export const PASS_TYPES = [
  "boardingPass",
  "generic",
  "coupon",
  "eventTicketStrip",
  "eventTicketBackground",
  "storeCard",
] as const;

export type PassType = (typeof PASS_TYPES)[number];

export const BARCODE_FORMATS = [
  "PKBarcodeFormatQR",
  "PKBarcodeFormatCode128",
] as const;

export type BarcodeFormat = (typeof BARCODE_FORMATS)[number];

export const PASS_FIELD_LIMITS = {
  headerFields: 3,
  primaryFields: 1,
  secondaryFields: 2,
  auxiliaryFields: 4,
  backFields: 5,
} as const;

export type PassFieldLimits = {
  headerFields: number;
  primaryFields: number;
  secondaryFields: number;
  auxiliaryFields: number;
  backFields: number;
};

export const PASS_FIELD_LIMITS_BY_TYPE: Record<PassType, PassFieldLimits> = {
  boardingPass: {
    headerFields: 3,
    primaryFields: 2,
    secondaryFields: 4,
    auxiliaryFields: 5,
    backFields: 5,
  },
  generic: PASS_FIELD_LIMITS,
  coupon: PASS_FIELD_LIMITS,
  eventTicketStrip: {
    headerFields: 3,
    primaryFields: 1,
    secondaryFields: 4,
    auxiliaryFields: 4,
    backFields: 5,
  },
  eventTicketBackground: {
    headerFields: 3,
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

export const PASS_IMAGE_KEYS = [
  "logo",
  "icon",
  "strip",
  "background",
  "thumbnail",
  "footer",
] as const;

export type PassImageKey = (typeof PASS_IMAGE_KEYS)[number];

export const PASS_IMAGES_BY_TYPE: Record<PassType, PassImageKey[]> = {
  boardingPass: ["logo", "icon", "footer"],
  generic: ["logo", "icon", "thumbnail"],
  coupon: ["logo", "icon", "strip"],
  eventTicketStrip: ["logo", "icon", "strip"],
  eventTicketBackground: ["logo", "icon", "background", "thumbnail"],
  storeCard: ["logo", "icon", "strip"],
};

export function getSupportedImagesForPassType(passType: PassType): PassImageKey[] {
  return PASS_IMAGES_BY_TYPE[passType];
}

export function cleanPassImagesForPassType(
  passType: PassType,
  images?: PassImages,
): PassImages | undefined {
  if (!images) {
    return undefined;
  }

  const supportedImages = new Set(getSupportedImagesForPassType(passType));
  const nextImages: PassImages = {};

  PASS_IMAGE_KEYS.forEach((imageKey) => {
    const image = images[imageKey];

    if (image && supportedImages.has(imageKey)) {
      nextImages[imageKey] = image;
    }
  });

  return Object.keys(nextImages).length > 0 ? nextImages : undefined;
}

export type PassDesign = {
  passType: PassType;

  organizationName: string;
  description: string;
  logoText: string;

  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;

  headerFields: PassField[];
  primaryFields: PassField[];
  secondaryFields: PassField[];
  auxiliaryFields: PassField[];
  backFields: PassField[];

  barcode: PassBarcode;

  images?: PassImages;
};

export type PassFieldGroups = Pick<
  PassDesign,
  | "headerFields"
  | "primaryFields"
  | "secondaryFields"
  | "auxiliaryFields"
  | "backFields"
>;

export const DEFAULT_PASS_FIELDS_BY_TYPE: Record<PassType, PassFieldGroups> = {
  boardingPass: {
    headerFields: [
      { key: "flight", label: "FLIGHT", value: "PA 428" },
      { key: "gate", label: "GATE", value: "B12" },
    ],
    primaryFields: [
      { key: "from", label: "FROM", value: "SFO" },
      { key: "to", label: "TO", value: "LAX" },
    ],
    secondaryFields: [
      { key: "boarding", label: "BOARDING", value: "10:15 AM" },
      { key: "terminal", label: "TERMINAL", value: "2" },
    ],
    auxiliaryFields: [
      { key: "seat", label: "SEAT", value: "14A" },
      { key: "zone", label: "ZONE", value: "3" },
    ],
    backFields: [],
  },
  generic: {
    headerFields: [{ key: "status", label: "STATUS", value: "Active" }],
    primaryFields: [{ key: "name", label: "NAME", value: "Enes" }],
    secondaryFields: [{ key: "member", label: "MEMBER", value: "Since 2026" }],
    auxiliaryFields: [],
    backFields: [],
  },
  coupon: {
    headerFields: [{ key: "code", label: "CODE", value: "SUMMER" }],
    primaryFields: [{ key: "offer", label: "OFFER", value: "20% Off" }],
    secondaryFields: [{ key: "expires", label: "EXPIRES", value: "Today" }],
    auxiliaryFields: [],
    backFields: [],
  },
  eventTicketStrip: {
    headerFields: [
      { key: "date", label: "DATE", value: "Jul 21" },
      { key: "time", label: "TIME", value: "8:00 PM" },
    ],
    primaryFields: [{ key: "event", label: "EVENT", value: "Design Night" }],
    secondaryFields: [{ key: "venue", label: "VENUE", value: "Studio A" }],
    auxiliaryFields: [{ key: "section", label: "SECTION", value: "A" }],
    backFields: [],
  },
  eventTicketBackground: {
    headerFields: [
      { key: "date", label: "DATE", value: "Jul 21" },
      { key: "time", label: "TIME", value: "8:00 PM" },
    ],
    primaryFields: [{ key: "event", label: "EVENT", value: "Design Night" }],
    secondaryFields: [{ key: "venue", label: "VENUE", value: "Studio A" }],
    auxiliaryFields: [{ key: "section", label: "SECTION", value: "A" }],
    backFields: [],
  },
  storeCard: {
    headerFields: [{ key: "tier", label: "TIER", value: "Member" }],
    primaryFields: [{ key: "balance", label: "BALANCE", value: "$25.00" }],
    secondaryFields: [{ key: "points", label: "POINTS", value: "1250" }],
    auxiliaryFields: [{ key: "rewards", label: "REWARDS", value: "$5" }],
    backFields: [],
  },
};

function clonePassFields(fields: PassField[]) {
  return fields.map((field) => ({ ...field }));
}

export function getDefaultFieldsForPassType(passType: PassType): PassFieldGroups {
  const defaults = DEFAULT_PASS_FIELDS_BY_TYPE[passType];

  return {
    headerFields: clonePassFields(defaults.headerFields),
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
