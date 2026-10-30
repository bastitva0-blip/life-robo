import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import type { ItemResponse, QuizBadge } from "@shared/types";
import { useApi } from "@/lib/useApi";
import { fmtDate } from "@/lib/format";
import { ChevronLeft, Download } from "@/components/icons";
import { ShareButton } from "@/components/ShareButton";
import { ErrorState } from "@/components/ui";
import { is404 } from "./_shared";

// Rendered outside the site layout, like certificates. The badge is drawn on a canvas so the
// preview and the downloaded PNG are the same pixels.

const SIZE = 1080;
const SANS = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, Arial, sans-serif`;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Splits text into at most `max` lines that fit `width`, ellipsising the last one. */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number, max: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width <= width || !line) line = next;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  let last = kept[max - 1];
  while (last && ctx.measureText(`${last}…`).width > width) last = last.slice(0, -1);
  kept[max - 1] = `${last.trimEnd()}…`;
  return kept;
}

/** Largest font size (down to `min`) at which `text` fits on `lines` lines. */
function fit(ctx: CanvasRenderingContext2D, text: string, weight: number, start: number, min: number, width: number, lines: number) {
  for (let size = start; size > min; size -= 2) {
    ctx.font = `${weight} ${size}px ${SANS}`;
    if (wrap(ctx, text, width, 99).length <= lines) return size;
  }
  ctx.font = `${weight} ${min}px ${SANS}`;
  return min;
}

async function drawBadge(canvas: HTMLCanvasElement, badge: QuizBadge, host: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = SIZE;
  canvas.height = SIZE;
  await document.fonts?.ready;
  const logo = await loadImage("/brand/logo-badge.png");
  const cx = SIZE / 2;
  const pct = Math.round((badge.score / Math.max(1, badge.total)) * 100);
  const ring = badge.passed ? ["#30d158", "#2997ff"] : ["#2997ff", "#8b5cf6"];

  // Background
  const bg = ctx.createRadialGradient(cx, 380, 40, cx, 540, 820);
  bg.addColorStop(0, "#0d1b3a");
  bg.addColorStop(0.55, "#060a16");
  bg.addColorStop(1, "#000000");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= SIZE; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, x);
    ctx.lineTo(SIZE, x);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, SIZE - 72, SIZE - 72);

  // Header: logo + wordmark
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  if (logo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, 128, 46, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, cx - 46, 82, 92, 92);
    ctx.restore();
  }
  ctx.fillStyle = "#f5f5f7";
  ctx.font = `600 26px ${SANS}`;
  ctx.letterSpacing = "10px";
  ctx.fillText("LIFE ROBO", cx + 5, 214);
  ctx.letterSpacing = "0px";

  // Medal
  const my = 420;
  const r = 150;
  ctx.beginPath();
  ctx.arc(cx, my, r + 26, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, my, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 18;
  ctx.stroke();
  const grad = ctx.createLinearGradient(cx - r, my - r, cx + r, my + r);
  grad.addColorStop(0, ring[0]);
  grad.addColorStop(1, ring[1]);
  ctx.beginPath();
  ctx.arc(cx, my, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * Math.max(pct, 2)) / 100);
  ctx.strokeStyle = grad;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.lineCap = "butt";

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 92px ${SANS}`;
  ctx.fillText(`${badge.score}/${badge.total}`, cx, my + 22);
  ctx.fillStyle = "#a1a1a6";
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText(`${pct}%`, cx, my + 72);

  // Status pill
  const label = badge.passed ? "QUIZ PASSED" : "QUIZ COMPLETED";
  ctx.font = `700 24px ${SANS}`;
  ctx.letterSpacing = "5px";
  const pw = ctx.measureText(label).width + 56;
  const py = my + r + 52;
  ctx.fillStyle = badge.passed ? "rgba(48,209,88,0.16)" : "rgba(41,151,255,0.16)";
  ctx.beginPath();
  ctx.roundRect(cx - pw / 2, py, pw, 50, 25);
  ctx.fill();
  ctx.fillStyle = badge.passed ? "#30d158" : "#2997ff";
  ctx.fillText(label, cx + 2.5, py + 34);
  ctx.letterSpacing = "0px";

  // Name
  const width = SIZE - 200;
  let y = py + 130;
  const nameSize = fit(ctx, badge.name, 700, 72, 40, width, 2);
  ctx.fillStyle = "#ffffff";
  for (const line of wrap(ctx, badge.name, width, 2)) {
    ctx.fillText(line, cx, y);
    y += nameSize * 1.12;
  }

  // Event
  y += 8;
  ctx.font = `500 32px ${SANS}`;
  ctx.fillStyle = "#c7c7cc";
  for (const line of wrap(ctx, badge.event.title, width, 2)) {
    ctx.fillText(line, cx, y);
    y += 42;
  }

  // Footer
  ctx.font = `500 22px ${SANS}`;
  ctx.fillStyle = "#86868b";
  ctx.fillText(`${fmtDate(badge.issuedAt, { day: "numeric", month: "long", year: "numeric" })}  ·  Badge ID ${badge.code}`, cx, SIZE - 104);
  ctx.fillText(`Verify at ${host}/badges/${badge.code}`, cx, SIZE - 70);
}

