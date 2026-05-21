export const toolContent = {
  hero: {
    title: "Stable Audio 3 AI Audio Generator",
    lead: "Turn a text prompt or a still image into a cinematic AI video — in seconds, entirely in your browser. No GPU, no ComfyUI, no local setup.",
  },
  stats: [
    { num: "2", label: "Creation modes\nT2V & I2V" },
    { num: "3", label: "Duration options\n5s · 10s · 15s" },
    { num: "0", label: "Local setup\nrequired" },
  ],
  sections: {
    t2v: {
      title: "Text to Video — Generate Any Scene from a Prompt",
      body: "Text-to-video is the core creation mode. You describe a scene description, and Stable Audio 3 renders it as a short cinematic clip. The model interprets your prompt as a visual shot direction — so the more you describe camera behavior, lighting, and motion, the more controlled the output.",
      example: {
        category: "Product Commercial",
        prompt: "A luxury ceramic coffee cup on a dark slate surface, steam rising slowly, soft studio backlight with warm rim glow, slow dolly-in camera movement, shallow depth of field, premium lifestyle commercial style, minimal background, realistic condensation texture.",
      },
    },
    i2v: {
      title: "Image to Video — Animate a Still Photo",
      body: "Image-to-video takes a reference image you upload and transforms it into a moving clip based on motion instructions you provide. The original composition, subject, and visual identity of the image are preserved — what changes is that the scene begins to move.",
      example: {
        category: "Product Animation",
        prompt: "Slow orbit camera movement around the product, light sweeping across the surface from left to right, subtle reflection shifting on the base, maintain the original composition, preserve the product shape, clean background, premium commercial pacing.",
      },
    },
  },
  useCases: [
    { icon: "🛍️", title: "Product Videos & E-commerce", description: "Animate product photography with studio-quality camera motion — slow orbits, dolly-ins, light sweeps. Replace expensive product videography for social and web use." },
    { icon: "📱", title: "Social Media Clips", description: "Generate vertical video hooks for TikTok, Reels, and Shorts. Fast visual concepts tested and downloaded in minutes — without recording equipment or editing software." },
    { icon: "🎬", title: "Pre-production & Storyboarding", description: "Test cinematic shots, camera angles, and scene mood before committing to a full production. Generate multiple directional options in one session." },
    { icon: "📣", title: "Ad Concepts & Campaign Tests", description: "Create video ad concepts for review and approval before production. Explore different visual directions, tones, and product framings at low cost." },
    { icon: "🏗️", title: "Architecture & Interior Visualization", description: "Animate renders and interior images with camera walkthrough motion. Show clients how a space feels before it's built." },
    { icon: "🎨", title: "Concept Art & Creative Direction", description: "Turn concept artwork into animated references. Communicate mood, pacing, and visual style to collaborators without a full edit." },
  ],
  settings: [
    {
      num: "01",
      title: "Aspect Ratio — Match Your Output Channel",
      description: "16:9 landscape is the standard for website media, product pages, YouTube, and cinematic previews. 9:16 vertical is optimized for TikTok, Instagram Reels, YouTube Shorts, and any placement where the video plays full-screen on mobile. Choose the ratio before writing the prompt — camera framing language works differently in landscape versus vertical compositions.",
    },
    {
      num: "02",
      title: "Duration — Start Short, Scale Up",
      description: "5-second clips are the most efficient way to validate a prompt direction. They reveal whether the motion, framing, and style are working without spending additional credits. 10-second clips suit actions that need time to develop — a full camera orbit, a character crossing a scene, or a product reveal. 15-second clips are best reserved for finalized prompts that need a longer output for editing or presentation.",
    },
    {
      num: "03",
      title: "Resolution — Validate First, Upgrade Second",
      description: "720P is the correct starting resolution for all prompt exploration. It renders faster, uses fewer credits, and is more than sufficient to evaluate motion quality and scene direction. Upgrade to 1080P only after the prompt is confirmed to be producing the right shot — higher resolution adds detail to a working direction, but cannot correct a structurally weak prompt.",
    },
  ],
  comparison: [
    { feature: "Setup required", online: true, local: false, onlineText: "None — browser only", localText: "ComfyUI + weights" },
    { feature: "GPU needed", online: true, local: false, onlineText: "No — cloud generation", localText: "24–32 GB VRAM min" },
    { feature: "Time to first video", online: true, local: false, onlineText: "Under 2 minutes", localText: "Hours of setup" },
    { feature: "Text-to-video", online: true, local: true, onlineText: "✓ Supported", localText: "✓ Supported" },
    { feature: "Image-to-video", online: true, local: true, onlineText: "✓ Supported", localText: "✓ Supported" },
    { feature: "Best for", online: "Creators, marketers, designers", local: "Advanced technical users" },
  ],
  faq: [
    {
      question: "What is Stable Audio 3 AI Audio Generator?",
      answer: "Stable Audio 3 AI Audio Generator is an online tool for creating short cinematic AI videos from text prompts or reference images. It is built around the Stable Audio 3 model, an LTX 2.3 based video generation model that supports text-to-video and image-to-video workflows.",
    },
    {
      question: "What makes Stable Audio 3 different from other AI video generators?",
      answer: "Stable Audio 3 is known for LTX 2.3 based video generation, native text-to-video and image-to-video support, and cinematic motion workflows. The online version removes the technical setup, so you can create videos in a browser without ComfyUI, local model files, or a high-end GPU.",
    },
    {
      question: "Can I use Stable Audio 3 AI Audio Generator for commercial projects?",
      answer: "Yes. Stable Audio 3 AI Audio Generator is designed for commercial creative workflows such as product videos, ad concepts, social content, campaign visuals, landing page media, and early video tests. Always review the Terms of Service on stableaudio3.com for the full usage rights that apply to generated content.",
    },
    {
      question: "Can Stable Audio 3 generate videos from text prompts?",
      answer: "Yes. Stable Audio 3 supports text-to-video generation. Write a scene description, add subject details, action, camera movement, lighting, mood, and style, then generate a short AI video based on your prompt.",
    },
    {
      question: "Can Stable Audio 3 turn images into videos?",
      answer: "Yes. Stable Audio 3 supports image-to-video creation. Upload a reference image, then describe how the subject, camera, lighting, or background should move. This works well for product photos, portraits, concept art, fashion visuals, and brand images.",
    },
    {
      question: "What aspect ratio should I use for social media videos?",
      answer: "Use 9:16 vertical for TikTok, Instagram Reels, and YouTube Shorts. Use 16:9 landscape for YouTube, website embeds, product pages, landing pages, and presentation visuals. Choose the format before writing your prompt so the framing and camera direction match the final channel.",
    },
    {
      question: "How do I get better motion in Stable Audio 3 videos?",
      answer: "Use clear camera motion terms in your prompt, such as dolly-in, tracking shot, orbit shot, pan, close-up, wide shot, handheld motion, or slow push-in. Motion language tells Stable Audio 3 how the viewer should move through the scene and often works better than only adding style labels.",
    },
    {
      question: "What image formats work best for image-to-video?",
      answer: "Use clear, well-lit JPEG or PNG images with a strong subject and clean composition. Avoid very dark, heavily cropped, blurry, or cluttered images because they give the model less visual structure to follow. Better image quality usually leads to more stable image-to-video results.",
    },
    {
      question: "Do I need a GPU or ComfyUI to use Stable Audio 3 online?",
      answer: "No. The online Stable Audio 3 AI Audio Generator runs through a browser-based workflow. You do not need to install ComfyUI, download model weights, configure nodes, or use a local GPU. Write a prompt, upload an image, choose settings, preview the result, and download the video.",
    },
    {
      question: "How do credits work in Stable Audio 3 AI Audio Generator?",
      answer: "Credits are used when you generate videos. New users can start with free credits to test Stable Audio 3 online. Longer videos, higher resolution, or more advanced settings may use more credits, so the pricing page explains plans based on different workflow sizes.",
    },
  ],
} as const;
