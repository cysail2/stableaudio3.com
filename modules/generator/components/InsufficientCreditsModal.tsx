"use client";

import { useEffect } from "react";

type InsufficientCreditsModalProps = {
  open: boolean;
  creditCost: number;
  currentBalance?: number;
  onClose: () => void;
  onUpgrade: () => void;
};

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="36"
      viewBox="0 0 24 24"
      width="36"
    >
      <path d="M13.6 2.3 4.4 13.2c-.5.6-.1 1.5.7 1.5h5.1l-1.3 6.8c-.2.9 1 1.4 1.6.7l9.1-11c.5-.6.1-1.5-.7-1.5h-5.1l1.3-6.8c.2-.9-1-1.4-1.5-.6Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function InsufficientCreditsModal({
  open,
  creditCost,
  currentBalance = 0,
  onClose,
  onUpgrade,
}: InsufficientCreditsModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const shortfall = Math.max(creditCost - currentBalance, 0);

  return (
    <div
      aria-labelledby="insufficient-credits-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/78 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <button aria-label="Close credit dialog" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <div className="surface-card relative w-full max-w-md overflow-hidden !rounded-[2rem] !border-cyan-300/25 bg-slate-950/95 !p-0 text-center shadow-2xl shadow-cyan-950/40">
        <button
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-cyan-300/50 hover:text-white"
          onClick={onClose}
          type="button"
        >
          x
        </button>

        <div className="px-7 pb-7 pt-10">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-cyan-300/12 text-cyan-200 ring-8 ring-cyan-300/5">
            <ZapIcon className="h-9 w-9" />
          </div>

          <p className="eyebrow mb-3">Credits Required</p>
          <h2 className="text-2xl font-bold text-white" id="insufficient-credits-title">
            Not enough credits
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-300">
            This generation needs <span className="font-bold text-cyan-200">{creditCost} credits</span>.
            Your current balance is <span className="font-bold text-white">{currentBalance} credits</span>.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Need</span>
              <strong className="mt-2 block text-2xl text-white">{creditCost}</strong>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">Short by</span>
              <strong className="mt-2 block text-2xl text-cyan-100">{shortfall}</strong>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <button className="button-primary w-full" onClick={onUpgrade} type="button">
              Buy Credits
            </button>
            <button className="button-secondary w-full" onClick={onClose} type="button">
              Not now
            </button>
          </div>

          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-400">
              {["No expiry", "One-time packs", "Secure checkout"].map((item) => (
                <span className="inline-flex items-center gap-1.5" key={item}>
                  <CheckIcon className="h-4 w-4 text-emerald-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
