import type { PassDesign } from "@/lib/pass";

const generalInfoFields = [
  { key: "organizationName", label: "Organization Name" },
  { key: "description", label: "Description" },
  { key: "logoText", label: "Logo Text" },
] as const;

type GeneralInfoControlsProps = {
  design: Pick<PassDesign, "organizationName" | "description" | "logoText">;
};

export function GeneralInfoControls({ design }: GeneralInfoControlsProps) {
  return (
    <div className="form-stack">
      {generalInfoFields.map((field) => (
        <label className="form-label" key={field.key}>
          <span className="muted-label">{field.label}</span>
          <input
            className="form-input"
            defaultValue={design[field.key]}
            type="text"
          />
        </label>
      ))}
    </div>
  );
}
