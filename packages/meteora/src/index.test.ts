import { compileLaunchManifest, createPresetDigest, initialPresets } from '@pairforge/core';
import { TokenDecimal } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { describe, expect, it } from 'vitest';

import { buildDbcCurve, DEVNET_USDC_MINT, METEORA_SDK_VERSIONS } from './index.js';

const address = '11111111111111111111111111111111';

describe('DBC adapter', () => {
  it('pins the approved devnet quote asset and SDK versions', () => {
    expect(DEVNET_USDC_MINT).toBe('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
    expect(METEORA_SDK_VERSIONS).toEqual({ dbc: '1.5.13', dammV2: '1.5.1' });
  });

  it.each(initialPresets)('builds the $name preset with the official DBC builder', (preset) => {
    const manifest = compileLaunchManifest(
      {
        preset,
        presetDigest: createPresetDigest(preset),
        token: { name: 'Example', symbol: 'EXM', supplyBaseUnits: '1000000000000000', decimals: 6 },
        recipients: { creator: address, partner: address, leftoverReceiver: address },
      },
      METEORA_SDK_VERSIONS,
    );

    expect(() =>
      buildDbcCurve({
        manifest,
        baseTokenSupply: 1_000_000_000,
        baseTokenDecimals: TokenDecimal.SIX,
        quoteTokenDecimals: 6,
        migrationQuoteThreshold: 10,
        percentageSupplyOnMigration: 20,
      }),
    ).not.toThrow();
  });
});
