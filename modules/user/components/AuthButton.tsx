"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TaskCenterMenuButton } from "@/modules/task-center/components/TaskCenterMenuButton";
import { CreditsBalance } from "./CreditsBalance";
import { useUserInfo } from "../providers/UserProvider";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="14"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect height="18" rx="1" width="3" x="4" y="3" />
      <rect height="18" rx="1" width="3" x="10" y="3" />
      <path d="M17 5l3 .6-3 16-3-.6z" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

export function AuthButton() {
  const { isSignedIn, userInfo, openSignIn, signOut } = useUserInfo();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  if (!isSignedIn) {
    return (
      <button className="button-primary min-h-10 px-4 text-sm" onClick={() => openSignIn()} type="button">
        Sign In
      </button>
    );
  }

  const displayName = userInfo?.nickname || userInfo?.email || "Account";
  const initials = (userInfo?.nickname?.[0] || userInfo?.email?.[0] || "U").toUpperCase();

  return (
    <div className="flex items-center gap-2" ref={containerRef}>
      <TaskCenterMenuButton />
      <CreditsBalance />
      <div className="relative">
        <button
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 py-1 pl-1 pr-3 text-sm text-slate-100 transition hover:border-cyan-300/60"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-cyan-300/20 text-xs font-bold text-cyan-100">
            {userInfo?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className="h-full w-full object-cover" src={userInfo.avatar} />
            ) : (
              initials
            )}
          </span>
          <span className="hidden max-w-[140px] truncate text-slate-100 sm:inline">{displayName}</span>
          <ChevronDownIcon className={`text-slate-400 transition ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen ? (
          <div
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl"
            role="menu"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-3 pb-3 pt-2">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-cyan-300/20 text-sm font-bold text-cyan-100">
                {userInfo?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" className="h-full w-full object-cover" src={userInfo.avatar} />
                ) : (
                  initials
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                {userInfo?.email ? <p className="truncate text-xs text-slate-400">{userInfo.email}</p> : null}
              </div>
            </div>
            <div className="mt-1 flex flex-col">
              <Link
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                href="/account"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <UserIcon />
                My Account
              </Link>
              <Link
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                href="/library"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <LibraryIcon />
                My Creations
              </Link>
              <div className="mx-2 my-1 h-px bg-white/10" />
              <button
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                onClick={() => {
                  setIsOpen(false);
                  void signOut();
                }}
                role="menuitem"
                type="button"
              >
                <LogOutIcon />
                Sign Out
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
