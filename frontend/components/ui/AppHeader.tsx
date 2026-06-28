import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/designer", label: "Designer" },
  { href: "/components", label: "Components" },
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
              className="site-nav-link"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
