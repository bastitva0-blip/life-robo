import { useMemo } from "react";
import { Link } from "react-router";
import type { ClubEvent, ListResponse } from "@shared/types";
import { useApi } from "@/lib/useApi";
import { useSite } from "@/lib/site";
import { usePageMeta } from "@/lib/seo";
import { fmtDate, fmtTime, safeHref } from "@/lib/format";
import { ArrowRight, ArrowUpRight, Calendar, Clock, Instagram, LinkedIn, Pin } from "@/components/icons";
import { CardSkeletons, EmptyState, ErrorState, Img, Reveal, SmartLink } from "@/components/ui";
import { ImageGrid } from "./_shared";

const linkIcon = (label: string) => (/insta/i.test(label) ? Instagram : /linked/i.test(label) ? LinkedIn : ArrowUpRight);

/** Slowly turning conic swirl behind the hero wordmark. */
function Swirl() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="vortex-swirl absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-50"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgb(41 151 255 / 0.35) 60deg, transparent 120deg, rgb(139 92 246 / 0.3) 200deg, transparent 260deg, rgb(41 151 255 / 0.2) 320deg, transparent 360deg)",
          maskImage: "radial-gradient(closest-side, black 0%, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(closest-side, black 0%, black 30%, transparent 70%)",
        }}
      />
      <div className="tech-grid mask-fade-b absolute inset-0 opacity-40" />
    </div>
  );
}

