import { NextRequest } from "next/server";
import { errorResponse, getUpstreamJson, upstreamPaths } from "../_private/upstream";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get("task_id");
  if (!taskId) return errorResponse("Task ID is required");

  return getUpstreamJson(
    request,
    `${upstreamPaths.check}?task_id=${encodeURIComponent(taskId)}`,
  );
}
