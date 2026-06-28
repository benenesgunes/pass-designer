import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { className: "site-nav-link hidden sm:inline", href: "/", label: "Home" },
  { className: "site-nav-link", href: "/designer", label: "Designer" },
  { className: "site-nav-link", href: "/components", label: "Components" },
];

export function AppHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link className="site-brand" href="/">
          Wallet Pass Designer
        </Link>
        <div className="site-nav-list">
          {navItems.map((item) => (
            <Link
              className={item.className}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
