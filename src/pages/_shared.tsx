import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ApiError } from "@/lib/api";
import { renderMarkdown } from "@/lib/markdown";
import { ChevronLeft } from "@/components/icons";
import { Skeleton } from "@/components/ui";
import { Lightbox, type LightboxItem } from "./_Lightbox";

// eslint-disable-next-line react-refresh/only-export-components
export const is404 = (e: unknown) => e instanceof ApiError && e.status === 404;

/** Outer wrapper for detail pages: clears the fixed nav and constrains width. */
export function DetailShell({ children }: { children: ReactNode }) {
  return <article className="container-x pb-24 pt-28 md:pb-32 md:pt-36">{children}</article>;
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-11 items-center gap-1 rounded-full text-[15px] text-muted transition-colors hover:text-fg"
    >
      <ChevronLeft size={18} /> {label}
    </Link>
  );
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const html = useMemo(() => renderMarkdown(source), [source]);
  if (!source?.trim()) return null;
  return <div className={className ?? "prose-lr"} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function DetailSkeleton({ aspect = "4/5" }: { aspect?: string }) {
  return (
    <div role="status" aria-label="Loading" className="mt-8 grid gap-10 md:grid-cols-12 md:gap-14">
      <div className="md:col-span-5">
        <Skeleton className="!rounded-[28px]" style={{ aspectRatio: aspect }} />
      </div>
      <div className="space-y-5 md:col-span-7">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-14 w-4/5" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-2/5" />
        <div className="space-y-3 pt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

/** Thumbnail grid that opens the shared lightbox. */
export function ImageGrid({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const items: LightboxItem[] = useMemo(
    () => images.filter(Boolean).map((src, i) => ({ src, alt: `${title}, photo ${i + 1}` })),
    [images, title],
  );
  if (!items.length) return null;
  return (
    <>
      {/* Masonry columns keep each photo's own shape, so group photos are never cropped. */}
      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3">
        {items.map((it, i) => (
          <li key={it.src + i} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-[20px] border border-line bg-elev"
              aria-label={`Open ${it.alt}`}
            >
              <img
                src={it.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </>
  );
}
