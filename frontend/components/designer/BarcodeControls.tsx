import { BARCODE_FORMATS, type PassBarcode } from "@/lib/pass";

type BarcodeControlsProps = {
  barcode: PassBarcode;
};

export function BarcodeControls({ barcode }: BarcodeControlsProps) {
  return (
    <div className="form-stack text-sm">
      <label className="toggle-card">
        <span>Enable Barcode</span>
        <input
          className="checkbox-input"
          defaultChecked={barcode.enabled}
          type="checkbox"
        />
      </label>

      <label className="form-label">
        <span className="muted-label">Format</span>
        <select
          className="form-select"
          defaultValue={barcode.format}
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
          defaultValue={barcode.message}
          type="text"
        />
      </label>

      <label className="form-label">
        <span className="muted-label">Alternative Text</span>
        <input
          className="form-input"
          defaultValue={barcode.altText}
          type="text"
        />
      </label>
    </div>
  );
}
