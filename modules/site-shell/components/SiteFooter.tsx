import Link from "next/link";
import {
  footerNavigation,
  isNavGroup,
  primaryNavigation,
  seoNavigation,
  type NavLink,
} from "@/project/config/navigation";
import { siteConfig } from "@/project/config/site";

const productLinks: readonly NavLink[] = primaryNavigation.filter(
  (item): item is NavLink => !isNavGroup(item),
);

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">{siteConfig.productName}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{siteConfig.seo.description}</p>
          <p className="mt-4 text-sm text-slate-400">
            Support:{" "}
            <a className="font-semibold text-cyan-200 underline decoration-cyan-400/40 underline-offset-4 transition hover:text-cyan-100" href={`mailto:${siteConfig.supportEmail}`}>
              {siteConfig.supportEmail}
            </a>
          </p>
        </div>
        <div className="grid gap-5 text-sm text-slate-400 md:grid-cols-3">
          {(
            [
              ["Product", productLinks],
              ["Resources", seoNavigation],
              ["Policies", footerNavigation],
            ] as const
          ).map(([title, links]) => (
            <div key={title}>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{title}</p>
              <div className="grid gap-2">
                {links.map((item) => (
                  <Link className="hover:text-white" href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
