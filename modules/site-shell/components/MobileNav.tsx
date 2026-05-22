"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  footerNavigation,
  isNavGroup,
  primaryNavigation,
} from "@/project/config/navigation";
import { siteConfig } from "@/project/config/site";

/**
 * MobileNav — hamburger button + slide-out drawer for mobile navigation.
 *
 * Visible only on mobile (md:hidden). The desktop horizontal nav in SiteHeader
 * is `hidden md:flex`, so this fills the gap below the 768px breakpoint.
 *
 * Drawer behaviors:
 * - Closes when route changes (usePathname watcher)
 * - Closes on Escape key
 * - Closes on backdrop click
 * - Locks body scroll while open
 * - Highlights the current page link
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portal target = document.body, but only after mount (SSR-safe).
  // Rendering the drawer via portal lifts it out of SiteHeader's `sticky` stacking
  // context — otherwise the drawer is trapped within the 76px-tall header band.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (href: string) => {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    return `block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-violet-50 text-violet-700"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    }`;
  };

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        aria-controls="mobile-nav-drawer"
        aria-expanded={open}
        aria-label="Open navigation menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Drawer overlay — rendered via portal to document.body to escape the
          sticky SiteHeader's stacking context (which would otherwise trap it). */}
      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[100] md:hidden" id="mobile-nav-drawer">
              {/* Backdrop */}
              <button
                aria-label="Close navigation menu"
                className="absolute inset-0 h-full w-full bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setOpen(false)}
                type="button"
              />

              {/* Panel — use inset-y-0 + h-screen as a belt-and-suspenders for full-height */}
              <div className="absolute inset-y-0 right-0 flex h-screen w-72 max-w-[85vw] flex-col bg-white shadow-2xl">
            <div className="flex h-[76px] items-center justify-between border-b border-slate-200 px-5">
              <span className="text-base font-semibold text-slate-900">Menu</span>
              <button
                aria-label="Close navigation menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setOpen(false)}
                type="button"
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Product
              </p>
              <ul className="mt-2 space-y-1">
                {primaryNavigation.map((item) => {
                  if (isNavGroup(item)) {
                    return (
                      <li className="mt-2" key={item.label}>
                        <p className="px-3 pb-1 text-xs font-semibold text-slate-500">
                          {item.label}
                        </p>
                        <ul className="space-y-1">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link className={linkClass(child.href)} href={child.href}>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <Link className={linkClass(item.href)} href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Policies
              </p>
              <ul className="mt-2 space-y-1">
                {footerNavigation.map((link) => (
                  <li key={link.href}>
                    <Link className={linkClass(link.href)} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
              Support:{" "}
              <a
                className="font-semibold text-violet-700 underline decoration-violet-500/40 underline-offset-4"
                href={`mailto:${siteConfig.supportEmail}`}
              >
                {siteConfig.supportEmail}
              </a>
            </div>
          </div>
        </div>,
            document.body,
          )
        : null}
    </>
  );
}
