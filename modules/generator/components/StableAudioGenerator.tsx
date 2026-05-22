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
  // Audio Outpaint / Extend removed from UI — Stable Audio 3 doesn't support this mode.
  // (The temporary ace-step upstream supports it, but we're positioned as SA3 so we
  // hide the option to keep the public surface honest. Server route still exists but
  // is no longer reachable from the form.)
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
  return "text-to-audio";
};

function WaveformPreview() {
  const bars = [18, 36, 24, 54, 42, 70, 48, 30, 58, 38, 76, 46, 32, 62, 40, 68, 26, 44, 52, 34, 20];
  return (
    // w-full max-w-full overflow-hidden so the bar row never pushes its grid/flex
    // parent past the viewport on mobile. Rightmost bars get visually clipped if
    // the card is narrower than the 21-bar intrinsic width.
    <div className="flex h-28 w-full max-w-full items-center justify-center gap-1.5 overflow-hidden rounded-[1.25rem] border border-violet-300/15 bg-white/70 px-3 sm:gap-2 sm:px-5">
      {bars.map((height, index) => (
        <span
          className="w-1.5 flex-shrink-0 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(124,58,237,0.32)]"
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
  // Raw input string — lets the user type freely (e.g. delete "5" before typing "30")
  // without the number-clamp snapping the value back. Synced to `duration` on blur.
  const [durationInput, setDurationInput] = useState<string>(
    String(generatorCreditRules.defaultAudioDurationSeconds),
  );
  const [tags, setTags] = useState(initialTags?.trim() || "lofi, hiphop, chill, warm, mellow");
  const [originalTags, setOriginalTags] = useState("lofi, hiphop, chill");
  const [editNote, setEditNote] = useState("");
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(30);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState("");
  // activeTaskId = the task the user just submitted (used for polling progress).
  // selectedTaskId = the task currently displayed in the detail view. Defaults
  // to the newest task; user can click any task in the list to switch.
  const [activeTaskId, setActiveTaskId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [isInsufficientCreditsOpen, setInsufficientCreditsOpen] = useState(false);
  const [, forceProgressTick] = useState(0);
  const { isSignedIn, userInfo, openSignIn, refreshUserInfo } = useUserInfo();
  const { addTask, replaceTaskId, updateTask, tasks } = useTaskCenter();

  // Sort tasks newest first for both the chip list and the auto-select default
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [tasks],
  );

  // The currently-running task (pending) — different from selectedTask. Used to
  // drive the progress polling tick even when the user is viewing a different task.
  const activeTask = tasks.find((task) => task.taskId === activeTaskId);

  const isTextMode = mode === "text-to-audio";
  const needsAudioUrl = !isTextMode;
  const needsRegion = mode === "audio-inpaint";
  const minDurationSeconds = isTextMode ? 5 : 1;
  const normalizedDuration = clampNumber(
    duration,
    minDurationSeconds,
    generatorCreditRules.maxAudioDurationSeconds,
  );

  const resolvedSelectedTaskId =
    selectedTaskId && sortedTasks.some((task) => task.taskId === selectedTaskId)
      ? selectedTaskId
      : activeTaskId && sortedTasks.some((task) => task.taskId === activeTaskId)
        ? activeTaskId
        : sortedTasks[0]?.taskId || "";
  const selectedTask = sortedTasks.find((task) => task.taskId === resolvedSelectedTaskId);
  const selectedTaskProgress = selectedTask ? getEstimatedTaskProgress(selectedTask) : 0;
  const selectedTaskStage = selectedTask ? getTaskProgressStage(selectedTask) : "";
  const selectedTaskHint = selectedTask ? getTaskProgressHint(selectedTask) : "";
  const selectedOutputUrl = selectedTask?.outputUrl || selectedTask?.videoUrl || "";

  const creditCost = useMemo(() => {
    return Math.max(1, Math.ceil(normalizedDuration * generatorCreditRules.audioCostPerSecond));
  }, [normalizedDuration]);

  const canAfford = !userInfo || userInfo.total_credits >= creditCost;

  useEffect(() => {
    if (activeTask?.status !== "pending") return;
    const intervalId = window.setInterval(() => {
      forceProgressTick((tick) => (tick + 1) % 10_000);
    }, 1500);
    return () => window.clearInterval(intervalId);
  }, [activeTask?.status, activeTask?.taskId]);

  // Sync form state when URL params change (e.g. a "Try this prompt" button
  // on the same page navigates with ?prompt=...&mode=...). Cross-page jumps
  // already hit the initial useState via initialPrompt/initialTags above; this
  // effect covers the same-page navigation case.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const urlPrompt = searchParams.get("prompt");
      const urlMode = searchParams.get("mode");
      const urlTags = searchParams.get("tags");
      if (urlMode) {
        setMode(modeFromQuery(urlMode));
      }
      if (urlPrompt && urlPrompt.trim()) {
        const nextMode = urlMode ? modeFromQuery(urlMode) : mode;
        if (nextMode === "text-to-audio") {
          setPrompt(urlPrompt.trim());
        } else {
          setEditNote(urlPrompt.trim());
        }
      }
      if (urlTags && urlTags.trim()) {
        setTags(urlTags.trim());
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
    // Intentionally only depend on searchParams — we want this to fire when
    // the URL changes, not when the user edits the form locally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const validateInput = () => {
    // Text-to-Audio: needs prompt (free-form)
    if (isTextMode) {
      if (!prompt.trim()) return "Please enter an audio prompt before generating.";
      return "";
    }
    // A2A / Inpaint: ace-step requires keyword-style `tags`; A2A also requires `original_tags`.
    // The natural-language note is optional and is sent as `prompt` for the future SA3 backend.
    if (needsAudioUrl && !isHttpUrl(audioUrl)) {
      return "Please upload a source audio file or paste a valid audio URL.";
    }
    if (!tags.trim()) return "Please enter style tags (e.g. lofi, hiphop, chill, warm).";
    if (mode === "audio-to-audio" && !originalTags.trim()) {
      return "Please enter the original tags that describe the source clip's style.";
    }
    if (needsRegion && endTime <= startTime) return "Inpaint end time must be greater than start time.";
    if (needsRegion && endTime > normalizedDuration) {
      return "Inpaint end time must be within the source duration.";
    }
    return "";
  };

  const buildTaskPrompt = () => {
    // Human-readable task title in the task list.
    if (isTextMode) return prompt.trim();
    const desc = editNote.trim() || tags.trim();
    if (mode === "audio-inpaint") return `[Inpaint ${startTime}s–${endTime}s] ${desc}`;
    return `[A2A] ${desc}`;
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
        prompt: isTextMode ? prompt.trim() : editNote.trim(),
        audioUrl: audioUrl.trim(),
        duration: normalizedDuration,
        tags: tags.trim(),
        originalTags: originalTags.trim(),
        startTime: clampNumber(startTime, 0, normalizedDuration),
        endTime: clampNumber(endTime, 0, normalizedDuration),
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
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="surface-card !rounded-[1.5rem] !border-slate-200 bg-white/60 !p-4 shadow-xl shadow-violet-500/5 backdrop-blur-xl transition-none sm:!rounded-[2rem] sm:!p-8">
          {/* Mode tabs — keep 3 modes in one row even on mobile (smaller text), no longer
              short-label fallback since we only have 3 modes after dropping outpaint. */}
          <div className="grid grid-cols-3 gap-1 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-1">
            {modeOptions.map((item) => (
              <button
                className={`rounded-[1.15rem] px-2 py-2.5 text-[11px] font-semibold leading-tight transition whitespace-nowrap sm:text-[13px] ${
                  mode === item.mode
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                }`}
                key={item.mode}
                onClick={() => {
                  setMode(item.mode);
                  setLocalMessage("");
                }}
                title={item.description}
                type="button"
              >
                <span className="block sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:block">{item.label}</span>
              </button>
            ))}
          </div>

          {isTextMode ? (
            <label className="mt-5 block text-sm font-semibold text-slate-900" htmlFor="prompt">
              Prompt
              <textarea
                className="mt-2 min-h-40 w-full rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 text-slate-900 outline-none ring-violet-300/40 placeholder:text-slate-500 focus:ring-2"
                id="prompt"
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe genre, instruments, mood, tempo, and production style..."
                value={prompt}
              />
            </label>
          ) : (
            <div className="mt-5 space-y-4">
              {/* Source audio upload — shared by A2A + Inpaint */}
              <div className="block text-sm font-semibold text-slate-900">
                Source audio
                <label
                  className="mt-2 flex cursor-pointer flex-col gap-3 rounded-[1.25rem] border border-dashed border-violet-300/30 bg-violet-50/40 p-4 text-sm transition hover:border-violet-300 hover:bg-violet-50"
                  htmlFor="source-audio-file"
                >
                  <span className="font-semibold text-violet-700">
                    {isUploadingAudio ? "Uploading audio..." : "Upload MP3, WAV, FLAC, M4A, AAC, OGG, OPUS, or WEBM"}
                  </span>
                  <span className="text-xs leading-5 text-slate-600">
                    {audioFileName
                      ? `Selected: ${audioFileName}`
                      : "Choose an audio file you have rights to use. The uploaded URL is used for remix or inpaint tasks."}
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
                  <p className="mt-2 truncate rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs font-normal text-slate-600">
                    Source ready: <span className="text-violet-700">{audioUrl}</span>
                  </p>
                ) : null}
                <label className="mt-3 block text-xs font-semibold text-slate-700" htmlFor="audio-url">
                  Or paste an audio URL
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-slate-900 outline-none ring-violet-300/40 placeholder:text-slate-500 focus:ring-2"
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

              <label className="block text-sm font-semibold text-slate-900" htmlFor="style-tags">
                Style tags <span className="font-normal text-xs text-slate-500">— required, comma-separated</span>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-slate-900 outline-none ring-violet-300/40 placeholder:text-slate-500 focus:ring-2"
                  id="style-tags"
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="lofi, hiphop, chill, warm"
                  value={tags}
                />
              </label>

              {mode === "audio-to-audio" ? (
                <label className="block text-sm font-semibold text-slate-900" htmlFor="original-tags">
                  Original tags <span className="font-normal text-xs text-slate-500">— required for source style</span>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-slate-900 outline-none ring-violet-300/40 placeholder:text-slate-500 focus:ring-2"
                    id="original-tags"
                    onChange={(event) => setOriginalTags(event.target.value)}
                    placeholder="lofi, hiphop, drum and bass, trap, chill"
                    value={originalTags}
                  />
                </label>
              ) : null}

              <label className="block text-sm font-semibold text-slate-900" htmlFor="edit-note">
                {mode === "audio-inpaint" ? "Inpaint note" : "Transformation note"}{" "}
                <span className="font-normal text-xs text-slate-500">— optional</span>
                <textarea
                  className="mt-2 min-h-24 w-full rounded-[1.25rem] border border-slate-200 bg-white/80 p-4 text-slate-900 outline-none ring-violet-300/40 placeholder:text-slate-500 focus:ring-2"
                  id="edit-note"
                  onChange={(event) => setEditNote(event.target.value)}
                  placeholder={
                    mode === "audio-inpaint"
                      ? "Regenerate the selected region as a smooth piano transition that bridges into the next phrase."
                      : "Transform this clip into a lo-fi hip hop version while preserving the original timing."
                  }
                  value={editNote}
                />
              </label>
            </div>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold text-slate-900">
              {isTextMode ? "Duration" : "Source duration"}
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-slate-900 outline-none ring-violet-300/40 focus:ring-2"
                max={generatorCreditRules.maxAudioDurationSeconds}
                min={minDurationSeconds}
                onBlur={() => {
                  // Text generation keeps the backend's 5s minimum; source-audio modes can use shorter clips.
                  const num = Number(durationInput);
                  const fallback = isTextMode ? generatorCreditRules.defaultAudioDurationSeconds : minDurationSeconds;
                  const safe = Number.isFinite(num) && num > 0 ? num : fallback;
                  const clamped = clampNumber(safe, minDurationSeconds, generatorCreditRules.maxAudioDurationSeconds);
                  setDuration(clamped);
                  setDurationInput(String(clamped));
                }}
                onChange={(event) => {
                  // Free typing — no clamp here. Sync `duration` only when input is a valid number,
                  // so credit cost / submission stays in sync as the user edits.
                  const raw = event.target.value;
                  setDurationInput(raw);
                  const num = Number(raw);
                  if (Number.isFinite(num) && num >= 0) {
                    setDuration(num);
                  }
                }}
                type="number"
                value={durationInput}
              />
            </label>
            {needsRegion ? (
              <>
                <label className="text-sm font-semibold text-slate-900">
                  Start time
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-slate-900 outline-none ring-violet-300/40 focus:ring-2"
                    max={normalizedDuration}
                    min={0}
                    onBlur={(event) => {
                      const num = Number(event.target.value);
                      setStartTime(clampNumber(Number.isFinite(num) ? num : 0, 0, normalizedDuration));
                    }}
                    onChange={(event) => {
                      // Allow free typing, no clamp here — clamp on blur.
                      const num = Number(event.target.value);
                      if (event.target.value === "" || Number.isFinite(num)) {
                        setStartTime(Number.isFinite(num) ? num : 0);
                      }
                    }}
                    type="number"
                    value={startTime}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-900">
                  End time
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-slate-900 outline-none ring-violet-300/40 focus:ring-2"
                    max={normalizedDuration}
                    min={0}
                    onBlur={(event) => {
                      const num = Number(event.target.value);
                      setEndTime(clampNumber(Number.isFinite(num) ? num : normalizedDuration, 0, normalizedDuration));
                    }}
                    onChange={(event) => {
                      const num = Number(event.target.value);
                      if (event.target.value === "" || Number.isFinite(num)) {
                        setEndTime(Number.isFinite(num) ? num : 0);
                      }
                    }}
                    type="number"
                    value={endTime}
                  />
                </label>
              </>
            ) : (
              <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white/55 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">Credits</p>
                <p className="mt-1 text-sm text-slate-600">Audio generation uses 1 credit per second.</p>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {styleExamples.map((item) => (
              <button
                className="rounded-2xl border border-slate-200 bg-white/60 p-3 text-left transition hover:border-violet-400"
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
                <span className="block text-sm font-semibold text-slate-900">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{item.tags}</span>
              </button>
            ))}
          </div>

          {localMessage ? <p className="mt-4 text-sm text-violet-700">{localMessage}</p> : null}
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

        <div className="surface-card flex min-h-[420px] flex-col !rounded-[1.5rem] !border-slate-200 bg-white !p-4 shadow-md shadow-violet-500/5 transition-none sm:min-h-[520px] sm:!rounded-[2rem] sm:!p-8">
          <div className="flex items-center justify-between gap-4 px-1 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Output Preview</span>
            <span className="font-mono text-xs">{creditCost} credits</span>
          </div>

          {/* Detail view of the currently SELECTED task (not necessarily the just-submitted one) */}
          <div className="flex-1">
          {selectedOutputUrl ? (
            /* DONE — playable result with download + share toolbar */
            <div className="mt-5 rounded-[1.5rem] border border-violet-200 bg-violet-50/40 p-5">
              <WaveformPreview />
              <audio className="mt-5 w-full" controls src={selectedOutputUrl} />

              {/* Action toolbar — Download + 3 share buttons (Twitter / Facebook / WhatsApp) */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <a
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                  download
                  href={selectedOutputUrl}
                  rel="noreferrer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download
                </a>

                <a
                  aria-label="Share to Twitter"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Generated with Stable Audio 3 — " + selectedOutputUrl)}`}
                  rel="noreferrer noopener"
                  target="_blank"
                  title="Share to Twitter"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                <a
                  aria-label="Share to Facebook"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedOutputUrl)}`}
                  rel="noreferrer noopener"
                  target="_blank"
                  title="Share to Facebook"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                <a
                  aria-label="Share to WhatsApp"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
                  href={`https://wa.me/?text=${encodeURIComponent("Generated with Stable Audio 3 — " + selectedOutputUrl)}`}
                  rel="noreferrer noopener"
                  target="_blank"
                  title="Share to WhatsApp"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>
          ) : selectedTask?.status === "pending" ? (
            /* PENDING — generation in progress */
            <div className="generator-preview-placeholder relative mt-5 grid min-h-[360px] min-w-0 place-items-center overflow-hidden rounded-[1.5rem] border border-slate-200 p-4 text-center sm:min-h-[420px] sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_70%)]" />
              <div className="relative z-10 mx-auto max-w-lg">
                <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-violet-100 ring-8 ring-violet-50">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-violet-500 shadow-[0_0_32px_rgba(124,58,237,0.55)]" />
                </div>
                <p className="text-2xl font-semibold text-slate-900">Generating your audio</p>
                <div className="mt-8 flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-violet-700">{selectedTaskStage}</span>
                  <span className="font-mono text-violet-700">{Math.round(selectedTaskProgress)}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-400 transition-[width] duration-700 ease-out"
                    style={{ width: `${selectedTaskProgress}%` }}
                  />
                </div>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600">
                  {selectedTask.statusMsg && !/pending/i.test(selectedTask.statusMsg)
                    ? selectedTask.statusMsg
                    : selectedTaskHint}
                </p>
              </div>
            </div>
          ) : (
            /* DEFAULT EMPTY — minimal hint, no redundant mode cards */
            <div className="generator-preview-placeholder relative mt-5 grid min-h-[360px] min-w-0 place-items-center overflow-hidden rounded-[1.5rem] border border-slate-200 p-4 text-center sm:min-h-[420px] sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_70%)]" />
              <div className="relative z-10 mx-auto max-w-md">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-violet-50 ring-1 ring-violet-200">
                  <svg className="h-7 w-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-slate-900">Your audio appears here</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Submit a generation task to preview the waveform, play, download, or share the result.
                </p>
                <div className="mt-7">
                  <WaveformPreview />
                </div>
              </div>
            </div>
          )}
          </div>

          {/* === Task list — scrollable chips, switch between concurrent / past tasks === */}
          {sortedTasks.length > 0 ? (
            <div className="mt-5 border-t border-slate-200 pt-4">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Tasks ({sortedTasks.length})
                </span>
                {sortedTasks.some((t) => t.status === "pending") ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-violet-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                    {sortedTasks.filter((t) => t.status === "pending").length} running
                  </span>
                ) : null}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {sortedTasks.map((task) => {
                  const isSelected = task.taskId === resolvedSelectedTaskId;
                  const isPending = task.status === "pending";
                  const isFailed = task.status === "failed";
                  const chipProgress = isPending ? getEstimatedTaskProgress(task) : task.outputUrl ? 100 : 0;
                  return (
                    <button
                      className={`group flex-shrink-0 w-28 sm:w-32 rounded-xl border p-2.5 text-left transition ${
                        isSelected
                          ? "border-violet-500 bg-violet-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      key={task.taskId}
                      onClick={() => setSelectedTaskId(task.taskId)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            isPending
                              ? "bg-violet-100 text-violet-700"
                              : isFailed
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isPending ? <span className="h-1 w-1 rounded-full bg-violet-500 animate-pulse" /> : null}
                          {isPending ? "Running" : isFailed ? "Failed" : "Done"}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {new Date(task.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-tight text-slate-700">
                        {task.prompt || "(no prompt)"}
                      </p>
                      {isPending ? (
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-violet-500 transition-[width] duration-700"
                            style={{ width: `${chipProgress}%` }}
                          />
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
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
