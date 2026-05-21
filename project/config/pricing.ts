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
    key: "starter",
    priceId: "price_1TWoEmDJTbYYRvdPucthg6Et",
    title: "Starter",
    price: "$9.90",
    priceAmount: 9.9,
    credits: 300,
    creditsText: "About 6 five-second 720P videos",
    pricePerCredit: "$0.033 / credit",
    features: ["300 credits", "Text to Video", "Image to Video", "Standard generation queue"],
  },
  {
    key: "creator",
    priceId: "price_1TWoF0DJTbYYRvdP96fzESeZ",
    title: "Creator",
    price: "$29.90",
    priceAmount: 29.9,
    credits: 1200,
    creditsText: "About 24 five-second 720P videos",
    pricePerCredit: "$0.025 / credit",
    featured: true,
    features: ["1,200 credits", "Text to Video", "Image to Video", "Best value for regular creators"],
  },
  {
    key: "pro",
    priceId: "price_1TWoFHDJTbYYRvdPeHmQfpXg",
    title: "Pro",
    price: "$49.90",
    priceAmount: 49.9,
    credits: 2200,
    creditsText: "About 44 five-second 720P videos",
    pricePerCredit: "$0.023 / credit",
    features: ["2,200 credits", "Text to Video", "Image to Video", "Built for campaign batches"],
  },
  {
    key: "business",
    priceId: "price_1TWoFTDJTbYYRvdPFfs8ff7c",
    title: "Business",
    price: "$99.90",
    priceAmount: 99.9,
    credits: 5000,
    creditsText: "About 100 five-second 720P videos",
    pricePerCredit: "$0.020 / credit",
    features: ["5,000 credits", "Text to Video", "Image to Video", "Best unit price"],
  },
];

export const generatorCreditRules = {
  signupCredits: 50,
  fiveSecond720pCost: 50,
  fiveSecond1080pCost: 75,
  costPerSecond720p: 10,
  costPerSecond1080p: 15,
} as const;
