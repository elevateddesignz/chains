import { NextFunction, Response } from 'express';

import { HttpError } from '../lib/errors';
import { AuthenticatedRequest } from './session';

export function requireAuth(roles?: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new HttpError(401, 'Authentication required');
    }
    if (roles && !roles.includes(req.user.role)) {
      throw new HttpError(403, 'Insufficient permissions');
    }
    next();
  };
}
