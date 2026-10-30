import { Link, useParams } from "react-router";
import type { ClubEvent, ItemResponse } from "@shared/types";
import { useApi } from "@/lib/useApi";
import { usePageMeta } from "@/lib/seo";
import { fmtDate, fmtTime, safeHref } from "@/lib/format";
import { ArrowRight, ArrowUpRight, Calendar, Clock, Pin } from "@/components/icons";
import { ShareButton } from "@/components/ShareButton";
import { QrButton } from "@/components/QrButton";
import { ErrorState, Img, Reveal, SmartLink } from "@/components/ui";
import NotFound from "./NotFound";
import { BackLink, DetailShell, DetailSkeleton, ImageGrid, Markdown, is404 } from "./_shared";
import { RegisterForm } from "./_RegisterForm";

const fileKind = (url: string) => /\.(pdf|pptx?)(?:$|\?)/i.exec(url)?.[1].toUpperCase() ?? "Link";

/** "When" line for sharing: date, time and venue only. */
function whenText(event: ClubEvent) {
  const multiDay = event.endsAt && fmtDate(event.endsAt) !== fmtDate(event.startsAt);
  const date = fmtDate(event.startsAt, { weekday: "short" }) + (multiDay ? ` to ${fmtDate(event.endsAt)}` : "");
  const time = `${fmtTime(event.startsAt)}${event.endsAt && !multiDay ? ` to ${fmtTime(event.endsAt)}` : ""} IST`;
  return [date, time, event.venue].filter(Boolean).join(" · ");
}

export default function EventDetail() {
  const { slug = "" } = useParams();
  const { data, error, loading, retry } = useApi<ItemResponse<ClubEvent>>(`/api/events/${encodeURIComponent(slug)}`);
  const event = data?.item;
  usePageMeta(event?.title ?? "Event", event?.summary);

  if (error && is404(error)) return <NotFound what="event" />;

  const share = event && (
    <>
      <ShareButton
        title={event.title}
        text={`${event.title}\n${whenText(event)}`}
        url={`${window.location.origin}/events/${event.slug}`}
        className="w-full sm:w-auto"
      />
      <QrButton path={`/events/${event.slug}`} title={event.title} fileName={event.slug} className="w-full sm:w-auto" />
    </>
  );

  return (
    <DetailShell>
      <BackLink to="/events" label="All events" />
      {loading ? (
        <DetailSkeleton />
      ) : error || !event ? (
        <div className="mt-8">
          <ErrorState error={error} onRetry={retry} />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-14">
            <Reveal className="md:col-span-5">
              <Img src={event.cover} alt={event.coverAlt || event.title} aspect="4/5" priority className="rounded-[28px] border border-line" />
            </Reveal>
            <Reveal className="md:col-span-7" delay={0.08}>
              <p className="eyebrow mb-4">{event.status === "upcoming" ? "Upcoming event" : "Past event"}</p>
              <h1 className="headline">{event.title}</h1>
              <ul className="mt-8 space-y-3 text-[17px] text-muted">
                <li className="flex items-center gap-3">
                  <Calendar size={20} className="shrink-0 text-accent" />
                  <span>
                    {fmtDate(event.startsAt, { weekday: "long" })}
                    {event.endsAt && fmtDate(event.endsAt) !== fmtDate(event.startsAt) ? ` – ${fmtDate(event.endsAt)}` : ""}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={20} className="shrink-0 text-accent" />
                  <span>
                    {fmtTime(event.startsAt)}
                    {event.endsAt ? ` – ${fmtTime(event.endsAt)}` : ""} IST
                  </span>
                </li>
                {event.venue && (
                  <li className="flex items-center gap-3">
                    <Pin size={20} className="shrink-0 text-accent" />
                    <span>{event.venue}</span>
                  </li>
                )}
              </ul>
              {event.summary && <p className="mt-8 text-lg text-fg/90 md:text-xl">{event.summary}</p>}
              {event.quizOpen && (
                <div className="card mt-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[19px] font-semibold">Workshop quiz</p>
                    <p className="mt-1 text-[15px] text-muted">Attended the session? Take the quiz, see your score and download your badge.</p>
                  </div>
                  <Link to={`/events/${event.slug}/quiz`} className="btn btn-primary shrink-0">
                    Take the quiz <ArrowRight size={18} />
                  </Link>
                </div>
              )}
              {event.registrationOpen && event.status === "upcoming" ? (
                <div className="mt-8" id="register">
                  <RegisterForm event={event} aside={share} />
                </div>
              ) : (
                <div className="mt-8 flex flex-wrap gap-3">
                  {safeHref(event.registerUrl) && (
                    <SmartLink href={event.registerUrl} className="btn btn-primary">
                      Register now <ArrowUpRight size={18} />
                    </SmartLink>
                  )}
                  {share}
                </div>
              )}
              <Markdown source={event.body} className="prose-lr mt-10 max-w-2xl" />
            </Reveal>
          </div>

          {event.resources?.some((r) => safeHref(r.url)) && (
            <section className="mt-20 md:mt-28" aria-labelledby="event-resources">
              <h2 id="event-resources" className="title mb-8">
                Session resources
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {event.resources
                  .filter((r) => safeHref(r.url))
                  .map((r) => (
                    <li key={r.url}>
                      <SmartLink href={r.url} className="card flex items-center justify-between gap-4 p-5 transition-colors hover:bg-white/[0.04]">
                        <span className="min-w-0">
                          <span className="block truncate text-[17px] font-semibold">{r.label}</span>
                          <span className="text-[13px] uppercase tracking-wide text-dim">{fileKind(r.url)}</span>
                        </span>
                        <ArrowUpRight size={18} className="shrink-0 text-accent" />
                      </SmartLink>
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {event.images?.some(Boolean) && (
            <section className="mt-20 md:mt-28" aria-labelledby="event-photos">
              <h2 id="event-photos" className="title mb-8">
                Photos
              </h2>
              <ImageGrid images={event.images} title={event.title} />
            </section>
          )}
        </>
      )}
    </DetailShell>
  );
}
