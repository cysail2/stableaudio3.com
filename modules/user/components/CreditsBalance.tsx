"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/modules/api/services/api";
import { useUserInfo } from "../providers/UserProvider";

type PointsLogItem = {
  id: number;
  change_type: string;
  use_limit: number;
  created_at: number;
};

type LoadStatus = "idle" | "loading" | "loaded" | "error";

const CHANGE_TYPE_LABEL: Record<string, string> = {
  buy_package: "Purchase",
  create_task: "Generation",
  create_task_free: "Free generation",
  month_free: "Monthly grant",
  register_give: "Welcome bonus",
  invite_reward: "Invite reward",
  daily_check: "Daily check-in",
  refund: "Refund",
};

function formatChangeType(value: string) {
  return CHANGE_TYPE_LABEL[value] ?? value.replace(/_/g, " ");
}

function formatTimestamp(seconds: number) {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays === 0) {
    return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(date);
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="14"
    >
      <ellipse cx="9" cy="6.5" rx="6" ry="2.5" />
      <path d="M3 6.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
      <path d="M3 10.5v4c0 1.4 2.7 2.5 6 2.5" />
      <ellipse cx="16" cy="14" rx="6" ry="2.5" />
      <path d="M10 14v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
    </svg>
  );
}

export function CreditsBalance() {
  const { userInfo, isLoadingUserInfo, isSignedIn, refreshUserInfo } = useUserInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<PointsLogItem[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const loadLog = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setStatus("loading");
    setErrorMessage("");
    try {
      const result = await api.user.getTimesLog(1, 5);
      if (requestId !== requestIdRef.current) return;
      const list = (result as { data?: { list?: PointsLogItem[] } })?.data?.list;
      setItems(Array.isArray(list) ? list : []);
      setStatus("loaded");
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to load history");
    }
  }, []);

  const handleToggleOpen = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen && isSignedIn) {
      void refreshUserInfo();
      void loadLog();
    }
  };

  if (!isSignedIn) return null;

  const credits = userInfo?.total_credits ?? 0;
  const freeCredits = userInfo?.free_limit ?? 0;
  const paidCredits = userInfo?.remaining_limit ?? 0;

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-700"
        onClick={handleToggleOpen}
        title="Credit balance — view recent activity"
        type="button"
      >
        <CoinsIcon className="text-violet-700" />
        <span>{isLoadingUserInfo ? "..." : credits}</span>
      </button>
      {isOpen ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-xl"
          role="menu"
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Credit balance</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{isLoadingUserInfo ? "..." : credits}</p>
              <p className="mt-1 text-xs text-slate-600">
                Free {freeCredits} · Paid {paidCredits}
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-cyan-300/15 text-violet-700">
              <CoinsIcon className="h-5 w-5" />
            </span>
          </div>

          <div className="px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Recent activity</p>
            {status === "loading" && items.length === 0 ? (
              <p className="py-3 text-center text-sm text-slate-500">Loading...</p>
            ) : status === "error" ? (
              <p className="py-3 text-center text-sm text-rose-300">{errorMessage || "Unable to load history"}</p>
            ) : items.length === 0 ? (
              <p className="py-3 text-center text-sm text-slate-500">No recent activity</p>
            ) : (
              <ul className={`space-y-2 transition-opacity ${status === "loading" ? "opacity-60" : "opacity-100"}`}>
                {items.map((item) => (
                  <li className="flex items-center justify-between gap-3 text-sm" key={item.id}>
                    <div className="min-w-0">
                      <p className="truncate text-slate-700">{formatChangeType(item.change_type)}</p>
                      <p className="text-xs text-slate-500">{formatTimestamp(item.created_at)}</p>
                    </div>
                    <span
                      className={`font-semibold ${item.use_limit > 0 ? "text-emerald-300" : "text-rose-300"}`}
                    >
                      {item.use_limit > 0 ? "+" : ""}
                      {item.use_limit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-2">
            <Link
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-white/5 hover:text-violet-700"
              href="/pricing"
              onClick={() => setIsOpen(false)}
            >
              <span>Top up credits</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
