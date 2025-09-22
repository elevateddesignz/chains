import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/require-auth';
import { createSignedUploadUrl } from '../services/storage';

export const uploadsRouter = Router();

const schema = z.object({ filename: z.string(), contentType: z.string() });

uploadsRouter.post('/sign', requireAuth(), async (req, res) => {
  const payload = schema.parse(req.body);
  const key = `uploads/${Date.now()}-${payload.filename}`;
  const { uploadUrl } = await createSignedUploadUrl(key, payload.contentType);
  res.json({ uploadUrl, key });
});
