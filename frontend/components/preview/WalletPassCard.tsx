import type { CSSProperties, ReactNode } from "react";
import type { PassBarcode, PassDesign, PassField, PassType } from "@/lib/pass";
import { Plane } from "lucide-react";

type WalletPassCardProps = {
  passData: PassDesign;
  variant: PassType;
};

const passTypeClasses: Record<PassType, string> = {
  boardingPass: "wallet-pass-boarding",
  generic: "wallet-pass-generic",
  posterGeneric: "wallet-pass-poster-generic",
  coupon: "wallet-pass-coupon",
  eventTicket: "wallet-pass-event-ticket",
  storeCard: "wallet-pass-store-card",
};

const qrPattern = new Set([
  0, 1, 2, 4, 5, 6, 7, 9, 12, 14, 16, 18, 19, 20, 22, 24, 26, 28, 30, 31, 34,
  36, 38, 39, 40, 42, 43, 44, 46, 47, 48,
]);

const fallbackPrimary: Record<PassType, PassField[]> = {
  boardingPass: [
    { key: "from", label: "FROM", value: "SFO" },
    { key: "to", label: "TO", value: "LAX" },
  ],
  generic: [{ key: "name", label: "NAME", value: "Enes" }],
  posterGeneric: [{ key: "member", label: "MEMBER", value: "Enes" }],
  coupon: [{ key: "offer", label: "OFFER", value: "20% Off" }],
  eventTicket: [{ key: "event", label: "EVENT", value: "Design Night" }],
  storeCard: [{ key: "balance", label: "BALANCE", value: "$25.00" }],
};

function safeHexColor(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function visibleFields(fields: PassField[]) {
  return fields.filter((field) => field.label || field.value);
}

function fieldsOrFallback(
  fields: PassField[],
  variant: PassType,
  fallback: PassField[] = fallbackPrimary[variant],
) {
  const visible = visibleFields(fields);

  return visible.length > 0 ? visible : fallback;
}

function HeaderField({ field }: { field?: PassField }) {
  if (!field) {
    return (
      <div className="wallet-header-field">
        <span>TYPE</span>
        <strong>PASS</strong>
      </div>
    );
  }

  return (
    <div className="wallet-header-field">
      <span>{field.label || field.key}</span>
      <strong>{field.value}</strong>
    </div>
  );
}

function PassHeader({
  headerField,
  passData,
}: {
  headerField?: PassField;
  passData: PassDesign;
}) {
  return (
    <header className="wallet-pass-header">
      <div className="wallet-logo-placeholder">Logo</div>
      <div className="wallet-logo-copy">
        <p className="wallet-logo-text">{passData.logoText}</p>
        <p className="wallet-organization">{passData.organizationName}</p>
      </div>
      <HeaderField field={headerField} />
    </header>
  );
}

function ImagePlaceholder({
  className = "",
  label,
}: {
  className?: string;
  label: string;
}) {
  return <div className={`wallet-image-placeholder ${className}`}>{label}</div>;
}

function FieldView({
  className = "",
  field,
}: {
  className?: string;
  field: PassField;
}) {
  return (
    <div className={`wallet-field ${className}`}>
      <p className="wallet-field-label">{field.label || field.key}</p>
      <p className="wallet-field-value">{field.value}</p>
    </div>
  );
}

function FieldGrid({
  className = "",
  fields,
}: {
  className?: string;
  fields: PassField[];
}) {
  const visible = visibleFields(fields);

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className={`wallet-field-grid ${className}`}>
      {visible.map((field, index) => (
        <FieldView field={field} key={`${field.key}-${index}`} />
      ))}
    </div>
  );
}

