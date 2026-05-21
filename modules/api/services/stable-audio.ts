import { getHeaders, handleApiError } from "./api-core";
import { uploadApi } from "./upload";

export type StableAudioMode = "text-to-audio" | "audio-to-audio" | "audio-inpaint" | "audio-outpaint";
export type StableAudioEditMode = "remix" | "lyrics";

export type CreateStableAudioTaskInput = {
  mode: StableAudioMode;
  prompt?: string;
  audioUrl?: string;
  duration: number;
  tags?: string;
  originalTags?: string;
  editMode?: StableAudioEditMode;
  startTime?: number;
  endTime?: number;
  extendBeforeDuration?: number;
  extendAfterDuration?: number;
  seed?: number;
  instrumental?: boolean;
};

export type StableAudioTaskStatus = {
  taskId: string;
  status: number;
  statusMsg?: string;
  outputUrl?: string;
  opusId?: number;
};

export type StableAudioUploadResult = {
  audioUrl: string;
  hkAudioUrl?: string;
};

const STABLE_AUDIO_PATHS = {
  textToAudio: "/api/stable-audio/text",
  audioToAudio: "/api/stable-audio/audio-to-audio",
  audioInpaint: "/api/stable-audio/audio-inpaint",
  audioOutpaint: "/api/stable-audio/audio-outpaint",
  check: "/api/stable-audio/status",
} as const;

const postJson = async (url: string, body: unknown) => {
  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleApiError(response);
};

const cleanText = (value?: string) => value?.trim() || "";
const cleanNumber = (value: number | undefined, fallback: number) =>
  Number.isFinite(value) ? Number(value) : fallback;
const pickUploadUrl = (value: unknown, keys: string[]) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return "";
};

const createTextToAudioTask = (input: CreateStableAudioTaskInput) =>
  postJson(STABLE_AUDIO_PATHS.textToAudio, {
    duration: cleanNumber(input.duration, 40),
    instrumental: input.instrumental ?? true,
    prompt: cleanText(input.prompt),
    seed: input.seed ?? -1,
  });

const createAudioToAudioTask = (input: CreateStableAudioTaskInput) =>
  postJson(STABLE_AUDIO_PATHS.audioToAudio, {
    audio_url: cleanText(input.audioUrl),
    edit_mode: input.editMode || "remix",
    lyrics: "",
    original_lyrics: "",
    original_tags: cleanText(input.originalTags) || cleanText(input.tags),
    seed: input.seed ?? -1,
    tags: cleanText(input.tags),
    duration: cleanNumber(input.duration, 60),
  });

const createAudioInpaintTask = (input: CreateStableAudioTaskInput) =>
  postJson(STABLE_AUDIO_PATHS.audioInpaint, {
    audio_url: cleanText(input.audioUrl),
    end_time: cleanNumber(input.endTime, 30),
    end_time_relative_to: "start",
    lyrics: "",
    seed: input.seed ?? -1,
    start_time: cleanNumber(input.startTime, 0),
    start_time_relative_to: "start",
    tags: cleanText(input.tags),
    duration: cleanNumber(input.duration, 60),
  });

const createAudioOutpaintTask = (input: CreateStableAudioTaskInput) =>
  postJson(STABLE_AUDIO_PATHS.audioOutpaint, {
    audio_url: cleanText(input.audioUrl),
    extend_after_duration: cleanNumber(input.extendAfterDuration, 30),
    extend_before_duration: cleanNumber(input.extendBeforeDuration, 0),
    lyrics: "",
    seed: input.seed ?? -1,
    tags: cleanText(input.tags),
    duration: cleanNumber(input.duration, 60),
  });

export const createStableAudioTask = async (input: CreateStableAudioTaskInput) => {
  const result =
    input.mode === "text-to-audio"
      ? await createTextToAudioTask(input)
      : input.mode === "audio-to-audio"
        ? await createAudioToAudioTask(input)
        : input.mode === "audio-inpaint"
          ? await createAudioInpaintTask(input)
          : await createAudioOutpaintTask(input);

  return {
    taskId: String(result.data?.task_id || result.data?.taskId || ""),
  };
};

export const uploadStableAudioSource = async (file: File): Promise<StableAudioUploadResult> => {
  const result = await uploadApi.upload(file);
  const data = result.data ?? result;
  const audioUrl =
    typeof data === "string" && data.trim()
      ? data.trim()
      : pickUploadUrl(data, ["audio_url", "hk_audio_url", "url", "file_url", "cdn_url", "r3_url"]);
  const hkAudioUrl = pickUploadUrl(data, ["hk_audio_url", "hk_file_url", "hk_url"]);

  if (!audioUrl) throw new Error("Upload succeeded but no audio URL was returned.");
  return { audioUrl, hkAudioUrl: hkAudioUrl || undefined };
};

export const checkStableAudioTaskStatus = async (taskId: string): Promise<StableAudioTaskStatus> => {
  const response = await fetch(
    `${STABLE_AUDIO_PATHS.check}?task_id=${encodeURIComponent(taskId)}`,
    {
      method: "GET",
      headers: getHeaders(),
    },
  );

  const json = await handleApiError(response);
  const data = json.data || {};
  return {
    taskId: String(data.task_id || taskId),
    status: Number(data.status ?? 0),
    statusMsg: data.status_msg,
    outputUrl: data.audio_url || data.video_url || data.output_url || data.url,
    opusId: data.opus_id,
  };
};

export const createStableAudioVideoTask = createStableAudioTask;
export const checkStableAudioVideoTaskStatus = checkStableAudioTaskStatus;
