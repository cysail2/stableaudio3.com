"use client";

import { useTaskCenter } from "../providers/TaskCenterProvider";

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
      <path d="m4 12 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </svg>
  );
}

export function TaskCenterMenuButton() {
  const { tasks, setOpen } = useTaskCenter();
  const pendingCount = tasks.filter((task) => task.status === "pending").length;

  return (
    <button
      aria-label="Open task center"
      className="relative inline-flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/60 px-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-100"
      onClick={() => setOpen(true)}
      title="Task Center"
      type="button"
    >
      <LayersIcon className="text-cyan-200" />
      <span className="hidden sm:inline">Tasks</span>
      {pendingCount ? (
        <span className="grid min-w-5 place-items-center rounded-full bg-cyan-300 px-1.5 text-[11px] font-black text-slate-950">
          {pendingCount}
        </span>
      ) : null}
    </button>
  );
}
