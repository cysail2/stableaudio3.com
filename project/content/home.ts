export const homeContent = {
  hero: {
    badge: "Stable Audio 3 AI Audio Generator",
    title: "Create AI Audio with Stable Audio 3",
    description:
      "Turn text prompts into music, ambient beds, and sound effects, or edit and inpaint existing audio — all in the browser, no install, free to try.",
    trustLine: "Sign up with 100 free credits and generate your first audio clip.",
  },
  intro: {
    eyebrow: "Online AI Audio Creation",
    title: "Built Around the Stable Audio 3 Model Family",
    paragraphs: [
      "Stable Audio 3 is an online AI audio generator for creators who need quick music sketches, ambient beds, sound effects, or precise edits on existing audio. Choose Text-to-Audio to create from a written prompt, Audio-to-Audio to transform an uploaded clip, or Audio Inpaint to regenerate a specific region of an audio file.",
      "The public Stable Audio 3 release from Stability AI is one of the most discussed open-weight audio models of May 2026: a model family trained on fully licensed data, with variants ranging from compact Small SFX through the largest Large variant. Stableaudio3.com brings that search intent into a simpler online product experience focused on generating, previewing, and downloading AI audio.",
      "Use Stable Audio 3 for podcast intros, video soundtrack beds, game audio sketches, social media hooks, ambient streaming loops, and short cinematic music. The best results come from prompts that describe genre, instruments, mood, tempo, and (optionally) key — not only the subject.",
    ],
    tags: ["Stability AI Open Weights", "Text-to-Audio", "Audio Inpaint"],
  },
  workflow: [
    {
      title: "Write or Upload",
      description:
        "Start with a text prompt or upload an audio file you want to edit or inpaint. For text prompts, describe the genre, instrumentation, mood, BPM, and any production style cues.",
    },
    {
      title: "Choose Mode and Length",
      description:
        "Pick Text-to-Audio for generation from scratch, Audio-to-Audio for transforming an upload, or Audio Inpaint to regenerate a region of an uploaded clip. Choose a duration that matches the use case.",
    },
    {
      title: "Generate the Audio",
      description:
        "Submit the prompt and let Stable Audio 3 produce a short clip. Preview the waveform and play the result directly in the browser.",
    },
    {
      title: "Download or Iterate",
      description:
        "Save the generated audio, reuse the prompt, or refine the genre, instruments, mood, or tempo for a stronger second version.",
    },
  ],
  workflowIntro:
    "Creating audio with Stable Audio 3 is simple. Pick a mode, write a prompt, generate a short clip, then refine the genre, instruments, mood, or tempo until the result feels right.",
  features: [
    {
      icon: "text-to-audio",
      title: "Text-to-Audio Creation",
      description:
        "Turn written prompts into music, ambient beds, or sound effects. Stable Audio 3 responds best when your prompt includes genre, instruments, mood, tempo, and a production style cue.",
    },
    {
      icon: "audio-to-audio",
      title: "Audio-to-Audio Editing",
      description:
        "Upload an existing audio file and describe how it should change. Useful for shifting genre, swapping instrumentation, or transforming a rough sketch into a polished bed without re-recording.",
    },
    {
      icon: "inpaint",
      title: "Audio Inpaint and Continuation",
      description:
        "Select a region of an uploaded clip and let Stable Audio 3 regenerate just that part. The right mode for fixing a section, removing an unwanted sound, or extending a loop.",
    },
    {
      icon: "length",
      title: "Variable-Length Generation",
      description:
        "Generate short SFX through longer music beds in the same workflow. Choose the duration that matches the use case rather than stitching multiple short clips together.",
    },
    {
      icon: "prompt",
      title: "Prompt Guidance",
      description:
        "Use structured prompt patterns to get more consistent results. The prompt guide covers formulas, genre vocabulary, BPM and key tips, and examples for each of the three modes.",
    },
    {
      icon: "browser",
      title: "Browser-Based Workflow",
      description:
        "Start creating without local installation. The online experience focuses on prompt input, mode selection, settings, preview, and download. The underlying Stable Audio 3 model weights are also available on Hugging Face for users who prefer local inference.",
    },
  ],
  metrics: [
    { value: "100", label: "free credits", detail: "Try Stable Audio 3 after signup" },
    { value: "3", label: "audio modes", detail: "Text-to-audio, audio-to-audio, inpaint" },
    { value: "30s", label: "first test", detail: "Enough for one short generation" },
    { value: "4", label: "credit plans", detail: "Choose by workflow size" },
  ],
  useCases: [
    {
      title: "Music Sketch and Cinematic Score",
      // mode controls the card thumb hue — keep most cards on primary (violet)
      // and reserve pink for an A2A example, amber for an Inpaint example.
      // This prevents the 6-card grid from looking like a rainbow.
      mode: "t2a",
      genre: "Cinematic",
      duration: "30 s",
      sample: "/samples/usecase-cinematic.mp3",
      seed: 13,
      description:
        "Generate cinematic music beds, electronic loops, or orchestral sketches from text prompts. Describe genre, instruments, tempo, and mood to give the model a clear sonic direction.",
    },
    {
      title: "Podcast Intro and Outro",
      mode: "a2a",
      genre: "Podcast Intro",
      duration: "8 s",
      sample: "/samples/usecase-podcast-intro.mp3",
      seed: 21,
      description:
        "Create short branded intro and outro music that sets the tone for an episode. Use Audio-to-Audio mode to take a rough sketch and shape it into a polished bed.",
    },
    {
      title: "Video Soundtrack Bed",
      mode: "t2a",
      genre: "Soundtrack",
      duration: "25 s",
      sample: "/samples/usecase-soundtrack.mp3",
      seed: 47,
      description:
        "Generate background music for short videos, social clips, and product launches. Match the duration to the cut, and use Audio Inpaint to swap a section that does not fit.",
    },
    {
      title: "Game Audio Prototyping",
      mode: "inpaint",
      genre: "Game SFX",
      duration: "5 s",
      sample: "/samples/usecase-game-sfx.mp3",
      seed: 7,
      description:
        "Sketch UI sound effects, ambience loops, and combat beds before commissioning final audio. Small SFX-style outputs from Stable Audio 3 are well-suited to short game sounds.",
    },
    {
      title: "Social Media Audio Hook",
      mode: "t2a",
      genre: "Lo-fi Hook",
      duration: "15 s",
      sample: "/samples/usecase-lofi-loop.mp3",
      seed: 33,
      description:
        "Create 5–10 second loops or hooks for Reels, TikTok, and Shorts. Use Audio Inpaint to refine the section that needs to read on the first second of a vertical clip.",
    },
    {
      title: "Ambient Bed for Streaming or Focus",
      mode: "t2a",
      genre: "Ambient",
      duration: "60 s",
      sample: "/samples/usecase-ambient.mp3",
      seed: 58,
      description:
        "Generate long-form ambient loops for streaming overlays, focus playlists, or installation pieces. Variable-length generation removes the need to stitch multiple loops manually.",
    },
  ],
  promptTips: [
    {
      title: "Genre and instruments first",
      description:
        "Describe genre and instruments before the mood. A lo-fi hip hop beat with mellow piano and brushed drums tells the model far more than just \"music.\"",
    },
    {
      title: "Tempo and key when it matters",
      description:
        "Add BPM and key when the use case has a known target. For loops that sync to a video cut or sit under voiceover, an explicit tempo keeps the model on-grid.",
    },
    {
      title: "Match the prompt to the mode",
      description:
        "Text-to-audio prompts describe a clip from scratch. Audio-to-audio prompts describe the transformation. Inpaint prompts should match the surrounding genre and tempo so the regenerated region blends in.",
    },
  ],
  faq: [
    {
      question: "What is Stable Audio 3?",
      answer:
        "Stable Audio 3 is an open-weights AI audio model family from Stability AI, released in May 2026. It supports text-to-audio, audio-to-audio editing, and audio inpainting / continuation. This site is an online product experience for that workflow — write a prompt, optionally upload an audio file, generate audio in the browser, and download the result.",
    },
    {
      question: "What can I create with Stable Audio 3?",
      answer:
        "You can generate music sketches, ambient beds, sound effects, podcast intros, video soundtrack beds, game audio prototypes, social media hooks, and short cinematic music. Stable Audio 3 is positioned for sound, music, and SFX — it is not designed for voice cloning, speech synthesis, or full songs with vocals.",
    },
    {
      question: "Do I need a GPU to use Stable Audio 3 online?",
      answer:
        "No. The online workflow runs in the browser, so you can generate audio without a local install. If you prefer local inference, the open weights for the Small and Medium variants are on Hugging Face under the Stability AI organization.",
    },
    {
      question: "What is audio inpainting?",
      answer:
        "Audio inpainting lets you select a region of an existing audio clip and ask the model to regenerate just that section. It is useful for fixing a problem area, removing an unwanted sound, swapping an instrument in a passage, or extending a loop without rewriting the entire clip.",
    },
    {
      question: "What prompt style works best?",
      answer:
        "Stable Audio 3 works best with detailed prompts that describe genre, instruments, mood, tempo, and production style. For example, instead of writing \"a song,\" describe the clip: \"a lo-fi hip hop beat with mellow piano chords, warm vinyl crackle, soft sub bass, 80 BPM, 30-second loop.\" This gives the model more sonic direction.",
    },
    {
      question: "Can Stable Audio 3 generate vocals or speech?",
      answer:
        "No. The Stable Audio 3 model family is positioned around sound, music, and SFX. Voice cloning, speech synthesis, and singing voice generation are different model classes — use a dedicated voice or TTS tool for those use cases.",
    },
    {
      question: "How do credits work?",
      answer:
        "Credits are used for audio generation. New users receive 100 free credits, enough to create about 100 seconds of audio. Longer audio or additional inpaint passes use more credits. The pricing page shows plan equivalents in practical clip counts.",
    },
    {
      question: "Can I use Stable Audio 3 outputs commercially?",
      answer:
        "The underlying Stable Audio 3 model from Stability AI is released under the Stability AI Community License, which lets you commercialize outputs you generate. Organizations with more than $1M in annual revenue should review Stability AI's Enterprise license. On this site, commercial use also depends on the Terms of Service — review them before running paid campaigns or client work.",
    },
    {
      question: "Is Stable Audio 3 only for technical users?",
      answer:
        "No. Stable Audio 3 can be used by creators, musicians, podcasters, video editors, game makers, and marketers who want a simple online AI audio workflow. The web experience focuses on prompts, audio uploads for editing, settings, preview, and download.",
    },
    {
      question: "Where should I start?",
      answer:
        "Start on the Stable Audio 3 AI Audio Generator page. Use a simple but descriptive prompt — name the genre, instruments, mood, and tempo — then generate a short test. The prompt guide includes formulas and examples for all three modes.",
    },
  ],
} as const;
