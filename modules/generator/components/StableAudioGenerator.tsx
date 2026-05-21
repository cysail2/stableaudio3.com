"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createStableAudioVideoTask } from "@/modules/api/services/stable-audio";
import { useTaskCenter } from "@/modules/task-center/providers/TaskCenterProvider";
import {
  getEstimatedTaskProgress,
  getTaskProgressHint,
  getTaskProgressStage,
} from "@/modules/task-center/services/taskProgress";
import { useUserInfo } from "@/modules/user/providers/UserProvider";
import { generatorCreditRules } from "@/project/config/pricing";
import { InsufficientCreditsModal } from "./InsufficientCreditsModal";

type Mode = "text" | "image";
type Resolution = "720P" | "1080P";
type AspectRatio = "16:9" | "9:16";

const maxReferenceImageSize = 10 * 1024 * 1024;

const previewVideos = [
  {
    title: "Product orbit",
    description: "Studio product motion",
    src: "/examples/product-showcase.mp4",
    poster: "/examples/product-showcase.webp",
  },
  {
    title: "Cinematic portrait",
    description: "Character and camera motion",
    src: "/examples/cinematic-portrait.mp4",
    poster: "/examples/cinematic-portrait.webp",
  },
  {
    title: "Social vertical",
    description: "Mobile-first clip",
    src: "/examples/social-vertical.mp4",
    poster: "/examples/social-vertical.webp",
  },
  {
    title: "Concept art",
    description: "Animated visual reference",
    src: "/examples/concept-art.mp4",
    poster: "/examples/concept-art.webp",
  },
] as const;

