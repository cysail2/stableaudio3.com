import { NextRequest, NextResponse } from "next/server";

import { siteConfig } from "@/project/config/site";

const GENERATION_UPSTREAM_BASE = process.env.ACE_STEP_API_BASE || "https://svc.grokimagineai.net";
const APP_ID = process.env.APP_ID || process.env.SITE_APP_ID || siteConfig.appIdentifier;

export const upstreamPaths = {
  text: "/api/task/wp/ace-step/prompt-to-audio",
  audioToAudio: "/api/task/wp/ace-step/audio-to-audio",
  audioInpaint: "/api/task/wp/ace-step/audio-inpaint",
  check: "/api/task/wp/ace-step/check",
} as const;

const jsonProxyHeaders = (request: NextRequest) => {
  const headers = new Headers();
  headers.set("content-type", "application/json");
  headers.set("x-appid", request.headers.get("x-appid") || APP_ID);

  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("authorization", authorization);

  return headers;
};

const generationUrl = (path: string) => `${GENERATION_UPSTREAM_BASE}${path}`;

export const proxyUpstreamResponse = async (response: Response) => {
  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "application/json",
    },
  });
};

export const postUpstreamJson = async (request: NextRequest, path: string, body: unknown) => {
  const response = await fetch(generationUrl(path), {
    method: "POST",
    headers: jsonProxyHeaders(request),
    body: JSON.stringify(body),
  });
  return proxyUpstreamResponse(response);
};

export const getUpstreamJson = async (request: NextRequest, path: string) => {
  const response = await fetch(generationUrl(path), {
    method: "GET",
    headers: jsonProxyHeaders(request),
  });
  return proxyUpstreamResponse(response);
};

export const errorResponse = (message: string, status = 400) =>
  NextResponse.json({ code: status, msg: message }, { status });
