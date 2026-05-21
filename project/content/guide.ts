export const guideContent = {
  meta: {
    tag: "Guide",
    date: "May 2026",
    readTime: "~8 min read",
  },
  hero: {
    title: "How to Use Stable Audio 3 AI Audio Generator",
    lead: "A complete step-by-step guide for creators who want to go from text prompt or image to cinematic AI video — directly in the browser, no GPU or local setup required.",
  },
  intro: {
    title: "What Is Stable Audio 3?",
    body: [
      "Stable Audio 3 is an open-weights AI video generation model built on the LTX 2.3 architecture, fine-tuned on over 125,000 video samples for improved motion realism and cinematic output quality. The model supports both text-to-video and image-to-video generation natively.",
      "While the base model can be run locally via ComfyUI on a high-end GPU, stableaudio3.com provides an online interface that removes all of that technical overhead. No weights to download, no GPU required, no ComfyUI setup — just open the generator, write a prompt, and generate a cinematic short video directly in your browser.",
      "This guide covers everything you need to know: how to write effective prompts, how to use both generation modes, how to choose the right settings, and how to iterate your way to better results.",
    ],
  },
  onboarding: [
    {
      title: "Go to stableaudio3.com",
      body: "Open the Stable Audio 3 website and click Sign In in the top navigation. Create a free account — no credit card needed.",
    },
    {
      title: "Open the AI Video Generator",
      body: "Navigate to the AI Video Generator page from the nav bar. This is the main creation workspace where all generation happens.",
    },
    {
      title: "Choose your mode: Text to Video or Image to Video",
      body: "Select the tab that matches your starting point. Use text-to-video to invent a scene from scratch, or image-to-video to animate an existing photo or visual reference.",
    },
    {
      title: "Write your prompt and choose settings",
      body: "Describe the shot in the prompt field. Set aspect ratio, duration, and resolution. Then hit Generate.",
    },
    {
      title: "Preview and download",
      body: "Your generated video appears in the output preview area. Watch it, then download or refine the prompt for a stronger second version.",
    },
  ],
  formula: {
    elements: ["Subject", "Action", "Setting", "Camera motion", "Lighting", "Style & mood"],
    explanation: "Think of it as writing a shot description for a cinematographer. The more specific you are about what moves and how the camera behaves, the more intentional the result.",
  },
  examples: [
    {
      category: "Product Commercial",
      prompt: "A luxury smartwatch rotating slowly on a matte black surface, soft blue rim light, macro close-up, subtle reflections, slow orbit camera movement, premium technology advertisement style, clean background.",
    },
    {
      category: "Cinematic Portrait",
      prompt: "A cinematic close-up of a young filmmaker standing under neon city lights at night, rain on the pavement, slow push-in camera movement, shallow depth of field, moody blue and magenta lighting, realistic skin texture.",
    },
    {
      category: "Social Vertical Clip",
      prompt: "A vertical fashion video of a model walking through a modern gallery, smooth handheld camera movement, clean white walls, soft diffused shadows, editorial style, confident mood, fast visual hook.",
    },
    {
      category: "Landscape Scene",
      prompt: "A wide shot of a mountain lake at sunrise, mist rolling across the water, birds drifting in the distance, slow aerial tracking shot, warm golden light, peaceful cinematic atmosphere, realistic detail.",
    },
  ],
  imageWorkflow: [
    {
      title: "Upload a clean reference image",
      body: "Use a well-lit image with a clear subject. Avoid dark, heavily cropped, or visually cluttered inputs — they give the model less to work with and produce less stable motion.",
    },
    {
      title: "Describe the motion, not the scene",
      body: "Don't re-describe what's already in the image. Focus only on what should move: slow push-in, product rotating, clouds drifting, fabric flowing, light sweeping across the surface.",
    },
    {
      title: "Preserve the composition explicitly",
      body: "If the subject starts changing too much, add preservation language: \"keep the same product shape,\" \"maintain the face,\" \"animate only the background.\"",
    },
  ],
  settings: [
    {
      setting: "Aspect Ratio",
      options: "16:9 / 9:16",
      usage: "16:9 for websites, product pages, cinematic previews. 9:16 for TikTok, Reels, Shorts.",
    },
    {
      setting: "Duration",
      options: "5s / 10s / 15s",
      usage: "Start with 5s for prompt testing. Use longer only when the action needs time to develop.",
    },
    {
      setting: "Resolution",
      options: "720P / 1080P",
      usage: "720P for exploration and drafts. 1080P when motion, framing, and style are already working.",
    },
  ],
  cameraTerms: [
    { term: "Dolly in", definition: "Camera slowly moves toward the subject — creates intimacy and tension." },
    { term: "Dolly out", definition: "Camera pulls back to reveal the scene — great for establishing shots." },
    { term: "Tracking shot", definition: "Camera follows the subject through movement — keeps the action centered." },
    { term: "Orbit", definition: "Camera circles around the subject — ideal for product showcases." },
    { term: "Pan", definition: "Horizontal rotation across a scene — good for wide environments." },
    { term: "Tilt", definition: "Vertical camera movement up or down — reveals scale or height." },
    { term: "Close-up", definition: "Tight framing for faces, product details, and texture work." },
    { term: "Handheld", definition: "Natural, subtle movement — adds realism and documentary feel." },
  ],
  lightingTerms: [
    { term: "Soft studio light", definition: "Clean, even illumination — best for product and beauty shots." },
    { term: "Blue rim light", definition: "Edge highlight — adds depth and a premium feel to dark backgrounds." },
    { term: "Golden hour", definition: "Warm, directional natural light — cinematic and emotionally resonant." },
    { term: "Neon city light", definition: "Colourful, urban ambient — good for night scenes and fashion content." },
  ],
  iteration: [
    {
      title: "Identify the weakest part of the output",
      body: "Is the motion too subtle? Is the subject changing unexpectedly? Is the framing wrong? Name one problem before you change anything.",
    },
    {
      title: "Change one or two things only",
      body: "Rewriting the entire prompt at once makes it hard to know what worked. Add a camera motion term, strengthen the lighting description, or clarify the subject action — not all three at once.",
    },
    {
      title: "Save your best prompt structure as a template",
      body: "Once a prompt produces good motion and framing, save its structure. Replace the subject and setting to generate new directions without starting from blank every time.",
    },
  ],
  mistakes: [
    {
      problem: "Subject changes too much (i2v)",
      cause: "No preservation language in prompt",
      fix: 'Add: "keep the same product shape, animate only the background"',
    },
    {
      problem: "Motion feels weak or static",
      cause: "No camera motion word in prompt",
      fix: "Add: dolly-in, tracking shot, orbit, pan, or handheld",
    },
    {
      problem: "Style looks inconsistent",
      cause: "Too many competing style words",
      fix: "Pick one dominant style and remove the conflicting ones",
    },
    {
      problem: "Important detail gets ignored",
      cause: "Key detail placed too late in prompt",
      fix: "Move the most critical visual information to the start",
    },
    {
      problem: "Result looks generic",
      cause: "Prompt only names subject, no direction",
      fix: "Add action, camera movement, lighting, and mood",
    },
  ],
  faq: [
    {
      question: "Do I need a GPU to use Stable Audio 3 online?",
      answer: "No. The stableaudio3.com online tool runs generation in the cloud. You write a prompt or upload an image in the browser, and the video renders server-side. No GPU, no ComfyUI, no local installation needed.",
    },
    {
      question: "What's the difference between Stable Audio 3 and the open-source base model?",
      answer: "The open-source Sulphur-2-base model on Hugging Face requires a high-end GPU (24GB+ VRAM), ComfyUI setup, and manual weight downloads. The stableaudio3.com online tool gives you the same generation capability through a browser interface — no technical setup required.",
    },
    {
      question: "How long should my Stable Audio 3 prompt be?",
      answer: "Aim for 30–80 words. Each detail should serve the shot — subject, action, setting, camera motion, lighting, style, and mood. Remove decorative filler phrases that don't change the visual outcome. A focused prompt of 40 words usually beats a padded prompt of 120 words.",
    },
    {
      question: "Can I use Stable Audio 3 for commercial video content?",
      answer: "Yes. Stable Audio 3 is designed for product showcases, marketing concepts, ad concepts, social clips, and creative campaign tests. Check the Terms of Service on stableaudio3.com for full usage rights on generated content.",
    },
    {
      question: "What resolution should I use for final output?",
      answer: "Validate your prompt at 720P first. Once the motion, framing, and style are working, move to 1080P for the final export. Higher resolution only adds value on top of a solid prompt — it can't compensate for unclear scene direction.",
    },
    {
      question: "How is Stable Audio 3 different from other AI video generators?",
      answer: "Stable Audio 3 is built on the LTX 2.3 architecture and fine-tuned specifically for cinematic motion realism. It's the only online tool built around the Stable Audio 3 model, offering browser-based text-to-video and image-to-video without the technical requirements of the local open-source workflow.",
    },
  ],
} as const;
