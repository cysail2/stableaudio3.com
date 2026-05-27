import Link from "next/link";
import { DeferredAudio } from "@/modules/media/components/DeferredAudio";

export type AudioShowcaseMode = "T2A" | "A2A" | "Inpaint";

export type AudioShowcaseExample = {
  id: string;
  title: string;
  audio: string;
  alt: string;
  /** Free-text prompt for T2A. For A2A/Inpaint, this holds the optional transformation/inpaint note. */
  prompt: string;
  /** Comma-separated style tags. Required for A2A/Inpaint, omitted for T2A. */
  styleTags?: string;
  /** Source audio path for A2A/Inpaint. Original tags + region info also live here for context. */
  sourceAudio?: string;
  /** Original tags for A2A only (Inpaint UI doesn't have this field). */
  originalTags?: string;
  /** Inpaint window (e.g., "10s – 17s"). Only set for Inpaint examples. */
  inpaintRegion?: string;
  tag: string;
  mode: AudioShowcaseMode;
  categoryId: string;
  uploadDate: string;
  /** ISO 8601 duration, e.g. "PT30S". */
  duration: string;
};

export type AudioShowcaseCategory = {
  id: string;
  title: string;
  description: string;
};

const MODE_QUERY: Record<AudioShowcaseMode, string> = {
  T2A: "t2a",
  A2A: "a2a",
  Inpaint: "inpaint",
};

const MODE_LABEL: Record<AudioShowcaseMode, string> = {
  T2A: "Text-to-Audio",
  A2A: "Audio-to-Audio",
  Inpaint: "Audio Inpaint",
};

const MODE_PLAYER: Record<AudioShowcaseMode, "t2a" | "a2a" | "inpaint"> = {
  T2A: "t2a",
  A2A: "a2a",
  Inpaint: "inpaint",
};

/**
 * Try-this-prompt deeplinks into the generator. The StableAudioGenerator reads
 * `mode`, `prompt`, and `tags` from URL search params. For A2A and Inpaint, the
 * user still needs to upload the source audio file manually — the deeplink
 * pre-fills only the prompt/tags fields.
 */
const tryThisPromptHref = (example: AudioShowcaseExample) => {
  const query: Record<string, string> = {
    mode: MODE_QUERY[example.mode],
  };
  if (example.prompt) {
    query.prompt = example.prompt;
  }
  if (example.styleTags) {
    query.tags = example.styleTags;
  }
  return {
    pathname: "/stable-audio-3",
    query,
  };
};

export function AudioShowcaseGrid({
  eyebrow = "Examples",
  examples,
  categories,
  id,
  showHomeLink = false,
  title = "Audio Showcase Clips",
}: {
  eyebrow?: string;
  examples: readonly AudioShowcaseExample[];
  categories?: readonly AudioShowcaseCategory[];
  id?: string;
  showHomeLink?: boolean;
  title?: string;
}) {
  if (!categories || categories.length === 0) {
    return (
      <section className="scroll-mt-28" id={id}>
        <ShowcaseHeader eyebrow={eyebrow} showHomeLink={showHomeLink} title={title} />
        <ExamplesGrid examples={examples} priorityCount={2} />
      </section>
    );
  }

  return (
    <section className="scroll-mt-28" id={id}>
      <ShowcaseHeader eyebrow={eyebrow} showHomeLink={showHomeLink} title={title} />
      <UseCaseIndex categories={categories} examples={examples} />
      <div className="mt-12 grid gap-16">
        {categories.map((category, categoryIndex) => {
          const categoryExamples = examples.filter(
            (example) => example.categoryId === category.id,
          );
          if (categoryExamples.length === 0) return null;
          return (
            <CategorySection
              category={category}
              examples={categoryExamples}
              key={category.id}
              priorityCount={categoryIndex === 0 ? 2 : 0}
            />
          );
        })}
      </div>
    </section>
  );
}

