"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/modules/api/services/api";
import { WorkDetailDialog } from "../components/WorkDetailDialog";
import { useUserInfo } from "../providers/UserProvider";
import {
  formatWorkDate,
  normalizeWorkItem,
  type RawWorkItem,
  type WorkItem,
} from "../services/workItem";

type LoadStatus = "idle" | "loading" | "loaded" | "error";

const PAGE_SIZE = 30;

function statusBadge(item: WorkItem) {
  if (item.status === "failed") {
    return { label: "Failed", className: "border border-rose-200 bg-rose-50 text-rose-700" };
  }
  if (item.status === "pending") {
    return { label: "Processing", className: "border border-violet-200 bg-violet-50 text-violet-700" };
  }
  if (item.status === "deleted") {
    return { label: "Removed", className: "border border-slate-200 bg-slate-100 text-slate-600" };
  }
  return null;
}

function mediaKindLabel(item: WorkItem) {
  if (item.isAudio) return "Audio";
  if (item.isVideo) return "Video";
  if (item.isImage) return "Image";
  return "Output";
}

function workTitle(item: WorkItem) {
  if (item.prompt) return item.prompt;
  return item.isAudio ? "Untitled audio generation" : "Untitled generation";
}

function waveformBars(seed: string) {
  const source = seed || "stable-audio-3";
  return Array.from({ length: 40 }, (_, index) => {
    const code = source.charCodeAt(index % source.length) || 17;
    return 18 + ((code + index * 11) % 58);
  });
}

function AudioWaveform({ seed }: { seed: string }) {
  const bars = waveformBars(seed);
  return (
    <svg aria-hidden="true" className="h-24 w-full" preserveAspectRatio="none" viewBox="0 0 400 96">
      {bars.map((height, index) => (
        <rect
          fill={index < 14 ? "#22d3ee" : index < 28 ? "#8b5cf6" : "#f59e0b"}
          height={height}
          key={`${seed}-${index}`}
          opacity={0.9}
          rx="3"
          width="5"
          x={index * 10 + 2}
          y={(96 - height) / 2}
        />
      ))}
    </svg>
  );
}

function LibraryPreview({
  badge,
  canPreview,
  item,
  onOpen,
}: {
  badge: ReturnType<typeof statusBadge>;
  canPreview: boolean;
  item: WorkItem;
  onOpen: () => void;
}) {
  if (item.isAudio) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
        {badge ? (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${badge.className}`}>
            {badge.label}
          </span>
        ) : null}
        <button className="block w-full pt-8 text-left" onClick={onOpen} type="button">
          <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            <span>Audio Output</span>
            <span>MP3</span>
          </div>
          <div className="mt-2 rounded-xl bg-white/5 px-3 py-2">
            <AudioWaveform seed={item.taskId} />
          </div>
        </button>
        {canPreview ? (
          <audio className="mt-3 h-9 w-full" controls preload="metadata" src={item.mediaUrl} />
        ) : (
          <p className="mt-3 text-sm text-slate-300">
            {item.status === "pending" ? "Generation in progress." : item.statusMsg || "Audio is not available."}
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      aria-label="View detail"
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
      onClick={onOpen}
      type="button"
    >
      {canPreview && item.isVideo ? (
        <video
          className="aspect-video w-full object-cover transition group-hover:opacity-90"
          muted
          playsInline
          poster={item.posterUrl || undefined}
          preload="metadata"
          src={item.mediaUrl}
        />
      ) : canPreview && item.isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          className="aspect-video w-full object-cover transition group-hover:opacity-90"
          loading="lazy"
          src={item.mediaUrl}
        />
      ) : item.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          className="aspect-video w-full object-cover opacity-70"
          loading="lazy"
          src={item.posterUrl}
        />
      ) : (
        <div className="grid aspect-video place-items-center text-sm text-slate-500">
          {item.status === "pending"
            ? "Generating..."
            : item.status === "failed"
              ? "Generation failed"
              : "No preview"}
        </div>
      )}
      {badge ? (
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${badge.className}`}>
          {badge.label}
        </span>
      ) : null}
      {item.isVideo && canPreview ? (
        <span className="absolute inset-0 grid place-items-center bg-white/0 transition group-hover:bg-white/20">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/85 text-slate-950 opacity-0 transition group-hover:opacity-100">
            ▶
          </span>
        </span>
      ) : null}
    </button>
  );
}

