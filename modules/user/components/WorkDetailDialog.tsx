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

function detailWaveformBars(seed: string) {
  const source = seed || "stable-audio-3";
  return Array.from({ length: 54 }, (_, index) => {
    const code = source.charCodeAt(index % source.length) || 23;
    return 18 + ((code + index * 9) % 64);
  });
}

function DetailAudioPlayer({ item }: { item: WorkItem }) {
  const bars = detailWaveformBars(item.taskId);
  return (
    <div className="bg-slate-950 p-5 text-white">
      <div className="mb-4 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        <span>Audio Output</span>
        <span>MP3</span>
      </div>
      <div className="rounded-2xl bg-white/5 p-4">
        <svg aria-hidden="true" className="h-36 w-full" preserveAspectRatio="none" viewBox="0 0 540 144">
          {bars.map((height, index) => (
            <rect
              fill={index < 18 ? "#22d3ee" : index < 38 ? "#8b5cf6" : "#f59e0b"}
              height={height}
              key={`${item.taskId}-${index}`}
              opacity={0.9}
              rx="3"
              width="5"
              x={index * 10 + 2}
              y={(144 - height) / 2}
            />
          ))}
        </svg>
      </div>
      <audio className="mt-4 h-10 w-full" controls preload="metadata" src={item.mediaUrl} />
    </div>
  );
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
      className="fixed inset-0 z-[80] flex items-center justify-center bg-white p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <div className="surface-card relative w-full max-w-5xl max-h-[92vh] overflow-auto">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="eyebrow mb-2">Generation Detail</p>
            <h2 className="text-2xl font-semibold text-slate-900">{item.modelLabel} generation</h2>
            <p className="mt-1 text-xs text-slate-500">
              {formatWorkDate(item.createdAt, true)}
              {item.taskId ? ` · ${item.taskId}` : ""}
            </p>
          </div>
          <button
            aria-label="Close detail"
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 transition hover:border-violet-400 hover:text-violet-700"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {item.status === "pending" ? (
                <div className="grid aspect-video place-items-center px-6 text-center text-sm text-violet-700">
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
              ) : item.isAudio ? (
                <DetailAudioPlayer item={item} />
              ) : item.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="aspect-video w-full object-contain" src={item.mediaUrl} />
              ) : (
                <div className="grid aspect-video place-items-center px-6 text-center text-sm text-slate-500">
                  Unsupported media preview.
                </div>
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
                      className="block h-20 w-20 overflow-hidden rounded-xl border border-slate-200 transition hover:border-violet-400"
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
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Details</p>
              <dl className="mt-3 space-y-3 text-sm">
                {metadata.map((row) => (
                  <div className="flex items-start justify-between gap-3" key={row.label}>
                    <dt className="text-slate-600">{row.label}</dt>
                    <dd className="break-all text-right text-slate-800">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {item.prompt ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Prompt</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{item.prompt}</p>
              </div>
            ) : null}

            {item.statusMsg && item.status !== "failed" ? (
              <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
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
