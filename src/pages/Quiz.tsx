import { useId, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import type { ItemResponse, PublicQuiz, QuizResult } from "@shared/types";
import { ApiError, api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { usePageMeta } from "@/lib/seo";
import { cx } from "@/lib/format";
import { ArrowRight, Check, Close } from "@/components/icons";
import { ErrorState, Skeleton } from "@/components/ui";
import { ShareButton } from "@/components/ShareButton";
import NotFound from "./NotFound";
import { BackLink, DetailShell, is404 } from "./_shared";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const inputCls =
  "w-full rounded-2xl border bg-elev-2 px-4 py-3 text-[17px] text-fg placeholder:text-dim transition-[border-color,box-shadow] duration-200 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/25";

export default function QuizPage() {
  const { slug = "" } = useParams();
  const { data, error, loading, retry } = useApi<ItemResponse<PublicQuiz>>(`/api/events/${encodeURIComponent(slug)}/quiz`);
  const quiz = data?.item;
  usePageMeta(quiz ? quiz.title : "Quiz", quiz ? `Quiz for ${quiz.event.title}` : undefined);

  if (error && is404(error)) return <NotFound what="quiz" />;

  return (
    <DetailShell>
      <BackLink to={`/events/${slug}`} label="Back to event" />
      <div className="mx-auto mt-8 max-w-3xl">
        {loading ? (
          <div role="status" aria-label="Loading" className="space-y-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error || !quiz ? (
          <ErrorState error={error} onRetry={retry} />
        ) : (
          <QuizForm quiz={quiz} slug={slug} />
        )}
      </div>
    </DetailShell>
  );
}

function ShareQuiz({ quiz, slug }: { quiz: PublicQuiz; slug: string }) {
  return (
    <ShareButton
      title={quiz.title}
      text={`${quiz.title}\nAttended ${quiz.event.title}? Take the quiz and get your badge.`}
      url={`${window.location.origin}/events/${slug}/quiz`}
      className="btn-sm"
    />
  );
}

function QuizForm({ quiz, slug }: { quiz: PublicQuiz; slug: string }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [answers, setAnswers] = useState<number[]>(() => quiz.questions.map(() => -1));
  const [errors, setErrors] = useState<{ name?: string; email?: string; missing?: number[] }>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const answered = answers.filter((a) => a >= 0).length;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = "Please enter your name.";
    if (!EMAIL_RE.test(email.trim())) errs.email = "Please enter a valid email address.";
    const missing = answers.flatMap((a, i) => (a < 0 ? [i] : []));
    if (missing.length) errs.missing = missing;
    setErrors(errs);
    if (errs.name || errs.email || missing.length) {
      setMessage(missing.length && !errs.name && !errs.email ? `Answer question ${missing[0] + 1} to finish.` : "Please check the highlighted fields.");
      const target = errs.name ? "name" : errs.email ? "email" : `q${missing[0]}`;
      formRef.current?.querySelector<HTMLElement>(`[data-field="${target}"]`)?.focus();
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const res = await api<ItemResponse<QuizResult>>(`/api/events/${encodeURIComponent(slug)}/quiz`, {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), email: email.trim(), answers, website }),
      });
      setResult(res.item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setMessage(err instanceof ApiError || err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (result) return <Result quiz={quiz} answers={answers} result={result} slug={slug} />;

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-busy={busy}>
      <p className="eyebrow mb-4">{quiz.event.title}</p>
      <h1 className="headline">{quiz.title}</h1>
      {quiz.intro && <p className="mt-6 whitespace-pre-line text-lg text-fg/90">{quiz.intro}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] text-dim">
          {quiz.questions.length} questions · one attempt per email · score {quiz.passPercent}% or more to pass
        </p>
        <ShareQuiz quiz={quiz} slug={slug} />
      </div>

      <div className="card mt-10 grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <label htmlFor={`${uid}-name`} className="mb-2 block text-[15px] font-medium">
            Full name
          </label>
          <input
            id={`${uid}-name`}
            data-field="name"
            autoComplete="name"
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            className={cx(inputCls, errors.name ? "border-danger" : "border-line-strong")}
          />
          {errors.name ? <p className="mt-2 text-[14px] text-danger">{errors.name}</p> : <p className="mt-2 text-[13px] text-dim">As it should appear on your badge.</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="mb-2 block text-[15px] font-medium">
            Email
          </label>
          <input
            id={`${uid}-email`}
            data-field="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            className={cx(inputCls, errors.email ? "border-danger" : "border-line-strong")}
          />
          {errors.email && <p className="mt-2 text-[14px] text-danger">{errors.email}</p>}
        </div>
      </div>

      <ol className="mt-8 space-y-5">
        {quiz.questions.map((q, i) => {
          const missing = errors.missing?.includes(i) && answers[i] < 0;
          return (
            <li key={i}>
              <fieldset
                data-field={`q${i}`}
                tabIndex={-1}
                className={cx("card p-6 focus:outline-none sm:p-8", missing && "!border-danger")}
                aria-invalid={missing ? true : undefined}
              >
                <legend className="sr-only">Question {i + 1}</legend>
                <p className="text-[13px] font-medium uppercase tracking-wide text-dim">
                  Question {i + 1} of {quiz.questions.length}
                </p>
                <p className="mt-2 whitespace-pre-line text-[19px] font-semibold leading-snug">{q.q}</p>
                <div className="mt-5 grid gap-2.5">
                  {q.options.map((opt, j) => {
                    const checked = answers[i] === j;
                    return (
                      <label
                        key={j}
                        className={cx(
                          "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-[16px] transition-colors",
                          checked ? "border-accent bg-accent/10" : "border-line-strong hover:bg-white/[0.04]",
                        )}
                      >
                        <input
                          type="radio"
                          name={`${uid}-q${i}`}
                          checked={checked}
                          onChange={() => setAnswers((a) => a.map((v, k) => (k === i ? j : v)))}
                          className="h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
                {missing && <p className="mt-3 text-[14px] text-danger">Pick an answer.</p>}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div className="sticky bottom-4 z-10 mt-8">
        <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line-strong px-4 py-3 shadow-2xl">
          <p className="text-[14px] text-muted" aria-live="polite">
            {message || `${answered} of ${quiz.questions.length} answered`}
          </p>
          <button type="submit" className="btn btn-primary disabled:opacity-60" disabled={busy}>
            {busy ? "Submitting…" : "Submit answers"}
            {!busy && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </form>
  );
}

function Result({ quiz, answers, result, slug }: { quiz: PublicQuiz; answers: number[]; result: QuizResult; slug: string }) {
  const pct = Math.round((result.score / Math.max(1, result.total)) * 100);
  return (
    <div>
      <p className="eyebrow mb-4">{quiz.event.title}</p>
      <h1 className="headline">{result.passed ? "Well done!" : "Thanks for taking the quiz"}</h1>
      <div className="card mt-10 flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
        <div
          className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-4"
          style={{ borderColor: result.passed ? "var(--color-success)" : "var(--color-accent)" }}
        >
          <span className="text-[40px] font-semibold leading-none tabular-nums">
            {result.score}/{result.total}
          </span>
          <span className="mt-1 text-[14px] text-muted">{pct}%</span>
        </div>
        <div>
          <p className="text-[21px] font-semibold">{result.passed ? "You passed." : `You need ${quiz.passPercent}% to pass.`}</p>
          <p className="mt-2 text-[15px] text-muted">
            Your badge is ready. Download it and share it. Badge ID <span className="font-mono text-fg">{result.code}</span>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={`/badges/${result.code}`} className="btn btn-primary">
              Get your badge <ArrowRight size={18} />
            </Link>
            <ShareQuiz quiz={quiz} slug={slug} />
          </div>
        </div>
      </div>

      <h2 className="title mb-6 mt-16">Your answers</h2>
      <ol className="space-y-4">
        {quiz.questions.map((q, i) => {
          const right = answers[i] === result.answers[i];
          return (
            <li key={i} className="card p-6">
              <p className="flex items-start gap-3 text-[17px] font-semibold">
                <span
                  className={cx(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    right ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
                  )}
                >
                  {right ? <Check size={14} /> : <Close size={14} />}
                </span>
                <span className="whitespace-pre-line">
                  {i + 1}. {q.q}
                </span>
              </p>
              <ul className="mt-3 space-y-1.5 pl-9 text-[15px]">
                {q.options.map((opt, j) => (
                  <li
                    key={j}
                    className={cx(
                      j === result.answers[i] ? "font-medium text-success" : j === answers[i] ? "text-danger line-through" : "text-muted",
                    )}
                  >
                    {opt}
                    {j === result.answers[i] && <span className="sr-only"> (correct answer)</span>}
                    {j === answers[i] && j !== result.answers[i] && <span className="sr-only"> (your answer)</span>}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
