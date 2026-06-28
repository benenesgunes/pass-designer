import { z } from "zod";
import {
  BARCODE_FORMATS,
  PASS_FIELD_LIMITS,
  PASS_TYPES,
  getPassFieldLimits,
  type CreatePassRequest,
  type CreatePassResponse,
  type PassDesign,
} from "../../../shared/pass";

const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex color, for example #1f2937.");

const nonEmptyTextSchema = z.string().trim().min(1);

export const passFieldSchema = z.object({
  key: nonEmptyTextSchema.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Field keys can only contain letters, numbers, underscores, and hyphens.",
  ),
  label: nonEmptyTextSchema,
  value: nonEmptyTextSchema,
});

export const passBarcodeSchema = z
  .object({
    enabled: z.boolean(),
    format: z.enum(BARCODE_FORMATS),
    message: z.string(),
    altText: z.string().optional(),
  })
  .superRefine((barcode, ctx) => {
    if (barcode.enabled && barcode.message.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Barcode message is required when barcode is enabled.",
        path: ["message"],
      });
    }
  });

export const passImagesSchema = z
  .object({
    logo: z.string().min(1).optional(),
    icon: z.string().min(1).optional(),
    strip: z.string().min(1).optional(),
    background: z.string().min(1).optional(),
    thumbnail: z.string().min(1).optional(),
    footer: z.string().min(1).optional(),
  })
  .partial();

export const passDesignSchema = z.object({
  passType: z.enum(PASS_TYPES),

  organizationName: nonEmptyTextSchema,
  description: nonEmptyTextSchema,
  logoText: nonEmptyTextSchema,

  backgroundColor: hexColorSchema,
  foregroundColor: hexColorSchema,
  labelColor: hexColorSchema,

  headerFields: z
    .array(passFieldSchema)
    .max(Math.max(...PASS_TYPES.map((passType) => getPassFieldLimits(passType).headerFields))),
  primaryFields: z
    .array(passFieldSchema)
    .max(Math.max(...PASS_TYPES.map((passType) => getPassFieldLimits(passType).primaryFields))),
  secondaryFields: z
    .array(passFieldSchema)
    .max(Math.max(...PASS_TYPES.map((passType) => getPassFieldLimits(passType).secondaryFields))),
  auxiliaryFields: z
    .array(passFieldSchema)
    .max(Math.max(...PASS_TYPES.map((passType) => getPassFieldLimits(passType).auxiliaryFields))),
  backFields: z.array(passFieldSchema).max(PASS_FIELD_LIMITS.backFields),

  barcode: passBarcodeSchema,

  images: passImagesSchema.optional(),
}).superRefine((design, ctx) => {
  const limits = getPassFieldLimits(design.passType);
  const fieldGroups = [
    ["headerFields", design.headerFields, limits.headerFields],
    ["primaryFields", design.primaryFields, limits.primaryFields],
    ["secondaryFields", design.secondaryFields, limits.secondaryFields],
    ["auxiliaryFields", design.auxiliaryFields, limits.auxiliaryFields],
    ["backFields", design.backFields, limits.backFields],
  ] as const;

  fieldGroups.forEach(([path, fields, maxFields]) => {
    if (fields.length > maxFields) {
      ctx.addIssue({
        code: "custom",
        message: `${path} can contain at most ${maxFields} fields for ${design.passType}.`,
        path: [path],
      });
    }
  });
}) satisfies z.ZodType<PassDesign>;

export const createPassRequestSchema = z.object({
  email: z.string().trim().email(),
  design: passDesignSchema,
}) satisfies z.ZodType<CreatePassRequest>;

export const createPassResponseSchema = z.object({
  success: z.boolean(),
  passId: z.string(),
  downloadUrl: z.string(),
}) satisfies z.ZodType<CreatePassResponse>;

export function parseCreatePassRequest(input: unknown): CreatePassRequest {
  return createPassRequestSchema.parse(input);
}
