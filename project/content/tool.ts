export const toolContent = {
  hero: {
    title: "Stable Audio 3 AI Audio Generator",
    lead:
      "Generate music sketches, ambient beds, and sound effects from a text prompt — or upload an audio file to edit a section, inpaint a region, or extend a loop. All three Stable Audio 3 modes in the same browser workflow.",
  },
  stats: [
    { num: "3", label: "Audio modes\nT2A · A2A · Inpaint" },
    { num: "100", label: "Free credits\nat signup" },
    { num: "0", label: "Local setup\nrequired" },
  ],
  sections: {
    t2a: {
      title: "Text-to-Audio — Generate Music, Ambient, or SFX from a Prompt",
      body:
        "Text-to-Audio is the core creation mode. You describe a clip — genre, instruments, mood, tempo, production style — and Stable Audio 3 generates a short audio file. Best for new music sketches, ambient beds, podcast intros, and short sound effects.",
      example: {
        category: "Cinematic Ambient Track",
        prompt:
          "A cinematic ambient track with slow synth pads, deep sub bass, distant piano notes, warm reverb, 70 BPM in A minor, soundtrack production style, 30 seconds.",
      },
    },
    a2a: {
      title: "Audio-to-Audio — Transform an Uploaded Clip",
      body:
        "Audio-to-Audio takes an audio file you upload and reshapes it based on a transformation prompt. The model preserves the timing and structure of the source while shifting genre, instrumentation, or feel. Useful for turning a rough sketch into a polished bed.",
      example: {
        category: "Lo-Fi Transformation",
        prompt:
          "Transform this clip into a lo-fi hip hop version with mellow piano, soft drums, warm vinyl crackle, and a relaxed feel. Preserve the original timing.",
      },
    },
    inpaint: {
      title: "Audio Inpaint — Regenerate a Region of an Audio File",
      body:
        "Audio Inpaint lets you select a region of an uploaded clip on the waveform and ask Stable Audio 3 to regenerate just that part. The rest of the clip stays untouched. Use it to fix a problem section, remove an unwanted sound, swap an instrument in a passage, or extend a loop.",
      example: {
        category: "Section Regeneration",
        prompt:
          "Regenerate the selected region as a smooth synth pad that bridges into the next phrase. Match the surrounding key, tempo, and mood.",
      },
    },
  },
  useCases: [
    {
      icon: "🎬",
      title: "Music Sketch and Cinematic Score",
      description:
        "Generate cinematic music beds, electronic loops, and orchestral sketches from text prompts. Describe genre, instruments, tempo, and mood to give the model a clear sonic direction.",
    },
    {
      icon: "🎙️",
      title: "Podcast Intros and Outros",
      description:
        "Create short branded intro and outro music that sets the tone for an episode. Use Audio-to-Audio mode to take a rough hum into a polished bed under voiceover.",
    },
    {
      icon: "📹",
      title: "Video Soundtrack Beds",
      description:
        "Generate background music for short videos, social clips, and product launches. Match the duration to the cut, and use Audio Inpaint to swap a section that does not fit.",
    },
    {
      icon: "🎮",
      title: "Game Audio Prototyping",
      description:
        "Sketch UI sound effects, ambience loops, and combat beds before commissioning final audio. Stable Audio 3's Small SFX-style outputs are well-suited to short game sounds.",
    },
    {
      icon: "📱",
      title: "Social Media Audio Hooks",
      description:
        "Create 5–10 second loops or hooks for Reels, TikTok, and Shorts. Use Audio Inpaint to refine the section that needs to read on the first second of a vertical clip.",
    },
    {
      icon: "🌊",
      title: "Ambient Bed for Streaming or Focus",
      description:
        "Generate long-form ambient loops for streaming overlays, focus playlists, or installation pieces. Variable-length generation removes the need to stitch multiple loops manually.",
    },
  ],
  settings: [
    {
      num: "01",
      title: "Mode — Match the Workflow to the Job",
      description:
        "Text-to-Audio creates a clip from a written prompt. Audio-to-Audio transforms an uploaded clip while preserving its timing. Audio Inpaint regenerates a selected region of an uploaded clip. Choose mode before writing the prompt — the prompt style differs per mode.",
    },
    {
      num: "02",
      title: "Duration — Start Short, Scale Up",
      description:
        "Short clips work best for prompt exploration and SFX. Longer clips work for music beds and ambient loops. The first generation should be short — once the prompt direction works, use more credits for longer or higher-quality versions. Audio Inpaint duration is determined by the selected region size.",
    },
    {
      num: "03",
      title: "Prompt Detail — More Specific Beats Longer",
      description:
        "A clear prompt with genre, instruments, mood, tempo, and production style outperforms a long vague prompt. For Text-to-Audio: lead with genre and instruments. For Audio-to-Audio: lead with the transformation goal. For Audio Inpaint: match the surrounding clip's tempo and key so the regenerated region blends in.",
    },
  ],
  comparison: [
    { feature: "Setup required", online: true, local: false, onlineText: "None — browser only", localText: "Local install + ComfyUI" },
    { feature: "GPU needed", online: true, local: false, onlineText: "No — cloud generation", localText: "Workstation GPU recommended" },
    { feature: "Time to first clip", online: true, local: false, onlineText: "Under 2 minutes", localText: "Hours of setup" },
    { feature: "Text-to-Audio", online: true, local: true, onlineText: "✓ Supported", localText: "✓ Supported (open weights)" },
    { feature: "Audio-to-Audio editing", online: true, local: true, onlineText: "✓ Supported", localText: "✓ Supported" },
    { feature: "Audio Inpainting", online: true, local: true, onlineText: "✓ Supported", localText: "✓ Supported" },
    { feature: "Best for", online: "Creators, podcasters, video editors, game makers, marketers", local: "Advanced technical users running open weights locally" },
  ],
  faq: [
    {
      question: "What is Stable Audio 3 AI Audio Generator?",
      answer:
        "Stable Audio 3 AI Audio Generator is an online tool for creating audio from text prompts or editing existing audio clips. It is built around the Stable Audio 3 model family from Stability AI and exposes three modes — Text-to-Audio, Audio-to-Audio, and Audio Inpaint — in a single browser workflow.",
    },
    {
      question: "Can I create music from text?",
      answer:
        "Yes. Choose Text-to-Audio, write a detailed prompt with genre, instruments, mood, and tempo, then generate the clip. Stable Audio 3 is positioned for sound, music, and SFX — it does not generate vocals, sung lyrics, or spoken dialogue.",
    },
    {
      question: "Can I edit an existing audio file?",
      answer:
        "Yes. Choose Audio-to-Audio, upload an MP3, WAV, or FLAC clip, then describe how it should change. The model preserves the timing and structure of your source while shifting genre, instrumentation, or feel.",
    },
    {
      question: "What is audio inpainting?",
      answer:
        "Audio inpainting lets you select a region of an uploaded clip on the waveform and ask Stable Audio 3 to regenerate just that section. The rest of the clip is preserved. Use it to fix a section, remove an unwanted sound, swap an instrument, or extend a loop.",
    },
    {
      question: "What file formats can I upload?",
      answer:
        "Common audio formats are supported — MP3, WAV, and FLAC are the most reliable. Make sure the upload is audio you have rights to use. Uploading copyrighted material or someone else's recording without permission is not allowed under the Terms of Service.",
    },
    {
      question: "How long can a generated clip be?",
      answer:
        "Duration depends on the mode and your selected settings. Short clips work well for prompt exploration and SFX; longer clips work well for music beds and ambient loops. The exact upper bound on the hosted workflow is shown in the settings panel inside the generator.",
    },
    {
      question: "How many credits does an audio generation use?",
      answer:
        "Credit usage is 1 credit per second. The 100 free signup credits are enough to create about 100 seconds of audio. Check the pricing page for plan equivalents.",
    },
    {
      question: "Can I use Stable Audio 3 audio for product or marketing work?",
      answer:
        "Yes. Stable Audio 3 outputs are designed for creative, product, podcast, video, and game-audio workflows. The underlying model is released under the Stability AI Community License, which lets you commercialize outputs. Organizations with more than $1M in annual revenue should review Stability AI's Enterprise license.",
    },
    {
      question: "Can Stable Audio 3 generate vocals or speech?",
      answer:
        "No. The Stable Audio 3 model family is positioned around music, ambient, and SFX. Voice cloning, speech synthesis, and singing voice generation are different model classes — use a dedicated voice or TTS tool for those use cases.",
    },
    {
      question: "Why did my audio sound different from the prompt?",
      answer:
        "AI audio generation is interpretive, so the output may not match every detail. Improve the next attempt by making the genre and instruments clearer, adding tempo (BPM) and mood, removing conflicting style words, and putting the most important constraints near the beginning of the prompt.",
    },
  ],
} as const;
