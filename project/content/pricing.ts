export const pricingContent = {
  explainer: [
    "uses credits for audio generation at 1 credit per second. New users receive 100 free credits, enough to create about 100 seconds of audio before choosing a paid credit pack.",
    "For prompt exploration, start with shorter test clips. When you find a prompt direction that works, use additional credits to generate longer or higher-quality outputs for presentation, editing, or publishing workflows. Audio Inpaint uses credits based on the size of the regenerated region, so small fixes are more efficient than full regenerations.",
  ],
  selection: [
    {
      title: "10,000 Credits",
      description: "Best for first paid tests, short SFX, and one-off audio ideas.",
    },
    {
      title: "22,000 Credits",
      description: "Best for exploring prompts, refining music beds, and creating multiple usable clips.",
    },
    {
      title: "60,000 Credits",
      description: "Best for heavier iteration across podcast, video, game-audio, and marketing workflows.",
    },
    {
      title: "150,000 Credits",
      description: "Best for teams and frequent creators that need the lowest unit price.",
    },
  ],
  faq: [
    {
      question: "What are Stable Audio 3 credits?",
      answer:
        "Credits are the unit used for Stable Audio 3 audio generation. When you generate audio, credits are deducted based on the selected mode, duration, and settings. The pricing cards show practical short-clip equivalents so you can compare plans more easily.",
    },
    {
      question: "How many free credits do I get?",
      answer:
        "New users get 100 free credits after signup. Credits are charged at 1 credit per second, so the signup bonus can create about 100 seconds of audio.",
    },
    {
      question: "How many clips can I create with each plan?",
      answer:
        "The exact number depends on duration, mode, and settings. The plan cards use a short-clip equivalent so you can compare at a glance. Inpaint passes on small regions cost less than full regenerations.",
    },
    {
      question: "Which Stable Audio 3 plan is best for most users?",
      answer:
        "The 22,000-credit pack is the best starting point for most users because it gives enough credits to test prompts, create variations, and produce several usable clips. The 10,000-credit pack is better for light testing, while the 60,000-credit and 150,000-credit packs fit heavier creative workflows.",
    },
    {
      question: "Why do longer or higher-quality clips use more credits?",
      answer:
        "Longer durations and higher-quality settings require more generation resources, so they use more credits. For early creative exploration, use short test clips first. Once the prompt direction works, increase duration or quality for a more polished output.",
    },
    {
      question: "Can I use Stable Audio 3 audio for marketing or product work?",
      answer:
        "Yes. Stable Audio 3 audio is designed for creative, product, marketing, podcast, video, and game-audio workflows. Your use must still follow the Terms of Service and respect any rights connected to uploaded materials, brands, products, or third-party content.",
    },
    {
      question: "Do I need a subscription to use Stable Audio 3?",
      answer:
        "No. Stable Audio 3 pricing is based on credit packs, so you can choose the amount that fits your workflow. You can start with free credits, then buy more credits when you need additional generations.",
    },
    {
      question: "Do credits expire?",
      answer:
        "No. Stable Audio 3 credits do not expire, so you can use them when your project needs more generations. This makes credit packs flexible for occasional testing, campaign planning, and ongoing creative work.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Refund eligibility depends on the Refund Policy, payment status, and whether credits have already been used. Review the Refund Policy before purchasing, especially if you are buying credits for a specific campaign or time-sensitive project.",
    },
    {
      question: "Does Audio Inpaint cost the same as a full generation?",
      answer:
        "Audio Inpaint cost depends on the size of the region you regenerate. Small inpaint regions are cheaper than full regenerations, which makes inpaint a cost-effective way to fix sections of an existing clip without rerunning the whole thing.",
    },
  ],
} as const;
