import type { PassDesign, PassField, PassType } from "../types/pass";
import { env } from "../config/env";
import { hexToRgbString } from "../utils/color.util";

type PassJsonStyleKey =
  | "boardingPass"
  | "coupon"
  | "eventTicket"
  | "generic"
  | "storeCard";

type PassJsonField = {
  key: string;
  label: string;
  value: string;
};

type PassJsonStyle = {
  auxiliaryFields: PassJsonField[];
  backFields: PassJsonField[];
  headerFields: PassJsonField[];
  primaryFields: PassJsonField[];
  secondaryFields: PassJsonField[];
};

type PassJsonBarcode = {
  altText?: string;
  format: string;
  message: string;
  messageEncoding: "iso-8859-1";
};

export type PassJson = {
  backgroundColor: string;
  barcode?: PassJsonBarcode;
  description: string;
  foregroundColor: string;
  formatVersion: 1;
  labelColor: string;
  logoText: string;
  organizationName: string;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
} & Partial<Record<PassJsonStyleKey, PassJsonStyle>>;

const passTypeToStyleKey: Record<PassType, PassJsonStyleKey> = {
  boardingPass: "boardingPass",
  coupon: "coupon",
  eventTicketBackground: "eventTicket",
  eventTicketStrip: "eventTicket",
  generic: "generic",
  storeCard: "storeCard",
};

function mapFields(fields: PassField[]): PassJsonField[] {
  return fields.map((field) => ({
    key: field.key,
    label: field.label,
    value: field.value,
  }));
}

function buildStyleFields(design: PassDesign): PassJsonStyle {
  return {
    auxiliaryFields: mapFields(design.auxiliaryFields),
    backFields: mapFields(design.backFields),
    headerFields: mapFields(design.headerFields),
    primaryFields: mapFields(design.primaryFields),
    secondaryFields: mapFields(design.secondaryFields),
  };
}

function buildBarcode(design: PassDesign): PassJsonBarcode | undefined {
  if (!design.barcode.enabled) {
    return undefined;
  }

  return {
    format: design.barcode.format,
    message: design.barcode.message,
    messageEncoding: "iso-8859-1",
    ...(design.barcode.altText ? { altText: design.barcode.altText } : {}),
  };
}

export function buildPassJson(
  design: PassDesign,
  serialNumber: string,
): PassJson {
  const styleKey = passTypeToStyleKey[design.passType];
  const barcode = buildBarcode(design);

  return {
    formatVersion: 1,
    passTypeIdentifier: env.passTypeIdentifier,
    serialNumber,
    teamIdentifier: env.teamIdentifier,
    organizationName: design.organizationName,
    description: design.description,
    logoText: design.logoText,
    backgroundColor: hexToRgbString(design.backgroundColor),
    foregroundColor: hexToRgbString(design.foregroundColor),
    labelColor: hexToRgbString(design.labelColor),
    ...(barcode ? { barcode } : {}),
    [styleKey]: buildStyleFields(design),
  };
}
