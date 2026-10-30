import { Hono, type Context } from "hono";
import { z } from "zod";
import type { PublicQuiz, Quiz, QuizAttempt, QuizBadge, QuizEventSummary, QuizQuestion, QuizResult } from "@shared/types";
import type { AppEnv } from "./env";
import { hashIp } from "./auth";

// Workshop quizzes: public taking + badges, admin editing + results.
// Mounted in index.ts after the admin auth middleware and before the generic CRUD routes.

export const quizzes = new Hono<AppEnv>();

type Row = Record<string, unknown>;

const issues = (err: z.ZodError) => err.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
const invalid = (c: Context<AppEnv>, err: z.ZodError) => c.json({ error: "Invalid input", issues: issues(err) }, 400);
const isUniqueError = (err: unknown) => String(err).includes("UNIQUE constraint failed");

const parseQuestions = (v: unknown): QuizQuestion[] => {
  try {
    const list: unknown = JSON.parse(String(v ?? "[]"));
    return Array.isArray(list) ? (list as QuizQuestion[]) : [];
  } catch {
    return [];
  }
};

const toQuiz = (r: Row): Quiz => ({
  id: Number(r.id),
  eventId: Number(r.event_id),
  title: String(r.title ?? ""),
  intro: String(r.intro ?? ""),
  questions: parseQuestions(r.questions),
  passPercent: Number(r.pass_percent ?? 60),
  open: r.open === 1,
  updatedAt: String(r.updated_at),
});

const toAttempt = (r: Row): QuizAttempt => ({
  id: Number(r.id),
  name: String(r.name),
  email: String(r.email),
  score: Number(r.score),
  total: Number(r.total),
  code: String(r.code),
  createdAt: String(r.created_at),
});

const passed = (score: number, total: number, passPercent: number) => total > 0 && (score / total) * 100 >= passPercent;

// Same alphabet as certificate IDs: no 0/O, 1/I/L.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `QZ-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

const OPEN_QUIZ = `SELECT q.*, e.title AS event_title, e.slug AS event_slug, e.starts_at AS event_starts_at
  FROM quizzes q JOIN events e ON e.id = q.event_id
  WHERE e.slug = ?1 AND e.published = 1 AND q.open = 1`;

/* ---------- Public: take a quiz ---------- */

quizzes.get("/api/events/:slug/quiz", async (c) => {
  const r = await c.env.DB.prepare(OPEN_QUIZ).bind(c.req.param("slug")).first<Row>();
  const questions = r ? parseQuestions(r.questions) : [];
  if (!r || !questions.length) return c.json({ error: "There's no open quiz for this event." }, 404);
  const item: PublicQuiz = {
    title: String(r.title || `${r.event_title} quiz`),
    intro: String(r.intro ?? ""),
    passPercent: Number(r.pass_percent ?? 60),
    questions: questions.map(({ q, options }) => ({ q, options })),
    event: { title: String(r.event_title), slug: String(r.event_slug), startsAt: String(r.event_starts_at) },
  };
  return c.json({ item });
});

const submitSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Please enter a valid email").max(200),
  answers: z.array(z.number().int().min(-1).max(20)).max(200),
  website: z.string().max(200).optional(),
});

