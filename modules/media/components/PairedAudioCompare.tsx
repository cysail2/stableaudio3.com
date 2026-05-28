import { DeferredAudio } from "@/modules/media/components/DeferredAudio";

export type AudioCompareSide = {
  audio: string;
  /** ISO 8601 duration, e.g. "PT45S". */
  duration: string;
  alt: string;
  note: string;
};

export type AudioComparePair = {
  id: string;
  title: string;
  prompt: string;
  /** The competitor model's clip (rendered on the left). */
  competitor: AudioCompareSide;
  /** Stable Audio 3's clip (rendered on the right). */
  stableAudio: AudioCompareSide;
  /** Short verdict line, e.g. "Structure → ACE-Step · Atmosphere → Stable Audio 3". */
  verdict: string;
};

/** "PT45S" → "45 s" for the DeferredAudio duration chip. */
function isoDurationToHuman(iso: string): string {
  const match = iso.match(/^PT(\d+)S$/);
  if (!match) return iso;
  return `${match[1]} s`;
}

/**
 * Side-by-side A/B audio comparison card used in the comparison ("vs") pages'
 * "Real Prompt Test Examples" section. Each card renders the shared prompt,
 * the competitor clip on the left and the Stable Audio 3 clip on the right
 * (each via the lazy DeferredAudio player), and a verdict line below.
 *
 * The competitor uses the amber waveform (data-mode="inpaint") and Stable
 * Audio 3 uses the brand violet (data-mode="t2a") purely as a visual A/B
 * distinction; the mode prop here only drives the canvas color, not any schema.
 * `competitorLabel` sets the left-column label (e.g. "ACE-Step", "Suno AI").
 */
export function PairedAudioCompare({
  id,
  pairs,
  title,
  competitorLabel,
  eyebrow = "Real Prompt Tests",
}: {
  id?: string;
  pairs: readonly AudioComparePair[];
  title: string;
  competitorLabel: string;
  eyebrow?: string;
}) {
  return (
    <section className="scroll-mt-28" id={id}>
      <div className="mb-7 max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
        <p className="mt-3 text-base leading-7 text-slate-600 md:text-lg">
          Same prompt, both models. Press play on each side to compare {competitorLabel} and Stable Audio 3 directly — these are real generations, not cherry-picked showcase demos.
        </p>
      </div>
      <div className="grid gap-8">
        {pairs.map((pair) => (
          <ComparePairCard competitorLabel={competitorLabel} key={pair.id} pair={pair} />
        ))}
      </div>
    </section>
  );
}

function ComparePairCard({ competitorLabel, pair }: { competitorLabel: string; pair: AudioComparePair }) {
  return (
    <article
      className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
      id={pair.id}
    >
      <div className="border-b border-slate-100 p-6 md:p-8">
        <h3 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{pair.title}</h3>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Prompt used</p>
          <p className="mt-2 text-sm leading-6 text-slate-700 md:text-base">&ldquo;{pair.prompt}&rdquo;</p>
        </div>
      </div>
      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-2">
        <CompareSide
          accent="amber"
          label={competitorLabel}
          mode="inpaint"
          side={pair.competitor}
          title={pair.title}
        />
        <CompareSide
          accent="violet"
          label="Stable Audio 3"
          mode="t2a"
          side={pair.stableAudio}
          title={pair.title}
        />
      </div>
      <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4 md:px-8">
        <p className="text-sm leading-6 text-slate-700">
          <span className="font-black uppercase tracking-[0.14em] text-violet-700">Verdict </span>
          {pair.verdict}
        </p>
      </div>
    </article>
  );
}

function CompareSide({
  accent,
  label,
  mode,
  side,
  title,
}: {
  accent: "amber" | "violet";
  label: string;
  mode: "t2a" | "inpaint";
  side: AudioCompareSide;
  title: string;
}) {
  const labelClass =
    accent === "amber"
      ? "bg-amber-50 text-amber-800 ring-1 ring-amber-100"
      : "bg-violet-50 text-violet-800 ring-1 ring-violet-100";
  return (
    <div className="flex flex-col gap-4">
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${labelClass}`}
      >
        {label}
      </span>
      <DeferredAudio
        description={side.alt}
        duration={isoDurationToHuman(side.duration)}
        genre={label}
        mode={mode}
        src={side.audio}
        title={`${label} — ${title}`}
      />
      <p className="text-sm leading-6 text-slate-600">{side.note}</p>
    </div>
  );
}
