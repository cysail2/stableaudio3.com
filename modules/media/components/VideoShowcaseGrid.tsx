import Link from "next/link";
import { DeferredVideo } from "@/modules/media/components/DeferredVideo";

export type VideoShowcaseExample = {
  id: string;
  title: string;
  video: string;
  poster: string;
  alt: string;
  prompt: string;
  tag: string;
  mode: "T2V" | "I2V";
  aspect: "16:9" | "9:16" | "1:1";
  categoryId: string;
  uploadDate: string;
  duration: string;
  bestFor?: string;
};

export type VideoShowcaseCategory = {
  id: string;
  title: string;
  description: string;
};

const generatorModeForExample = (mode: VideoShowcaseExample["mode"]) =>
  mode === "I2V" ? "image" : "text";

const tryThisPromptHref = (example: VideoShowcaseExample) => ({
  pathname: "/stable-audio-3",
  query: {
    prompt: example.prompt,
    mode: generatorModeForExample(example.mode),
    aspect: example.aspect,
  },
});

export function VideoShowcaseGrid({
  eyebrow = "Examples",
  examples,
  categories,
  id,
  showHomeLink = false,
  title = "Video Showcase Clips",
}: {
  eyebrow?: string;
  examples: readonly VideoShowcaseExample[];
  categories?: readonly VideoShowcaseCategory[];
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
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      {showHomeLink ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          For the product overview, start from the{" "}
          <Link
            className="font-semibold text-cyan-700 underline decoration-cyan-300 underline-offset-4 transition hover:text-cyan-800 hover:decoration-cyan-500"
            href="/"
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
  categories: readonly VideoShowcaseCategory[];
  examples: readonly VideoShowcaseExample[];
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
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
            href={`#${category.id}`}
            key={category.id}
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
  category: VideoShowcaseCategory;
  examples: readonly VideoShowcaseExample[];
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
  examples: readonly VideoShowcaseExample[];
  priorityCount: number;
}) {
  const hasOddTail = examples.length > 1 && examples.length % 2 === 1;
  const gridExamples = hasOddTail ? examples.slice(0, -1) : examples;
  const tailExample = hasOddTail ? examples.at(-1) : undefined;

  return (
    <>
      <div className="grid items-stretch gap-8 lg:grid-cols-2">
        {gridExamples.map((example, index) => (
          <ExampleCard
            example={example}
            key={example.id}
            priority={index < priorityCount}
          />
        ))}
      </div>
      {tailExample ? (
        <div className="mt-8">
          <ExampleCard example={tailExample} priority={examples.length - 1 < priorityCount} variant="wide" />
        </div>
      ) : null}
    </>
  );
}

function ExampleCard({
  example,
  priority,
  variant = "standard",
}: {
  example: VideoShowcaseExample;
  priority: boolean;
  variant?: "standard" | "wide";
}) {
  const isWide = variant === "wide";

  return (
    <article className={`overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm ${isWide ? "lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]" : "flex flex-col"}`}>
      <DeferredVideo
        ariaLabel={`${example.title} example video`}
        alt={example.alt}
        controls
        poster={example.poster}
        priority={priority}
        preload="metadata"
        src={example.video}
        wrapperClassName={`aspect-video w-full bg-slate-950 ${isWide ? "lg:h-full lg:min-h-[20rem]" : ""}`}
      />
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <header>
          <h4 className="text-xl font-bold leading-tight text-slate-950 md:text-2xl">{example.title}</h4>
          <ChipRow example={example} />
        </header>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Starter prompt</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{example.prompt}</p>
        </div>
        <div className="mt-auto">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
            href={tryThisPromptHref(example)}
          >
            Try this prompt
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function ChipRow({ example }: { example: VideoShowcaseExample }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Chip tone="cyan">{example.mode}</Chip>
      <Chip tone="slate">{example.aspect}</Chip>
      <Chip tone="amber">{example.tag}</Chip>
    </div>
  );
}

function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "cyan" | "slate" | "amber";
}) {
  const toneClasses: Record<"cyan" | "slate" | "amber", string> = {
    cyan: "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-100",
    slate: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
