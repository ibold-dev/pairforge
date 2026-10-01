import { describe, expect, it } from 'vitest';

import { formatBaseUnits, parseDecimalToBaseUnits, tokenAmount } from './units.js';

describe('token amounts', () => {
  it.each([
    ['0', 6, 0n],
    ['1', 6, 1_000_000n],
    ['1.23', 6, 1_230_000n],
    ['999999.000001', 6, 999_999_000_001n],
  ])('converts %s at %i decimals without float input', (value, decimals, expected) => {
    expect(parseDecimalToBaseUnits(value, decimals)).toBe(expected);
  });

  it('formats base units without insignificant trailing zeroes', () => {
    expect(formatBaseUnits(1_230_000n as never, 6)).toBe('1.23');
    expect(formatBaseUnits(1n as never, 6)).toBe('0.000001');
  });

  it.each(['-1', '1e3', '.5', ' 1', '1.0000001'])('rejects unsafe decimal input: %s', (value) => {
    expect(() => parseDecimalToBaseUnits(value, 6)).toThrow();
  });

  it('retains token precision alongside parsed base units', () => {
    expect(tokenAmount('42.5', 9)).toEqual({ amount: 42_500_000_000n, decimals: 9 });
  });
});
