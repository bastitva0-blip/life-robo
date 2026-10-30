import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { cx } from "@/lib/format";
import { Close, Download } from "./icons";

/** Opens a QR code for `path` that anyone can scan from the screen or download. */
export function QrButton({ path, title, fileName, className }: { path: string; title: string; fileName: string; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [png, setPng] = useState("");
  const url = `${window.location.origin}${path}`;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
    if (!open) return;
    let live = true;
    QRCode.toDataURL(url, { width: 1024, margin: 2, errorCorrectionLevel: "M" })
      .then((data) => live && setPng(data))
      .catch(() => live && setPng(""));
    return () => {
      live = false;
    };
  }, [open, url]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cx("btn btn-ghost", className)}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" />
        </svg>
        QR code
      </button>
      <dialog
        ref={ref}
        aria-label={title}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="m-auto w-[calc(100vw-32px)] max-w-sm rounded-[28px] border border-line-strong bg-elev p-0 text-fg shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="flex w-full items-start justify-between gap-3">
              <p className="text-[17px] font-semibold leading-snug">{title}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-white/10 hover:text-fg"
                aria-label="Close"
              >
                <Close size={18} />
              </button>
            </div>
            {png ? (
              <img src={png} alt={`QR code for ${url}`} className="aspect-square w-full rounded-2xl bg-white p-2" />
            ) : (
              <div className="skeleton aspect-square w-full rounded-2xl" role="status" aria-label="Making QR code" />
            )}
            <p className="text-center text-[14px] text-muted">Scan with your phone camera to open this page.</p>
            <a href={png || undefined} download={`${fileName}-qr.png`} className={cx("btn btn-primary w-full", !png && "pointer-events-none opacity-60")}>
              <Download size={18} /> Download QR
            </a>
          </div>
        )}
      </dialog>
    </>
  );
}
