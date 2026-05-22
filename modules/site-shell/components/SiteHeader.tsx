import Link from "next/link";
import { isNavGroup, primaryNavigation, type NavGroup, type NavLink } from "@/project/config/navigation";
import { siteConfig } from "@/project/config/site";
import { AuthButton } from "@/modules/user/components/AuthButton";
import { SiteLogo } from "./SiteLogo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Left cluster: logo immediately followed by nav links — keeps the
            page-header rhythm tight and contrasts with hero centered copy. */}
        <div className="flex items-center gap-10">
          <Link className="flex items-center gap-3" href="/" title="Stable Audio 3 home">
            <SiteLogo className="rounded-xl" size={40} variant="color" />
            <span className="text-lg font-semibold text-slate-900">{siteConfig.name}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            {primaryNavigation.map((item) =>
              isNavGroup(item) ? (
                <NavGroupTrigger group={item} key={item.label} />
              ) : (
                <Link className="transition hover:text-slate-900" href={item.href} key={item.href} title={item.title}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
        <AuthButton />
      </div>
    </header>
  );
}

function NavGroupTrigger({ group }: { group: NavGroup }) {
  return (
    <div className="group relative">
      <button
        aria-haspopup="menu"
        className="flex cursor-default items-center gap-1 text-slate-600 transition hover:text-slate-900 group-hover:text-slate-900 group-focus-within:text-slate-900"
        title={group.title}
        type="button"
      >
        {group.label}
        <svg
          aria-hidden="true"
          className="h-3 w-3 transition group-hover:rotate-180 group-focus-within:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
          viewBox="0 0 12 12"
        >
          <path d="m3 4.5 3 3 3-3" />
        </svg>
      </button>
      <div
        className="invisible absolute left-1/2 top-full z-50 min-w-[220px] -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        role="menu"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl backdrop-blur-xl">
          {group.children.map((child) => (
            <NavGroupItem child={child} key={child.href} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NavGroupItem({ child }: { child: NavLink }) {
  return (
    <Link
      className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:bg-slate-100 focus-visible:text-slate-900 focus-visible:outline-none"
      href={child.href}
      role="menuitem"
      title={child.title}
    >
      {child.label}
    </Link>
  );
}
