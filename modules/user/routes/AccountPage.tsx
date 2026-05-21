"use client";

import Link from "next/link";
import { useUserInfo } from "../providers/UserProvider";

export function AccountPage() {
  const { userInfo, isSignedIn, isLoadingUserInfo, openSignIn, refreshUserInfo, signOut } = useUserInfo();

  if (!isSignedIn) {
    return (
      <main className="section">
        <div className="section-heading">
          <p className="eyebrow">Account</p>
          <h1>Your Stable Audio 3 Account</h1>
          <p>Sign in to view your balance, generation history, and account settings.</p>
        </div>
        <div className="surface-card mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-white">Sign in to continue</h2>
          <p className="mt-3 text-slate-400">
            Your free credits, purchased credits, and generated audio are tied to your account.
          </p>
          <button
            className="button-primary mt-6"
            onClick={() => openSignIn({ forceRedirectUrl: "/account" })}
            type="button"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  const displayName = userInfo?.nickname || userInfo?.email || "Stable Audio 3 member";
  const initials = (userInfo?.nickname?.[0] || userInfo?.email?.[0] || "U").toUpperCase();
  const freeCredits = userInfo?.free_limit ?? 0;
  const paidCredits = userInfo?.remaining_limit ?? 0;
  const totalCredits = userInfo?.total_credits ?? freeCredits + paidCredits;

  return (
    <main className="section">
      <div className="section-heading">
        <p className="eyebrow">Account</p>
        <h1>Account Settings</h1>
        <p>Manage your profile, credit balance, and account security in one place.</p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6">
        <section className="grid gap-6 md:grid-cols-3">
          <div className="surface-card md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Profile</span>
            </div>
            <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-white/10 bg-cyan-300/15 text-xl font-bold text-cyan-100">
                {userInfo?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" className="h-full w-full object-cover" src={userInfo.avatar} />
                ) : (
                  initials
                )}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-semibold text-white">{displayName}</h2>
                <p className="mt-1 break-all text-sm text-slate-400">{userInfo?.email || ""}</p>
                {userInfo?.uuid ? (
                  <p className="mt-2 text-xs text-slate-500">User ID: {userInfo.uuid}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="surface-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Balance</span>
            </div>
            <p className="mt-5 text-sm text-slate-400">Total credits available</p>
            <p className="mt-1 text-4xl font-bold text-white">{isLoadingUserInfo ? "-" : totalCredits}</p>
            <Link className="button-primary mt-6 min-h-10 px-4 text-sm" href="/pricing">
              Top up credits
            </Link>
          </div>
        </section>

        <section className="surface-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Resources &amp; Usage</span>
              <h3 className="mt-1 text-xl font-semibold text-white">Credit breakdown</h3>
            </div>
            <button
              className="button-secondary min-h-10 px-4 text-sm"
              onClick={() => void refreshUserInfo()}
              type="button"
            >
              Refresh
            </button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <span className="text-sm text-slate-400">Free credits</span>
              <strong className="mt-2 block text-3xl text-white">{isLoadingUserInfo ? "-" : freeCredits}</strong>
              <p className="mt-2 text-xs text-slate-500">Granted on sign-up and available until used.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <span className="text-sm text-slate-400">Paid credits</span>
              <strong className="mt-2 block text-3xl text-white">{isLoadingUserInfo ? "-" : paidCredits}</strong>
              <p className="mt-2 text-xs text-slate-500">Purchased credits never expire.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <span className="text-sm text-slate-400">Total available</span>
              <strong className="mt-2 block text-3xl text-white">{isLoadingUserInfo ? "-" : totalCredits}</strong>
              <p className="mt-2 text-xs text-slate-500">Used automatically by every generation.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="button-secondary min-h-10 px-4 text-sm" href="/library">
              View library
            </Link>
            <Link className="button-secondary min-h-10 px-4 text-sm" href="/pricing">
              See pricing plans
            </Link>
          </div>
        </section>

        <section className="surface-card border-rose-400/30">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">Security</span>
          <h3 className="mt-1 text-xl font-semibold text-white">Session &amp; account</h3>
          <p className="mt-2 text-sm text-slate-400">
            Sign out from this device if you are on a shared computer, or contact support to permanently delete
            your Stable Audio 3 account and generation history.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="button-secondary min-h-10 px-4 text-sm" onClick={() => void signOut()} type="button">
              Sign out of this device
            </button>
            <a className="button-secondary min-h-10 px-4 text-sm text-rose-200 hover:border-rose-300/70" href="mailto:support@stableaudio3.com?subject=Delete%20my%20Stable%20Audio%203%20account">
              Request account deletion
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
