type FAQItem = {
  question: string;
  answer: string;
};

export function StableAudioFAQ({
  items,
  title = "Questions About Stable Audio 3 AI Audio Generator",
}: {
  items: readonly FAQItem[];
  title?: string;
}) {
  return (
    <div>
      <div className="section-heading">
        <p className="eyebrow">FAQ</p>
        <h2>{title}</h2>
      </div>
      <div className="mx-auto grid max-w-4xl gap-4">
        {items.map((item) => (
          <details className="surface-card tool-faq-item group" key={item.question}>
            <summary className="cursor-pointer list-none text-base font-semibold text-slate-900 flex items-center justify-between gap-4">
              {item.question}
              <span className="tool-faq-chevron">▼</span>
            </summary>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
