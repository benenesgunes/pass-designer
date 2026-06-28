import type { ReactNode } from "react";

type PanelSectionProps = {
  title: string;
  children: ReactNode;
};

export function PanelSection({ title, children }: PanelSectionProps) {
  return (
    <section className="panel-section">
      <h2 className="panel-title">{title}</h2>
      {children}
    </section>
  );
}
