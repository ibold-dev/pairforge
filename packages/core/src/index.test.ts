import { describe, expect, it } from 'vitest';

import { productName } from './index.js';

describe('productName', () => {
  it('identifies the product', () => {
    expect(productName).toBe('PairForge');
  });
});
