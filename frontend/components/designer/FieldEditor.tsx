"use client";

import type { PassField } from "@/lib/pass";

type FieldEditorProps = {
  title: string;
  fields: PassField[];
  maxFields: number;
  onChange?: (fields: PassField[]) => void;
};

const emptyField: PassField = {
  key: "",
  label: "",
  value: "",
};

type FieldKey = keyof PassField;

function hasFieldContent(field: PassField) {
  return Boolean(field.key || field.label || field.value);
}

export function FieldEditor({
  title,
  fields,
  maxFields,
  onChange,
}: FieldEditorProps) {
  const rows = fields.length > 0 ? fields : [emptyField];

  function updateField(index: number, key: FieldKey, value: string) {
    const nextFields = rows.map((field, fieldIndex) =>
      fieldIndex === index
        ? {
            ...field,
            [key]: value,
          }
        : field,
    );

    onChange?.(nextFields.filter(hasFieldContent));
  }

  return (
    <div className="form-stack">
      <div className="field-editor-header">
        <h3 className="small-title">{title}</h3>
        <span className="muted-caption">Max {maxFields}</span>
      </div>
      <div className="grid gap-2">
        {rows.map((field, index) => (
          <div
            className="field-editor-row"
            key={`${title}-${index}`}
          >
            <input
              aria-label={`${title} key ${index + 1}`}
              className="form-input-sm"
              onChange={(event) =>
                updateField(index, "key", event.target.value)
              }
              placeholder="key"
              type="text"
              value={field.key}
            />
            <input
              aria-label={`${title} label ${index + 1}`}
              className="form-input-sm"
              onChange={(event) =>
                updateField(index, "label", event.target.value)
              }
              placeholder="label"
              type="text"
              value={field.label}
            />
            <input
              aria-label={`${title} value ${index + 1}`}
              className="form-input-sm"
              onChange={(event) =>
                updateField(index, "value", event.target.value)
              }
              placeholder="value"
              type="text"
              value={field.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