quizzes.post("/api/events/:slug/quiz", async (c) => {
  const parsed = submitSchema.safeParse(await c.req.json().catch(() => undefined));
  if (!parsed.success) return invalid(c, parsed.error);
  const data = parsed.data;
  if (data.website) return c.json({ error: "Couldn't submit. Please try again." }, 400); // honeypot

  const db = c.env.DB;
  const r = await db.prepare(OPEN_QUIZ).bind(c.req.param("slug")).first<Row>();
  const questions = r ? parseQuestions(r.questions) : [];
  if (!r || !questions.length) return c.json({ error: "This quiz is closed." }, 403);
  if (data.answers.length !== questions.length) return c.json({ error: "Please answer every question." }, 400);

  const ip = await hashIp(c);
  const since = new Date(Date.now() - 3600_000).toISOString();
  const recent = await db
    .prepare("SELECT COUNT(*) AS n FROM quiz_attempts WHERE ip_hash = ?1 AND created_at > ?2")
    .bind(ip, since)
    .first<{ n: number }>();
  if ((recent?.n ?? 0) >= 20) return c.json({ error: "Too many attempts from this network. Try again later." }, 429);

  const score = questions.reduce((n, q, i) => n + (data.answers[i] === q.answer ? 1 : 0), 0);
  const total = questions.length;
  const email = data.email.toLowerCase();
  let code = "";
  for (let attempt = 0; attempt < 2 && !code; attempt++) {
    try {
      const row = await db
        .prepare(
          "INSERT INTO quiz_attempts (quiz_id, name, email, score, total, answers, code, ip_hash) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8) RETURNING code",
        )
        .bind(r.id, data.name, email, score, total, JSON.stringify(data.answers), newCode(), ip)
        .first<{ code: string }>();
      code = row?.code ?? "";
    } catch (err) {
      if (!isUniqueError(err)) throw err;
      if (String(err).includes("email")) return c.json({ error: "This email has already taken this quiz." }, 409);
      // otherwise the random code collided: retry once
    }
  }
  if (!code) throw new Error("Could not save quiz attempt");

  const result: QuizResult = {
    code,
    score,
    total,
    passed: passed(score, total, Number(r.pass_percent ?? 60)),
    answers: questions.map((q) => q.answer),
  };
  return c.json({ item: result }, 201);
});

/* ---------- Public: badge lookup ---------- */

