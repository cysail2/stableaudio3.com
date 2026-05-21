import { siteConfig } from "@/project/config/site";

export type RawWorkItem = {
  id: number;
  task_id?: string;
  user_id?: number;
  prompt?: string;
  model?: string;
  origin_image?: string;
  generate_image?: string;
  quality_image?: string;
  size_image?: string;
  other_image?: string;
  status?: number;
  status_msg?: string;
  generation_time?: number;
  created_at?: number;
  updated_at?: number;
  deleted_at?: number;
};

export type WorkStatus = "success" | "pending" | "failed" | "deleted";

export type WorkItem = {
  id: number;
  taskId: string;
  status: WorkStatus;
  statusCode: number;
  statusMsg?: string;
  prompt: string;
  model: string;
  modelLabel: string;
  mediaUrl: string;
  posterUrl: string;
  originUrls: string[];
  isVideo: boolean;
  width?: number;
  height?: number;
  durationSeconds?: number;
  createdAt: number;
  updatedAt?: number;
  raw: RawWorkItem;
};

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|mkv)(\?|#|$)/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i;
export function getModelLabel(model?: string): string {
  void model;
  return siteConfig.name;
}

function parseDimensions(value?: string): { width?: number; height?: number } {
  if (!value) return {};
  const match = value.match(/(\d{2,5})\s*[x×*]\s*(\d{2,5})/);
  if (!match) return {};
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return {};
  return { width, height };
}

function parseOriginUrls(value?: string): string[] {
  if (!value) return [];
  return value
    .split("|")
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && /^(https?:|\/)/i.test(url));
}

function deriveStatus(item: RawWorkItem): { status: WorkStatus; statusCode: number } {
  const code = item.status ?? 1;
  if (item.deleted_at && item.deleted_at > 0) return { status: "deleted", statusCode: code };
  if (code === 0) return { status: "pending", statusCode: code };
  if (code === -1) return { status: "failed", statusCode: code };
  return { status: "success", statusCode: code };
}

export function normalizeWorkItem(raw: RawWorkItem | null | undefined): WorkItem | null {
  if (!raw) return null;
  const mediaUrl = raw.quality_image || raw.generate_image || "";
  const originUrls = parseOriginUrls(raw.origin_image);
  const { width, height } = parseDimensions(raw.size_image);

  const isVideo = VIDEO_EXT.test(mediaUrl) || (mediaUrl.length > 0 && !IMAGE_EXT.test(mediaUrl));
  const posterUrl = isVideo ? originUrls[0] || "" : mediaUrl;
  const { status, statusCode } = deriveStatus(raw);

  return {
    id: raw.id,
    taskId: raw.task_id || `local-${raw.id}`,
    status,
    statusCode,
    statusMsg: raw.status_msg,
    prompt: raw.prompt || "",
    model: raw.model || "",
    modelLabel: getModelLabel(raw.model),
    mediaUrl,
    posterUrl,
    originUrls,
    isVideo,
    width,
    height,
    durationSeconds: raw.generation_time,
    createdAt: raw.created_at ?? 0,
    updatedAt: raw.updated_at,
    raw,
  };
}

export function formatWorkDate(seconds: number | undefined, withTime = false): string {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function buildDownloadFilename(item: WorkItem): string {
  const safePrompt = (item.prompt || item.modelLabel)
    .slice(0, 40)
    .replace(/[^\w-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const ext = item.isVideo ? "mp4" : "png";
  const shortId = item.taskId.replace(/-/g, "").slice(0, 8) || String(item.id);
  return `${safePrompt || "stableaudio3"}-${shortId}.${ext}`;
}
