"use client";

import { useEffect, useState } from "react";
import {
  buildDownloadFilename,
  formatWorkDate,
  type WorkItem,
} from "../services/workItem";

type WorkDetailDialogProps = {
  item: WorkItem | null;
  onClose: () => void;
  onRequestDelete: (id: number) => void;
};

type MetadataRow = { label: string; value: string };

function buildMetadata(item: WorkItem): MetadataRow[] {
  const rows: (MetadataRow | null)[] = [
    { label: "Created", value: formatWorkDate(item.createdAt, true) },
    { label: "Model", value: item.modelLabel },
    item.width && item.height
      ? { label: "Resolution", value: `${item.width} × ${item.height}` }
      : null,
    item.durationSeconds
      ? { label: "Generation time", value: `${item.durationSeconds}s` }
      : null,
    item.taskId ? { label: "Task ID", value: item.taskId } : null,
  ];
  return rows.filter((row): row is MetadataRow => Boolean(row && row.value));
}

export function WorkDetailDialog({ item, onClose, onRequestDelete }: WorkDetailDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<{ itemId: number; message: string } | null>(null);

  useEffect(() => {
    if (!item) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const handleDownload = async () => {
    if (!item.mediaUrl) return;
    setIsDownloading(true);
    setDownloadError(null);
    let blobUrl: string | null = null;
    try {
      const response = await fetch(item.mediaUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = buildDownloadFilename(item);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setDownloadError({
        itemId: item.id,
        message: error instanceof Error ? error.message : "Unable to download",
      });
      window.open(item.mediaUrl, "_blank", "noopener,noreferrer");
    } finally {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setIsDownloading(false);
    }
  };

  const metadata = buildMetadata(item);
  const currentDownloadError = downloadError?.itemId === item.id ? downloadError.message : "";

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <div className="surface-card relative w-full max-w-5xl max-h-[92vh] overflow-auto">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="eyebrow mb-2">Generation Detail</p>
            <h2 className="text-2xl font-semibold text-white">{item.modelLabel} generation</h2>
            <p className="mt-1 text-xs text-slate-500">
              {formatWorkDate(item.createdAt, true)}
              {item.taskId ? ` · ${item.taskId}` : ""}
            </p>
          </div>
          <button
            aria-label="Close detail"
            className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300 transition hover:border-cyan-300/60 hover:text-cyan-100"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
              {item.status === "pending" ? (
                <div className="grid aspect-video place-items-center px-6 text-center text-sm text-cyan-100">
                  Generation in progress — check back once the task completes.
                </div>
              ) : item.status === "failed" || !item.mediaUrl ? (
                <div className="grid aspect-video place-items-center px-6 text-center text-sm text-rose-200">
                  {item.statusMsg || "Generation failed"}
                </div>
              ) : item.status === "deleted" ? (
                <div className="grid aspect-video place-items-center px-6 text-center text-sm text-rose-200">
                  This content has been removed.
                </div>
              ) : item.isVideo ? (
                <video
                  autoPlay
                  className="aspect-video w-full"
                  controls
                  playsInline
                  poster={item.posterUrl || undefined}
                  src={item.mediaUrl}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="aspect-video w-full object-contain" src={item.mediaUrl} />
              )}
            </div>

            {item.originUrls.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Input image
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {item.originUrls.map((url) => (
                    <a
                      className="block h-20 w-20 overflow-hidden rounded-xl border border-white/10 transition hover:border-cyan-300/60"
                      href={url}
                      key={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" className="h-full w-full object-cover" src={url} />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Details</p>
              <dl className="mt-3 space-y-3 text-sm">
                {metadata.map((row) => (
                  <div className="flex items-start justify-between gap-3" key={row.label}>
                    <dt className="text-slate-400">{row.label}</dt>
                    <dd className="break-all text-right text-slate-100">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {item.prompt ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Prompt</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{item.prompt}</p>
              </div>
            ) : null}

            {item.statusMsg && item.status !== "failed" ? (
              <p className="rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
                {item.statusMsg}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button
                className="button-primary min-h-10 px-4 text-sm disabled:opacity-60"
                disabled={!item.mediaUrl || isDownloading || item.status !== "success"}
                onClick={() => void handleDownload()}
                type="button"
              >
                {isDownloading ? "Downloading..." : "Download output"}
              </button>
              {item.mediaUrl ? (
                <a
                  className="button-secondary min-h-10 px-4 text-sm"
                  href={item.mediaUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Open in new tab
                </a>
              ) : null}
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-rose-400/40 px-4 text-sm font-semibold text-rose-200 transition hover:border-rose-300 hover:text-rose-100"
                onClick={() => onRequestDelete(item.id)}
                type="button"
              >
                Delete
              </button>
            </div>
            {currentDownloadError ? (
              <p className="text-xs text-rose-200">
                Direct download blocked: {currentDownloadError}. Opened in a new tab as a fallback.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
