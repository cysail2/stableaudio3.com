import { getPolicyMarkdown, type PolicySlug } from "@/modules/policy/services/policy";

export function PolicyPage({ slug }: { slug: PolicySlug }) {
  const markdown = getPolicyMarkdown(slug);
  const lines = markdown.split(/\r?\n/).filter(Boolean);

  return (
    <main>
      <article className="section max-w-4xl">
        <div className="surface-card">
          {lines.map((line, index) => {
            const key = `${index}-${line}`;
            if (line.startsWith("# ")) {
              return <h1 className="mb-6 text-4xl font-semibold text-white" key={key}>{line.slice(2)}</h1>;
            }
            if (line.startsWith("## ")) {
              return <h2 className="mt-8 text-2xl font-semibold text-white" key={key}>{line.slice(3)}</h2>;
            }
            if (line.startsWith("- ")) {
              return <p className="ml-4 text-slate-300" key={key}>• {line.slice(2)}</p>;
            }
            return <p className="mt-4 leading-8 text-slate-300" key={key}>{line}</p>;
          })}
        </div>
      </article>
    </main>
  );
}
