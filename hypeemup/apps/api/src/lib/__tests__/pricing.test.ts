import { describe, expect, it } from 'vitest';

import { validateCartTotals } from '../pricing';

describe('validateCartTotals', () => {
  it('calculates totals with shipping', () => {
    const result = validateCartTotals([
      { price: 1000, quantity: 2 },
      { price: 500, quantity: 1 },
    ]);
    expect(result.subtotal).toBe(2500);
    expect(result.tax).toBe(175);
    expect(result.shipping).toBe(1500);
    expect(result.total).toBe(4175);
  });

  it('waives shipping when subtotal above threshold', () => {
    const result = validateCartTotals([{ price: 30000, quantity: 2 }]);
    expect(result.shipping).toBe(0);
  });
});
