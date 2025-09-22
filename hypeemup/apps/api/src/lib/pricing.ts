import { z } from 'zod';

const itemSchema = z.object({ price: z.number().int().nonnegative(), quantity: z.number().int().positive() });

export function validateCartTotals(items: Array<{ price: number; quantity: number }>) {
  const parsed = z.array(itemSchema).parse(items);
  const subtotal = parsed.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.07);
  const shipping = subtotal > 50000 ? 0 : 1500;
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
}
