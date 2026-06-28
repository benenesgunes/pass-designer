import { PASS_TYPES, type PassType } from "@/lib/pass";

const passTypeLabels: Record<PassType, string> = {
  generic: "Generic",
  coupon: "Coupon",
  eventTicket: "Event",
  storeCard: "Store",
};

const passTypeDescriptions: Record<PassType, string> = {
  generic: "A flexible card for simple records.",
  coupon: "Offer-focused fields and redemption details.",
  eventTicket: "Date, venue, and admission details.",
  storeCard: "Membership and loyalty pass structure.",
};

type PassTypeSelectorProps = {
  value: PassType;
};

export function PassTypeSelector({ value }: PassTypeSelectorProps) {
  return (
    <div className="grid gap-2">
      {PASS_TYPES.map((passType) => (
        <label
          className="choice-card"
          key={passType}
        >
          <input
            className="radio-input"
            defaultChecked={passType === value}
            name="passType"
            type="radio"
            value={passType}
          />
          <span className="grid gap-1">
            <span className="small-title">{passTypeLabels[passType]}</span>
            <span className="muted-caption leading-5">
              {passTypeDescriptions[passType]}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
