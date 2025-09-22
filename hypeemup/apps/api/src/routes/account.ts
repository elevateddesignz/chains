import { Router } from 'express';
import { z } from 'zod';

import { HttpError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/require-auth';
import { AuthenticatedRequest } from '../middleware/session';

export const accountRouter = Router();

accountRouter.use(requireAuth());

accountRouter.get('/overview', async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, status: true, total: true, createdAt: true },
      },
    },
  });
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  res.json({ user, orders: user.orders });
});

accountRouter.get('/orders', async (req: AuthenticatedRequest, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, status: true, total: true, createdAt: true },
  });
  res.json({ orders });
});

accountRouter.get('/orders/:id', async (req: AuthenticatedRequest, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: { shipment: { include: { events: true } } },
  });
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }
  res.json({ order, shipment: order.shipment });
});

accountRouter.get('/addresses', async (req: AuthenticatedRequest, res) => {
  const addresses = await prisma.address.findMany({ where: { userId: req.user!.id } });
  res.json({ addresses });
});

accountRouter.post('/addresses', async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    label: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postal: z.string(),
    country: z.string(),
    isDefault: z.boolean().optional(),
  });
  const payload = schema.parse(req.body);
  const address = await prisma.address.create({
    data: { ...payload, userId: req.user!.id },
  });
  res.status(201).json({ address });
});

accountRouter.delete('/addresses/:id', async (req: AuthenticatedRequest, res) => {
  await prisma.address.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
  res.json({ ok: true });
});

accountRouter.get('/saved-designs', async (req: AuthenticatedRequest, res) => {
  const designs = await prisma.savedDesign.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json({ designs });
});

accountRouter.post('/saved-designs', async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    name: z.string(),
    svgKey: z.string(),
    previewKey: z.string(),
    config: z.any(),
  });
  const payload = schema.parse(req.body);
  const design = await prisma.savedDesign.create({ data: { ...payload, userId: req.user!.id } });
  res.status(201).json({ design });
});

accountRouter.delete('/saved-designs/:id', async (req: AuthenticatedRequest, res) => {
  await prisma.savedDesign.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
  res.json({ ok: true });
});

export { accountRouter };