function ShowcaseHeader({
  eyebrow,
  showHomeLink,
  title,
}: {
  eyebrow: string;
  showHomeLink: boolean;
  title: string;
}) {
  return (
    <div className="mb-7 max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      {showHomeLink ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          For the product overview, start from the{" "}
          <Link
            className="font-semibold text-violet-700 underline decoration-violet-300 underline-offset-4 transition hover:text-violet-800 hover:decoration-violet-500"
            href="/"
            title="Stable Audio 3 home"
          >
            Stable Audio 3 homepage
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}

function UseCaseIndex({
  categories,
  examples,
}: {
  categories: readonly AudioShowcaseCategory[];
  examples: readonly AudioShowcaseExample[];
}) {
  const countByCategory = categories.map((category) => ({
    category,
    count: examples.filter((example) => example.categoryId === category.id).length,
  }));

  return (
    <nav
      aria-label="Showcase categories"
      className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      {countByCategory.map(({ category, count }) =>
        count === 0 ? null : (
          <a
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-800"
            href={`#${category.id}`}
            key={category.id}
            title={`View ${category.title} examples`}
          >
            <span>{category.title}</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-500">{count}</span>
          </a>
        ),
      )}
    </nav>
  );
}

function CategorySection({
  category,
  examples,
  priorityCount,
}: {
  category: AudioShowcaseCategory;
  examples: readonly AudioShowcaseExample[];
  priorityCount: number;
}) {
  return (
    <section className="scroll-mt-28" id={category.id}>
      <div className="mb-6 max-w-4xl">
        <h3 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{category.title}</h3>
        <p className="mt-3 text-base leading-7 text-slate-600 md:text-lg">{category.description}</p>
      </div>
      <ExamplesGrid examples={examples} priorityCount={priorityCount} />
    </section>
  );
}

function ExamplesGrid({
  examples,
  priorityCount,
}: {
  examples: readonly AudioShowcaseExample[];
  priorityCount: number;
}) {
  return (
    <div className="grid items-stretch gap-6 md:grid-cols-2">
      {examples.map((example, index) => {
        const isLast = index === examples.length - 1;
        // When a category has an odd number of examples, the final card would
        // leave an empty grid cell next to it. We span the tail across both
        // columns and keep the same stacked DeferredAudio + details layout —
        // visually a "featured" wide card. This avoids the side-by-side
        // alignment issue that came from two separate card chromes (the
        // colored audio thumb touching the top edge on the left vs the
        // white padded details panel on the right) sitting next to each
        // other on the same row.
        const spanFullRow = examples.length % 2 === 1 && isLast;
        return (
          <ExampleCard
            example={example}
            key={example.id}
            priority={index < priorityCount}
            spanFullRow={spanFullRow}
          />
        );
      })}
    </div>
  );
}

function ExampleCard({
  example,
  priority: _priority,
  spanFullRow = false,
}: {
  example: AudioShowcaseExample;
  priority: boolean;
  spanFullRow?: boolean;
}) {
  // _priority is currently unused — DeferredAudio handles its own lazy-mount
  // gate. Reserved for future enhancement (e.g. preloading the first two cards).
  void _priority;

  return (
    <article className={`flex flex-col gap-4 ${spanFullRow ? "md:col-span-2" : ""}`}>
      <DeferredAudio
        description={example.alt}
        duration={isoDurationToHuman(example.duration)}
        genre={MODE_LABEL[example.mode]}
        mode={MODE_PLAYER[example.mode]}
        src={example.audio}
        title={example.title}
      />
      <div className="flex flex-1 flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <ChipRow example={example} />
        <PromptPanel example={example} />
        <SourceContext example={example} />
        <div className="mt-auto">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            href={tryThisPromptHref(example)}
            title={`Try this ${MODE_LABEL[example.mode]} example in the Stable Audio 3 generator`}
          >
            Try this prompt
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function ChipRow({ example }: { example: AudioShowcaseExample }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip tone="violet">{example.mode}</Chip>
      <Chip tone="slate">{example.tag}</Chip>
    </div>
  );
}

function PromptPanel({ example }: { example: AudioShowcaseExample }) {
  const isTagBased = example.mode === "A2A" || example.mode === "Inpaint";
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      {isTagBased ? (
        <>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Style tags</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{example.styleTags}</p>
          {example.prompt ? (
            <>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {example.mode === "Inpaint" ? "Inpaint note" : "Transformation note"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{example.prompt}</p>
            </>
          ) : null}
        </>
      ) : (
        <>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Starter prompt</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{example.prompt}</p>
        </>
      )}
    </div>
  );
}

function SourceContext({ example }: { example: AudioShowcaseExample }) {
  if (example.mode === "T2A") return null;
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-xs leading-5 text-slate-600">
      {example.sourceAudio ? (
        <p>
          <span className="font-bold uppercase tracking-[0.14em] text-slate-500">Source audio </span>
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-700">
            {example.sourceAudio}
          </code>
        </p>
      ) : null}
      {example.originalTags ? (
        <p className="mt-1.5">
          <span className="font-bold uppercase tracking-[0.14em] text-slate-500">Original tags </span>
          {example.originalTags}
        </p>
      ) : null}
      {example.inpaintRegion ? (
        <p className="mt-1.5">
          <span className="font-bold uppercase tracking-[0.14em] text-slate-500">Inpaint region </span>
          {example.inpaintRegion}
        </p>
      ) : null}
    </div>
  );
}

function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "violet" | "slate";
}) {
  const toneClasses: Record<"violet" | "slate", string> = {
    violet: "bg-violet-50 text-violet-800 ring-1 ring-violet-100",
    slate: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

/** "PT30S" → "30 s" for the DeferredAudio duration chip. */
function isoDurationToHuman(iso: string): string {
  const match = iso.match(/^PT(\d+)S$/);
  if (!match) return iso;
  return `${match[1]} s`;
}
