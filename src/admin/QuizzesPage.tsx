import { useMemo, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router";
import type { Quiz, QuizAttempt, QuizEventSummary, QuizQuestion } from "@shared/types";
import { cx, fmtDate } from "@/lib/format";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Plus, Trash } from "@/components/icons";
import { adminApi, errorMessage } from "./adminApi";
import { useAdminData } from "./hooks";
import { toast } from "./toast";
import {
  Badge,
  ConfirmDialog,
  Empty,
  Group,
  IconButton,
  LoadError,
  NumberField,
  PageHeader,
  SaveBar,
  SkeletonRows,
  TextArea,
  TextField,
  Toggle,
  UnsavedGuard,
} from "./ui";

const BASE = "/admin/quizzes";

export default function QuizzesPage() {
  return (
    <Routes>
      <Route index element={<QuizList />} />
      <Route path=":eventId" element={<QuizEditor />} />
    </Routes>
  );
}

/* ---------- List ---------- */

function QuizList() {
  const { data, error, loading, reload } = useAdminData<{ items: QuizEventSummary[] }>("/api/admin/quizzes");
  const [showAll, setShowAll] = useState(false);
  const items = data?.items ?? [];
  // Workshops of a series (Vortex) are the ones with quizzes; other events are one click away.
  const shown = showAll ? items : items.filter((e) => e.series || e.quizId);

  return (
    <div>
      <PageHeader
        title="Quizzes"
        subtitle="One multiple-choice quiz per workshop. Participants see their score at the end and download a badge."
        actions={
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Workshops only" : "Show all events"}
          </button>
        }
      />
      {error && !data ? (
        <LoadError error={error} onRetry={reload} />
      ) : loading && !data ? (
        <SkeletonRows count={5} />
      ) : shown.length === 0 ? (
        <Empty title="No workshops yet" body="Events with a series (like Vortex) show up here. Use “Show all events” to add a quiz to any other event." />
      ) : (
        <ul className="flex flex-col gap-2">
          {shown.map((e) => (
            <li key={e.eventId}>
              <Link
                to={`${BASE}/${e.eventId}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-elev p-4 transition-colors hover:bg-white/[0.04]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-fg">{e.title}</p>
                    {e.quizId == null ? <Badge>No quiz</Badge> : e.open ? <Badge tone="green">Open</Badge> : <Badge tone="amber">Closed</Badge>}
                  </div>
                  <p className="mt-0.5 text-[14px] text-muted">{fmtDate(e.startsAt)}</p>
                  {e.quizId != null && (
                    <p className="mt-1 text-[13px] text-dim">
                      {e.questions} questions · {e.attempts} {e.attempts === 1 ? "attempt" : "attempts"}
                    </p>
                  )}
                </div>
                <ChevronRight size={18} className="shrink-0 text-dim" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Editor ---------- */

type Data = { event: { id: number; slug: string; title: string; startsAt: string }; quiz: Quiz | null; attempts: QuizAttempt[] };
type Draft = Pick<Quiz, "title" | "intro" | "questions" | "passPercent" | "open">;

const blankQuestion = (): QuizQuestion => ({ q: "", options: ["", "", "", ""], answer: 0 });
const toDraft = (q: Quiz | null): Draft =>
  q ? { title: q.title, intro: q.intro, questions: q.questions, passPercent: q.passPercent, open: q.open } : { title: "", intro: "", questions: [blankQuestion()], passPercent: 60, open: false };

function QuizEditor() {
  const { eventId } = useParams();
  const { data, error, loading, reload, mutate } = useAdminData<Data>(`/api/admin/quizzes/${eventId}`);

  return (
    <div>
      <Link to={BASE} className="mb-3 inline-flex min-h-9 items-center gap-1 text-[14px] text-muted hover:text-fg">
        <ChevronLeft size={16} /> Quizzes
      </Link>
      {error && !data ? (
        <LoadError error={error} onRetry={reload} />
      ) : loading && !data ? (
        <SkeletonRows count={6} />
      ) : data ? (
        <Editor key={data.quiz?.updatedAt ?? "new"} data={data} onSaved={(quiz) => mutate((d) => ({ ...d, quiz }))} reloadAttempts={reload} />
      ) : null}
    </div>
  );
}

function Editor({ data, onSaved, reloadAttempts }: { data: Data; onSaved: (q: Quiz) => void; reloadAttempts: () => void }) {
  const initial = useMemo(() => toDraft(data.quiz), [data.quiz]);
  const [draft, setDraft] = useState<Draft>(initial);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const setQ = (i: number, fn: (q: QuizQuestion) => QuizQuestion) =>
    setDraft((d) => ({ ...d, questions: d.questions.map((q, k) => (k === i ? fn(q) : q)) }));
  const move = (i: number, by: number) =>
    setDraft((d) => {
      const qs = d.questions.slice();
      const [q] = qs.splice(i, 1);
      qs.splice(i + by, 0, q);
      return { ...d, questions: qs };
    });

  const problem = (() => {
    for (const [i, q] of draft.questions.entries()) {
      if (!q.q.trim()) return `Question ${i + 1} is empty.`;
      if (q.options.filter((o) => o.trim()).length < 2) return `Question ${i + 1} needs at least 2 options.`;
      if (q.options.some((o) => !o.trim())) return `Question ${i + 1} has an empty option. Fill it in or remove it.`;
    }
    if (draft.open && !draft.questions.length) return "Add at least one question before opening the quiz.";
    return null;
  })();

  const save = async () => {
    if (problem) {
      toast.error(problem);
      return;
    }
    setSaving(true);
    try {
      const res = await adminApi.put<{ quiz: Quiz }>(`/api/admin/quizzes/${data.event.id}`, {
        ...draft,
        questions: draft.questions.map((q) => ({ q: q.q.trim(), options: q.options.map((o) => o.trim()), answer: q.answer })),
      });
      onSaved(res.quiz);
      toast.success(res.quiz.open ? "Quiz saved. It's open on the event page." : "Quiz saved.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <UnsavedGuard when={dirty} />
      <PageHeader
        title={data.event.title}
        subtitle={`${fmtDate(data.event.startsAt)} · quiz`}
        actions={
          data.quiz?.open && (
            <a href={`/events/${data.event.slug}/quiz`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              Open quiz <ArrowUpRight size={15} />
            </a>
          )
        }
      />

      <div className="flex flex-col gap-8">
        <Group title="Settings">
          <Toggle
            label="Quiz is open"
            description="When on, the event page shows a “Take the quiz” button. Turn it off to stop new attempts."
            checked={draft.open}
            onChange={(v) => set("open", v)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Title" value={draft.title} onChange={(v) => set("title", v)} optional maxLength={200} placeholder={`${data.event.title} quiz`} />
            <NumberField
              label="Pass mark (%)"
              value={draft.passPercent}
              onChange={(v) => set("passPercent", Math.min(100, Math.max(0, v)))}
              hint="Below this the badge says “Quiz completed” instead of “Quiz passed”."
            />
          </div>
          <TextArea label="Intro" value={draft.intro} onChange={(v) => set("intro", v)} optional rows={3} maxLength={2000} placeholder="A line or two shown above the questions." />
        </Group>

        <section>
          <div className="mb-2 flex items-end justify-between gap-3 px-1">
            <div>
              <h2 className="text-[15px] font-semibold text-fg">Questions</h2>
              <p className="text-[13px] text-dim">Tick the correct option for each question.</p>
            </div>
            <span className="text-[13px] text-dim">{draft.questions.length} total</span>
          </div>
          <ol className="flex flex-col gap-4">
            {draft.questions.map((q, i) => (
              <li key={i} className="rounded-2xl border border-line bg-elev p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold uppercase tracking-wide text-dim">Question {i + 1}</p>
                  <div className="flex">
                    <IconButton label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                      <ChevronUp size={16} />
                    </IconButton>
                    <IconButton label="Move down" onClick={() => move(i, 1)} disabled={i === draft.questions.length - 1}>
                      <ChevronDown size={16} />
                    </IconButton>
                    <IconButton label="Delete question" danger onClick={() => setDraft((d) => ({ ...d, questions: d.questions.filter((_, k) => k !== i) }))}>
                      <Trash size={16} />
                    </IconButton>
                  </div>
                </div>
                <TextArea label="Question" value={q.q} onChange={(v) => setQ(i, (x) => ({ ...x, q: v }))} rows={2} maxLength={1000} />
                <fieldset className="mt-4">
                  <legend className="label">Options</legend>
                  <ul className="flex flex-col gap-2">
                    {q.options.map((opt, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <label
                          className={cx(
                            "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border",
                            q.answer === j ? "border-success bg-success/15" : "border-line hover:bg-white/[0.04]",
                          )}
                          title="Correct answer"
                        >
                          <input
                            type="radio"
                            name={`q${i}-answer`}
                            checked={q.answer === j}
                            onChange={() => setQ(i, (x) => ({ ...x, answer: j }))}
                            className="h-4 w-4 accent-[var(--color-success)]"
                            aria-label={`Option ${j + 1} is correct`}
                          />
                        </label>
                        <input
                          className="field min-w-0 flex-1"
                          value={opt}
                          maxLength={300}
                          placeholder={`Option ${j + 1}`}
                          aria-label={`Question ${i + 1}, option ${j + 1}`}
                          onChange={(e) => setQ(i, (x) => ({ ...x, options: x.options.map((o, k) => (k === j ? e.target.value : o)) }))}
                        />
                        <IconButton
                          label="Remove option"
                          danger
                          disabled={q.options.length <= 2}
                          onClick={() =>
                            setQ(i, (x) => ({
                              ...x,
                              options: x.options.filter((_, k) => k !== j),
                              answer: x.answer === j ? 0 : x.answer > j ? x.answer - 1 : x.answer,
                            }))
                          }
                        >
                          <Trash size={15} />
                        </IconButton>
                      </li>
                    ))}
                  </ul>
                  {q.options.length < 8 && (
                    <button type="button" className="mt-2 inline-flex items-center gap-1 text-[14px] text-accent hover:underline" onClick={() => setQ(i, (x) => ({ ...x, options: [...x.options, ""] }))}>
                      <Plus size={14} /> Add option
                    </button>
                  )}
                </fieldset>
              </li>
            ))}
          </ol>
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => setDraft((d) => ({ ...d, questions: [...d.questions, blankQuestion()] }))}>
            <Plus size={16} /> Add question
          </button>
        </section>

        <Results eventId={data.event.id} attempts={data.attempts} onChange={reloadAttempts} />
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={() => void save()} onDiscard={() => setDraft(initial)} label="Save quiz" />
    </>
  );
}

/* ---------- Results ---------- */

function Results({ eventId, attempts, onChange }: { eventId: number; attempts: QuizAttempt[]; onChange: () => void }) {
  const [target, setTarget] = useState<QuizAttempt | null>(null);
  const [busy, setBusy] = useState(false);
  const avg = attempts.length ? attempts.reduce((n, a) => n + a.score / Math.max(1, a.total), 0) / attempts.length : 0;

  const remove = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await adminApi.del(`/api/admin/quizzes/${eventId}/attempts/${target.id}`);
      toast.success(`${target.name} can take the quiz again.`);
      onChange();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
      setTarget(null);
    }
  };

  return (
    <section>
      <div className="mb-2 flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-[15px] font-semibold text-fg">Results</h2>
          <p className="text-[13px] text-dim">
            {attempts.length} {attempts.length === 1 ? "attempt" : "attempts"}
            {attempts.length > 0 && ` · average ${Math.round(avg * 100)}%`}
          </p>
        </div>
        {attempts.length > 0 && (
          <a href={`/api/admin/quizzes/${eventId}/export.csv`} className="btn btn-ghost btn-sm">
            Export CSV
          </a>
        )}
      </div>
      {attempts.length === 0 ? (
        <div className="rounded-2xl border border-line bg-elev px-4 py-8 text-center text-[14px] text-dim">No one has taken this quiz yet.</div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-elev">
          {attempts.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-4 py-3">
              <span className="w-14 shrink-0 text-[17px] font-semibold tabular-nums">
                {a.score}/{a.total}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] text-fg">{a.name}</p>
                <p className="truncate text-[13px] text-dim">
                  {a.email} · {fmtDate(a.createdAt)}
                </p>
              </div>
              <a href={`/badges/${a.code}`} target="_blank" rel="noopener noreferrer" className="hidden font-mono text-[13px] text-accent hover:underline sm:block">
                {a.code}
              </a>
              <IconButton label={`Delete ${a.name}'s attempt`} danger onClick={() => setTarget(a)}>
                <Trash size={15} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog
        open={!!target}
        title={`Delete ${target?.name ?? ""}'s attempt?`}
        body="Their badge link stops working and they can take the quiz again."
        busy={busy}
        onCancel={() => setTarget(null)}
        onConfirm={() => void remove()}
      />
    </section>
  );
}