function SessionRow({ event, index }: { event: ClubEvent; index: number }) {
  const upcoming = event.status === "upcoming";
  return (
    <Link
      to={`/events/${event.slug}`}
      className="card group grid gap-0 transition-colors hover:border-line-strong md:grid-cols-12"
      aria-label={`${event.title}, ${fmtDate(event.startsAt)}`}
    >
      <div className="relative md:col-span-4">
        <Img src={event.cover} alt={event.coverAlt || event.title} aspect="4/3" imgClassName="group-hover:scale-[1.04]" className="h-full" />
        {upcoming && (
          <span className="absolute right-4 top-4 rounded-full bg-accent-strong px-3 py-1 text-[12px] font-medium text-white">Upcoming</span>
        )}
      </div>
      <div className="flex flex-col p-6 sm:p-8 md:col-span-8">
        <p className="font-vortex text-[13px] font-bold tracking-[0.3em] text-accent">WORKSHOP {String(index + 1).padStart(2, "0")}</p>
        <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-tight md:text-[26px]">{event.title.replace(/^Vortex Workshop \d+:\s*/i, "")}</h3>
        {event.summary && <p className="mt-3 text-[15px] text-muted md:text-[17px]">{event.summary}</p>}
        <ul className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6 text-[14px] text-dim">
          <li className="flex items-center gap-2">
            <Calendar size={15} /> {fmtDate(event.startsAt)}
          </li>
          <li className="flex items-center gap-2">
            <Clock size={15} /> {fmtTime(event.startsAt)} IST
          </li>
          {event.venue && (
            <li className="flex items-center gap-2">
              <Pin size={15} /> {event.venue}
            </li>
          )}
        </ul>
        <span className="mt-6 inline-flex items-center gap-1 text-[15px] font-medium text-accent">
          {upcoming && event.registrationOpen ? "Register" : "Read more"} <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

export default function Vortex() {
  const { settings } = useSite();
  const name = settings.seriesName || "Vortex";
  const key = settings.seriesKey || "vortex";
  usePageMeta(name, settings.seriesTagline ? `${name}: ${settings.seriesTagline}. The robotics workshop series by ${settings.shortName}.` : undefined);
  const { data, error, loading, retry } = useApi<ListResponse<ClubEvent>>(`/api/events?series=${encodeURIComponent(key)}`);

  const events = useMemo(() => data?.items ?? [], [data]);
  const next = events.find((e) => e.status === "upcoming");
  const done = events.filter((e) => e.status !== "upcoming").length;
  const photos = useMemo(() => {
    const all = [...settings.seriesImages, ...events.flatMap((e) => e.images)].filter(Boolean);
    return Array.from(new Set(all));
  }, [settings.seriesImages, events]);
  const paragraphs = settings.seriesBody.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const links = settings.seriesLinks.filter((l) => safeHref(l.url));

  return (
    <>
      <header className="relative flex min-h-[88svh] items-center overflow-hidden pb-16 pt-32 md:pt-40">
        <Swirl />
        <div className="container-x relative text-center">
          <Reveal>
            <p className="eyebrow mb-6">{settings.shortName} presents</p>
            <h1 className="font-vortex vortex-word text-[clamp(3.5rem,17vw,13rem)] font-black leading-[0.9] tracking-[0.06em]">
              {name.toUpperCase()}
            </h1>
            {settings.seriesTagline && (
              <p className="font-vortex mt-6 text-[clamp(0.7rem,2.2vw,1rem)] font-semibold uppercase tracking-[0.35em] text-muted">
                {settings.seriesTagline}
              </p>
            )}
            <p className="mx-auto mt-8 max-w-2xl text-lg text-fg/85 md:text-xl">
              The robotics workshop series by {settings.shortName}. One idea per session, worked through from the basics to something you can build.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {next ? (
                <Link to={`/events/${next.slug}`} className="btn btn-primary">
                  Next: {fmtDate(next.startsAt)} <ArrowRight size={18} />
                </Link>
              ) : (
                <a href="#sessions" className="btn btn-primary">
                  See the sessions <ArrowRight size={18} />
                </a>
              )}
              {links.map((l) => {
                const Icon = linkIcon(l.label);
                return (
                  <SmartLink key={l.url} href={l.url} className="btn btn-ghost" ariaLabel={`${name} on ${l.label}`}>
                    <Icon size={18} /> {l.label}
                  </SmartLink>
                );
              })}
            </div>
            {events.length > 0 && (
              <dl className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-4 text-center">
                <div>
                  <dt className="eyebrow">Sessions</dt>
                  <dd className="font-vortex mt-2 text-[28px] font-bold md:text-[36px]">{String(done).padStart(2, "0")}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Photos</dt>
                  <dd className="font-vortex mt-2 text-[28px] font-bold md:text-[36px]">{photos.length}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Next</dt>
                  <dd className="font-vortex mt-2 text-[28px] font-bold md:text-[36px]">{next ? fmtDate(next.startsAt, { year: undefined }) : "Soon"}</dd>
                </div>
              </dl>
            )}
          </Reveal>
        </div>
      </header>

      {paragraphs.length > 0 && (
        <section className="container-x pb-20 md:pb-28" aria-labelledby="vortex-about">
          <Reveal className="grid gap-8 md:grid-cols-12 md:gap-14">
            <h2 id="vortex-about" className="title md:col-span-4">
              What is <span className="font-vortex text-gradient">{name}</span>?
            </h2>
            <div className="space-y-5 text-[17px] leading-relaxed text-fg/85 md:col-span-8">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      <section id="sessions" className="container-x scroll-mt-24 pb-20 md:pb-28" aria-labelledby="vortex-sessions">
        <Reveal>
          <h2 id="vortex-sessions" className="title mb-8 md:mb-10">
            The sessions
          </h2>
        </Reveal>
        {loading ? (
          <CardSkeletons count={2} aspect="4/3" />
        ) : error ? (
          <ErrorState error={error} onRetry={retry} />
        ) : events.length === 0 ? (
          <EmptyState title="First session announced soon" body={`Follow ${name} on Instagram and LinkedIn for the date.`} />
        ) : (
          <ol className="space-y-5">
            {events.map((e, i) => (
              <Reveal as="li" key={e.id} delay={Math.min(i, 3) * 0.05}>
                <SessionRow event={e} index={i} />
              </Reveal>
            ))}
          </ol>
        )}
      </section>

      {photos.length > 0 && (
        <section className="container-x pb-20 md:pb-28" aria-labelledby="vortex-photos">
          <Reveal>
            <h2 id="vortex-photos" className="title mb-8 md:mb-10">
              From the room
            </h2>
          </Reveal>
          <ImageGrid images={photos} title={name} />
        </section>
      )}

      <section className="container-x pb-24 md:pb-32">
        <Reveal className="card relative overflow-hidden p-8 text-center sm:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: "radial-gradient(80% 120% at 50% 0%, rgb(41 151 255 / 0.35), transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative">
            <p className="font-vortex text-[13px] font-bold tracking-[0.3em] text-accent">BE IN THE NEXT ONE</p>
            <h2 className="title mx-auto mt-4 max-w-xl">Open to every branch and year. No experience needed.</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/join" className="btn btn-primary">
                Join {settings.shortName} <ArrowRight size={18} />
              </Link>
              <Link to="/events" className="btn btn-ghost">
                All events
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
