import type { Preset } from './preset.js';

const standardLiquidityAllocation = {
  creatorClaimableBps: 4_500,
  creatorLockedBps: 500,
  partnerClaimableBps: 4_500,
  partnerLockedBps: 500,
} as const;

const standardFeeSplit = {
  creatorBps: 5_000,
  partnerBps: 5_000,
} as const;

export const initialPresets: readonly Preset[] = [
  {
    id: 'catalyst-v1',
    version: 1,
    kind: 'catalyst',
    name: 'Catalyst',
    description:
      'A time-bounded policy for attention-driven releases with measured early fee decay.',
    quoteAssetKind: 'native-sol',
    curve: { intent: 'accelerated', durationSeconds: 86_400 },
    feePolicy: {
      startingFeeBps: 250,
      endingFeeBps: 100,
      dynamicFeeEnabled: true,
      curvePhaseFeeSplit: standardFeeSplit,
    },
    migration: {
      target: 'damm-v2',
      feeOption: 0,
      graduationThresholdQuoteUnits: '25000000000',
    },
    liquidityAllocation: standardLiquidityAllocation,
  },
  {
    id: 'conviction-v1',
    version: 1,
    kind: 'conviction',
    name: 'Conviction',
    description:
      'A longer discovery policy for launches that prioritize gradual participation and durable liquidity.',
    quoteAssetKind: 'native-sol',
    curve: { intent: 'long-tail', durationSeconds: 604_800 },
    feePolicy: {
      startingFeeBps: 150,
      endingFeeBps: 75,
      dynamicFeeEnabled: true,
      curvePhaseFeeSplit: standardFeeSplit,
    },
    migration: {
      target: 'damm-v2',
      feeOption: 0,
      graduationThresholdQuoteUnits: '50000000000',
    },
    liquidityAllocation: standardLiquidityAllocation,
  },
  {
    id: 'pair-thesis-v1',
    version: 1,
    kind: 'pair-thesis',
    name: 'Pair Thesis',
    description:
      'A reference-aware policy for launches paired with an approved asset and disclosed reference context.',
    quoteAssetKind: 'tokenized-rwa',
    curve: { intent: 'reference-aware', durationSeconds: 259_200 },
    feePolicy: {
      startingFeeBps: 200,
      endingFeeBps: 100,
      dynamicFeeEnabled: true,
      curvePhaseFeeSplit: standardFeeSplit,
    },
    migration: {
      target: 'damm-v2',
      feeOption: 0,
      graduationThresholdQuoteUnits: '1000000000',
    },
    liquidityAllocation: standardLiquidityAllocation,
  },
];
