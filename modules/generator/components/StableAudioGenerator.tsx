"use client";

import { useSearchParams } from "next/navigation";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  createStableAudioTask,
  type StableAudioMode,
  uploadStableAudioSource,
} from "@/modules/api/services/stable-audio";
import { useTaskCenter } from "@/modules/task-center/providers/TaskCenterProvider";
import {
  getEstimatedTaskProgress,
  getTaskProgressHint,
  getTaskProgressStage,
} from "@/modules/task-center/services/taskProgress";
import { useUserInfo } from "@/modules/user/providers/UserProvider";
import { generatorCreditRules } from "@/project/config/pricing";
import { InsufficientCreditsModal } from "./InsufficientCreditsModal";

const modeOptions: Array<{
  mode: StableAudioMode;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    mode: "text-to-audio",
    label: "Text-to-Audio",
    shortLabel: "Text",
    description: "Create a new audio clip from a written production prompt.",
  },
  {
    mode: "audio-to-audio",
    label: "Audio-to-Audio",
    shortLabel: "A2A",
    description: "Upload an existing audio file and remix it with new style tags.",
  },
  {
    mode: "audio-inpaint",
    label: "Audio Inpaint",
    shortLabel: "Inpaint",
    description: "Regenerate a selected region inside an existing audio file.",
  },
  {
    mode: "audio-outpaint",
    label: "Audio Extend",
    shortLabel: "Extend",
    description: "Extend audio before or after the source clip.",
  },
];

const styleExamples = [
  {
    title: "Cinematic ambient",
    tags: "cinematic, ambient, piano, warm reverb, 70 bpm",
  },
  {
    title: "Lo-fi loop",
    tags: "lofi, hiphop, mellow piano, soft drums, vinyl crackle",
  },
  {
    title: "Game SFX bed",
    tags: "sci-fi, digital, clean transient, short ui sound",
  },
] as const;

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

const isHttpUrl = (value: string) => /^https?:\/\/\S+$/i.test(value.trim());
const audioFilePattern = /\.(aac|aif|aiff|flac|m4a|mp3|ogg|opus|wav|webm)$/i;
const audioAcceptTypes = [
  "audio/aac",
  "audio/aiff",
  "audio/flac",
  "audio/m4a",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/opus",
  "audio/wav",
  "audio/webm",
  ".aac",
  ".aif",
  ".aiff",
  ".flac",
  ".m4a",
  ".mp3",
  ".ogg",
  ".opus",
  ".wav",
  ".webm",
].join(",");
const isSupportedAudioFile = (file: File) =>
  file.type.startsWith("audio/") || audioFilePattern.test(file.name);

const modeFromQuery = (value: string | null): StableAudioMode => {
  if (value === "audio-to-audio" || value === "a2a") return "audio-to-audio";
  if (value === "audio-inpaint" || value === "inpaint") return "audio-inpaint";
  if (value === "audio-outpaint" || value === "outpaint" || value === "extend") return "audio-outpaint";
  return "text-to-audio";
};

function WaveformPreview() {
  const bars = [18, 36, 24, 54, 42, 70, 48, 30, 58, 38, 76, 46, 32, 62, 40, 68, 26, 44, 52, 34, 20];
  return (
    <div className="flex h-28 items-center justify-center gap-2 rounded-[1.25rem] border border-cyan-300/15 bg-slate-950/70 px-5">
      {bars.map((height, index) => (
        <span
          className="w-1.5 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.32)]"
          key={`${height}-${index}`}
          style={{ height }}
        />
      ))}
    </div>
  );
}

