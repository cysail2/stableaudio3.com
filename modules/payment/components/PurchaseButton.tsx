"use client";

import type { ReactNode } from "react";
import { paymentApi, type PaymentProvider } from "@/modules/api/services/payment";
import { paymentConfig, type PricingPlan } from "@/project/config/pricing";
import { useUserInfo } from "@/modules/user/providers/UserProvider";

type PaymentSessionResult = {
  data?: {
    url?: string;
    checkout_url?: string;
    checkoutUrl?: string;
    redirect_url?: string;
  };
  url?: string;
};

const getCheckoutUrl = (result: PaymentSessionResult) =>
  result?.data?.url ||
  result?.data?.checkout_url ||
  result?.data?.checkoutUrl ||
  result?.data?.redirect_url ||
  result?.url;

export function PurchaseButton({
  plan,
  className,
  children,
  provider = paymentConfig.provider,
}: {
  plan: PricingPlan;
  className?: string;
  children: ReactNode;
  provider?: PaymentProvider;
}) {
  const { isSignedIn, openSignIn } = useUserInfo();

  const handleClick = async () => {
    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: "/pricing" });
      return;
    }
    if (!plan.priceId || plan.priceId.startsWith("price_TBD")) {
      window.alert("Checkout is not configured for this plan yet.");
      return;
    }

    localStorage.setItem(
      "selectedPlan",
      JSON.stringify({
        title: plan.title,
        price: plan.price,
        credits: plan.credits,
        features: plan.features,
        timestamp: Date.now(),
      }),
    );
    localStorage.setItem("payment_return_to", "/stable-audio-3");

    const result = await paymentApi.createSession(plan.priceId, provider);
    const checkoutUrl = getCheckoutUrl(result);
    if (!checkoutUrl) throw new Error("Checkout URL missing from payment response");
    window.location.href = checkoutUrl;
  };

  return (
    <button
      className={className}
      onClick={() => {
        void handleClick().catch((error) => {
          window.alert(error instanceof Error ? error.message : "Unable to start checkout");
        });
      }}
      type="button"
    >
      {children}
    </button>
  );
}
