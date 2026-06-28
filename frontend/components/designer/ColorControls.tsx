"use client";

import type { PassDesign } from "@/lib/pass";

type ColorKey = "backgroundColor" | "foregroundColor" | "labelColor";

const colorControls = [
  { key: "backgroundColor", label: "Background" },
  { key: "foregroundColor", label: "Foreground" },
  { key: "labelColor", label: "Labels" },
] as const;

type ColorControlsProps = {
  design: Pick<PassDesign, ColorKey>;
  onChange?: (key: ColorKey, value: string) => void;
};

function colorInputValue(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
}

export function ColorControls({ design, onChange }: ColorControlsProps) {
  return (
    <div className="form-stack">
      {colorControls.map((control) => (
        <label className="form-label" key={control.key}>
          <span className="muted-label">{control.label}</span>
          <span className="color-input-row">
            <input
              className="form-color-input"
              onChange={(event) => onChange?.(control.key, event.target.value)}
              type="color"
              value={colorInputValue(design[control.key])}
            />
            <input
              className="form-input"
              onChange={(event) => onChange?.(control.key, event.target.value)}
              type="text"
              value={design[control.key]}
            />
          </span>
        </label>
      ))}
    </div>
  );
}
