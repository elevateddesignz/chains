import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import { sendEmail } from './email';

interface ChatTurn {
  sessionId: string;
  message: string;
  userId?: string;
}

function classifyIntent(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes('order')) return 'order_status';
  if (normalized.includes('ship')) return 'shipping';
  if (normalized.includes('return')) return 'returns';
  if (normalized.includes('price') || normalized.includes('product')) return 'product';
  if (normalized.includes('faq') || normalized.includes('question')) return 'faq';
  return 'other';
}

async function escalate(sessionId: string, lastUser: string, summary: string, customerEmail?: string) {
  await sendEmail({
    to: [env.ESCALATION_TO_EMAIL, env.ESCALATION_CC_EMAIL],
    subject: `HypeEmUp chat escalation ${sessionId}`,
    html: `<p>Session ${sessionId} requires human attention.</p><p>Last user message: ${lastUser}</p><p>Summary: ${summary}</p><p>Customer email: ${customerEmail ?? 'unknown'}</p>`,
  });
  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { status: 'pending_human' },
  });
}

export async function startChat(userId?: string) {
  const session = await prisma.chatSession.create({
    data: {
      userId,
      messages: {
        create: {
          role: 'assistant',
          content: 'Hi! I\'m the HypeEmUp concierge. Ask me about orders, shipping, or custom chains.',
        },
      },
    },
    include: { messages: true },
  });
  return session;
}

export async function processChatTurn({ sessionId, message, userId }: ChatTurn) {
  const session = await prisma.chatSession.findUnique({ where: { id: sessionId }, include: { messages: true, user: true } });
  if (!session) {
    throw new Error('Session not found');
  }
  await prisma.chatMessage.create({ data: { sessionId, role: 'user', content: message } });

  const intent = classifyIntent(message);
  let response = 'I am routing your question to a specialist.';
  let confidence = 0.3;

  if (intent === 'faq') {
    response = 'Check out our FAQ page for common answers: https://hypeemup.com/pages/faqs';
    confidence = 0.9;
  } else if (intent === 'shipping') {
    response = 'Most hype chains ship within 7-10 business days. Use /account/orders to see tracking updates.';
    confidence = 0.85;
  } else if (intent === 'returns') {
    response = 'Custom hype chains are final sale, but reach out within 7 days for adjustments.';
    confidence = 0.75;
  } else if (intent === 'order_status' && session.userId) {
    const order = await prisma.order.findFirst({ where: { userId: session.userId }, orderBy: { createdAt: 'desc' } });
    if (order) {
      response = `Your latest order ${order.id.slice(-6)} is currently ${order.status}.`; // simple summarization
      confidence = 0.8;
    } else {
      response = 'I could not find any orders tied to your account. Try visiting /account/orders for more detail.';
      confidence = 0.6;
    }
  } else if (intent === 'product') {
    const product = await prisma.product.findFirst({ orderBy: { createdAt: 'desc' }, select: { name: true, description: true } });
    if (product) {
      response = `${product.name}: ${product.description.slice(0, 180)}...`;
      confidence = 0.7;
    }
  }

  if (confidence < 0.55) {
    await escalate(sessionId, message, `Intent ${intent}`, session.user?.email);
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: 'I am looping in a human specialist. They will email you shortly.',
      },
    });
  } else {
    await prisma.chatMessage.create({ data: { sessionId, role: 'assistant', content: response } });
  }

  const updated = await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  return updated;
}
