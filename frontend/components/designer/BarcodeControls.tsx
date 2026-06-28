"use client";

import { BARCODE_FORMATS, type PassBarcode } from "@/lib/pass";

type BarcodeControlsProps = {
  barcode: PassBarcode;
  onChange?: (barcode: PassBarcode) => void;
};

export function BarcodeControls({ barcode, onChange }: BarcodeControlsProps) {
  return (
    <div className="form-stack text-sm">
      <label className="toggle-card">
        <span>Enable Barcode</span>
        <input
          checked={barcode.enabled}
          className="checkbox-input"
          onChange={(event) =>
            onChange?.({ ...barcode, enabled: event.target.checked })
          }
          type="checkbox"
        />
      </label>

      <label className="form-label">
        <span className="muted-label">Format</span>
        <select
          className="form-select"
          onChange={(event) =>
            onChange?.({
              ...barcode,
              format: event.target.value as PassBarcode["format"],
            })
          }
          value={barcode.format}
        >
          {BARCODE_FORMATS.map((format) => (
            <option key={format} value={format}>
              {format.replace("PKBarcodeFormat", "")}
            </option>
          ))}
        </select>
      </label>

      <label className="form-label">
        <span className="muted-label">Message</span>
        <input
          className="form-input"
          onChange={(event) =>
            onChange?.({ ...barcode, message: event.target.value })
          }
          type="text"
          value={barcode.message}
        />
      </label>

      <label className="form-label">
        <span className="muted-label">Alternative Text</span>
        <input
          className="form-input"
          onChange={(event) =>
            onChange?.({ ...barcode, altText: event.target.value })
          }
          type="text"
          value={barcode.altText ?? ""}
        />
      </label>
    </div>
  );
}