quizzes.get("/api/badges/:code", async (c) => {
  const code = c.req.param("code").toUpperCase();
  if (!/^QZ-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return c.json({ error: "Badge not found" }, 404);
  const r = await c.env.DB.prepare(
    `SELECT a.code, a.name, a.score, a.total, a.created_at, q.pass_percent, e.title, e.slug, e.starts_at, e.series
       FROM quiz_attempts a JOIN quizzes q ON q.id = a.quiz_id JOIN events e ON e.id = q.event_id
      WHERE a.code = ?1`,
  )
    .bind(code)
    .first<Row>();
  if (!r) return c.json({ error: "Badge not found" }, 404);
  const score = Number(r.score);
  const total = Number(r.total);
  const item: QuizBadge = {
    code: String(r.code),
    name: String(r.name),
    score,
    total,
    passed: passed(score, total, Number(r.pass_percent ?? 60)),
    issuedAt: String(r.created_at),
    event: { title: String(r.title), slug: String(r.slug), startsAt: String(r.starts_at), series: String(r.series ?? "") },
  };
  c.header("Cache-Control", "public, max-age=300");
  return c.json({ item });
});

/* ---------- Admin ---------- */

quizzes.get("/api/admin/quizzes", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT e.id AS event_id, e.slug, e.title, e.starts_at, e.series, q.id AS quiz_id, q.open, q.questions,
            (SELECT COUNT(*) FROM quiz_attempts a WHERE a.quiz_id = q.id) AS attempts
       FROM events e LEFT JOIN quizzes q ON q.event_id = e.id
      ORDER BY e.starts_at DESC`,
  ).all<Row>();
  const items: QuizEventSummary[] = results.map((r) => ({
    eventId: Number(r.event_id),
    slug: String(r.slug),
    title: String(r.title),
    startsAt: String(r.starts_at),
    series: String(r.series ?? ""),
    quizId: r.quiz_id == null ? null : Number(r.quiz_id),
    open: r.open === 1,
    questions: parseQuestions(r.questions).length,
    attempts: Number(r.attempts ?? 0),
  }));
  return c.json({ items });
});

const eventIdParam = (c: Context<AppEnv>) => {
  const id = Number(c.req.param("eventId"));
  return Number.isInteger(id) && id > 0 ? id : null;
};

quizzes.get("/api/admin/quizzes/:eventId", async (c) => {
  const id = eventIdParam(c);
  if (!id) return c.json({ error: "Bad id" }, 400);
  const db = c.env.DB;
  const ev = await db.prepare("SELECT id, slug, title, starts_at FROM events WHERE id = ?1").bind(id).first<Row>();
  if (!ev) return c.json({ error: "Event not found" }, 404);
  const q = await db.prepare("SELECT * FROM quizzes WHERE event_id = ?1").bind(id).first<Row>();
  const attempts = q
    ? (await db.prepare("SELECT * FROM quiz_attempts WHERE quiz_id = ?1 ORDER BY score DESC, created_at ASC").bind(q.id).all<Row>()).results
    : [];
  return c.json({
    event: { id: Number(ev.id), slug: String(ev.slug), title: String(ev.title), startsAt: String(ev.starts_at) },
    quiz: q ? toQuiz(q) : null,
    attempts: attempts.map(toAttempt),
  });
});

const questionSchema = z
  .object({
    q: z.string().trim().min(1, "Write the question").max(1000),
    options: z.array(z.string().trim().min(1, "Options can't be empty").max(300)).min(2, "Add at least 2 options").max(8),
    answer: z.number().int().min(0),
  })
  .refine((v) => v.answer < v.options.length, { message: "Pick the correct option", path: ["answer"] });

const quizSchema = z.object({
  title: z.string().trim().max(200).default(""),
  intro: z.string().trim().max(2000).default(""),
  questions: z.array(questionSchema).max(100),
  passPercent: z.number().int().min(0).max(100).default(60),
  open: z.boolean().default(false),
});

quizzes.put("/api/admin/quizzes/:eventId", async (c) => {
  const id = eventIdParam(c);
  if (!id) return c.json({ error: "Bad id" }, 400);
  const parsed = quizSchema.safeParse(await c.req.json().catch(() => undefined));
  if (!parsed.success) return invalid(c, parsed.error);
  const d = parsed.data;
  if (d.open && !d.questions.length) return c.json({ error: "Add at least one question before opening the quiz." }, 400);
  const db = c.env.DB;
  const ev = await db.prepare("SELECT id FROM events WHERE id = ?1").bind(id).first();
  if (!ev) return c.json({ error: "Event not found" }, 404);
  const row = await db
    .prepare(
      `INSERT INTO quizzes (event_id, title, intro, questions, pass_percent, open) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
       ON CONFLICT (event_id) DO UPDATE SET title = excluded.title, intro = excluded.intro, questions = excluded.questions,
         pass_percent = excluded.pass_percent, open = excluded.open, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       RETURNING *`,
    )
    .bind(id, d.title, d.intro, JSON.stringify(d.questions), d.passPercent, d.open ? 1 : 0)
    .first<Row>();
  return c.json({ quiz: toQuiz(row!) });
});

quizzes.get("/api/admin/quizzes/:eventId/export.csv", async (c) => {
  const id = eventIdParam(c);
  if (!id) return c.json({ error: "Bad id" }, 400);
  const { results } = await c.env.DB.prepare(
    `SELECT a.* FROM quiz_attempts a JOIN quizzes q ON q.id = a.quiz_id WHERE q.event_id = ?1 ORDER BY a.score DESC, a.created_at ASC`,
  )
    .bind(id)
    .all<Row>();
  const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
  const lines = [["Submitted", "Name", "Email", "Score", "Out of", "Badge ID"].map(cell).join(",")];
  for (const a of results.map(toAttempt)) {
    lines.push([a.createdAt, a.name, a.email, String(a.score), String(a.total), a.code].map(cell).join(","));
  }
  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quiz-results-${id}.csv"`,
      "Cache-Control": "no-store",
    },
  });
});

/** Deletes one attempt so that person can take the quiz again. */
quizzes.delete("/api/admin/quizzes/:eventId/attempts/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ error: "Bad id" }, 400);
  const res = await c.env.DB.prepare("DELETE FROM quiz_attempts WHERE id = ?1").bind(id).run();
  if (!res.meta.changes) return c.json({ error: "Not found" }, 404);
  return c.json({ ok: true });
});
