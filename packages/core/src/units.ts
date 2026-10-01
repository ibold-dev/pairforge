const decimalPattern = /^(0|[1-9]\d*)(\.\d+)?$/;

export type BaseUnits = bigint & { readonly __brand: 'BaseUnits' };

export type TokenAmount = Readonly<{
  amount: BaseUnits;
  decimals: number;
}>;

export function parseDecimalToBaseUnits(value: string, decimals: number): BaseUnits {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new Error('Token decimals must be an integer between 0 and 255.');
  }

  if (!decimalPattern.test(value)) {
    throw new Error('Amount must be a non-negative decimal string without exponent notation.');
  }

  const [whole, fraction = ''] = value.split('.');

  if (fraction.length > decimals) {
    throw new Error(`Amount has more than ${decimals} decimal places.`);
  }

  const normalized = `${whole}${fraction.padEnd(decimals, '0')}`.replace(/^0+(?=\d)/, '');
  return BigInt(normalized || '0') as BaseUnits;
}

export function formatBaseUnits(amount: BaseUnits, decimals: number): string {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new Error('Token decimals must be an integer between 0 and 255.');
  }

  if (amount < 0n) {
    throw new Error('Base-unit amounts cannot be negative.');
  }

  const value = amount.toString().padStart(decimals + 1, '0');
  if (decimals === 0) {
    return value;
  }

  const whole = value.slice(0, -decimals);
  const fraction = value.slice(-decimals).replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole;
}

export function tokenAmount(value: string, decimals: number): TokenAmount {
  return { amount: parseDecimalToBaseUnits(value, decimals), decimals };
}
