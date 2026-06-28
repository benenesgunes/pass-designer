"use client";

import type { PassDesign } from "@/lib/pass";

type GeneralInfoKey = "organizationName" | "description" | "logoText";

const generalInfoFields = [
  { key: "organizationName", label: "Organization Name" },
  { key: "description", label: "Description" },
  { key: "logoText", label: "Logo Text" },
] as const;

type GeneralInfoControlsProps = {
  design: Pick<PassDesign, GeneralInfoKey>;
  onChange?: (key: GeneralInfoKey, value: string) => void;
};

export function GeneralInfoControls({
  design,
  onChange,
}: GeneralInfoControlsProps) {
  return (
    <div className="form-stack">
      {generalInfoFields.map((field) => (
        <label className="form-label" key={field.key}>
          <span className="muted-label">{field.label}</span>
          <input
            className="form-input"
            onChange={(event) => onChange?.(field.key, event.target.value)}
            type="text"
            value={design[field.key]}
          />
        </label>
      ))}
    </div>
  );
}
