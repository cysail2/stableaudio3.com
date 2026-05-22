"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

export type TocItem = {
  id: string;
  label: string;
};

type TocSide = "left" | "right";

// Viewport width at which the expanded outline (w-64) fits in the gutter
// beside the max-w-5xl article column without overlapping content.
// Math: article half-width (32rem) + panel column (16rem) ≈ 48rem each side ≈ 96rem total ≈ 1536px (Tailwind 2xl).
const EXPANDED_TOC_MIN_WIDTH = "(min-width: 1536px)";

export function SeoArticleShell({
  children,
  toc,
}: {
  children: ReactNode;
  toc: readonly TocItem[];
}) {
  const [tocSide, setTocSide] = useState<TocSide>("left");
  const [tocPinned, setTocPinned] = useState(false);
  const tocItems = useMemo(() => toc.filter((item) => item.id !== "next-steps"), [toc]);
  const { activeId, isTocVisible } = useArticleTocState(tocItems);

  // Auto-expand when the viewport is wide enough to fit the panel beside the
  // article without overlap; auto-collapse to the mini preview otherwise.
  // Re-evaluates on viewport resize across the 2xl breakpoint.
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia(EXPANDED_TOC_MIN_WIDTH);
    const apply = (matches: boolean) => setTocPinned(matches);
    apply(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => apply(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="relative bg-slate-50 text-slate-950">
      <FloatingArticleToc
        activeId={activeId}
        isPinned={tocPinned}
        isVisible={isTocVisible}
        items={tocItems}
        onCollapse={() => setTocPinned(false)}
        onPin={() => setTocPinned(true)}
        onSelectSide={(side) => {
          setTocSide(side);
          setTocPinned(true);
        }}
        side={tocSide}
      />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <MobileArticleToc activeId={activeId} items={tocItems} />
        <article className="min-w-0 space-y-8">{children}</article>
      </div>
    </div>
  );
}

function FloatingArticleToc({
  activeId,
  isPinned,
  isVisible,
  items,
  onCollapse,
  onPin,
  onSelectSide,
  side,
}: {
  activeId: string;
  isPinned: boolean;
  isVisible: boolean;
  items: readonly TocItem[];
  onCollapse: () => void;
  onPin: () => void;
  onSelectSide: (side: TocSide) => void;
  side: TocSide;
}) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const panelOpen = isPinned || isPreviewing;
  const sideStyle: CSSProperties = side === "left"
    ? {
        height: "min(calc(100vh - 10rem), calc(100% - 2rem))",
        marginLeft: "max(1rem, calc(50vw - 49.5rem))",
      }
    : {
        height: "min(calc(100vh - 10rem), calc(100% - 2rem))",
        marginLeft: "auto",
        marginRight: "max(1rem, calc(50vw - 49.5rem))",
      };
  const panelSideClass = side === "left" ? "left-0" : "right-0";
  const handleSideClass = side === "left" ? "left-0" : "right-0";
  const panelVisibility = panelOpen
    ? "pointer-events-auto opacity-100"
    : "pointer-events-none opacity-0";
  const collapsePanel = () => {
    setIsPreviewing(false);
    onCollapse();
  };

  if (!isVisible || items.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
      <aside
        className={`sticky top-32 pointer-events-auto transition-[width] duration-200 ${panelOpen ? "w-64" : "w-12"}`}
        onBlurCapture={(event) => {
          const nextTarget = event.relatedTarget;
          if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
            setIsPreviewing(false);
          }
        }}
        onFocusCapture={() => setIsPreviewing(true)}
        onMouseEnter={() => setIsPreviewing(true)}
        onMouseLeave={() => setIsPreviewing(false)}
        style={sideStyle}
      >
        {!panelOpen ? (
          <button
            aria-label="Pin page outline"
            className={`absolute ${handleSideClass} top-0 z-10 rounded-2xl border border-transparent bg-transparent px-2 py-3 opacity-100 transition hover:border-slate-200 hover:bg-white/80 focus-visible:border-violet-300 focus-visible:bg-white focus-visible:outline-none`}
            onClick={onPin}
            title="Pin page outline"
            type="button"
          >
            <MiniOutlinePreview activeId={activeId} items={items} />
          </button>
        ) : null}
        <nav
          aria-label="Page sections"
          className={`absolute ${panelSideClass} flex h-full max-h-full w-64 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/12 transition duration-200 ${panelVisibility}`}
        >
          <ArticleTocHeader
            isPinned={isPinned}
            onCollapse={collapsePanel}
            onSelectSide={onSelectSide}
            side={side}
          />
          <TocLinks activeId={activeId} items={items} />
        </nav>
      </aside>
    </div>
  );
}

