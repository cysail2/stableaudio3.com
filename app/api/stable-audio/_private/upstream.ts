import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/project/config/site";

const UPSTREAM_BASE =
  process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || siteConfig.apiServiceUrl;
const APP_ID =
  process.env.APP_ID || process.env.NEXT_PUBLIC_APP_ID || siteConfig.appIdentifier;

export const upstreamPaths = {
  text: "/api/task/aliyun/wan2.7/text2video",
  image: "/api/task/aliyun/wan2.7/image2video",
  check: "/api/task/aliyun/wan2.7/check_task",
  uploadImage: "/api/common/upload/aliyun_image_and_hk",
} as const;

type UploadedAsset = {
  url: string;
  hkUrl: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const pickFirstString = (value: unknown, keys: string[]) => {
  if (!isRecord(value)) return undefined;
  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return undefined;
};

const proxyHeaders = (request: NextRequest) => {
  const headers = new Headers();
  headers.set("x-appid", request.headers.get("x-appid") || APP_ID);

  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("authorization", authorization);

  return headers;
};

const upstreamUrl = (path: string) => `${UPSTREAM_BASE}${path}`;

export const proxyUpstreamResponse = async (response: Response) => {
  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "application/json",
    },
  });
};

export const postUpstreamForm = async (
  request: NextRequest,
  path: string,
  formData: FormData,
) => {
  const response = await fetch(upstreamUrl(path), {
    method: "POST",
    headers: proxyHeaders(request),
    body: formData,
  });
  return proxyUpstreamResponse(response);
};

export const getUpstreamJson = async (request: NextRequest, path: string) => {
  const response = await fetch(upstreamUrl(path), {
    method: "GET",
    headers: proxyHeaders(request),
  });
  return proxyUpstreamResponse(response);
};

export const uploadImageAsset = async (
  request: NextRequest,
  file: File,
): Promise<UploadedAsset> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(upstreamUrl(upstreamPaths.uploadImage), {
    method: "POST",
    headers: proxyHeaders(request),
    body: formData,
  });

  const result = await response.json();
  if (!response.ok || (result.code && result.code !== 200)) {
    throw new Error(result.message || result.msg || "Unable to upload image");
  }

  const payload = result.data ?? result;
  if (typeof payload === "string" && payload.trim()) {
    return { url: payload.trim(), hkUrl: payload.trim() };
  }

  const nestedPayload = isRecord(payload) ? payload.data : undefined;
  const hkUrl =
    pickFirstString(payload, ["hk_url", "hk_file_url", "hk_image_url", "hk_video_url"]) ||
    pickFirstString(nestedPayload, ["hk_url", "hk_file_url", "hk_image_url", "hk_video_url"]);
  const r3Url =
    pickFirstString(payload, ["url", "file_url", "image_url", "video_url", "cdn_url", "r3_url"]) ||
    pickFirstString(nestedPayload, ["url", "file_url", "image_url", "video_url", "cdn_url", "r3_url"]);
  const url = hkUrl || r3Url;

  if (!url) throw new Error("Upload succeeded but no image URL was returned.");
  return { url, hkUrl: hkUrl || url };
};

export const errorResponse = (message: string, status = 400) =>
  NextResponse.json({ code: status, msg: message }, { status });
