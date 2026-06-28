import type { PassField } from "@/lib/pass";

type FieldEditorProps = {
  title: string;
  fields: PassField[];
  maxFields: number;
};

const emptyField: PassField = {
  key: "",
  label: "",
  value: "",
};

export function FieldEditor({ title, fields, maxFields }: FieldEditorProps) {
  const rows = fields.length > 0 ? fields : [emptyField];

  return (
    <div className="form-stack">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="small-title">{title}</h3>
        <span className="muted-caption">Max {maxFields}</span>
      </div>
      <div className="grid gap-2">
        {rows.map((field, index) => (
          <div
            className="grid grid-cols-[0.85fr_0.9fr_1.1fr] gap-2"
            key={`${title}-${field.key || index}`}
          >
            <input
              aria-label={`${title} key ${index + 1}`}
              className="form-input-sm"
              defaultValue={field.key}
              placeholder="key"
              type="text"
            />
            <input
              aria-label={`${title} label ${index + 1}`}
              className="form-input-sm"
              defaultValue={field.label}
              placeholder="label"
              type="text"
            />
            <input
              aria-label={`${title} value ${index + 1}`}
              className="form-input-sm"
              defaultValue={field.value}
              placeholder="value"
              type="text"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
