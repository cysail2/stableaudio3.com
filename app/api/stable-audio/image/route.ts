import { NextRequest } from "next/server";
import {
  errorResponse,
  postUpstreamForm,
  uploadImageAsset,
  upstreamPaths,
} from "../_private/upstream";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const incomingForm = await request.formData();
  const image = incomingForm.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return errorResponse("Please upload a reference image");
  }

  try {
    const imageAsset = await uploadImageAsset(request, image);
    const upstreamForm = new FormData();

    incomingForm.forEach((value, key) => {
      if (key === "image" || typeof value !== "string") return;
      upstreamForm.append(key, value);
    });
    upstreamForm.append("image_url", imageAsset.url);
    upstreamForm.append("hk_image_url", imageAsset.hkUrl);

    return postUpstreamForm(request, upstreamPaths.image, upstreamForm);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to create image video task", 502);
  }
}
