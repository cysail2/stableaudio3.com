import { getFormHeaders, handleApiError, postForm } from "./api-core";

export type StableAudioVideoMode = "text" | "image";
export type StableAudioVideoResolution = "720p" | "1080p";
export type StableAudioVideoAspectRatio = "16:9" | "9:16" | "1:1";

export type CreateStableAudioVideoTaskInput = {
  mode: StableAudioVideoMode;
  prompt: string;
  duration: number;
  resolution: StableAudioVideoResolution;
  aspectRatio: StableAudioVideoAspectRatio;
  image?: File;
  negativePrompt?: string;
};

export type StableAudioTaskStatus = {
  taskId: string;
  status: number;
  statusMsg?: string;
  videoUrl?: string;
};

const SULPHUR_VIDEO_PATHS = {
  text: "/api/stable-audio/text",
  image: "/api/stable-audio/image",
  check: "/api/stable-audio/status",
} as const;

const getStableAudioTextPreset = (input: CreateStableAudioVideoTaskInput) => {
  if (input.resolution === "1080p" && input.aspectRatio === "9:16") {
    return { resolution: "1080P", ratio: "9:16" };
  }
  if (input.resolution === "1080p") {
    return { resolution: "1080P", ratio: "16:9" };
  }
  return { resolution: "720P", ratio: input.aspectRatio };
};

const appendOptionalText = (formData: FormData, key: string, value?: string | number | boolean) => {
  if (value === undefined || value === "") return;
  formData.append(key, String(value));
};

const appendStableAudioCommonFields = (formData: FormData, input: CreateStableAudioVideoTaskInput) => {
  formData.append("prompt", input.prompt);
  formData.append("duration", String(input.duration));
  appendOptionalText(formData, "negative_prompt", input.negativePrompt);
  appendOptionalText(formData, "prompt_extend", true);
  appendOptionalText(formData, "topic_tag", 0);
};

const createStableAudioTextTask = async (input: CreateStableAudioVideoTaskInput) => {
  const { resolution, ratio } = getStableAudioTextPreset(input);
  const formData = new FormData();
  appendStableAudioCommonFields(formData, input);
  formData.append("resolution", resolution);
  formData.append("ratio", ratio);
  return postForm(SULPHUR_VIDEO_PATHS.text, formData);
};

const createStableAudioImageTask = async (input: CreateStableAudioVideoTaskInput) => {
  if (!input.image) throw new Error("Please upload a reference image");
  const formData = new FormData();
  appendStableAudioCommonFields(formData, input);
  formData.append("image", input.image);
  formData.append("resolution", input.resolution);
  return postForm(SULPHUR_VIDEO_PATHS.image, formData);
};

export const createStableAudioVideoTask = async (input: CreateStableAudioVideoTaskInput) => {
  const result = input.mode === "text" ? await createStableAudioTextTask(input) : await createStableAudioImageTask(input);
  return {
    taskId: String(result.data?.task_id || result.data?.taskId || ""),
  };
};

export const checkStableAudioVideoTaskStatus = async (taskId: string): Promise<StableAudioTaskStatus> => {
  const response = await fetch(
    `${SULPHUR_VIDEO_PATHS.check}?task_id=${encodeURIComponent(taskId)}`,
    {
      method: "GET",
      headers: getFormHeaders(),
    },
  );

  const json = await handleApiError(response);
  const data = json.data || {};
  return {
    taskId: String(data.task_id || taskId),
    status: Number(data.status ?? 0),
    statusMsg: data.status_msg,
    videoUrl: data.video_url,
  };
};
