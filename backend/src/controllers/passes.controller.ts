import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import type { CreatePassRequest, CreatePassResponse } from "../types/pass";
import {
  PKPASS_MIME_TYPE,
  findPassFile,
  saveDebugPassJsonFile,
} from "../services/passFile.service";
import { buildPassJson } from "../services/passJson.service";

export const createPass: RequestHandler = async (request, response, next) => {
  try {
    const passId = randomUUID();
    const createPassRequest = request.body as CreatePassRequest;

    const passJson = buildPassJson(createPassRequest.design, passId);

    await saveDebugPassJsonFile(passId, passJson);

    const payload: CreatePassResponse = {
      success: true,
      mode: "unsigned-debug",
      passId,
      message: "Pass JSON generated, but Apple signing is not configured yet.",
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