function BadgeCanvas({ badge }: { badge: QuizBadge }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const host = window.location.host;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let live = true;
    void drawBadge(canvas, badge, host).then(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, [badge, host]);

  const download = () => {
    ref.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `life-robo-badge-${badge.code}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  };

  return (
    <>
      <div className="mx-auto mb-6 flex max-w-[560px] flex-wrap items-center justify-center gap-3">
        <button type="button" className="btn btn-primary" onClick={download} disabled={!ready}>
          <Download size={18} /> Download badge
        </button>
        <ShareButton
          title={`My badge: ${badge.event.title}`}
          text={`I scored ${badge.score}/${badge.total} in the ${badge.event.title} quiz by Life Robo.`}
          url={`${window.location.origin}/badges/${badge.code}`}
        />
      </div>
      <canvas
        ref={ref}
        role="img"
        aria-label={`Quiz badge for ${badge.name}: ${badge.score} out of ${badge.total} in ${badge.event.title}`}
        className="mx-auto block aspect-square w-full max-w-[560px] rounded-[28px] border border-line shadow-2xl"
      />
    </>
  );
}

export default function BadgePage() {
  const { code = "" } = useParams();
  const { data, error, loading, retry } = useApi<ItemResponse<QuizBadge>>(`/api/badges/${encodeURIComponent(code)}`);
  const badge = data?.item;

  useEffect(() => {
    document.title = badge ? `Badge - ${badge.name} - ${badge.event.title}` : "Badge - Life Robo";
  }, [badge]);

  return (
    <main className="min-h-dvh bg-canvas px-4 py-6 text-fg sm:px-8 sm:py-10">
      <div className="mx-auto mb-6 flex max-w-[560px] items-center justify-between gap-3">
        <Link to={badge ? `/events/${badge.event.slug}` : "/"} className="inline-flex min-h-11 items-center gap-1 text-[15px] text-muted hover:text-fg">
          <ChevronLeft size={18} /> {badge ? "Back to event" : "Life Robo"}
        </Link>
      </div>
      {loading ? (
        <div className="skeleton mx-auto aspect-square w-full max-w-[560px] rounded-[28px]" role="status" aria-label="Loading badge" />
      ) : error && is404(error) ? (
        <div className="card mx-auto max-w-lg px-6 py-14 text-center">
          <h1 className="title">Badge not found</h1>
          <p className="mt-3 text-muted">Check the link or the badge ID.</p>
        </div>
      ) : error || !badge ? (
        <div className="mx-auto max-w-lg">
          <ErrorState error={error} onRetry={retry} />
        </div>
      ) : (
        <>
          <h1 className="sr-only">
            Quiz badge for {badge.name}, {badge.event.title}
          </h1>
          <BadgeCanvas badge={badge} />
        </>
      )}
    </main>
  );
}
