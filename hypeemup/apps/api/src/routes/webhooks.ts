import express, { Router } from 'express';
import Stripe from 'stripe';

import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import { stripe } from '../services/stripe';

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>) {
  const subtotal = lineItems.data.reduce((sum, item) => sum + (item.amount_total ?? 0), 0);
  const total = session.amount_total ?? subtotal;
  const tax = total - subtotal;

  await prisma.order.upsert({
    where: { stripeId: session.id },
    create: {
      stripeId: session.id,
      email: session.customer_details?.email ?? 'guest@hypeemup.com',
      items: lineItems.data,
      subtotal,
      tax,
      shipping: 0,
      total,
      currency: session.currency ?? 'usd',
      status: 'paid',
      receiptUrl: session.receipt_url ?? undefined,
    },
    update: {
      status: 'paid',
      receiptUrl: session.receipt_url ?? undefined,
      total,
    },
  });
}

export const webhookRouter = Router();

webhookRouter.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return res.status(400).send('Missing signature');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed', err);
      return res.status(400).send('Webhook Error');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      await handleCheckoutCompleted(session, lineItems);
    }

    res.json({ received: true });
  },
);
