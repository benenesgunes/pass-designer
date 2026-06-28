"use client";

import type { PassField } from "@/lib/pass";
import { Trash, Plus } from "lucide-react";

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

function createEmptyField(): PassField {
  return {
    key: "",
    label: "",
    value: "",
  };
}

export function FieldEditor({
  title,
  fields,
  maxFields,
  onChange,
}: FieldEditorProps) {
  const rows = fields.length > 0 ? fields : [emptyField];
  const fieldCount = Math.min(fields.length, maxFields);
  const canAddField = Boolean(onChange) && fieldCount > 0 && rows.length < maxFields;

  function emitRows(nextRows: PassField[]) {
    onChange?.(nextRows.slice(0, maxFields));
  }

  function updateField(index: number, key: FieldKey, value: string) {
    const nextFields = rows.map((field, fieldIndex) =>
      fieldIndex === index
        ? {
            ...field,
            [key]: value,
          }
        : field,
    );

    emitRows(nextFields);
  }

  function addField() {
    if (!canAddField) {
      return;
    }

    emitRows([...rows, createEmptyField()]);
  }

  function removeField(index: number) {
    emitRows(rows.filter((_, fieldIndex) => fieldIndex !== index));
  }

  return (
    <div className="form-stack">
      <div className="field-editor-header">
        <h3 className="small-title">{title}</h3>
        <div className="field-editor-controls">
          <span className="muted-caption">
            {fieldCount}/{maxFields}
          </span>
          {maxFields > 1 ? (
            <button
              aria-label={`Add ${title}`}
              className="field-add-button"
              disabled={!canAddField}
              onClick={addField}
              title={`Add ${title}`}
              type="button"
            >
              <span aria-hidden>
                <Plus size={14} />
              </span>
              <span>Add</span>
            </button>
          ) : null}
        </div>
      </div>
      <div className="grid gap-2">
        {rows.map((field, index) => (
          <div
            className="field-editor-row-with-action"
            key={`${title}-${index}`}
          >
            <div className="field-editor-row">
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
            <button
              aria-label={`Remove ${title} ${index + 1}`}
              className="field-remove-button"
              disabled={!onChange}
              onClick={() => removeField(index)}
              title={`Remove ${title} ${index + 1}`}
              type="button"
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
