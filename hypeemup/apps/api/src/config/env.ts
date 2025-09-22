import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  AWS_REGION: z.string(),
  S3_BUCKET_UPLOADS: z.string(),
  SES_REGION: z.string(),
  SES_FROM_EMAIL: z.string().email(),
  ESCALATION_TO_EMAIL: z.string().email(),
  ESCALATION_CC_EMAIL: z.string().email(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  COOKIE_DOMAIN: z.string(),
  ALLOWED_ORIGINS: z.string().optional(),
  RAG_TOP_K: z.coerce.number().default(6),
});

export const env = envSchema.parse(process.env);

export const isProd = env.NODE_ENV === 'production';
