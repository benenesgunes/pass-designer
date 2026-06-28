export const PASS_TYPES = [
  "generic",
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
  thumbnail?: string;
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
  primaryFields: [
    {
      key: "name",
      label: "NAME",
      value: "Enes",
    },
  ],
  secondaryFields: [
    {
      key: "status",
      label: "STATUS",
      value: "Active",
    },
  ],
  auxiliaryFields: [],
  backFields: [],
  barcode: {
    enabled: true,
    format: "PKBarcodeFormatQR",
    message: "DEMO-123456",
    altText: "DEMO-123456",
  },
};
