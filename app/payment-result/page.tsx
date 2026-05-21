import { Suspense } from "react";
import { PaymentResultPage } from "@/modules/payment/routes/PaymentResultPage";
import { privatePageMetadata } from "@/project/config/pages";

export const metadata = privatePageMetadata;

export default function PaymentResultRoute() {
  return (
    <Suspense fallback={null}>
      <PaymentResultPage />
    </Suspense>
  );
}
