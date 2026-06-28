"use client";

import { PASS_TYPES, type PassType } from "@/lib/pass";

const passTypeLabels: Record<PassType, string> = {
  boardingPass: "Boarding",
  generic: "Generic",
  coupon: "Coupon",
  eventTicketStrip: "Event (with a strip image)",
  eventTicketBackground: "Event (with a background image)",
  storeCard: "Store",
};

const passTypeDescriptions: Record<PassType, string> = {
  boardingPass: "Travel layout with origin, destination, footer, and barcode.",
  generic: "A flexible card for simple records.",
  coupon: "Offer-focused fields and redemption details.",
  eventTicketStrip: "Uses a strip image and excludes background and thumbnail images.",
  eventTicketBackground: "Uses a full pass background image and can include a thumbnail.",
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
