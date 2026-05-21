import { NextRequest } from "next/server";
import { postUpstreamForm, upstreamPaths } from "../_private/upstream";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  return postUpstreamForm(request, upstreamPaths.text, formData);
}
