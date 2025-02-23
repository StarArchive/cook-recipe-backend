import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce
    .number()
    .default(3000)
    .refine((port) => port > 1000 && port < 5000, {
      message: "PORT must be a number between 1 and 65535",
    }),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("2d"),
  USER_PASSWORD_HASH_ROUNDS: z.coerce.number().default(10),
  UPLOAD_PATH: z.string().default("public/uploads"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
