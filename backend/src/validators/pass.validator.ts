import type { RequestHandler } from "express";
import { createPassRequestSchema } from "./passDesignSchema";

function formatIssuePath(path: PropertyKey[]) {
  return path.length > 0 ? path.map(String).join(".") : "body";
}

export const validateCreatePassRequest: RequestHandler = (
  request,
  response,
  next,
) => {
  const result = createPassRequestSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: formatIssuePath(issue.path),
        message: issue.message,
      })),
    });
    return;
  }

  request.body = result.data;
  next();
};