function BarcodePreview({ barcode }: { barcode: PassBarcode }) {
  const barcodeText = barcode.altText || barcode.message;
  const isRectangular = barcode.format === "PKBarcodeFormatCode128";

  return (
    <section
      className={
        isRectangular
          ? "wallet-barcode-section wallet-barcode-rectangular"
          : "wallet-barcode-section wallet-barcode-square"
      }
    >
      {barcode.enabled ? (
        <>
          {isRectangular ? (
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

function PassFrame({
  children,
  passData,
  variant,
}: {
  children: ReactNode;
  passData: PassDesign;
  variant: PassType;
}) {
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
      {children}
    </article>
  );
}

function BoardingPassLayout({ passData }: { passData: PassDesign }) {
  const primaryFields = fieldsOrFallback(passData.primaryFields, "boardingPass");

  return (
    <PassFrame passData={passData} variant="boardingPass">
      <PassHeader headerField={passData.secondaryFields[0]} passData={passData} />
      <section className="wallet-boarding-route">
        <FieldView className="wallet-route-field" field={primaryFields[0]} />
        <span aria-hidden className="wallet-route-arrow">
          <Plane />
        </span>
        <FieldView
          className="wallet-route-field-to"
          field={primaryFields[1] ?? fallbackPrimary.boardingPass[1]}
        />
      </section>
      <FieldGrid
        className="wallet-auxiliary-row"
        fields={passData.auxiliaryFields}
      />
      <FieldGrid
        className="wallet-secondary-row"
        fields={passData.secondaryFields.slice(1)}
      />
      <ImagePlaceholder className="wallet-footer-placeholder" label="Footer" />
      <BarcodePreview barcode={passData.barcode} />
    </PassFrame>
  );
}

function CouponLayout({ passData }: { passData: PassDesign }) {
  return (
    <PassFrame passData={passData} variant="coupon">
      <PassHeader headerField={passData.secondaryFields[0]} passData={passData} />
      <section className="wallet-strip-section">
        <ImagePlaceholder className="wallet-strip-placeholder" label="Strip" />
        <div className="wallet-strip-fields">
          {fieldsOrFallback(passData.primaryFields, "coupon").map((field, index) => (
            <FieldView
              className="wallet-primary-strip-field"
              field={field}
              key={`${field.key}-${index}`}
            />
          ))}
        </div>
      </section>
      <FieldGrid
        className="wallet-combined-row"
        fields={[...passData.secondaryFields.slice(1), ...passData.auxiliaryFields]}
      />
      <BarcodePreview barcode={passData.barcode} />
    </PassFrame>
  );
}

function EventTicketLayout({ passData }: { passData: PassDesign }) {
  const primaryField = fieldsOrFallback(passData.primaryFields, "eventTicket")[0];

  return (
    <PassFrame passData={passData} variant="eventTicket">
      <PassHeader headerField={passData.secondaryFields[0]} passData={passData} />
      <section className="wallet-event-hero">
        <ImagePlaceholder
          className="wallet-background-placeholder"
          label="Background"
        />
        <ImagePlaceholder
          className="wallet-thumbnail-placeholder"
          label="Thumbnail"
        />
        <FieldView className="wallet-event-primary" field={primaryField} />
      </section>
      <FieldGrid className="wallet-secondary-row" fields={passData.secondaryFields} />
      <FieldGrid className="wallet-auxiliary-row" fields={passData.auxiliaryFields} />
      <BarcodePreview barcode={passData.barcode} />
    </PassFrame>
  );
}

function GenericLayout({
  passData,
  variant,
}: {
  passData: PassDesign;
  variant: "generic" | "posterGeneric";
}) {
  const primaryField = fieldsOrFallback(passData.primaryFields, variant)[0];

  return (
    <PassFrame passData={passData} variant={variant}>
      <PassHeader headerField={passData.secondaryFields[0]} passData={passData} />
      {variant === "posterGeneric" ? (
        <ImagePlaceholder className="wallet-poster-placeholder" label="Poster" />
      ) : null}
      <section className="wallet-generic-primary">
        <FieldView className="wallet-generic-primary-field" field={primaryField} />
        <ImagePlaceholder
          className="wallet-thumbnail-placeholder"
          label="Thumbnail"
        />
      </section>
      <FieldGrid
        className="wallet-combined-row"
        fields={[...passData.secondaryFields.slice(1), ...passData.auxiliaryFields]}
      />
      <BarcodePreview barcode={passData.barcode} />
    </PassFrame>
  );
}

function StoreCardLayout({ passData }: { passData: PassDesign }) {
  const primaryField = fieldsOrFallback(passData.primaryFields, "storeCard")[0];

  return (
    <PassFrame passData={passData} variant="storeCard">
      <PassHeader headerField={passData.secondaryFields[0]} passData={passData} />
      <section className="wallet-strip-section">
        <ImagePlaceholder className="wallet-strip-placeholder" label="Strip" />
        <FieldView className="wallet-store-primary" field={primaryField} />
      </section>
      <FieldGrid
        className="wallet-combined-row"
        fields={[...passData.secondaryFields.slice(1), ...passData.auxiliaryFields]}
      />
      <BarcodePreview barcode={passData.barcode} />
    </PassFrame>
  );
}

export function WalletPassCard({ passData, variant }: WalletPassCardProps) {
  if (variant === "boardingPass") {
    return <BoardingPassLayout passData={passData} />;
  }

  if (variant === "coupon") {
    return <CouponLayout passData={passData} />;
  }

  if (variant === "eventTicket") {
    return <EventTicketLayout passData={passData} />;
  }

  if (variant === "storeCard") {
    return <StoreCardLayout passData={passData} />;
  }

  return <GenericLayout passData={passData} variant={variant} />;
}
