"use client";

import { useSearchParams } from "next/navigation";

export function PaymentResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";
  const isSuccess = status === "success";

  return (
    <main className="section">
      <div className="section-heading">
        <p className="eyebrow">Payment</p>
        <h1>{isSuccess ? "Payment Successful" : "Payment Result"}</h1>
        <p>
          {isSuccess
            ? "Your Stable Audio 3 payment was completed. Credits may take a short moment to appear in your account."
            : "We could not confirm a completed payment from the current checkout result."}
        </p>
      </div>
      <div className="mx-auto max-w-2xl surface-card text-center">
        <a
          className="button-primary"
          href={isSuccess ? "/stable-audio-3" : "/pricing"}
          title={isSuccess ? "Open the Stable Audio 3 AI audio generator" : "Compare Stable Audio 3 pricing"}
        >
          {isSuccess ? "Create Audio" : "Back to Pricing"}
        </a>
      </div>
    </main>
  );
}
