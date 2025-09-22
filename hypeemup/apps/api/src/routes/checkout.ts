import { Router } from 'express';
import { z } from 'zod';

import { HttpError } from '../lib/errors';
import { validateCartTotals } from '../lib/pricing';
import { stripe } from '../services/stripe';

export const checkoutRouter = Router();

const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

checkoutRouter.post('/session', async (req, res) => {
  const schema = z.object({ items: z.array(cartItemSchema) });
  const { items } = schema.parse(req.body);
  if (items.length === 0) {
    throw new HttpError(400, 'No items to checkout');
  }

  const { subtotal, tax, shipping, total } = validateCartTotals(items.map((item) => ({ price: item.price, quantity: item.quantity })));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: 'https://hypeemup.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://hypeemup.com/cancel',
    payment_method_types: ['card'],
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: item.price,
        product_data: {
          name: item.name,
        },
      },
    })),
    metadata: {
      app: 'hypeemup',
      subtotal: subtotal.toString(),
      tax: tax.toString(),
      shipping: shipping.toString(),
      total: total.toString(),
    },
  });

  res.json({ url: session.url });
});