export function StableAudioGenerator() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode");
  const initialAspectRatio = searchParams.get("aspect");
  const initialPrompt = searchParams.get("prompt");
  const [mode, setMode] = useState<Mode>(initialMode === "image" ? "image" : "text");
  const [prompt, setPrompt] = useState(initialPrompt?.trim() ? initialPrompt : "");
  const [duration, setDuration] = useState(5);
  const [resolution, setResolution] = useState<Resolution>("720P");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    initialAspectRatio === "9:16" ? "9:16" : "16:9",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState("");
  const [activeTaskId, setActiveTaskId] = useState("");
  const [isInsufficientCreditsOpen, setInsufficientCreditsOpen] = useState(false);
  const [, forceProgressTick] = useState(0);
  const { isSignedIn, userInfo, openSignIn, refreshUserInfo } = useUserInfo();
  const { addTask, replaceTaskId, updateTask, tasks } = useTaskCenter();

  const creditCost = useMemo(() => {
    const perSecond =
      resolution === "720P"
        ? generatorCreditRules.costPerSecond720p
        : generatorCreditRules.costPerSecond1080p;
    return duration * perSecond;
  }, [duration, resolution]);

  const activeTask = tasks.find((task) => task.taskId === activeTaskId);
  const canAfford = !userInfo || userInfo.total_credits >= creditCost;
  const activeTaskProgress = activeTask ? getEstimatedTaskProgress(activeTask) : 0;
  const activeTaskStage = activeTask ? getTaskProgressStage(activeTask) : "";
  const activeTaskHint = activeTask ? getTaskProgressHint(activeTask) : "";

  useEffect(() => {
    if (activeTask?.status !== "pending") return;
    const intervalId = window.setInterval(() => {
      forceProgressTick((tick) => (tick + 1) % 10_000);
    }, 1500);
    return () => window.clearInterval(intervalId);
  }, [activeTask?.status, activeTask?.taskId]);

  const handleImageChange = (file: File | null) => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setLocalMessage("");
    if (file && file.size > maxReferenceImageSize) {
      setImageFile(null);
      setImagePreviewUrl("");
      setLocalMessage("Reference image must be 10MB or smaller.");
      return;
    }
    setImageFile(file);
    setImagePreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleGenerate = async () => {
    setLocalMessage("");
    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: "/stable-audio-3" });
      return;
    }
    if (!prompt.trim()) {
      setLocalMessage("Please enter a prompt before generating.");
      return;
    }
    if (mode === "image" && !imageFile) {
      setLocalMessage("Please upload a reference image for Image to Video.");
      return;
    }
    if (!canAfford) {
      setInsufficientCreditsOpen(true);
      return;
    }

    setIsSubmitting(true);
    const tempTaskId = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setActiveTaskId(tempTaskId);
    addTask(
      {
        taskId: tempTaskId,
        modelLabel: "Stable Audio 3",
        prompt: prompt.trim(),
        statusMsg: "Submitting request...",
        isLocalPending: true,
      },
      { open: false },
    );

    try {
      const result = await createStableAudioVideoTask({
        mode,
        prompt: prompt.trim(),
        duration,
        resolution: resolution.toLowerCase() as "720p" | "1080p",
        aspectRatio,
        image: imageFile || undefined,
      });

      if (!result.taskId) throw new Error("Task ID missing from generation response");

      setActiveTaskId(result.taskId);
      replaceTaskId(tempTaskId, {
        taskId: result.taskId,
        modelLabel: "Stable Audio 3",
        prompt: prompt.trim(),
        statusMsg: "Generating video...",
      });
      await refreshUserInfo();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit generation task";
      updateTask(tempTaskId, { status: "failed", statusMsg: message, isLocalPending: false });
      setLocalMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPricing = () => {
    setInsufficientCreditsOpen(false);
    const pricingSection = document.getElementById("stable-audio-pricing-plans");
    if (!pricingSection) {
      window.location.href = "/pricing";
      return;
    }
    pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "#stable-audio-pricing-plans");
  };

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="surface-card !rounded-[2rem] !p-8 bg-slate-950/60 !border-white/10 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 transition-none">
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-full border border-white/8 bg-slate-950/80 p-1">
            {(["text", "image"] as const).map((item) => (
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === item ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"
                }`}
                key={item}
                onClick={() => setMode(item)}
                type="button"
              >
                {item === "text" ? "Text to Video" : "Image to Video"}
              </button>
            ))}
          </div>

          {mode === "image" ? (
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-white">Reference Image</p>
              <label className="group mx-auto flex min-h-32 max-w-md cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/20 bg-slate-950/70 px-5 py-5 text-center text-sm text-slate-300 transition hover:border-cyan-300/50 hover:bg-cyan-300/5">
                <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-slate-900/90 text-cyan-200 transition group-hover:border-cyan-300/40 group-hover:text-cyan-100">
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="m17 8-5-5-5 5" />
                    <path d="M12 3v12" />
                  </svg>
                </span>
                <span className="mt-3 text-base font-semibold text-slate-100">
                  {imageFile ? imageFile.name : "Click to upload"}
                </span>
                <span className="mt-1 text-xs leading-5 text-slate-500">
                  Supports JPG, JPEG, PNG, WEBP. Max size 10MB.
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => handleImageChange(event.target.files?.[0] || null)}
                />
                {imagePreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" className="mt-4 max-h-32 w-full max-w-xs rounded-xl object-contain" src={imagePreviewUrl} />
                ) : null}
              </label>
            </div>
          ) : null}

          <label className="block text-sm font-semibold text-white" htmlFor="prompt">
            Prompt
          </label>
          <textarea
            className="mt-2 min-h-40 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 text-white outline-none ring-cyan-300/40 placeholder:text-slate-500 focus:ring-2"
            id="prompt"
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the subject, motion, camera movement, lighting, and atmosphere..."
            value={prompt}
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold text-white">
              Aspect ratio
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white appearance-none"
                onChange={(event) => setAspectRatio(event.target.value as AspectRatio)}
                value={aspectRatio}
              >
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-white">
              Duration
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white appearance-none"
                onChange={(event) => setDuration(Number(event.target.value))}
                value={duration}
              >
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-white">
              Resolution
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white appearance-none"
                onChange={(event) => setResolution(event.target.value as Resolution)}
                value={resolution}
              >
                <option value="720P">720P</option>
                <option value="1080P">1080P</option>
              </select>
            </label>
          </div>

          {localMessage ? <p className="mt-4 text-sm text-cyan-100">{localMessage}</p> : null}
          <button className="button-primary mt-6 w-full" disabled={isSubmitting} onClick={handleGenerate} type="button">
            {!isSignedIn
              ? "Sign In to Generate"
              : isSubmitting
                ? "Submitting..."
                : `Generate Video - ${creditCost} Credits`}
          </button>
        </div>

        <div className="surface-card !rounded-[2rem] !p-8 bg-slate-950/60 !border-white/10 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 transition-none min-h-[520px]">
          <div className="flex items-center justify-between text-sm text-slate-400 px-1">
            <span>Output Preview</span>
            <span>{aspectRatio} - {resolution}</span>
          </div>
          {activeTask?.videoUrl ? (
            <video className="mt-5 w-full rounded-[1.5rem] border border-white/10" controls playsInline src={activeTask.videoUrl} />
          ) : (
            <div className="generator-preview-placeholder relative mt-5 grid min-h-[420px] place-items-center overflow-hidden rounded-[1.5rem] border border-white/10 p-8 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.05),transparent_70%)]"></div>
              <div className="relative z-10 w-full max-w-xl">
                {activeTask?.status === "pending" ? (
                  <div className="mx-auto max-w-lg">
                    <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-cyan-300/10 ring-8 ring-cyan-300/5">
                      <div className="h-9 w-9 animate-pulse rounded-full bg-cyan-200 shadow-[0_0_32px_rgba(34,211,238,0.55)]" />
                    </div>
                    <p className="text-2xl font-semibold text-white">Generating your Stable Audio 3 video</p>
                    <div className="mt-8 flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-cyan-200">{activeTaskStage}</span>
                      <span className="font-mono text-cyan-100">{Math.round(activeTaskProgress)}%</span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full border border-cyan-300/20 bg-slate-900">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-100 transition-[width] duration-700 ease-out"
                        style={{ width: `${activeTaskProgress}%` }}
                      />
                    </div>
                    <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400">
                      {activeTask.statusMsg && !/pending/i.test(activeTask.statusMsg)
                        ? activeTask.statusMsg
                        : activeTaskHint}
                    </p>
                  </div>
                ) : (
                  <div className="w-full text-left">
                    <div className="mx-auto max-w-lg text-center">
                      <p className="text-2xl font-semibold text-white">Preview Stable Audio 3 motion styles</p>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Browse a few example clips while you prepare a prompt. The progress panel appears here only after you start a generation.
                      </p>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {previewVideos.map((video) => (
                        <article
                          className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950/72 text-left shadow-lg shadow-slate-950/30 transition hover:border-cyan-300/40"
                          key={video.src}
                        >
                          <video
                            autoPlay
                            className="aspect-video w-full object-cover opacity-80 transition group-hover:opacity-100"
                            loop
                            muted
                            playsInline
                            poster={video.poster}
                          >
                            <source src={video.src} type="video/mp4" />
                          </video>
                          <div className="p-3">
                            <p className="text-sm font-semibold text-white">{video.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{video.description}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <InsufficientCreditsModal
        creditCost={creditCost}
        currentBalance={userInfo?.total_credits ?? 0}
        onClose={() => setInsufficientCreditsOpen(false)}
        onUpgrade={handleOpenPricing}
        open={isInsufficientCreditsOpen}
      />
    </>
  );
}
