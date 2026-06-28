import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import type { CreatePassRequest, CreatePassResponse } from "../types/pass";
import { env } from "../config/env";
import {
  PKPASS_MIME_TYPE,
  createPlaceholderPassFile,
  findPassFile,
} from "../services/passFile.service";

function buildDownloadUrl(passId: string) {
  return `${env.backendUrl.replace(/\/$/, "")}/passes/${passId}.pkpass`;
}

export const createPass: RequestHandler = async (request, response, next) => {
  try {
    const passId = randomUUID();

    await createPlaceholderPassFile(passId, request.body as CreatePassRequest);

    const payload: CreatePassResponse = {
      success: true,
      passId,
      downloadUrl: buildDownloadUrl(passId),
    };

    response.json(payload);
  } catch (error) {
    next(error);
  }
};

export const downloadPass: RequestHandler = async (request, response, next) => {
  try {
    const passIdParam = request.params.passId;
    const passId = Array.isArray(passIdParam) ? passIdParam[0] : passIdParam;
    const filePath = passId ? await findPassFile(passId) : null;

    if (!filePath) {
      response.status(404).json({
        success: false,
        message: "Pass not found",
      });
      return;
    }

    response.setHeader("Content-Type", PKPASS_MIME_TYPE);
    response.setHeader(
      "Content-Disposition",
      'attachment; filename="pass.pkpass"',
    );
    response.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