export function StableAudioGenerator() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");
  const initialTags = searchParams.get("tags");
  const [mode, setMode] = useState<StableAudioMode>(modeFromQuery(searchParams.get("mode")));
  const [prompt, setPrompt] = useState(
    initialPrompt?.trim() ||
      "A jazzy chillout track with a cozy vibe about rainy evenings in a quiet cafe.",
  );
  const [audioUrl, setAudioUrl] = useState("");
  const [audioFileName, setAudioFileName] = useState("");
  const [duration, setDuration] = useState<number>(generatorCreditRules.defaultAudioDurationSeconds);
  const [tags, setTags] = useState(initialTags?.trim() || "lofi, hiphop, chill, warm, mellow");
  const [originalTags, setOriginalTags] = useState("lofi, hiphop, chill");
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(30);
  const [extendBeforeDuration, setExtendBeforeDuration] = useState<number>(0);
  const [extendAfterDuration, setExtendAfterDuration] = useState<number>(30);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState("");
  const [activeTaskId, setActiveTaskId] = useState("");
  const [isInsufficientCreditsOpen, setInsufficientCreditsOpen] = useState(false);
  const [, forceProgressTick] = useState(0);
  const { isSignedIn, userInfo, openSignIn, refreshUserInfo } = useUserInfo();
  const { addTask, replaceTaskId, updateTask, tasks } = useTaskCenter();

  const activeTask = tasks.find((task) => task.taskId === activeTaskId);
  const activeTaskProgress = activeTask ? getEstimatedTaskProgress(activeTask) : 0;
  const activeTaskStage = activeTask ? getTaskProgressStage(activeTask) : "";
  const activeTaskHint = activeTask ? getTaskProgressHint(activeTask) : "";
  const activeOutputUrl = activeTask?.outputUrl || activeTask?.videoUrl || "";

  const creditCost = useMemo(() => {
    const baseDuration =
      mode === "audio-outpaint"
        ? duration + extendBeforeDuration + extendAfterDuration
        : duration;
    return Math.max(1, Math.ceil(baseDuration * generatorCreditRules.audioCostPerSecond));
  }, [duration, extendAfterDuration, extendBeforeDuration, mode]);

  const canAfford = !userInfo || userInfo.total_credits >= creditCost;
  const selectedMode = modeOptions.find((item) => item.mode === mode) || modeOptions[0];
  const isTextMode = mode === "text-to-audio";
  const needsAudioUrl = !isTextMode;
  const needsRegion = mode === "audio-inpaint";
  const needsExtend = mode === "audio-outpaint";

  useEffect(() => {
    if (activeTask?.status !== "pending") return;
    const intervalId = window.setInterval(() => {
      forceProgressTick((tick) => (tick + 1) % 10_000);
    }, 1500);
    return () => window.clearInterval(intervalId);
  }, [activeTask?.status, activeTask?.taskId]);

  const validateInput = () => {
    if (isTextMode && !prompt.trim()) return "Please enter an audio prompt before generating.";
    if (needsAudioUrl && !isHttpUrl(audioUrl)) {
      return "Please upload a source audio file or paste a valid audio URL.";
    }
    if (!isTextMode && !tags.trim()) return "Please enter style tags for the audio edit.";
    if (needsRegion && endTime <= startTime) return "Inpaint end time must be greater than start time.";
    if (needsExtend && extendBeforeDuration + extendAfterDuration <= 0) {
      return "Add at least one second before or after the source audio.";
    }
    return "";
  };

  const buildTaskPrompt = () => {
    if (isTextMode) return prompt.trim();
    if (mode === "audio-inpaint") return `Inpaint ${startTime}s-${endTime}s with tags: ${tags.trim()}`;
    if (mode === "audio-outpaint") {
      return `Extend audio before ${extendBeforeDuration}s / after ${extendAfterDuration}s with tags: ${tags.trim()}`;
    }
    return `Remix audio with tags: ${tags.trim()}`;
  };

  const handleAudioFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setLocalMessage("");

    if (!file) return;
    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: "/stable-audio-3" });
      return;
    }
    if (!isSupportedAudioFile(file)) {
      setLocalMessage("Please upload an MP3, WAV, FLAC, M4A, AAC, OGG, OPUS, or WEBM audio file.");
      return;
    }

    setAudioFileName(file.name);
    setIsUploadingAudio(true);
    try {
      const uploaded = await uploadStableAudioSource(file);
      setAudioUrl(uploaded.audioUrl);
      setLocalMessage("Audio uploaded. Adjust the settings, then generate.");
    } catch (error) {
      setAudioFileName("");
      setAudioUrl("");
      setLocalMessage(error instanceof Error ? error.message : "Unable to upload audio");
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleGenerate = async () => {
    setLocalMessage("");
    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: "/stable-audio-3" });
      return;
    }

    const validationMessage = validateInput();
    if (validationMessage) {
      setLocalMessage(validationMessage);
      return;
    }

    if (!canAfford) {
      setInsufficientCreditsOpen(true);
      return;
    }

    setIsSubmitting(true);
    const tempTaskId = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const taskPrompt = buildTaskPrompt();
    setActiveTaskId(tempTaskId);
    addTask(
      {
        taskId: tempTaskId,
        modelLabel: "Stable Audio 3",
        prompt: taskPrompt,
        statusMsg: "Submitting request...",
        isLocalPending: true,
      },
      { open: false },
    );

    try {
      const result = await createStableAudioTask({
        mode,
        prompt: prompt.trim(),
        audioUrl: audioUrl.trim(),
        duration: clampNumber(duration, 5, generatorCreditRules.maxAudioDurationSeconds),
        tags: tags.trim(),
        originalTags: originalTags.trim(),
        startTime: clampNumber(startTime, 0, generatorCreditRules.maxAudioDurationSeconds),
        endTime: clampNumber(endTime, 0, generatorCreditRules.maxAudioDurationSeconds),
        extendBeforeDuration: clampNumber(extendBeforeDuration, 0, generatorCreditRules.maxAudioDurationSeconds),
        extendAfterDuration: clampNumber(extendAfterDuration, 0, generatorCreditRules.maxAudioDurationSeconds),
        instrumental: true,
        seed: -1,
      });

      if (!result.taskId) throw new Error("Task ID missing from generation response");

      setActiveTaskId(result.taskId);
      replaceTaskId(tempTaskId, {
        taskId: result.taskId,
        modelLabel: "Stable Audio 3",
        prompt: taskPrompt,
        statusMsg: "Generating audio...",
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
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="surface-card !rounded-[2rem] !border-white/10 bg-slate-950/60 !p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl transition-none">
          <div className="grid gap-2 rounded-[1.5rem] border border-white/8 bg-slate-950/80 p-1 sm:grid-cols-4">
            {modeOptions.map((item) => (
              <button
                className={`rounded-[1.15rem] px-3 py-3 text-sm font-semibold transition ${
                  mode === item.mode ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"
                }`}
                key={item.mode}
                onClick={() => {
                  setMode(item.mode);
                  setLocalMessage("");
                }}
                type="button"
              >
                <span className="block sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:block">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-cyan-300/10 bg-cyan-300/5 p-4">
            <p className="text-sm font-semibold text-cyan-100">{selectedMode.label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">{selectedMode.description}</p>
          </div>

          {isTextMode ? (
            <label className="mt-5 block text-sm font-semibold text-white" htmlFor="prompt">
              Prompt
              <textarea
                className="mt-2 min-h-40 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 text-white outline-none ring-cyan-300/40 placeholder:text-slate-500 focus:ring-2"
                id="prompt"
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe genre, instruments, mood, tempo, and production style..."
                value={prompt}
              />
            </label>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="block text-sm font-semibold text-white">
                Source audio
                <label
                  className="mt-2 flex cursor-pointer flex-col gap-3 rounded-[1.25rem] border border-dashed border-cyan-300/30 bg-cyan-300/5 p-4 text-sm transition hover:border-cyan-200/70 hover:bg-cyan-300/10"
                  htmlFor="source-audio-file"
                >
                  <span className="font-semibold text-cyan-100">
                    {isUploadingAudio ? "Uploading audio..." : "Upload MP3, WAV, FLAC, M4A, AAC, OGG, OPUS, or WEBM"}
                  </span>
                  <span className="text-xs leading-5 text-slate-400">
                    {audioFileName
                      ? `Selected: ${audioFileName}`
                      : "Choose an audio file you have rights to use. The uploaded URL is used for remix, inpaint, or extend tasks."}
                  </span>
                  <input
                    accept={audioAcceptTypes}
                    className="sr-only"
                    disabled={isUploadingAudio}
                    id="source-audio-file"
                    onChange={handleAudioFileChange}
                    type="file"
                  />
                </label>
                {audioUrl ? (
                  <p className="mt-2 truncate rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-normal text-slate-400">
                    Source ready: <span className="text-cyan-100">{audioUrl}</span>
                  </p>
                ) : null}
                <label className="mt-3 block text-xs font-semibold text-slate-300" htmlFor="audio-url">
                  Or paste an audio URL
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white outline-none ring-cyan-300/40 placeholder:text-slate-500 focus:ring-2"
                  id="audio-url"
                  onChange={(event) => {
                    setAudioUrl(event.target.value);
                    setAudioFileName("");
                  }}
                  placeholder="https://example.com/source-audio.mp3"
                  type="url"
                  value={audioUrl}
                />
              </div>

              <label className="block text-sm font-semibold text-white" htmlFor="style-tags">
                Style tags
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white outline-none ring-cyan-300/40 placeholder:text-slate-500 focus:ring-2"
                  id="style-tags"
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="lofi, hiphop, chill, warm"
                  value={tags}
                />
              </label>

              {mode === "audio-to-audio" ? (
                <label className="block text-sm font-semibold text-white" htmlFor="original-tags">
                  Original tags
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white outline-none ring-cyan-300/40 placeholder:text-slate-500 focus:ring-2"
                    id="original-tags"
                    onChange={(event) => setOriginalTags(event.target.value)}
                    placeholder="lofi, hiphop, chill"
                    value={originalTags}
                  />
                </label>
              ) : null}
            </div>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold text-white">
              {isTextMode ? "Duration" : "Source duration"}
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white outline-none ring-cyan-300/40 focus:ring-2"
                max={generatorCreditRules.maxAudioDurationSeconds}
                min={5}
                onChange={(event) => setDuration(clampNumber(Number(event.target.value), 5, generatorCreditRules.maxAudioDurationSeconds))}
                type="number"
                value={duration}
              />
            </label>
            {needsRegion ? (
              <>
                <label className="text-sm font-semibold text-white">
                  Start time
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white outline-none ring-cyan-300/40 focus:ring-2"
                    max={240}
                    min={0}
                    onChange={(event) => setStartTime(clampNumber(Number(event.target.value), 0, 240))}
                    type="number"
                    value={startTime}
                  />
                </label>
                <label className="text-sm font-semibold text-white">
                  End time
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white outline-none ring-cyan-300/40 focus:ring-2"
                    max={240}
                    min={0}
                    onChange={(event) => setEndTime(clampNumber(Number(event.target.value), 0, 240))}
                    type="number"
                    value={endTime}
                  />
                </label>
              </>
            ) : needsExtend ? (
              <>
                <label className="text-sm font-semibold text-white">
                  Extend before
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white outline-none ring-cyan-300/40 focus:ring-2"
                    max={240}
                    min={0}
                    onChange={(event) => setExtendBeforeDuration(clampNumber(Number(event.target.value), 0, 240))}
                    type="number"
                    value={extendBeforeDuration}
                  />
                </label>
                <label className="text-sm font-semibold text-white">
                  Extend after
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-white outline-none ring-cyan-300/40 focus:ring-2"
                    max={240}
                    min={0}
                    onChange={(event) => setExtendAfterDuration(clampNumber(Number(event.target.value), 0, 240))}
                    type="number"
                    value={extendAfterDuration}
                  />
                </label>
              </>
            ) : (
              <div className="sm:col-span-2 rounded-xl border border-white/10 bg-slate-950/55 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Credits</p>
                <p className="mt-1 text-sm text-slate-400">Audio generation uses 1 credit per second.</p>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {styleExamples.map((item) => (
              <button
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-left transition hover:border-cyan-300/50"
                key={item.title}
                onClick={() => {
                  if (isTextMode) {
                    setPrompt(`${item.title}: ${item.tags}, 40 seconds.`);
                  } else {
                    setTags(item.tags);
                  }
                }}
                type="button"
              >
                <span className="block text-sm font-semibold text-white">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{item.tags}</span>
              </button>
            ))}
          </div>

          {localMessage ? <p className="mt-4 text-sm text-cyan-100">{localMessage}</p> : null}
          <button
            className="button-primary mt-6 w-full"
            disabled={isSubmitting || isUploadingAudio}
            onClick={handleGenerate}
            type="button"
          >
            {!isSignedIn
              ? "Sign In to Generate"
              : isUploadingAudio
                ? "Uploading Audio..."
                : isSubmitting
                ? "Submitting..."
                : `Generate Audio - ${creditCost} Credits`}
          </button>
        </div>

        <div className="surface-card min-h-[520px] !rounded-[2rem] !border-white/10 bg-slate-950/60 !p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl transition-none">
          <div className="flex items-center justify-between gap-4 px-1 text-sm text-slate-400">
            <span>Output Preview</span>
            <span>{creditCost} credits</span>
          </div>

          {activeOutputUrl ? (
            <div className="mt-5 rounded-[1.5rem] border border-cyan-300/15 bg-slate-950/70 p-5">
              <WaveformPreview />
              <audio className="mt-5 w-full" controls src={activeOutputUrl} />
              <a
                className="button-secondary mt-5 w-full"
                href={activeOutputUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open Output
              </a>
            </div>
          ) : (
            <div className="generator-preview-placeholder relative mt-5 grid min-h-[420px] place-items-center overflow-hidden rounded-[1.5rem] border border-white/10 p-8 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.05),transparent_70%)]" />
              <div className="relative z-10 w-full max-w-xl">
                {activeTask?.status === "pending" ? (
                  <div className="mx-auto max-w-lg">
                    <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-cyan-300/10 ring-8 ring-cyan-300/5">
                      <div className="h-9 w-9 animate-pulse rounded-full bg-cyan-200 shadow-[0_0_32px_rgba(34,211,238,0.55)]" />
                    </div>
                    <p className="text-2xl font-semibold text-white">Generating your Stable Audio 3 audio</p>
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
                      <p className="text-2xl font-semibold text-white">Preview the audio workflow</p>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Start with a prompt or uploaded source audio. The progress panel appears here after
                        you submit a generation task.
                      </p>
                    </div>
                    <div className="mt-6">
                      <WaveformPreview />
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {modeOptions.map((item) => (
                        <article
                          className="rounded-2xl border border-white/10 bg-slate-950/72 p-4 text-left shadow-lg shadow-slate-950/30"
                          key={item.mode}
                        >
                          <p className="text-sm font-semibold text-white">{item.label}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
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
