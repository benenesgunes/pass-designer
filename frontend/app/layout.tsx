import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wallet Pass Designer",
  description: "Design and prepare Apple Wallet pass data.",
};

const themeInitScript = `
(function () {
  try {
    var storedTheme = window.localStorage.getItem("wallet-pass-theme");
    var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : systemTheme;
    document.documentElement.dataset.theme = theme;
  } catch (_) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
