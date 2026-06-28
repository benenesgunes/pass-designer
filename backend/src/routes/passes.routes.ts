import { Router } from "express";
import { createPass, downloadPass } from "../controllers/passes.controller";
import { validateCreatePassRequest } from "../validators/pass.validator";

export const passesRouter = Router();

passesRouter.post("/api/passes/create", validateCreatePassRequest, createPass);
passesRouter.get("/passes/:passId.pkpass", downloadPass);
