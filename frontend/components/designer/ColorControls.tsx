import type { PassDesign } from "@/lib/pass";

const colorControls = [
  { key: "backgroundColor", label: "Background" },
  { key: "foregroundColor", label: "Foreground" },
  { key: "labelColor", label: "Labels" },
] as const;

type ColorControlsProps = {
  design: Pick<
    PassDesign,
    "backgroundColor" | "foregroundColor" | "labelColor"
  >;
};

export function ColorControls({ design }: ColorControlsProps) {
  return (
    <div className="form-stack">
      {colorControls.map((control) => (
        <label className="form-label" key={control.key}>
          <span className="muted-label">{control.label}</span>
          <span className="grid grid-cols-[44px_1fr] gap-3">
            <input
              className="form-color-input"
              defaultValue={design[control.key]}
              type="color"
            />
            <input
              className="form-input"
              defaultValue={design[control.key]}
              type="text"
            />
          </span>
        </label>
      ))}
    </div>
  );
}
