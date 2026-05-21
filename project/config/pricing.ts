export type PricingPlan = {
  key: string;
  priceId: string;
  title: string;
  price: string;
  priceAmount: number;
  credits: number;
  creditsText: string;
  pricePerCredit: string;
  featured?: boolean;
  features: string[];
};

export const paymentConfig = {
  provider: "stripe",
} as const;

export const pricingPlans: PricingPlan[] = [
  {
    key: "credits-10000",
    priceId: "price_1TZQ2UBBWIcC1Fv9o7j3A1Qn",
    title: "10,000 Credits",
    price: "$9.90",
    priceAmount: 9.9,
    credits: 10000,
    creditsText: "Up to 10,000 seconds of audio",
    pricePerCredit: "$0.00099 / credit",
    features: ["10,000 credits", "About 41 four-minute clips", "All Stable Audio 3 modes"],
  },
  {
    key: "credits-22000",
    priceId: "price_1TZQ2mBBWIcC1Fv90MCm4zu6",
    title: "22,000 Credits",
    price: "$19.90",
    priceAmount: 19.9,
    credits: 22000,
    creditsText: "Up to 22,000 seconds of audio",
    pricePerCredit: "$0.00090 / credit",
    features: ["22,000 credits", "About 91 four-minute clips", "Better unit price for prompt testing"],
  },
  {
    key: "credits-60000",
    priceId: "price_1TZQ2xBBWIcC1Fv93e0YfFWV",
    title: "60,000 Credits",
    price: "$49.90",
    priceAmount: 49.9,
    credits: 60000,
    creditsText: "Up to 60,000 seconds of audio",
    pricePerCredit: "$0.00083 / credit",
    features: ["60,000 credits", "About 250 four-minute clips", "Built for larger creative batches"],
  },
  {
    key: "credits-150000",
    priceId: "price_1TZQ39BBWIcC1Fv9iv4VzYbV",
    title: "150,000 Credits",
    price: "$99.90",
    priceAmount: 99.9,
    credits: 150000,
    creditsText: "Up to 150,000 seconds of audio",
    pricePerCredit: "$0.00067 / credit",
    features: ["150,000 credits", "About 625 four-minute clips", "Lowest unit price"],
  },
];

export const generatorCreditRules = {
  signupCredits: 100,
  audioCostPerSecond: 1,
  defaultAudioDurationSeconds: 40,
  maxAudioDurationSeconds: 240,
} as const;
