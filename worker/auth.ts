import type { Context, MiddlewareHandler } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { ADMIN_SECTIONS, type AdminSection } from "@shared/types";
import type { AdminSession, AppEnv, Env } from "./env";

export const SESSION_COOKIE = "lr_session";
const SESSION_TTL_S = 7 * 24 * 3600;

const enc = new TextEncoder();

const b64url = (buf: ArrayBuffer | Uint8Array): string => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const b64urlDecode = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (ch) => ch.charCodeAt(0));

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

/** Constant-time string compare via hashing both sides to equal length. */
export async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0 && a.length === b.length;
}

export async function hashIp(c: Context<AppEnv>): Promise<string> {
  const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for") ?? "local";
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(`${ip}|${c.env.SESSION_SECRET}`));
  return b64url(digest).slice(0, 32);
}

/* ---------- Roles ---------- */

/** Signs in with the ADMIN_PASSWORD secret and always has full access, including the Roles page. */
export const DEVELOPER = "developer";

interface RoleRow {
  key: string;
  name: string;
  permissions: string;
  session_version: number;
}

const SECTION_KEYS = new Set<string>(ADMIN_SECTIONS.map((s) => s.key));
const ALL_SECTIONS = ADMIN_SECTIONS.map((s) => s.key) as AdminSection[];

export function parsePermissions(raw: unknown): AdminSection[] {
  try {
    const list: unknown = JSON.parse(String(raw ?? "[]"));
    return Array.isArray(list) ? (list.filter((k) => SECTION_KEYS.has(k)) as AdminSection[]) : [];
  } catch {
    return [];
  }
}

const toSession = (r: RoleRow): AdminSession => {
  const developer = r.key === DEVELOPER;
  return { key: r.key, name: r.name, developer, permissions: developer ? ALL_SECTIONS : parsePermissions(r.permissions) };
};

/* ---------- Role passwords (PBKDF2) ---------- */

const PBKDF2_ITER = 100_000; // Workers' upper limit

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return b64url(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${PBKDF2_ITER}$${b64url(salt)}$${await pbkdf2(password, salt, PBKDF2_ITER)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iter, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2" || !iter || !salt || !hash) return false;
  return safeEqual(await pbkdf2(password, b64urlDecode(salt), Number(iter)), hash);
}

/** The role this password belongs to, or null. `except` skips one role (used when changing its password). */
export async function findRoleByPassword(env: Env, password: string, except?: string): Promise<string | null> {
  if (!password) return null;
  if (except !== DEVELOPER && env.ADMIN_PASSWORD && (await safeEqual(password, env.ADMIN_PASSWORD))) return DEVELOPER;
  const { results } = await env.DB.prepare("SELECT key, password_hash FROM admin_roles WHERE key <> ?1 AND key <> ?2 AND password_hash <> ''")
    .bind(DEVELOPER, except ?? "")
    .all<{ key: string; password_hash: string }>();
  for (const r of results) if (await verifyPassword(password, r.password_hash)) return r.key;
  return null;
}

/* ---------- Session cookie ---------- */

// v2.<role>.<session_version>.<exp>.<sig>. Bumping a role's session_version signs everyone in it out.
export async function issueSession(c: Context<AppEnv>, role: string): Promise<void> {
  const row = await c.env.DB.prepare("SELECT session_version FROM admin_roles WHERE key = ?1").bind(role).first<{ session_version: number }>();
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_S;
  const payload = `v2.${role}.${row?.session_version ?? 1}.${exp}`;
  const sig = await hmac(c.env.SESSION_SECRET, payload);
  setCookie(c, SESSION_COOKIE, `${payload}.${sig}`, {
    httpOnly: true,
    secure: new URL(c.req.url).protocol === "https:",
    sameSite: "Strict",
    path: "/",
    maxAge: SESSION_TTL_S,
  });
}

export function clearSession(c: Context<AppEnv>): void {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
}

/** The admin behind the session cookie, or null when missing, expired, tampered with or revoked. */
export async function readSession(c: Context<AppEnv>): Promise<AdminSession | null> {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token || !c.env.SESSION_SECRET) return null;
  const parts = token.split(".");
  if (parts.length !== 5 || parts[0] !== "v2") return null;
  const [, role, version, expRaw, sig] = parts;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  const expected = await hmac(c.env.SESSION_SECRET, parts.slice(0, 4).join("."));
  if (!(await safeEqual(expected, sig))) return null;
  const row = await c.env.DB.prepare("SELECT key, name, permissions, session_version FROM admin_roles WHERE key = ?1").bind(role).first<RoleRow>();
  if (!row || String(row.session_version) !== version) return null;
  return toSession(row);
}

/** Reject cross-site mutating requests. Browsers always send Origin on POST/PUT/DELETE. */
export const sameOrigin: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (c.req.method !== "GET" && c.req.method !== "HEAD") {
    const origin = c.req.header("origin");
    if (origin && origin !== new URL(c.req.url).origin) {
      return c.json({ error: "Cross-origin request blocked" }, 403);
    }
  }
  await next();
};

/* ---------- Access control ---------- */

const TABLE_SECTION: Record<string, AdminSection> = {
  events: "events",
  projects: "projects",
  team: "team",
  gallery: "gallery",
  posts: "blog",
  alerts: "alerts",
  partners: "partners",
};

/**
 * The section an admin API call belongs to. Reading content lists stays open to every role (the
 * dashboard and pickers use them); writes, and anything holding personal data, need the section.
 * "developer" marks developer-only routes; null means any signed-in role may call it.
 */
export function sectionFor(method: string, path: string): AdminSection | "developer" | null {
  const rest = path.slice("/api/admin/".length).split("/");
  const head = rest[0];
  const write = method !== "GET" && method !== "HEAD";
  if (["me", "login", "logout", "upload", "upload-file", "import-image"].includes(head)) return null;
  if (head === "settings") return write ? "content" : null;
  if (head === "signups" || head === "signups.csv") return "signups";
  if (head === "media") return write ? "media" : null;
  if (head === "attendance" || head === "registrations" || head === "mail-quota") return "attendance";
  if (head === "quizzes") return "quizzes";
  if (head === "reorder") return TABLE_SECTION[rest[1]] ?? "developer";
  if (head in TABLE_SECTION) return write ? TABLE_SECTION[head] : null;
  return "developer"; // roles, and anything new until it's mapped here
}

export const requireAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
  const admin = await readSession(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);
  const need = sectionFor(c.req.method, c.req.path);
  const allowed = need === null || admin.developer || (need !== "developer" && admin.permissions.includes(need));
  if (!allowed) return c.json({ error: `The ${admin.name} role doesn't have access to this.` }, 403);
  c.set("admin", admin);
  await next();
};
