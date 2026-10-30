import { Hono } from "hono";
import { z } from "zod";
import { ADMIN_SECTIONS, type AdminRole, type AdminSection } from "@shared/types";
import type { AppEnv } from "./env";
import { DEVELOPER, findRoleByPassword, hashPassword, parsePermissions } from "./auth";

// Admin roles: developer only (enforced by sectionFor in auth.ts).
// Developer's own password is the ADMIN_PASSWORD secret, so it can't be changed or locked out here.

export const roles = new Hono<AppEnv>();

type Row = Record<string, unknown>;

const toRole = (r: Row): AdminRole => {
  const developer = r.key === DEVELOPER;
  return {
    id: Number(r.id),
    key: String(r.key),
    name: String(r.name),
    developer,
    hasPassword: developer || String(r.password_hash ?? "") !== "",
    permissions: developer ? ADMIN_SECTIONS.map((s) => s.key) : parsePermissions(r.permissions),
  };
};

const sectionKey = z.enum(ADMIN_SECTIONS.map((s) => s.key) as [AdminSection, ...AdminSection[]]);

const updateSchema = z.object({
  name: z.string().trim().min(1, "Required").max(60).optional(),
  permissions: z.array(sectionKey).max(ADMIN_SECTIONS.length).optional(),
  // Empty string removes the password, which stops the role from signing in.
  password: z.union([z.literal(""), z.string().min(8, "Use at least 8 characters").max(200)]).optional(),
});

roles.get("/api/admin/roles", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM admin_roles ORDER BY sort, id").all<Row>();
  return c.json({ items: results.map(toRole) });
});

roles.put("/api/admin/roles/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ error: "Bad id" }, 400);
  const parsed = updateSchema.safeParse(await c.req.json().catch(() => undefined));
  if (!parsed.success) {
    return c.json({ error: "Invalid input", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, 400);
  }
  const db = c.env.DB;
  const row = await db.prepare("SELECT * FROM admin_roles WHERE id = ?1").bind(id).first<Row>();
  if (!row) return c.json({ error: "Not found" }, 404);
  const isDev = row.key === DEVELOPER;
  const { name, permissions, password } = parsed.data;

  const sets: string[] = [];
  const binds: unknown[] = [];
  const add = (sql: string, v: unknown) => {
    binds.push(v);
    sets.push(`${sql} = ?${binds.length}`);
  };
  if (name !== undefined) add("name", name);
  if (permissions !== undefined && !isDev) {
    add("permissions", JSON.stringify(permissions));
  }
  if (password !== undefined) {
    if (isDev) return c.json({ error: "The developer password is the ADMIN_PASSWORD secret. Change it with wrangler." }, 400);
    if (password) {
      // Sign-in finds the role from the password alone, so two roles can't share one.
      const clash = await findRoleByPassword(c.env, password, String(row.key));
      if (clash) return c.json({ error: "Another role already uses that password. Pick a different one." }, 409);
      add("password_hash", await hashPassword(password));
    } else {
      add("password_hash", "");
    }
  }
  if (!sets.length) return c.json({ item: toRole(row) });
  // Any change signs that role out everywhere, so new permissions and passwords apply at once.
  if (!isDev) sets.push("session_version = session_version + 1");
  const updated = await db
    .prepare(`UPDATE admin_roles SET ${sets.join(", ")}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?${binds.length + 1} RETURNING *`)
    .bind(...binds, id)
    .first<Row>();
  return c.json({ item: toRole(updated!) });
});

/** Signs out everyone using a role without changing anything else. */
roles.post("/api/admin/roles/:id/sign-out", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ error: "Bad id" }, 400);
  const res = await c.env.DB.prepare("UPDATE admin_roles SET session_version = session_version + 1 WHERE id = ?1").bind(id).run();
  if (!res.meta.changes) return c.json({ error: "Not found" }, 404);
  return c.json({ ok: true });
});
