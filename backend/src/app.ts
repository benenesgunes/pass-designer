import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { healthRouter } from "./routes/health.routes";
import { passesRouter } from "./routes/passes.routes";

export const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: "10mb" }));

app.use(healthRouter);
app.use(passesRouter);

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(
  (
    _error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  },
);

