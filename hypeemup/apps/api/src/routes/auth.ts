import crypto from 'node:crypto';
import { Router } from 'express';
import argon2 from 'argon2';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/errors';
import { cookieOptions, signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { AuthenticatedRequest } from '../middleware/session';
import { sendEmail } from '../services/email';

const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

authRouter.post('/register', async (req, res) => {
  const payload = registerSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
  if (existing) {
    throw new HttpError(409, 'Email already registered');
  }

  const passwordHash = await argon2.hash(payload.password);
  const user = await prisma.user.create({
    data: {
      email: payload.email.toLowerCase(),
      passwordHash,
      firstName: payload.firstName,
      lastName: payload.lastName,
    },
    select: { id: true, email: true, role: true, firstName: true, lastName: true },
  });

  await sendEmail({
    to: user.email,
    subject: 'Welcome to HypeEmUp',
    html: `<p>Thanks for creating a HypeEmUp account, ${user.firstName}!</p>`,
  });

  res.status(201).json({ user });
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

authRouter.post('/login', async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const match = await argon2.verify(user.passwordHash, payload.password);
  if (!match) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  res
    .cookie('accessToken', accessToken, cookieOptions(60 * 15))
    .cookie('refreshToken', refreshToken, cookieOptions(60 * 60 * 24 * 7))
    .json({ user: { id: user.id, email: user.email, role: user.role } });
});

authRouter.post('/refresh', async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new HttpError(401, 'Missing refresh token');
  }
  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw new HttpError(401, 'Invalid refresh token');
  }
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  res.cookie('accessToken', accessToken, cookieOptions(60 * 15)).json({ ok: true });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('accessToken').clearCookie('refreshToken').json({ ok: true });
});

authRouter.get('/me', async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    throw new HttpError(401, 'Not authenticated');
  }
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });
  res.json({ user });
});

const forgotSchema = z.object({ email: z.string().email() });

authRouter.post('/forgot', async (req, res) => {
  const payload = forgotSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
  if (!user) {
    return res.json({ ok: true });
  }
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });
  await sendEmail({
    to: user.email,
    subject: 'Reset your HypeEmUp password',
    html: `<p>Click <a href="https://hypeemup.com/auth/reset?token=${token}">here</a> to reset your password.</p>`,
  });
  res.json({ ok: true });
});

const resetSchema = z.object({ token: z.string(), password: z.string().min(8) });

authRouter.post('/reset', async (req, res) => {
  const payload = resetSchema.parse(req.body);
  const token = await prisma.passwordResetToken.findUnique({ where: { token: payload.token } });
  if (!token || token.expiresAt < new Date()) {
    throw new HttpError(400, 'Invalid or expired token');
  }
  const passwordHash = await argon2.hash(payload.password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: token.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.delete({ where: { id: token.id } }),
  ]);
  res.json({ ok: true });
});

authRouter.post('/verify', async (req, res) => {
  const schema = z.object({ token: z.string() });
  const payload = schema.parse(req.body);
  const token = await prisma.emailVerifyToken.findUnique({ where: { token: payload.token } });
  if (!token || token.expiresAt < new Date()) {
    throw new HttpError(400, 'Invalid or expired token');
  }
  await prisma.$transaction([
    prisma.user.update({ where: { id: token.userId }, data: { emailVerified: new Date() } }),
    prisma.emailVerifyToken.delete({ where: { id: token.id } }),
  ]);
  res.json({ ok: true });
});

export { authRouter };
