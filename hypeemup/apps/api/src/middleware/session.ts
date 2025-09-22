import { NextFunction, Request, Response } from 'express';

import { prisma } from '../lib/prisma';
import { verifyAccessToken } from '../lib/jwt';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export async function attachUser(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, email: true },
    });
    if (user) {
      req.user = user;
    }
  } catch (error) {
    console.warn('Failed to verify access token', error);
  }

  next();
}
