"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DeferredAudio — lazy-mounting <audio> player with a canvas-rendered waveform.
 *
 * Why this exists:
 * - Audio cards on the home page + use-case grid + sample chips need a real
 *   playable preview once samples land in /public/samples/.
 * - We don't want to hit the network for audio binaries until the card scrolls
 *   into view (IntersectionObserver gate).
 * - We don't want to depend on WaveSurfer.js (~50 KB) — a plain canvas with a
 *   simple peaks renderer is enough for SEO-quality use-case cards.
 *
 * Phase A (now, no samples yet):
 *   <DeferredAudio src="" title="..." genre="..." duration="30 s" /> renders the
 *   placeholder shell (disabled play button + static-looking waveform). Once a
 *   real `src` is provided, the play button enables and the canvas paints peaks
 *   loaded from the audio file's first decode.
 *
 * Phase B (samples land):
 *   Drop MP3s in /public/samples/. Wire `src` per use-case in
 *   project/content/home.ts. AudioObject JSON-LD per sample lives at the page
 *   level (page passes `uploadDate` + `duration` props).
 */
type AudioMode = "t2a" | "a2a" | "inpaint";

type DeferredAudioProps = {
  src?: string;
  title: string;
  description?: string;
  genre?: string;
  duration?: string; // human-readable, e.g. "30 s" — paired with audio.duration once loaded
  mode?: AudioMode | string;
  /** Seed for deterministic placeholder waveform when no src is given */
  seed?: number;
  /** Render placeholder UI immediately, but only attach <audio> when scrolled in */
  loadWhenInView?: boolean;
  loadRootMargin?: string;
  className?: string;
};

