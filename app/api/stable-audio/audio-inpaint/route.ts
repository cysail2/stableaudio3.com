import { NextRequest } from "next/server";
import { postUpstreamJson, upstreamPaths } from "../_private/upstream";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return postUpstreamJson(request, upstreamPaths.audioInpaint, body);
}
