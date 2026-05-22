import { pricingPlans } from "@/project/config/pricing";
import { PurchaseButton } from "@/modules/payment/components/PurchaseButton";

/**
 * Pricing cards — clean SaaS layout, single visual anchor on the featured plan.
 *
 * Design rules applied:
 * - One color, one weight: price is the only huge slate-900 number. No purple price.
 * - No repeated "credits" label — the credit count lives in its own subtle card.
 * - Features use a small violet check icon (✓) instead of a redundant "Included" word.
 * - Featured plan: violet 2px border + "Most Popular" badge + violet CTA, slightly
 *   raised. Other plans: plain slate-200 border + dark CTA. Avoids the "all four cards
 *   shouting equally loud" problem.
 */
export function PricingCards() {
  return (
    <div className="grid items-stretch gap-5 pt-4 md:grid-cols-2 lg:grid-cols-4">
      {pricingPlans.map((plan) => {
        const planNameClean = plan.title.replace(" Credits", "").trim();
        return (
          <article
            className={`relative flex flex-col rounded-2xl bg-white p-5 sm:p-7 transition ${
              plan.featured
                ? "border-2 border-violet-500 shadow-xl shadow-violet-500/15 lg:-translate-y-3"
                : "border border-slate-200 shadow-sm hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            }`}
            key={plan.key}
          >
            {plan.featured ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-md shadow-violet-500/30">
                Most Popular
              </span>
            ) : null}

            {/* Plan name — small uppercase eyebrow, not a heading. */}
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {planNameClean}
            </p>

            {/* Price — single visual anchor, slate-900 black not purple. */}
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-5xl font-bold tracking-tight text-slate-900">{plan.price}</span>
              <span className="text-sm text-slate-500">one-time</span>
            </div>
            <p className="mt-1.5 font-mono text-xs text-slate-500">{plan.pricePerCredit}</p>

            {/* Credits highlight — subtle bg, not yet another big purple number. */}
            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-2xl font-bold leading-none text-slate-900">
                {plan.credits.toLocaleString()}
                <span className="ml-1.5 text-sm font-normal text-slate-500">credits</span>
              </p>
              <p className="mt-1.5 text-xs text-slate-500">{plan.creditsText}</p>
            </div>

            {/* Features — check icon, no "Included" word prefix. */}
            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li className="flex items-start gap-2.5 text-sm leading-6 text-slate-700" key={feature}>
                  <svg
                    aria-hidden="true"
                    className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-violet-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA — featured gets violet, others get dark slate (Stripe pattern). */}
            <PurchaseButton
              className={`mt-7 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                plan.featured
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/25"
                  : "bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800"
              }`}
              plan={plan}
            >
              Get Started
            </PurchaseButton>
          </article>
        );
      })}
    </div>
  );
}
