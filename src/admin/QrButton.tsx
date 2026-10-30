import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "@/components/icons";
import { toast } from "./toast";
import { Modal } from "./ui";

/** Button that opens a QR code for a public page, ready to download for posters and slides. */
export function QrButton({ path, title, fileName }: { path: string; title: string; fileName: string }) {
  const [open, setOpen] = useState(false);
  const [png, setPng] = useState("");
  const url = `${window.location.origin}${path}`;

  useEffect(() => {
    if (!open) return;
    let live = true;
    QRCode.toDataURL(url, { width: 1024, margin: 2, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#ffffff" } })
      .then((data) => live && setPng(data))
      .catch(() => toast.error("Couldn't make the QR code."));
    return () => {
      live = false;
    };
  }, [open, url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy. Select the link and copy it.");
    }
  };

  return (
    <>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
        QR code
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description="Scan to open the page. Download it for posters, slides or WhatsApp."
        footer={
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => void copy()}>
              Copy link
            </button>
            <a href={png || undefined} download={`${fileName}-qr.png`} className="btn btn-primary btn-sm" aria-disabled={!png}>
              <Download size={16} /> Download PNG
            </a>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3">
          {png ? (
            <img src={png} alt={`QR code for ${url}`} className="aspect-square w-full max-w-[300px] rounded-2xl bg-white p-2" />
          ) : (
            <div className="skeleton aspect-square w-full max-w-[300px] rounded-2xl" role="status" aria-label="Making QR code" />
          )}
          <p className="break-all text-center font-mono text-[13px] text-muted">{url}</p>
        </div>
      </Modal>
    </>
  );
}
