"use client";

import { useEffect, useState } from "react";
import { useTaskCenter } from "../providers/TaskCenterProvider";
import {
  getEstimatedTaskProgress,
  getTaskProgressHint,
  getTaskProgressStage,
} from "../services/taskProgress";

export function TaskCenterWidget() {
  const { tasks, isOpen, setOpen, clearTasks } = useTaskCenter();
  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const [, forceProgressTick] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!pendingCount) return;
    const intervalId = window.setInterval(() => {
      forceProgressTick((tick) => (tick + 1) % 10_000);
    }, 1500);
    return () => window.clearInterval(intervalId);
  }, [pendingCount]);

  if (!isOpen) return null;

  return (
    <div
      aria-labelledby="task-center-title"
      aria-modal="true"
      className="fixed inset-0 z-[80] grid place-items-center bg-white p-4 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Close task center"
        className="absolute inset-0 cursor-default"
        onClick={() => setOpen(false)}
        type="button"
      />
      <div className="surface-card relative w-full max-w-2xl max-h-[82vh] overflow-auto !rounded-[2rem] bg-white shadow-2xl shadow-violet-950/30">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow mb-1">Task Center</p>
            <h2 className="text-xl font-semibold text-slate-900" id="task-center-title">
              Stable Audio 3 Generations
            </h2>
          </div>
          <button className="button-secondary min-h-9 px-3 text-sm" onClick={() => setOpen(false)} type="button">
            Close
          </button>
        </div>
        {tasks.length ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <article className="rounded-2xl border border-slate-200 bg-white p-4" key={task.taskId}>
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-slate-900">{task.modelLabel}</strong>
                  <span className="text-xs uppercase text-violet-700">{task.status}</span>
                </div>
                {task.prompt ? <p className="mt-2 line-clamp-2 text-sm text-slate-600">{task.prompt}</p> : null}
                {task.status === "pending" ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                      <span className="animate-pulse text-violet-700">{getTaskProgressStage(task)}</span>
                      <span className="font-mono text-violet-700">{Math.round(getEstimatedTaskProgress(task))}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-300 to-sky-200 transition-[width] duration-700 ease-out"
                        style={{ width: `${getEstimatedTaskProgress(task)}%` }}
                      />
                    </div>
                    <p className="text-xs leading-5 text-slate-500">
                      {task.statusMsg && !/pending/i.test(task.statusMsg) ? task.statusMsg : getTaskProgressHint(task)}
                    </p>
                  </div>
                ) : task.statusMsg ? (
                  <p className="mt-2 text-xs text-slate-500">{task.statusMsg}</p>
                ) : null}
                {task.outputUrl || task.videoUrl ? (
                  <a
                    className="mt-3 inline-flex text-sm font-semibold text-violet-700"
                    href={task.outputUrl || task.videoUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open Output
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">No generation tasks yet</p>
            <p className="mt-2 text-sm text-slate-600">
              Submitted audio jobs will appear here after you start a generation.
            </p>
          </div>
        )}
        {tasks.length ? (
          <button className="button-secondary mt-4 w-full text-sm" onClick={clearTasks} type="button">
            Clear Tasks
          </button>
        ) : null}
      </div>
    </div>
  );
}
