import Image from "next/image";
import Link from "next/link";
import { isNavGroup, primaryNavigation, type NavGroup, type NavLink } from "@/project/config/navigation";
import { siteConfig } from "@/project/config/site";
import { AuthButton } from "@/modules/user/components/AuthButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/86 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <Image
            alt={`${siteConfig.name} logo`}
            className="h-10 w-10 rounded-xl"
            height={40}
            priority
            src="/logo.webp"
            width={40}
          />
          <span className="text-lg font-semibold text-white">{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {primaryNavigation.map((item) =>
            isNavGroup(item) ? (
              <NavGroupTrigger group={item} key={item.label} />
            ) : (
              <Link className="transition hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
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
        className="flex cursor-default items-center gap-1 text-slate-300 transition hover:text-white group-hover:text-white group-focus-within:text-white"
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
        <div className="rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl">
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
      className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:bg-white/5 focus-visible:text-white focus-visible:outline-none"
      href={child.href}
      role="menuitem"
    >
      {child.label}
    </Link>
  );
}
