import "dotenv/config";

type NodeEnvironment = "development" | "test" | "production";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getPort(): number {
  const value = process.env.PORT ?? "3000";
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT value: ${value}`);
  }

  return port;
}

function getNodeEnvironment(): NodeEnvironment {
  const value = process.env.NODE_ENV ?? "development";

  if (
    value !== "development" &&
    value !== "test" &&
    value !== "production"
  ) {
    throw new Error(`Invalid NODE_ENV value: ${value}`);
  }

  return value;
}

export const env = Object.freeze({
  nodeEnv: getNodeEnvironment(),
  port: getPort(),
  frontendUrl: getRequiredEnv("FRONTEND_URL"),
});