function MiniOutlinePreview({ activeId, items }: { activeId: string; items: readonly TocItem[] }) {
  const previewCount = Math.min(12, items.length);
  const previewItems = items.slice(0, previewCount);
  const sourceActiveIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const activePreviewIndex = previewCount > 1 && items.length > 1
    ? Math.round((sourceActiveIndex / (items.length - 1)) * (previewCount - 1))
    : 0;

  return (
    <span className="grid w-7 gap-2.5" aria-hidden="true">
      {previewItems.map((item, index) => (
        <span
          className={`h-0.5 rounded-full transition-all ${index === activePreviewIndex ? "bg-slate-800" : "bg-slate-300"}`}
          key={item.id}
          style={{ width: `${index === activePreviewIndex ? 34 : index % 3 === 0 ? 26 : index % 3 === 1 ? 18 : 22}px` }}
        />
      ))}
    </span>
  );
}

function MobileArticleToc({ activeId, items }: { activeId: string; items: readonly TocItem[] }) {
  return (
    <details className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
      <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.18em] text-slate-500">On this page</summary>
      <TocLinks activeId={activeId} items={items} />
    </details>
  );
}

function ArticleTocHeader({
  isPinned,
  onCollapse,
  onSelectSide,
  side,
}: {
  isPinned: boolean;
  onCollapse: () => void;
  onSelectSide: (side: TocSide) => void;
  side: TocSide;
}) {
  return (
    <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white/95 p-4 backdrop-blur">
      <p className="min-w-0 truncate text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">On This Page</p>
      <div className="flex shrink-0 rounded-full border border-slate-200 bg-slate-100 p-1">
        <TocControlButton
          isActive={isPinned && side === "left"}
          icon="left"
          label="Move outline to the left"
          onClick={() => onSelectSide("left")}
        />
        <TocControlButton
          isActive={isPinned && side === "right"}
          icon="right"
          label="Move outline to the right"
          onClick={() => onSelectSide("right")}
        />
        <TocControlButton
          isActive={!isPinned}
          icon="hide"
          label="Collapse outline"
          onClick={onCollapse}
        />
      </div>
    </div>
  );
}

function TocControlButton({
  icon,
  isActive,
  label,
  onClick,
}: {
  icon: "hide" | "left" | "right";
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={isActive}
      className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
        isActive
          ? "bg-white text-slate-700 ring-1 ring-slate-300"
          : "text-slate-500 hover:bg-white hover:text-slate-900 hover:ring-1 hover:ring-slate-200"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <TocControlIcon type={icon} />
    </button>
  );
}

function TocControlIcon({ type }: { type: "hide" | "left" | "right" }) {
  if (type === "hide") {
    return (
      <span className="relative h-3.5 w-3.5" aria-hidden="true">
        <span className="absolute left-0 top-1.5 h-0.5 w-3.5 rotate-45 rounded-full bg-current" />
        <span className="absolute left-0 top-1.5 h-0.5 w-3.5 -rotate-45 rounded-full bg-current" />
      </span>
    );
  }

  return (
    <span className="relative h-3.5 w-3.5 rounded-[3px] border border-current" aria-hidden="true">
      <span className={`absolute top-0 h-full w-1 rounded-[2px] bg-current ${type === "left" ? "left-0" : "right-0"}`} />
    </span>
  );
}

function TocLinks({ activeId, items }: { activeId: string; items: readonly TocItem[] }) {
  return (
    <div className="grid gap-1 overflow-y-auto p-4">
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <a
            aria-current={isActive ? "true" : undefined}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold leading-5 transition ${
              isActive
                ? "bg-violet-50 text-slate-950"
                : "text-slate-600 hover:bg-violet-50 hover:text-slate-950"
            }`}
            href={`#${item.id}`}
            key={item.id}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}

function useArticleTocState(items: readonly TocItem[]) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [isTocVisible, setIsTocVisible] = useState(false);
  const itemKey = items.map((item) => item.id).join("|");

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const sections = items
        .map((item) => ({ ...item, element: document.getElementById(item.id) }))
        .filter((item): item is TocItem & { element: HTMLElement } => item.element instanceof HTMLElement);

      if (sections.length === 0) {
        setIsTocVisible(false);
        return;
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const firstTop = sections[0].element.getBoundingClientRect().top;
      const ctaTop = document.getElementById("next-steps")?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const contentHasEntered = firstTop < viewportHeight - 80;
      const ctaHasEntered = ctaTop < viewportHeight - 24;
      setIsTocVisible(contentHasEntered && !ctaHasEntered);

      const anchorY = 160;
      let nextActiveId = sections[0].id;

      for (const section of sections) {
        if (section.element.getBoundingClientRect().top <= anchorY) {
          nextActiveId = section.id;
        }
      }

      setActiveId(nextActiveId);
    };

    const scheduleUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [itemKey, items]);

  return { activeId, isTocVisible };
}
