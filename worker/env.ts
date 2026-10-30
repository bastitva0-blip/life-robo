import type { AdminSection } from "@shared/types";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  /** Web app URL of scripts/gmail-mailer.gs. Without it, registration works but no emails go out. */
  MAIL_SCRIPT_URL?: string;
  /** Shared secret; must match SECRET in the Apps Script. */
  MAIL_SCRIPT_SECRET?: string;
  MAIL_FROM_NAME?: string;
  MAIL_REPLY_TO?: string;
}

/** A signed-in admin: the role they used and what it may open. Set by requireAdmin. */
export interface AdminSession {
  key: string;
  name: string;
  developer: boolean;
  permissions: AdminSection[];
}

export type AppEnv = { Bindings: Env; Variables: { admin: AdminSession } };
