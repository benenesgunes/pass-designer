import dotenv from "dotenv";

dotenv.config();

const DEFAULT_PORT = 8080;

function getPort() {
  const port = Number(process.env.PORT ?? DEFAULT_PORT);

  return Number.isFinite(port) ? port : DEFAULT_PORT;
}

const port = getPort();

export const env = {
  backendUrl: process.env.BACKEND_URL ?? `http://localhost:${port}`,
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  passTypeIdentifier:
    process.env.PASS_TYPE_ID ?? "pass.com.example.walletdesigner",
  port,
  teamIdentifier: process.env.TEAM_ID ?? "YOUR_TEAM_ID",
};
