import { pricingPlans } from "@/project/config/pricing";
import { PurchaseButton } from "@/modules/payment/components/PurchaseButton";

export function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {pricingPlans.map((plan) => (
        <article
          className={`surface-card relative ${plan.featured ? "border-cyan-300/70 bg-cyan-300/10" : ""}`}
          key={plan.key}
        >
          {plan.featured ? (
            <span className="absolute right-5 top-5 rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold text-slate-950">
              Recommended
            </span>
          ) : null}
          <h3>{plan.title}</h3>
          <p className="mt-4 !text-4xl font-semibold !text-cyan-300">{plan.price}</p>
          <p className="mt-2 text-sm !text-sky-300">{plan.pricePerCredit}</p>
          <div className="my-6 rounded-2xl bg-slate-950/70 p-4">
            <p className="!text-2xl font-semibold !text-cyan-200">{plan.credits.toLocaleString()} credits</p>
            <p className="mt-1 text-sm !text-slate-300">{plan.creditsText}</p>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            {plan.features.map((feature) => (
              <li key={feature}>
                <span className="mr-2 font-bold text-cyan-200">Included</span>
                {feature}
              </li>
            ))}
          </ul>
          <PurchaseButton
            className={plan.featured ? "button-primary mt-8 w-full" : "button-secondary mt-8 w-full"}
            plan={plan}
          >
            Buy {plan.title}
          </PurchaseButton>
        </article>
      ))}
    </div>
  );
}