const MODE_HUE: Record<AudioMode, string> = {
  t2a: "#7c3aed",
  a2a: "#ec4899",
  inpaint: "#f59e0b",
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getModeHue(mode: string) {
  return MODE_HUE[mode as AudioMode] || MODE_HUE.t2a;
}

/** Deterministic LCG → smooth peaks for placeholder mode */
function makeSeedPeaks(seed: number, count = 64): number[] {
  let state = seed * 9301 + 49297;
  const next = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
  const raw = Array.from({ length: count }, () => 0.4 + next() * 0.6);
  return raw.map((v, i) => {
    const envelope = Math.sin((i / (count - 1)) * Math.PI);
    return Math.max(0.08, v * (0.4 + 0.6 * envelope));
  });
}

/** Decode audio file → downsampled peaks for canvas drawing. Mono mix. */
async function loadAudioPeaks(src: string, samples = 96): Promise<number[]> {
  const res = await fetch(src);
  const buf = await res.arrayBuffer();
  const AudioCtx =
    (window.AudioContext as typeof AudioContext) ||
    ((window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
  if (!AudioCtx) return [];
  const ctx = new AudioCtx();
  try {
    const decoded = await ctx.decodeAudioData(buf.slice(0));
    const chan = decoded.getChannelData(0);
    const blockSize = Math.floor(chan.length / samples);
    const peaks: number[] = [];
    for (let i = 0; i < samples; i += 1) {
      let max = 0;
      const start = i * blockSize;
      const end = Math.min(start + blockSize, chan.length);
      for (let j = start; j < end; j += 1) {
        const v = Math.abs(chan[j]);
        if (v > max) max = v;
      }
      peaks.push(Math.max(0.05, max));
    }
    // Normalize
    const peakMax = Math.max(...peaks, 0.001);
    return peaks.map((p) => p / peakMax);
  } finally {
    ctx.close().catch(() => {});
  }
}

export function DeferredAudio({
  src,
  title,
  description,
  genre,
  duration,
  mode = "t2a",
  seed = 13,
  loadWhenInView = true,
  loadRootMargin = "320px 0px",
  className,
}: DeferredAudioProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inView, setInView] = useState(!loadWhenInView);
  const [peaks, setPeaks] = useState<number[]>(() => makeSeedPeaks(seed));
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [decoded, setDecoded] = useState(false);
  const [errored, setErrored] = useState(false);

  // IntersectionObserver gate — mount the <audio> only when card scrolls in
  useEffect(() => {
    if (!loadWhenInView || inView) return;
    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: loadRootMargin },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [inView, loadRootMargin, loadWhenInView]);

  // Decode peaks from real audio file once it's in view
  useEffect(() => {
    if (!inView || !src) return;
    let cancelled = false;
    loadAudioPeaks(src)
      .then((p) => {
        if (cancelled || p.length === 0) return;
        setPeaks(p);
        setDecoded(true);
      })
      .catch(() => {
        if (!cancelled) setErrored(true);
      });
    return () => {
      cancelled = true;
    };
  }, [inView, src]);

  // Draw waveform on canvas — re-run whenever peaks or progress change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const barWidth = 2;
    const gap = 2;
    const total = peaks.length;
    const stride = (w - gap) / total;
    const hue = getModeHue(mode);
    const midY = h / 2;
    const playedBars = Math.floor(progress * total);

    peaks.forEach((peak, i) => {
      const x = i * stride;
      const height = Math.max(2, peak * (h * 0.85));
      const y = midY - height / 2;
      ctx.fillStyle = i < playedBars ? hue : "rgba(148, 163, 184, 0.35)";
      // Rounded bar (manual)
      const r = Math.min(barWidth / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barWidth - r, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
      ctx.lineTo(x + barWidth, y + height - r);
      ctx.quadraticCurveTo(x + barWidth, y + height, x + barWidth - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.fill();
    });
  }, [mode, peaks, progress]);

  // Time tick → progress bar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setErrored(true);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const disabled = !src || errored;

  return (
    <div
      className={cx(
        "audio-card",
        className,
      )}
      data-mode={mode}
      ref={containerRef}
    >
      <div className="audio-card-thumb">
        {genre ? <span className="audio-card-genre">{genre}</span> : null}
        <canvas
          aria-hidden="true"
          className="block h-full w-full"
          ref={canvasRef}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <div className="audio-card-body">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="audio-card-foot">
        <button
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
          className="play-btn"
          disabled={disabled}
          onClick={handleToggle}
          style={
            !disabled
              ? {
                  cursor: "pointer",
                  opacity: 1,
                }
              : undefined
          }
          type="button"
        >
          {isPlaying ? (
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          {disabled ? "Preview" : isPlaying ? "Playing" : "Play"}
        </button>
        <span className="duration-chip">{duration}</span>
      </div>

      {/* Real <audio> mounted only after card scrolls into view */}
      {inView && src ? (
        <audio
          aria-label={`${title} — Stable Audio 3 sample`}
          className="hidden"
          preload={decoded ? "auto" : "metadata"}
          ref={audioRef}
          src={src}
        />
      ) : null}
    </div>
  );
}

export function HeroAudioPreview({
  src,
  title,
  subtitle,
}: {
  src: string;
  title: string;
  subtitle: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
      return;
    }
    audio.pause();
    setIsPlaying(false);
  };

  return (
    <div className="now-playing-chip mx-auto">
      <button
        aria-label={isPlaying ? "Pause Stable Audio 3 sample" : "Play Stable Audio 3 sample"}
        className="np-play"
        onClick={toggle}
        type="button"
      >
        {isPlaying ? (
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
        ) : (
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <div className="np-meta">
        <span className="np-title">{title}</span>
        <span className="np-sub">{subtitle}</span>
      </div>
      <div aria-hidden="true" className="np-wave">
        {[8, 14, 22, 12, 18, 26, 20, 12, 16, 24, 14, 8, 20, 18, 12, 22, 10, 16, 20, 12, 8].map(
          (height, index) => (
            <span key={index} style={{ height }} />
          ),
        )}
      </div>
      <audio aria-label={title} preload="metadata" ref={audioRef} src={src} />
    </div>
  );
}
