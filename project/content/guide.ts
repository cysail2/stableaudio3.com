export const guideContent = {
  meta: {
    tag: "Guide",
    date: "May 2026",
    readTime: "~10 min read",
  },
  hero: {
    title: "How to Use Stable Audio 3 AI Audio Generator",
    lead:
      "A complete step-by-step guide for creators who want to generate music, ambient beds, and SFX from a text prompt — or transform and inpaint existing audio — directly in the browser, no local install required.",
  },
  intro: {
    title: "What Stable Audio 3 Is, and What This Guide Covers",
    body: [
      "Stable Audio 3 is an open-weights AI audio model family from Stability AI, released in May 2026. It supports three inference modes: Text-to-Audio (generate a clip from a written prompt), Audio-to-Audio editing (transform an uploaded clip while preserving its timing), and Audio Inpaint (regenerate a selected region of an uploaded clip while preserving the rest).",
      "Stableaudio3.com is an online product experience for that workflow. This guide walks through all three modes, the prompt formula that works across them, genre and instrument vocabulary, BPM and key guidance, and the common mistakes that make AI audio sound generic. The same guidance works whether you are sketching music, building ambient beds, prototyping game audio, or producing podcast intros.",
    ],
  },
  onboarding: [
    {
      title: "Open the generator",
      body:
        "Open the Stable Audio 3 generator from the navigation. Sign up if you have not already — new users get 100 free credits, enough to create about 100 seconds of audio.",
    },
    {
      title: "Pick a mode",
      body:
        "Choose Text-to-Audio if you are creating from scratch. Choose Audio-to-Audio if you want to transform an existing clip. Choose Audio Inpaint if most of a clip works but a section needs to be regenerated.",
    },
    {
      title: "Plan a short first test",
      body:
        "Short clips are better for prompt exploration. Once the direction works, spend more credits on longer or higher-quality versions.",
    },
  ],
  formula: {
    elements: [
      "Genre / Style",
      "Instruments",
      "Mood",
      "Tempo / BPM",
      "Key (optional)",
      "Production Style",
      "Duration",
    ],
  },
  examples: [
    {
      category: "Cinematic Ambient",
      prompt:
        "A cinematic ambient track with slow synth pads, deep sub bass, distant piano notes, warm reverb, 70 BPM in A minor, soundtrack production style, 30 seconds.",
    },
    {
      category: "Lo-fi Hip Hop Loop",
      prompt:
        "A lo-fi hip hop beat with mellow piano chords, soft sub bass, warm vinyl crackle, brushed drums, 80 BPM, relaxed afternoon mood, 30-second loop.",
    },
    {
      category: "Electronic Dance",
      prompt:
        "An energetic electronic dance bed with driving 4-on-the-floor kick, plucky lead synth, bright hi-hats, 128 BPM in F minor, festival production style, 45 seconds.",
    },
    {
      category: "Game UI SFX",
      prompt:
        "A short crisp UI confirmation sound effect for a sci-fi game interface, two layered tones with a quick decay, clean digital character, 1.5 seconds.",
    },
    {
      category: "Podcast Intro Bed",
      prompt:
        "A warm podcast intro bed with rising synth pad, gentle kick drum, soft mallet percussion, 90 BPM, optimistic mood, 15 seconds with a tail for voiceover.",
    },
  ],
  audioToAudioWorkflow: [
    {
      title: "Upload a clean source clip",
      body:
        "Use an MP3, WAV, or FLAC file. The cleaner the upload, the cleaner the transformation. Avoid clips with heavy clipping or unclear instrumentation.",
    },
    {
      title: "Describe the transformation",
      body:
        "Say what should change, not what should stay the same. Examples: \"transform into a lo-fi hip hop version,\" \"shift to orchestral arrangement,\" \"convert to a synthwave bed.\" Keep the change description focused.",
    },
    {
      title: "Generate a short test first",
      body:
        "If the transformation went too far and lost the original feel, dial back the prompt. If it didn't go far enough, be more specific about what should change.",
    },
    {
      title: "Reuse the prompt as a template",
      body:
        "Once a prompt + upload combination produces a transformation you like, save it as a template for similar source clips.",
    },
  ],
  inpaintWorkflow: [
    {
      title: "Upload the source clip",
      body:
        "Choose the audio file that needs a fix or extension. Make sure it is audio you have rights to use.",
    },
    {
      title: "Select the region on the waveform",
      body:
        "Drag the handles to mark the start and end of the region you want the model to regenerate. For continuations, mark the very end and extend past the original.",
    },
    {
      title: "Match the surrounding context in the prompt",
      body:
        "Use the same genre, instruments, tempo, and key as the rest of the clip. If the rest is a lo-fi piano loop, the regenerated region should match: \"Regenerate the selected region as a smooth piano transition that bridges into the next phrase.\"",
    },
    {
      title: "Check the transitions",
      body:
        "Listen to the full clip with the new region in place. Mismatches usually show at the start and end of the regenerated region — tighten the prompt or try a slightly larger region for more blend context.",
    },
  ],
  settings: [
    {
      setting: "Mode",
      options: "T2A / A2A / Inpaint",
      usage:
        "Text-to-Audio creates from a prompt. Audio-to-Audio transforms an upload. Audio Inpaint regenerates a region of an upload.",
    },
    {
      setting: "Duration",
      options: "5s · 15s · 30s · 60s+",
      usage:
        "Short clips for SFX and prompt exploration. Longer durations for music beds and ambient loops. Inpaint duration is the region size.",
    },
    {
      setting: "Quality",
      options: "Standard / High",
      usage:
        "Start with standard for prompt exploration. Move to high once the prompt direction is working — higher quality costs more credits.",
    },
    {
      setting: "BPM",
      options: "40–180 BPM",
      usage:
        "Specify when the use case has a sync target (video cut, voiceover bed, loop at a known tempo). Leave open for exploratory sketches.",
    },
    {
      setting: "Key",
      options: "Major / Minor or open",
      usage:
        "Specify when you have a tonal center in mind. For unrelated sketches, leave open and let the model choose.",
    },
  ],
  genreTerms: [
    { term: "Cinematic", definition: "Film-score adjacent — strings, pads, low brass, swelling dynamics." },
    { term: "Ambient", definition: "Slow, atmospheric, often beatless or minimal-beat textures." },
    { term: "Electronic", definition: "Synth-driven; broad — narrow with subgenres like house, techno, or drum and bass." },
    { term: "Lo-fi hip hop", definition: "Mellow piano, brushed or boom-bap drums, vinyl crackle, 70–90 BPM." },
    { term: "Synthwave", definition: "Retro 80s-style synths, gated reverb drums, neon mood, 100–120 BPM." },
    { term: "Orchestral", definition: "Acoustic strings, brass, woodwinds; works for cinematic and score use." },
    { term: "Drum and bass", definition: "Fast breakbeats with heavy sub bass, 160–180 BPM." },
    { term: "Jazz / folk / rock", definition: "Acoustic-led genres; specify era (modern / vintage) and ensemble size." },
  ],
  moodTerms: [
    { term: "Calm / serene", definition: "Slow tempo, soft dynamics, warm pads. Good for focus and ambient beds." },
    { term: "Tense / urgent", definition: "Driving rhythm, dissonant intervals, builds. Useful for trailers and action beats." },
    { term: "Melancholic", definition: "Minor key, slow decay, piano or strings. Reflective and emotional." },
    { term: "Hopeful / uplifting", definition: "Major key, rising progressions, brighter timbres. Common for ad and brand work." },
    { term: "Epic / cinematic", definition: "Big dynamics, low brass, percussive swells. Good for reveals and finales." },
    { term: "Retro / nostalgic", definition: "Vintage production cues — tape hiss, analog synths, vinyl crackle." },
    { term: "Dreamy / ethereal", definition: "Reverb-heavy, breathy textures, slow harmonic motion. Good for surreal scenes." },
    { term: "Gritty / dark", definition: "Distortion, low-mid emphasis, sparse high end. Good for cyberpunk or industrial." },
  ],
  iteration: [
    {
      title: "Listen before rewriting",
      body:
        "Review the output and identify the weakest element first — instruments? tempo? mood? Don't rewrite the whole prompt if only one variable needs tightening.",
    },
    {
      title: "Change one variable at a time",
      body:
        "Adjust one or two things per iteration so you can tell what actually improved the result.",
    },
    {
      title: "Preserve what works",
      body:
        "Keep the prompt phrases that produced strong elements. If the kick drum sounds right but the synth is off, change only the synth description.",
    },
    {
      title: "Save successful patterns",
      body:
        "When a prompt produces a useful result, save the structure as a template for similar future work.",
    },
  ],
  mistakes: [
    {
      problem: "Prompt is too vague",
      cause: "Genre alone is not enough direction.",
      fix: "Add instruments, mood, tempo, and a production style cue.",
    },
    {
      problem: "Mixing too many genres",
      cause: "Asking for cinematic + lo-fi + synthwave produces muddy output.",
      fix: "Pick one main genre and at most one supporting flavor.",
    },
    {
      problem: "Tempo feels wrong",
      cause: "No BPM specified, so the model defaulted to genre convention.",
      fix: "Set BPM explicitly when the use case has a sync target.",
    },
    {
      problem: "Asked for vocals or speech",
      cause: "Out of scope — Stable Audio 3 is positioned for music, ambient, and SFX.",
      fix: "Use a dedicated voice or TTS tool for vocals; use Stable Audio 3 for the instrumental bed.",
    },
    {
      problem: "Upload failed for A2A or Inpaint",
      cause: "Unusual codec, DRM-locked file, or oversized upload.",
      fix: "Convert to MP3, WAV, or FLAC. Stay within the size limit shown on the upload field.",
    },
    {
      problem: "Inpaint region clashes with the rest of the clip",
      cause: "Prompt did not match the surrounding genre, instruments, or tempo.",
      fix: "Tighten the prompt to match the rest, or try a slightly larger region for more blend context.",
    },
  ],
  faq: [
    {
      question: "How do I start using Stable Audio 3?",
      answer:
        "Open the generator, choose Text to Audio, Audio to Audio, or Audio Inpaint, write a descriptive prompt, select a duration, and generate a short test clip. Start simple, then improve the prompt by adding genre, instruments, mood, and tempo.",
    },
    {
      question: "What is the best prompt structure for Stable Audio 3?",
      answer:
        "Use the formula subject + genre + instruments + mood + tempo + key (optional) + production style + duration. This gives the model both sonic content and structural direction. Prompts that only name the genre usually leave too much interpretation open.",
    },
    {
      question: "Should I start with text-to-audio or one of the editing modes?",
      answer:
        "Use text-to-audio when you want to create audio from scratch. Use audio-to-audio when you already have a clip that needs a genre or instrumentation shift. Use audio inpaint when most of an existing clip works but a specific section needs to be regenerated.",
    },
    {
      question: "How long should my first clip be?",
      answer:
        "Start with a short test. A 15–30 second clip is enough to evaluate prompt direction, instruments, and mood. Once the prompt is working, you can spend more credits on longer versions.",
    },
    {
      question: "Why does tempo (BPM) matter so much?",
      answer:
        "Tempo defines the structural feel of the clip. For sync-critical use cases (video cuts, music beds under voiceover, loops at a known BPM), specifying tempo is essential. For exploratory sketches, you can leave tempo open and adjust on the second iteration.",
    },
    {
      question: "Can I generate vocals or singing with Stable Audio 3?",
      answer:
        "No. Stable Audio 3 is positioned around music, ambient, and sound effects. Vocal generation, singing voice synthesis, and speech-to-audio are different model classes — use a dedicated voice or TTS tool for those use cases.",
    },
    {
      question: "Can I reuse prompt templates?",
      answer:
        "Yes. Reusing a strong template is one of the fastest ways to improve results. Keep the structure, then replace the genre, instruments, mood, tempo, and key. This helps you generate new ideas without starting from a blank prompt each time.",
    },
    {
      question: "What audio formats can I upload for A2A and Inpaint?",
      answer:
        "MP3, WAV, and FLAC are the most reliable. Other common formats may also work. Stay within the file size limit shown on the upload field, and make sure you have rights to use the audio you upload.",
    },
  ],
} as const;