export function LibraryPage() {
  const { isSignedIn, openSignIn } = useUserInfo();
  const [items, setItems] = useState<WorkItem[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadLibrary = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const result = await api.user.getUserOpusList(1, PAGE_SIZE);
      const rawList = (result as { data?: { list?: RawWorkItem[] } })?.data?.list;
      const next = Array.isArray(rawList)
        ? rawList
            .map(normalizeWorkItem)
            .filter((item): item is WorkItem => Boolean(item))
        : [];
      setItems(next);
      setStatus("loaded");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load library");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    const timer = window.setTimeout(() => {
      void loadLibrary();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isSignedIn, loadLibrary]);

  const selectedItem = useMemo(
    () => (selectedId == null ? null : items.find((item) => item.id === selectedId) ?? null),
    [items, selectedId],
  );

  const itemToDelete = useMemo(
    () => (confirmDeleteId == null ? null : items.find((item) => item.id === confirmDeleteId) ?? null),
    [confirmDeleteId, items],
  );

  useEffect(() => {
    if (!confirmDeleteId) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) setConfirmDeleteId(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmDeleteId, isDeleting]);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const result = await api.user.deleteOpus(id);
      if ((result as { code?: number })?.code === 200) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setSelectedId((current) => (current === id ? null : current));
        setConfirmDeleteId(null);
      } else {
        setErrorMessage(
          (result as { msg?: string })?.msg || "Server refused the delete request",
        );
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete this work");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <main className="section">
        <div className="section-heading">
          <p className="eyebrow">Library</p>
          <h1>Your Audio Library</h1>
          <p>Sign in to see every Stable Audio 3 generation tied to your account.</p>
        </div>
        <div className="surface-card mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Sign in to view your library</h2>
          <p className="mt-3 text-slate-600">Generated audio is saved to the account that created it.</p>
          <button
            className="button-primary mt-6"
            onClick={() => openSignIn({ forceRedirectUrl: "/library" })}
            type="button"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow">Library</p>
        <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-6xl">Your Audio Library</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Review every Stable Audio 3 generation tied to your account.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            {status === "loaded" ? `${items.length} works · ` : ""}
            Generations are retained for 6 months — download anything you want to keep.
          </p>
          <button
            className="button-secondary min-h-10 px-4 text-sm"
            disabled={status === "loading"}
            onClick={() => void loadLibrary()}
            type="button"
          >
            {status === "loading" ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {errorMessage ? (
          <p className="mb-4 rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {errorMessage}
          </p>
        ) : null}

        {status === "loading" && items.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">Loading library...</p>
        ) : null}

        {status === "loaded" && items.length === 0 ? (
          <div className="surface-card mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-slate-900">No audio yet</h2>
            <p className="mt-3 text-slate-600">
              Create your first Stable Audio 3 audio clip from the generator page.
            </p>
            <a className="button-primary mt-6 inline-flex" href="/stable-audio-3" title="Open the Stable Audio 3 AI audio generator">
              Open the generator
            </a>
          </div>
        ) : null}

        {items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const badge = statusBadge(item);
              const canPreview = item.status === "success" && item.mediaUrl;
              return (
                <article className="surface-card flex h-full flex-col !p-4" key={item.taskId}>
                  <LibraryPreview
                    badge={badge}
                    canPreview={Boolean(canPreview)}
                    item={item}
                    onOpen={() => setSelectedId(item.id)}
                  />
                  <div className="min-w-0 flex-1 pt-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                        {mediaKindLabel(item)}
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-950">
                      {workTitle(item)}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatWorkDate(item.createdAt)} · {item.modelLabel}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="button-secondary min-h-9 px-3 text-sm"
                      onClick={() => setSelectedId(item.id)}
                      type="button"
                    >
                      View detail
                    </button>
                    <button
                      className="inline-flex min-h-9 items-center justify-center rounded-xl border border-rose-200 px-3 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                      onClick={() => setConfirmDeleteId(item.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>

      <WorkDetailDialog
        item={selectedItem}
        onClose={() => setSelectedId(null)}
        onRequestDelete={(id) => setConfirmDeleteId(id)}
      />

      {itemToDelete ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-white p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isDeleting) setConfirmDeleteId(null);
          }}
          role="dialog"
        >
          <div className="surface-card w-full max-w-md">
            <h2 className="text-xl font-semibold text-slate-900">Delete this generation?</h2>
            <p className="mt-2 text-sm text-slate-600">
              This permanently removes the generation from your library. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="button-secondary min-h-10 px-4 text-sm"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteId(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-rose-500 px-4 text-sm font-semibold text-slate-900 transition hover:bg-rose-400 disabled:opacity-60"
                disabled={isDeleting}
                onClick={() => void handleDelete(itemToDelete.id)}
                type="button"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
