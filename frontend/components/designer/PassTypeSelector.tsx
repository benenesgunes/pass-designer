"use client";

import { PASS_TYPES, type PassType } from "@/lib/pass";

const passTypeLabels: Record<PassType, string> = {
  boardingPass: "Boarding",
  generic: "Generic",
  posterGeneric: "Poster Generic",
  coupon: "Coupon",
  eventTicket: "Event",
  storeCard: "Store",
};

const passTypeDescriptions: Record<PassType, string> = {
  boardingPass: "Travel layout with origin, destination, footer, and barcode.",
  generic: "A flexible card for simple records.",
  posterGeneric: "A visual generic pass with a poster-style image area.",
  coupon: "Offer-focused fields and redemption details.",
  eventTicket: "Date, venue, and admission details.",
  storeCard: "Membership and loyalty pass structure.",
};

type PassTypeSelectorProps = {
  onChange?: (value: PassType) => void;
  value: PassType;
};

export function PassTypeSelector({ onChange, value }: PassTypeSelectorProps) {
  return (
    <div className="grid gap-2">
      {PASS_TYPES.map((passType) => (
        <label
          className="choice-card"
          key={passType}
        >
          <input
            className="radio-input"
            checked={passType === value}
            name="passType"
            onChange={() => onChange?.(passType)}
            type="radio"
            value={passType}
          />
          <span className="grid gap-1">
            <span className="small-title">{passTypeLabels[passType]}</span>
            <span className="choice-copy">
              {passTypeDescriptions[passType]}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
