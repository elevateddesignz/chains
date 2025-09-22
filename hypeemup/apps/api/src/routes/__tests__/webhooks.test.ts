import { describe, expect, it, vi } from 'vitest';

import { prisma } from '../../lib/prisma';
import { handleCheckoutCompleted } from '../webhooks';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    order: {
      upsert: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe('handleCheckoutCompleted', () => {
  it('upserts order with derived totals', async () => {
    const session: any = {
      id: 'cs_test_123',
      amount_total: 12345,
      customer_details: { email: 'test@example.com' },
      currency: 'usd',
      receipt_url: 'https://stripe.com/receipt',
    };
    const lineItems: any = {
      data: [
        { amount_total: 10000 },
        { amount_total: 2345 },
      ],
    };

    await handleCheckoutCompleted(session, lineItems);

    expect(prisma.order.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { stripeId: 'cs_test_123' },
        create: expect.objectContaining({ subtotal: 12345, total: 12345 }),
      }),
    );
  });

  it('falls back to subtotal when total missing', async () => {
    const session: any = {
      id: 'cs_test_missing',
      amount_total: null,
      customer_details: { email: 'guest@example.com' },
      currency: 'usd',
    };
    const lineItems: any = {
      data: [{ amount_total: 5000 }],
    };

    await handleCheckoutCompleted(session, lineItems);

    expect(prisma.order.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { stripeId: 'cs_test_missing' },
        create: expect.objectContaining({ subtotal: 5000, total: 5000 }),
      }),
    );
  });
});
