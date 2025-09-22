import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/require-auth';
import { AuthenticatedRequest } from '../middleware/session';
import { processChatTurn, startChat } from '../services/chat';

export const chatRouter = Router();

chatRouter.post('/start', async (req: AuthenticatedRequest, res) => {
  const session = await startChat(req.user?.id);
  res.json({ sessionId: session.id, messages: session.messages });
});

chatRouter.post('/send', async (req: AuthenticatedRequest, res) => {
  const schema = z.object({ sessionId: z.string(), message: z.string() });
  const payload = schema.parse(req.body);
  const session = await processChatTurn({ sessionId: payload.sessionId, message: payload.message, userId: req.user?.id });
  res.json({ sessionId: session.id, messages: session.messages });
});

chatRouter.post('/handoff', requireAuth(['admin', 'staff']), async (req, res) => {
  const schema = z.object({ sessionId: z.string(), note: z.string().optional() });
  const payload = schema.parse(req.body);
  await processChatTurn({ sessionId: payload.sessionId, message: payload.note ?? 'Agent requested handoff', userId: undefined });
  res.json({ ok: true });
});
