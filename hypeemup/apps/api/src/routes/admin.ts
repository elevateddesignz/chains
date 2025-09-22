import { Router } from 'express';

import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/require-auth';

export const adminRouter = Router();

adminRouter.use(requireAuth(['admin', 'staff']));

adminRouter.get('/dashboard', async (_req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersToday, revenueTodayAgg, openTickets, liveChats, latestOrders, openSessions] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: today }, status: { in: ['paid', 'processing', 'shipped', 'delivered'] } },
    }),
    prisma.ticket.count({ where: { status: { in: ['open', 'escalated'] } } }),
    prisma.chatSession.count({ where: { status: { in: ['open', 'pending_human'] } } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, total: true, status: true, createdAt: true, email: true },
    }),
    prisma.chatSession.findMany({
      where: { status: { in: ['open', 'pending_human'] } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, status: true, user: { select: { email: true } } },
    }),
  ]);

  res.json({
    stats: {
      ordersToday,
      revenueToday: revenueTodayAgg._sum.total ?? 0,
      openTickets,
      liveChats,
    },
    latestOrders: latestOrders.map((order) => ({
      id: order.id,
      total: order.total,
      status: order.status,
      customer: order.email,
    })),
    openSessions: openSessions.map((session) => ({
      id: session.id,
      status: session.status,
      customer: session.user?.email,
    })),
  });
});

adminRouter.get('/inbox', async (_req, res) => {
  const sessions = await prisma.chatSession.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 20,
    select: { id: true, status: true, createdAt: true, updatedAt: true },
  });
  res.json({ sessions });
});

adminRouter.get('/inbox/:id', async (req, res) => {
  const session = await prisma.chatSession.findUnique({
    where: { id: req.params.id },
    include: { messages: { orderBy: { createdAt: 'asc' } }, ticket: true },
  });
  res.json({ session });
});

adminRouter.post('/inbox/:id/reply', async (req, res) => {
  const { message } = req.body as { message: string };
  const session = await prisma.chatSession.update({
    where: { id: req.params.id },
    data: {
      status: 'open',
      messages: {
        create: {
          role: 'agent',
          content: message,
        },
      },
    },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  res.json({ session });
});

export { adminRouter };
