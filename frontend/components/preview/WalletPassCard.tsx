import type { CSSProperties } from "react";
import type { PassBarcode, PassDesign, PassField, PassType } from "@/lib/pass";

type WalletPassCardProps = {
  passData: PassDesign;
  variant: PassType;
};

const passTypeLabels: Record<PassType, string> = {
  generic: "Generic",
  coupon: "Coupon",
  eventTicket: "Event",
  storeCard: "Store",
};

const passTypeClasses: Record<PassType, string> = {
  generic: "wallet-pass-generic",
  coupon: "wallet-pass-coupon",
  eventTicket: "wallet-pass-event-ticket",
  storeCard: "wallet-pass-store-card",
};

const qrPattern = new Set([
  0, 1, 2, 4, 5, 6, 7, 9, 12, 14, 16, 18, 19, 20, 22, 24, 26, 28, 30, 31, 34,
  36, 38, 39, 40, 42, 43, 44, 46, 47, 48,
]);

function safeHexColor(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function visibleFields(fields: PassField[]) {
  return fields.filter((field) => field.label || field.value);
}

function FieldGroup({
  fields,
  title,
  variant = "standard",
}: {
  fields: PassField[];
  title: string;
  variant?: "primary" | "standard";
}) {
  const visible = visibleFields(fields);

  if (visible.length === 0) {
    return (
      <section className={`wallet-field-group wallet-field-group-${variant}`}>
        <p className="wallet-group-title">{title}</p>
        <p className="wallet-empty-field">No {title.toLowerCase()} fields</p>
      </section>
    );
  }

  return (
    <section className={`wallet-field-group wallet-field-group-${variant}`}>
      <p className="wallet-group-title">{title}</p>
      <div className="wallet-field-grid">
        {visible.map((field, index) => (
          <div className="wallet-field" key={`${field.key}-${index}`}>
            <p className="wallet-field-label">{field.label || field.key}</p>
            <p className="wallet-field-value">{field.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BarcodePreview({ barcode }: { barcode: PassBarcode }) {
  const barcodeText = barcode.altText || barcode.message;

  return (
    <section className="wallet-barcode-section">
      {barcode.enabled ? (
        <>
          {barcode.format === "PKBarcodeFormatCode128" ? (
            <div aria-hidden className="wallet-code-preview" />
          ) : (
            <div aria-hidden className="wallet-qr-preview">
              {Array.from({ length: 49 }, (_, index) => (
                <span
                  className={qrPattern.has(index) ? "wallet-qr-cell-active" : ""}
                  key={index}
                />
              ))}
            </div>
          )}
          <p className="wallet-barcode-text">{barcodeText}</p>
        </>
      ) : (
        <p className="wallet-barcode-text">Barcode disabled</p>
      )}
    </section>
  );
}

export function WalletPassCard({ passData, variant }: WalletPassCardProps) {
  const cardStyle = {
    "--pass-bg": safeHexColor(passData.backgroundColor, "#1f2937"),
    "--pass-fg": safeHexColor(passData.foregroundColor, "#ffffff"),
    "--pass-label": safeHexColor(passData.labelColor, "#d1d5db"),
  } as CSSProperties;

  return (
    <article
      className={`wallet-pass-card ${passTypeClasses[variant]}`}
      style={cardStyle}
    >
      <header className="wallet-pass-header">
        <div>
          <p className="wallet-logo-text">{passData.logoText}</p>
          <p className="wallet-organization">{passData.organizationName}</p>
        </div>
        <span className="wallet-pass-type-pill">{passTypeLabels[variant]}</span>
      </header>

      {variant === "coupon" ? (
        <section className="wallet-offer-band">
          <p>{passData.description}</p>
        </section>
      ) : null}

      {variant === "eventTicket" ? <div className="wallet-ticket-rule" /> : null}

      {variant === "storeCard" ? (
        <section className="wallet-store-strip">
          <p>{passData.description}</p>
        </section>
      ) : null}

      <div className="wallet-pass-content">
        <FieldGroup
          fields={passData.primaryFields}
          title="Primary"
          variant="primary"
        />
        <FieldGroup fields={passData.secondaryFields} title="Secondary" />
        <FieldGroup fields={passData.auxiliaryFields} title="Auxiliary" />
      </div>

      <BarcodePreview barcode={passData.barcode} />
    </article>
  );
}
