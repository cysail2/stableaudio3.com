"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type DeferredVideoProps = {
  src: string;
  poster?: string;
  alt?: string;
  ariaLabel?: string;
  title?: string;
  wrapperClassName?: string;
  className?: string;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  priority?: boolean;
  loadWhenInView?: boolean;
  loadRootMargin?: string;
  loadThreshold?: number;
  disableVideoOnMobile?: boolean;
};

const MOBILE_MEDIA_QUERY = "(max-width: 767px), (hover: none), (pointer: coarse)";
const DEFERRED_VIDEO_PLAY_EVENT = "deferred-video:play";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function DeferredVideo({
  src,
  poster,
  alt = "",
  ariaLabel,
  title,
  wrapperClassName,
  className,
  controls = true,
  muted = true,
  loop = false,
  playsInline = true,
  preload = "metadata",
  priority = false,
  loadWhenInView = true,
  loadRootMargin = "320px 0px",
  loadThreshold = 0.1,
  disableVideoOnMobile = false,
}: DeferredVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(priority || !loadWhenInView);
  const [isMobileLike, setIsMobileLike] = useState(false);
  const [hasResolvedMediaState, setHasResolvedMediaState] = useState(!disableVideoOnMobile);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateMediaState = () => {
      setIsMobileLike(mediaQuery.matches);
      setHasResolvedMediaState(true);
    };

    updateMediaState();
    mediaQuery.addEventListener?.("change", updateMediaState);

    return () => {
      mediaQuery.removeEventListener?.("change", updateMediaState);
    };
  }, [disableVideoOnMobile]);

  useEffect(() => {
    if (!loadWhenInView || hasEnteredView || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setHasEnteredView(true);
        observer.disconnect();
      },
      {
        rootMargin: loadRootMargin,
        threshold: loadThreshold,
      },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [hasEnteredView, loadRootMargin, loadThreshold, loadWhenInView]);

  useEffect(() => {
    const handleOtherVideoPlay = (event: Event) => {
      const playingVideo = (event as CustomEvent<HTMLVideoElement>).detail;
      const video = videoRef.current;
      if (!video || video === playingVideo) {
        return;
      }

      video.pause();
    };

    window.addEventListener(DEFERRED_VIDEO_PLAY_EVENT, handleOtherVideoPlay);

    return () => {
      window.removeEventListener(DEFERRED_VIDEO_PLAY_EVENT, handleOtherVideoPlay);
    };
  }, []);

  const videoDisabled = disableVideoOnMobile && (!hasResolvedMediaState || isMobileLike);
  const shouldMountVideo = !videoDisabled && hasEnteredView;
  const accessibleLabel = ariaLabel || alt || title;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    window.dispatchEvent(new CustomEvent<HTMLVideoElement>(DEFERRED_VIDEO_PLAY_EVENT, { detail: video }));
    video.play().catch(() => {});
  };

  const pauseVideo = ({ reset = false }: { reset?: boolean } = {}) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.pause();
    if (reset) {
      video.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      playVideo();
      return;
    }

    pauseVideo();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) {
      setIsMuted((value) => !value);
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      ref={containerRef}
      className={cx("group/video relative overflow-hidden bg-black", wrapperClassName)}
    >
      {poster && !shouldMountVideo ? (
        <Image
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          fill
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          sizes="(min-width: 1536px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={poster}
        />
      ) : null}

      {shouldMountVideo ? (
        <video
          ref={videoRef}
          aria-label={accessibleLabel}
          className={cx("h-full w-full cursor-pointer object-cover", className)}
          height={720}
          loop={loop}
          muted={isMuted}
          onClick={togglePlayback}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
          onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
          playsInline={playsInline}
          poster={poster}
          preload={preload}
          src={src}
          title={title}
          width={1280}
        />
      ) : null}

      {controls && shouldMountVideo ? (
        <>
          {!isPlaying ? (
            <button
              aria-label={`Play ${accessibleLabel}`}
              className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/60 text-white opacity-100 ring-1 ring-white/25 backdrop-blur transition hover:bg-slate-950/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 md:opacity-0 md:group-hover/video:opacity-100 md:group-focus-within/video:opacity-100"
              onClick={(event) => {
                event.stopPropagation();
                playVideo();
              }}
              type="button"
            >
              <PlayIcon />
            </button>
          ) : (
            <button
              aria-label={`Pause ${accessibleLabel}`}
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/50 text-white opacity-0 ring-1 ring-white/20 backdrop-blur transition hover:bg-slate-950/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 group-hover/video:pointer-events-auto group-hover/video:opacity-100 group-focus-within/video:pointer-events-auto group-focus-within/video:opacity-100"
              onClick={(event) => {
                event.stopPropagation();
                pauseVideo();
              }}
              type="button"
            >
              <PauseIcon />
            </button>
          )}
          <button
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/45 text-white opacity-100 ring-1 ring-white/20 backdrop-blur transition hover:bg-slate-950/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 md:opacity-0 md:group-hover/video:opacity-100 md:group-focus-within/video:opacity-100"
            onClick={(event) => {
              event.stopPropagation();
              toggleMute();
            }}
            type="button"
          >
            {isMuted ? <MutedIcon /> : <VolumeIcon />}
          </button>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-white/20">
            <div className="h-full bg-cyan-300 transition-[width]" style={{ width: `${Number.isFinite(progress) ? progress : 0}%` }} />
          </div>
        </>
      ) : null}
    </div>
  );
}

function VolumeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 16 16">
      <path d="M2.5 6v4h2.7L9 13V3L5.2 6H2.5Z" />
      <path d="M11 5.2a4 4 0 0 1 0 5.6" />
      <path d="M12.8 3.7a6.5 6.5 0 0 1 0 8.6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 translate-x-px" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4 2.8v10.4c0 .7.8 1.1 1.4.7l8.1-5.2a.8.8 0 0 0 0-1.4L5.4 2.1C4.8 1.7 4 2.1 4 2.8Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4 3h3v10H4V3Zm5 0h3v10H9V3Z" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 16 16">
      <path d="M2.5 6v4h2.7L9 13V3L5.2 6H2.5Z" />
      <path d="m11.5 6 3 3" />
      <path d="m14.5 6-3 3" />
    </svg>
  );
}
