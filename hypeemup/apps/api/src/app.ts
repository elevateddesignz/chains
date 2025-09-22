import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { attachUser } from './middleware/session';
import { authRouter } from './routes/auth';
import { publicRouter } from './routes/public';
import { accountRouter } from './routes/account';
import { checkoutRouter } from './routes/checkout';
import { uploadsRouter } from './routes/uploads';
import { cmsRouter } from './routes/cms';
import { adminRouter } from './routes/admin';
import { chatRouter } from './routes/chat';
import { webhookRouter } from './routes/webhooks';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

const allowedOrigins = env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.use('/webhooks', webhookRouter);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
  }),
);

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, env: env.NODE_ENV });
});

app.use(attachUser);

app.use('/auth', authRouter);
app.use('/', publicRouter);
app.use('/account', accountRouter);
app.use('/checkout', checkoutRouter);
app.use('/uploads', uploadsRouter);
app.use('/cms', cmsRouter);
app.use('/admin', adminRouter);
app.use('/chat', chatRouter);

app.use(errorHandler);

export { app };
