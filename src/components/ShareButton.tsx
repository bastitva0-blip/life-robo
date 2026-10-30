import { useEffect, useState } from "react";
import { cx } from "@/lib/format";
import { Check, Share } from "./icons";

/**
 * Opens the native share sheet with `text` and `url`. Where that isn't available
 * (most desktop browsers), copies the same message to the clipboard instead.
 */
export function ShareButton({ title, text, url, className }: { title: string; text: string; url: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(t);
  }, [copied]);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return; // closed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  return (
    <button type="button" onClick={() => void share()} className={cx("btn btn-ghost", className)}>
      {copied ? <Check size={18} /> : <Share size={18} />}
      <span aria-live="polite">{copied ? "Copied" : "Share"}</span>
    </button>
  );
}
