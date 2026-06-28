export const PASS_TYPES = [
  "boardingPass",
  "generic",
  "posterGeneric",
  "coupon",
  "eventTicket",
  "storeCard",
] as const;

export type PassType = (typeof PASS_TYPES)[number];

export const BARCODE_FORMATS = [
  "PKBarcodeFormatQR",
  "PKBarcodeFormatCode128",
] as const;

export type BarcodeFormat = (typeof BARCODE_FORMATS)[number];

export const PASS_FIELD_LIMITS = {
  primaryFields: 1,
  secondaryFields: 2,
  auxiliaryFields: 4,
  backFields: 5,
} as const;

export type PassFieldLimits = {
  primaryFields: number;
  secondaryFields: number;
  auxiliaryFields: number;
  backFields: number;
};

export const PASS_FIELD_LIMITS_BY_TYPE: Record<PassType, PassFieldLimits> = {
  boardingPass: {
    primaryFields: 2,
    secondaryFields: 4,
    auxiliaryFields: 5,
    backFields: 5,
  },
  generic: PASS_FIELD_LIMITS,
  posterGeneric: PASS_FIELD_LIMITS,
  coupon: PASS_FIELD_LIMITS,
  eventTicket: {
    primaryFields: 1,
    secondaryFields: 4,
    auxiliaryFields: 4,
    backFields: 5,
  },
  storeCard: PASS_FIELD_LIMITS,
};

export function getPassFieldLimits(passType: PassType): PassFieldLimits {
  return PASS_FIELD_LIMITS_BY_TYPE[passType];
}

export type PassField = {
  key: string;
  label: string;
  value: string;
};

export type PassBarcode = {
  enabled: boolean;
  format: BarcodeFormat;
  message: string;
  altText?: string;
};

export type PassImages = {
  logo?: string;
  icon?: string;
  strip?: string;
  background?: string;
  thumbnail?: string;
  footer?: string;
};

export type PassDesign = {
  passType: PassType;

  organizationName: string;
  description: string;
  logoText: string;

  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;

  primaryFields: PassField[];
  secondaryFields: PassField[];
  auxiliaryFields: PassField[];
  backFields: PassField[];

  barcode: PassBarcode;

  images?: PassImages;
};

export type PassFieldGroups = Pick<
  PassDesign,
  "primaryFields" | "secondaryFields" | "auxiliaryFields" | "backFields"
>;

export const DEFAULT_PASS_FIELDS_BY_TYPE: Record<PassType, PassFieldGroups> = {
  boardingPass: {
    primaryFields: [
      { key: "from", label: "FROM", value: "SFO" },
      { key: "to", label: "TO", value: "LAX" },
    ],
    secondaryFields: [
      { key: "flight", label: "FLIGHT", value: "PA 428" },
      { key: "gate", label: "GATE", value: "B12" },
    ],
    auxiliaryFields: [
      { key: "seat", label: "SEAT", value: "14A" },
      { key: "zone", label: "ZONE", value: "3" },
    ],
    backFields: [],
  },
  generic: {
    primaryFields: [{ key: "name", label: "NAME", value: "Enes" }],
    secondaryFields: [{ key: "status", label: "STATUS", value: "Active" }],
    auxiliaryFields: [],
    backFields: [],
  },
  posterGeneric: {
    primaryFields: [{ key: "member", label: "MEMBER", value: "Enes" }],
    secondaryFields: [{ key: "status", label: "STATUS", value: "Active" }],
    auxiliaryFields: [{ key: "level", label: "LEVEL", value: "Studio" }],
    backFields: [],
  },
  coupon: {
    primaryFields: [{ key: "offer", label: "OFFER", value: "20% Off" }],
    secondaryFields: [
      { key: "code", label: "CODE", value: "SUMMER" },
      { key: "expires", label: "EXPIRES", value: "Today" },
    ],
    auxiliaryFields: [],
    backFields: [],
  },
  eventTicket: {
    primaryFields: [{ key: "event", label: "EVENT", value: "Design Night" }],
    secondaryFields: [
      { key: "date", label: "DATE", value: "Jul 21" },
      { key: "time", label: "TIME", value: "8:00 PM" },
    ],
    auxiliaryFields: [{ key: "venue", label: "VENUE", value: "Studio A" }],
    backFields: [],
  },
  storeCard: {
    primaryFields: [{ key: "balance", label: "BALANCE", value: "$25.00" }],
    secondaryFields: [{ key: "tier", label: "TIER", value: "Member" }],
    auxiliaryFields: [{ key: "points", label: "POINTS", value: "1250" }],
    backFields: [],
  },
};

function clonePassFields(fields: PassField[]) {
  return fields.map((field) => ({ ...field }));
}

export function getDefaultFieldsForPassType(passType: PassType): PassFieldGroups {
  const defaults = DEFAULT_PASS_FIELDS_BY_TYPE[passType];

  return {
    primaryFields: clonePassFields(defaults.primaryFields),
    secondaryFields: clonePassFields(defaults.secondaryFields),
    auxiliaryFields: clonePassFields(defaults.auxiliaryFields),
    backFields: clonePassFields(defaults.backFields),
  };
}

export type CreatePassRequest = {
  email: string;
  design: PassDesign;
};

export type CreatePassResponse = {
  success: boolean;
  passId: string;
  downloadUrl: string;
};

export const DEFAULT_PASS_DESIGN: PassDesign = {
  passType: "generic",
  organizationName: "Demo Company",
  description: "Demo Wallet Pass",
  logoText: "Demo Pass",
  backgroundColor: "#1f2937",
  foregroundColor: "#ffffff",
  labelColor: "#d1d5db",
  ...getDefaultFieldsForPassType("generic"),
  barcode: {
    enabled: true,
    format: "PKBarcodeFormatQR",
    message: "DEMO-123456",
    altText: "DEMO-123456",
  },
};
