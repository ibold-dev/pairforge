import { describe, expect, it } from 'vitest';

import fixtureCases from './fixtures/preset-cases.json' with { type: 'json' };
import { compileLaunchManifest } from './manifest.js';
import { createPresetDigest, launchDraftSchema, presetSchema } from './preset.js';
import { initialPresets } from './presets.js';

const address = '11111111111111111111111111111111';
const firstPreset = initialPresets[0];

if (!firstPreset) {
  throw new Error('Initial presets must include a first preset.');
}

describe('preset manifests', () => {
  it('accepts every initial versioned preset', () => {
    for (const preset of initialPresets) {
      expect(presetSchema.safeParse(preset).success).toBe(true);
      expect(createPresetDigest(preset)).toMatch(/^sha256:[a-f0-9]{64}$/);
    }
  });

  it('creates the same digest when object key order differs', () => {
    const preset = firstPreset;
    const reordered = {
      liquidityAllocation: preset.liquidityAllocation,
      migration: preset.migration,
      feePolicy: preset.feePolicy,
      curve: preset.curve,
      quoteAssetKind: preset.quoteAssetKind,
      description: preset.description,
      name: preset.name,
      kind: preset.kind,
      version: preset.version,
      id: preset.id,
    };

    expect(createPresetDigest(reordered)).toBe(createPresetDigest(preset));
  });

  it('rejects fee shares that do not total 10,000 basis points', () => {
    const invalid = structuredClone(firstPreset);
    invalid.feePolicy.curvePhaseFeeSplit = fixtureCases.invalidCurveFeeSplit;

    expect(presetSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects liquidity that is both incomplete and under the lock floor', () => {
    const invalid = structuredClone(firstPreset);
    invalid.liquidityAllocation = fixtureCases.invalidLiquidityAllocation;

    expect(presetSchema.safeParse(invalid).success).toBe(false);
  });

  it('requires the draft digest and all recipient roles to be complete', () => {
    const preset = firstPreset;
    const draft = {
      preset,
      presetDigest: createPresetDigest(preset),
      token: { name: 'Example', symbol: 'EXM', supplyBaseUnits: '1000000000', decimals: 9 },
      recipients: { creator: address, partner: address, leftoverReceiver: address },
    };

    expect(launchDraftSchema.safeParse(draft).success).toBe(true);
    const otherPreset = initialPresets[1];
    if (!otherPreset) {
      throw new Error('Initial presets must include a second preset.');
    }

    expect(
      launchDraftSchema.safeParse({ ...draft, presetDigest: createPresetDigest(otherPreset) })
        .success,
    ).toBe(false);
    expect(
      launchDraftSchema.safeParse({ ...draft, recipients: { ...draft.recipients, partner: 'bad' } })
        .success,
    ).toBe(false);
  });

  it('compiles separate fee and graduated-liquidity policies with pinned SDK versions', () => {
    const draft = {
      preset: firstPreset,
      presetDigest: createPresetDigest(firstPreset),
      token: { name: 'Example', symbol: 'EXM', supplyBaseUnits: '1000000000', decimals: 9 },
      recipients: { creator: address, partner: address, leftoverReceiver: address },
    };
    const manifest = compileLaunchManifest(draft, { dbc: '1.5.13', dammV2: '1.5.1' });

    expect(manifest.dbc.tradingFee.creatorPercentage).toBe(50);
    expect(manifest.dbc.liquidityDistribution.creatorLockedPercentage).toBe(5);
    expect(manifest.sdkVersions).toEqual({ dbc: '1.5.13', dammV2: '1.5.1' });
  });
});
