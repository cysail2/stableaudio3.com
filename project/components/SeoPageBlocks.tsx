import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SeoArticleShell, type TocItem } from "@/project/components/SeoArticleShell";
import { DeferredVideo } from "@/modules/media/components/DeferredVideo";
import {
  seoRelatedLinks,
  type ComparisonRow,
  type InlineVideoEvidence,
  type KeyFeatureRow,
  type MultiCompareTable as MultiCompareTableType,
  type ReviewSection,
  type SeoFaqItem,
  type SeoRelatedLink,
  type SeoSource,
  type SeoVisualCard,
} from "@/project/content/seo-pages";

export type { TocItem };

export type InternalLinkItem = {
  href: string;
  label: string;
};

const defaultContentLinks: readonly InternalLinkItem[] = [
  { href: "/", label: "Stable Audio 3 homepage" },
];

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Renders a paragraph string with inline markdown-style `[text](href)` links
// and backtick `code` spans. Plain text passes through unchanged.
const INLINE_PATTERN = /(\[([^\]]+)\]\(([^)]+)\))|(`([^`]+)`)/g;

export function renderInline(text: string): ReactNode {
  const segments: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      const label = match[2];
      const href = match[3];
      const isInternal = href.startsWith("/");
      const linkClass =
        "text-violet-700 underline decoration-cyan-300 underline-offset-4 transition hover:text-violet-800 hover:decoration-violet-500";
      segments.push(
        isInternal ? (
          <Link className={linkClass} href={href} key={key++} title={label}>
            {label}
          </Link>
        ) : (
          <a className={linkClass} href={href} key={key++} rel="noreferrer" target="_blank" title={label}>
            {label}
          </a>
        ),
      );
    } else if (match[4]) {
      segments.push(
        <code
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800"
          key={key++}
        >
          {match[5]}
        </code>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }
  return segments.length === 0 ? text : segments;
}

export function SeoArticleLayout({
  children,
  toc,
}: {
  children: ReactNode;
  toc: readonly TocItem[];
}) {
  return <SeoArticleShell toc={toc}>{children}</SeoArticleShell>;
}

export function InternalLinkLine({
  className = "",
  links = defaultContentLinks,
  text = "For the full product overview, start from the {0}.",
  variant = "light",
}: {
  className?: string;
  links?: readonly InternalLinkItem[];
  text?: string;
  variant?: "dark" | "light";
}) {
  const linkClass =
    variant === "dark"
      ? "font-semibold text-violet-700 underline decoration-violet-400/40 underline-offset-4 transition hover:text-violet-700"
      : "font-semibold text-violet-700 underline decoration-cyan-300 underline-offset-4 transition hover:text-violet-800 hover:decoration-violet-500";
  const textClass = variant === "dark" ? "text-slate-600" : "text-slate-600";
  const parts = text.split(/(\{\d+\})/g);

  return (
    <p className={`text-sm leading-6 ${textClass} ${className}`}>
      {parts.map((part, index) => {
        const match = part.match(/^\{(\d+)\}$/);
        if (!match) {
          return part;
        }

        const link = links[Number(match[1])];
        if (!link) {
          return null;
        }

        return (
          <Link className={linkClass} href={link.href} key={`${link.href}-${index}`} title={link.label}>
            {link.label}
          </Link>
        );
      })}
    </p>
  );
}

export type SeoHeroByline = {
  name: string;
  coReviewer?: string;
  lastUpdated: string;
};

export function SeoHero({
  eyebrow,
  title,
  lead,
  byline,
  disclosure,
  primaryHref = "/stable-audio-3",
  primaryLabel = "Try Stable Audio 3 Free",
  secondaryHref = "/stable-audio-3-showcase",
  secondaryLabel = "View Examples",
}: {
  eyebrow: string;
  title: string;
  lead: string;
  byline?: SeoHeroByline;
  disclosure?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string | null;
  secondaryLabel?: string | null;
}) {
  return (
    <section className="tool-hero-shell">
      <div className="tool-hero-copy">
        <p className="hero-badge">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-lede">{lead}</p>
        {byline ? (
          <p className="mt-4 text-sm text-slate-700/80">
            <span className="font-semibold text-slate-800">{byline.name}</span>
            {byline.coReviewer ? <span> · {byline.coReviewer}</span> : null}
            <span> · Updated {byline.lastUpdated}</span>
          </p>
        ) : null}
        {disclosure ? (
          <p className="mt-2 text-xs leading-relaxed text-slate-600/80">{disclosure}</p>
        ) : null}
        <div className="hero-actions">
          <Link className="button-primary" href={primaryHref} title={primaryLabel}>
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link className="button-secondary" href={secondaryHref} title={secondaryLabel}>
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function QuickTakeGrid({ id, items }: { id?: string; items: readonly { label: string; value: string }[] }) {
  return (
    <section className="scroll-mt-28" id={id}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" key={item.label}>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">{item.label}</span>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InlineVideoBreak({
  id,
  item,
  reverse = false,
}: {
  id?: string;
  item: InlineVideoEvidence;
  reverse?: boolean;
}) {
  return (
    <aside className="scroll-mt-28" id={id}>
      <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm md:grid-cols-[1.05fr_0.95fr]">
        <DeferredVideo
          alt={item.alt}
          ariaLabel={`${item.title} example video`}
          controls
          poster={item.poster}
          preload="metadata"
          src={item.video}
          wrapperClassName={`aspect-video w-full bg-white md:aspect-auto md:min-h-72 ${reverse ? "md:order-2" : ""}`}
        />
        <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
          {item.tag ? (
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">{item.tag}</p>
          ) : null}
          <h3 className="text-2xl font-bold tracking-tight text-slate-950">{item.title}</h3>
          <p className="text-base leading-8 text-slate-700">{item.caption}</p>
        </div>
      </div>
    </aside>
  );
}

export function VisualEvidenceBreak({
  id,
  item,
  reverse = false,
}: {
  id?: string;
  item: SeoVisualCard;
  reverse?: boolean;
}) {
  return (
    <aside className="scroll-mt-28" id={id}>
      <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm md:grid-cols-[0.95fr_1.05fr]">
        <div className={`relative aspect-[16/10] bg-slate-200 md:aspect-auto md:min-h-72 ${reverse ? "md:order-2" : ""}`}>
          <Image
            alt={item.alt}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
            src={item.image}
          />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-8">
          {item.badge ? (
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">{item.badge}</p>
          ) : null}
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{item.title}</h3>
          <p className="mt-4 text-base leading-8 text-slate-700">{item.body}</p>
        </div>
      </div>
    </aside>
  );
}

export function EditorialSections({
  internalLinks,
  sections,
}: {
  internalLinks?: readonly InternalLinkItem[];
  sections: readonly ReviewSection[];
}) {
  return (
    <section className="grid gap-6">
      {sections.map((section) => (
        <article className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-9" id={slugifyHeading(section.title)} key={section.title}>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{section.title}</h2>
          {internalLinks ? <InternalLinkLine className="mt-4" links={internalLinks} /> : null}
          <div className="mt-5 space-y-4">
            {section.paragraphs.map((paragraph, index) => (
              <div className="space-y-2" key={paragraph}>
                {section.subheadings?.[index] ? (
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">{section.subheadings[index]}</h3>
                ) : null}
                <p className="text-base leading-8 text-slate-700 md:text-lg">
                  {renderInline(paragraph)}
                </p>
              </div>
            ))}
            {section.bullets ? (
              <ul className="mt-2 grid gap-3">
                {section.bullets.map((bullet) => (
                  <li className="flex gap-3 text-base leading-7 text-slate-700 md:text-lg" key={bullet}>
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                    <span>{renderInline(bullet)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}

export function KeyFeatureTable({
  id,
  rows,
  title = "Key Features at a Glance",
}: {
  id?: string;
  rows: readonly KeyFeatureRow[];
  title?: string;
}) {
  return (
    <section className="scroll-mt-28" id={id}>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-9">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
        <dl className="mt-6 grid gap-x-8 gap-y-1 md:grid-cols-2">
          {rows.map((row) => (
            <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-2.5" key={row.label}>
              <dt className="text-sm font-semibold text-slate-600">{row.label}</dt>
              <dd className="text-right text-sm text-slate-800">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function MultiCompareTable({
  id,
  table,
  title = "How Stable Audio 3 Compares",
}: {
  id?: string;
  table: MultiCompareTableType;
  title?: string;
}) {
  return (
    <section className="scroll-mt-28" id={id}>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-9">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
        <p className="mt-4 text-base leading-7 text-slate-700 md:text-lg">{renderInline(table.intro)}</p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="block w-full max-w-full overflow-x-auto [overscroll-behavior-x:contain]">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  <th className="p-4 text-xs font-black uppercase tracking-[0.18em] text-violet-700">Dimension</th>
                  <th className="p-4 text-xs font-black uppercase tracking-[0.18em] text-violet-700">Stable Audio 3</th>
                  {table.competitors.map((competitor) => (
                    <th className="p-4 text-xs font-black uppercase tracking-[0.18em] text-violet-700" key={competitor}>
                      {competitor}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {table.rows.map((row) => (
                  <tr className="align-top" key={row.dimension}>
                    <td className="p-4 text-sm font-bold text-slate-950">{row.dimension}</td>
                    <td className="p-4 text-sm leading-6 text-slate-700">{row.sulphur}</td>
                    {row.competitors.map((value, idx) => (
                      <td className="p-4 text-sm leading-6 text-slate-700" key={`${row.dimension}-${idx}`}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {table.closingNote ? (
          <p className="mt-5 text-base leading-7 text-slate-700 md:text-lg">{renderInline(table.closingNote)}</p>
        ) : null}
      </div>
    </section>
  );
}

export function ProsCons({
  id,
  pros,
  cons,
}: {
  id?: string;
  pros: readonly string[];
  cons: readonly string[];
}) {
  return (
    <section className="scroll-mt-28" id={id}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-cyan-100 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">Strengths</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">What Stable Audio 3 Does Well</h2>
          <ul className="mt-6 space-y-4">
            {pros.map((item) => (
              <li className="flex gap-3 text-slate-700" key={item}>
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2rem] border border-orange-100 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Limits</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">What to Check Before Publishing</h2>
          <ul className="mt-6 space-y-4">
            {cons.map((item) => (
              <li className="flex gap-3 text-slate-700" key={item}>
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function TipCards({ id, tips }: { id?: string; tips: readonly { title: string; body: string }[] }) {
  return (
    <section className="scroll-mt-28" id={id}>
      <div className="grid gap-5 md:grid-cols-2">
        {tips.map((tip) => (
          <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm" key={tip.title}>
            <h2 className="text-2xl font-bold text-slate-950">{tip.title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{tip.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ComparisonTable({ id, rows, competitor }: { id?: string; rows: readonly ComparisonRow[]; competitor: string }) {
  const showTakeaway = rows.some((row) => row.takeaway);
  const minWidth = showTakeaway ? "min-w-[820px]" : "min-w-[640px]";
  return (
    <section className="scroll-mt-28" id={id}>
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="block w-full max-w-full overflow-x-auto [overscroll-behavior-x:contain]">
          <table className={`w-full ${minWidth} border-collapse text-left`}>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100">
                <th className="p-5 text-xs font-black uppercase tracking-[0.18em] text-violet-700">Dimension</th>
                <th className="p-5 text-xs font-black uppercase tracking-[0.18em] text-violet-700">Stable Audio 3</th>
                <th className="p-5 text-xs font-black uppercase tracking-[0.18em] text-violet-700">{competitor}</th>
                {showTakeaway ? (
                  <th className="p-5 text-xs font-black uppercase tracking-[0.18em] text-violet-700">Takeaway</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => (
                <tr className="align-top" key={row.dimension}>
                  <td className="p-5 font-bold text-slate-950">{row.dimension}</td>
                  <td className="p-5 text-sm leading-6 text-slate-700">{row.sulphur}</td>
                  <td className="p-5 text-sm leading-6 text-slate-700">{row.other}</td>
                  {showTakeaway ? (
                    <td className="p-5 text-sm font-semibold leading-6 text-violet-800">{row.takeaway ?? ""}</td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function SourceList({ id, sources }: { id?: string; sources: readonly SeoSource[] }) {
  return (
    <section className="scroll-mt-28" id={id}>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">Research Notes</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950">Public Sources Checked</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {sources.map((source) => (
            <a
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-violet-300 hover:bg-violet-50/50"
              href={source.href}
              key={source.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className="font-semibold text-slate-950">{source.label}</span>
              <p className="mt-2 text-sm leading-6 text-slate-600">{source.note}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedLinks({
  id,
  currentPath,
  links = seoRelatedLinks,
}: {
  id?: string;
  currentPath?: string;
  links?: readonly SeoRelatedLink[];
}) {
  const visibleLinks = currentPath ? links.filter((link) => link.href !== currentPath) : links;

  return (
    <section className="scroll-mt-28 pt-14 md:pt-16" id={id}>
      <div aria-hidden="true" className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="relative left-1/2 grid w-[min(calc(100vw-2rem),76rem)] -translate-x-1/2 gap-6 rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.18)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <div className="max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">Next Steps</p>
          <h2 className="mt-3 text-3xl font-bold">Keep Exploring Stable Audio 3</h2>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Use the generator, review examples, compare pricing, and save the strongest direction so the next test starts from what worked.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleLinks.map((link) => (
            <Link
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-violet-400"
              href={link.href}
              key={link.href}
              title={link.label}
            >
              <span className="font-semibold text-slate-900">{link.label}</span>
              <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SeoFaqSection({ id, items, title }: { id?: string; items: readonly SeoFaqItem[]; title: string }) {
  return (
    <section className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8" id={id}>
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">FAQ</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <details className="group rounded-2xl border border-slate-200 bg-slate-50 p-5" key={item.question}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-slate-950">
              {item.question}
              <span className="text-xs text-slate-600 transition group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
