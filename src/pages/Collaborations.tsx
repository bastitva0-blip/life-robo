import { Link } from "react-router";
import type { Partner } from "@shared/types";
import { useSite } from "@/lib/site";
import { usePageMeta } from "@/lib/seo";
import { safeHref } from "@/lib/format";
import { ArrowRight, ArrowUpRight, Instagram, LinkedIn } from "@/components/icons";
import { PageHero, Reveal, SectionHeader, SmartLink } from "@/components/ui";

function LogoTile({ src, alt, className = "h-28 w-28 sm:h-32 sm:w-32" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  const links = [
    { href: partner.website, label: "Website", Icon: ArrowUpRight },
    { href: partner.instagram, label: "Instagram", Icon: Instagram },
    { href: partner.linkedin, label: "LinkedIn", Icon: LinkedIn },
  ].filter((l) => safeHref(l.href));
  return (
    <article className="card flex h-full flex-col p-6 sm:p-8">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        {partner.logo && <LogoTile src={partner.logo} alt={`${partner.name} logo`} />}
        <div className="min-w-0">
          {partner.shortName && <p className="eyebrow mb-1">{partner.shortName}</p>}
          <h3 className="text-[22px] font-semibold leading-tight tracking-tight">{partner.name}</h3>
        </div>
      </div>
      {partner.summary && <p className="mt-6 text-[17px] text-fg/90">{partner.summary}</p>}
      {partner.body && <p className="mt-4 text-[15px] leading-relaxed text-muted">{partner.body}</p>}
      {links.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-2 pt-6">
          {links.map(({ href, label, Icon }) => (
            <li key={label}>
              <SmartLink href={href} className="btn btn-ghost btn-sm" ariaLabel={`${partner.shortName || partner.name} on ${label}`}>
                <Icon size={16} /> {label}
              </SmartLink>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function Collaborations() {
  const { settings, data } = useSite();
  const partners = data?.partners ?? [];
  usePageMeta("Collaborations", settings.collabIntro || undefined);

  return (
    <>
      <PageHero eyebrow="Collaborations" title={settings.collabHeading || "Collaborations"} intro={settings.collabIntro || undefined}>
        {partners.length > 0 && (
          // One row at every width: tiles shrink to share the space instead of wrapping.
          <div className="mt-12 flex max-w-[560px] flex-nowrap items-center gap-2 sm:gap-5" aria-label="Life Robo and its partners">
            <LogoTile
              src="/brand/logo-hd.jpg"
              alt={`${settings.shortName} logo`}
              className="aspect-square min-w-0 max-w-36 flex-1 !rounded-full !bg-black !p-0"
            />
            {partners.map((p) => (
              <span key={p.id} className="contents">
                <span className="shrink-0 text-[20px] font-light text-dim sm:text-[36px]" aria-hidden="true">
                  ×
                </span>
                <LogoTile src={p.logo} alt={`${p.name} logo`} className="aspect-square min-w-0 max-w-36 flex-1" />
              </span>
            ))}
          </div>
        )}
      </PageHero>

      {partners.length > 0 && (
        <section className="container-x pb-20 md:pb-28" aria-labelledby="partners-title">
          <h2 id="partners-title" className="sr-only">
            Our partners
          </h2>
          <ul className="grid gap-5 md:grid-cols-2">
            {partners.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.06}>
                <PartnerCard partner={p} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {settings.collabGoals.length > 0 && (
        <section className="container-x pb-20 md:pb-28" aria-labelledby="goals-title">
          <SectionHeader id="goals-title" eyebrow="Why we partner" title="Room to learn, and room to grow." />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {settings.collabGoals.map((g, i) => (
              <Reveal as="li" key={i} delay={i * 0.05} className="card p-6">
                <span className="text-[13px] font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[19px] font-semibold leading-snug tracking-tight">{g.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{g.description}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {settings.seriesName && (
        <section className="container-x pb-20 md:pb-28">
          <Reveal>
            <Link
              to="/vortex"
              className="card flex flex-col gap-6 p-8 transition-colors hover:border-line-strong sm:flex-row sm:items-center sm:justify-between sm:p-12"
            >
              <div>
                <p className="eyebrow mb-2">Our workshop series</p>
                <p className="font-vortex vortex-word text-[clamp(2.5rem,8vw,4.5rem)] font-black leading-none tracking-[0.06em]">
                  {settings.seriesName.toUpperCase()}
                </p>
                {settings.seriesTagline && <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-muted">{settings.seriesTagline}</p>}
              </div>
              <span className="btn btn-ghost shrink-0">
                See every session <ArrowRight size={18} />
              </span>
            </Link>
          </Reveal>
        </section>
      )}

      <section className="container-x pb-24 md:pb-32">
        <Reveal className="card flex flex-col gap-6 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="title">Want to work with us?</h2>
            <p className="mt-3 text-muted">
              If you run a club, a society or a lab and want to plan a session with {settings.shortName}, write to us. Students can join the club any time
              sign-ups are open.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link to="/contact" className="btn btn-primary">
              Get in touch <ArrowRight size={18} />
            </Link>
            <Link to="/join" className="btn btn-ghost">
              Join the club
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
