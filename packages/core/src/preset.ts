import { createHash } from 'node:crypto';

import { z } from 'zod';

const BASIS_POINTS = 10_000;
const MINIMUM_LOCKED_LIQUIDITY_BPS = 1_000;
const MINIMUM_DBC_FEE_BPS = 25;
const solanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const basisPoints = z.int().min(0).max(BASIS_POINTS);
const recipientAddress = z
  .string()
  .regex(solanaAddress, 'Recipient must be a valid base58 Solana address.');

export const curveIntentSchema = z.enum(['accelerated', 'long-tail', 'reference-aware']);
export const quoteAssetKindSchema = z.enum([
  'native-sol',
  'stablecoin',
  'tokenized-rwa',
  'tokenized-equity',
]);
export const presetKindSchema = z.enum(['catalyst', 'conviction', 'pair-thesis']);

export const curveFeeSplitSchema = z
  .object({
    creatorBps: basisPoints,
    partnerBps: basisPoints,
  })
  .strict()
  .superRefine((split, context) => {
    if (split.creatorBps + split.partnerBps !== BASIS_POINTS) {
      context.addIssue({
        code: 'custom',
        message: 'Curve-phase fee shares must total 10,000 basis points.',
      });
    }
  });

export const liquidityAllocationSchema = z
  .object({
    creatorClaimableBps: basisPoints,
    creatorLockedBps: basisPoints,
    partnerClaimableBps: basisPoints,
    partnerLockedBps: basisPoints,
  })
  .strict()
  .superRefine((allocation, context) => {
    const total = Object.values(allocation).reduce((sum, share) => sum + share, 0);
    if (total !== BASIS_POINTS) {
      context.addIssue({
        code: 'custom',
        message: 'Graduated liquidity shares must total 10,000 basis points.',
      });
    }

    if (allocation.creatorLockedBps + allocation.partnerLockedBps < MINIMUM_LOCKED_LIQUIDITY_BPS) {
      context.addIssue({
        code: 'custom',
        message: 'At least 1,000 basis points of graduated liquidity must remain locked.',
      });
    }
  });

export const presetSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    version: z.literal(1),
    kind: presetKindSchema,
    name: z.string().min(1).max(80),
    description: z.string().min(1).max(280),
    quoteAssetKind: quoteAssetKindSchema,
    curve: z
      .object({
        intent: curveIntentSchema,
        durationSeconds: z.int().positive(),
      })
      .strict(),
    feePolicy: z
      .object({
        startingFeeBps: z.int().min(MINIMUM_DBC_FEE_BPS).max(BASIS_POINTS),
        endingFeeBps: z.int().min(MINIMUM_DBC_FEE_BPS).max(BASIS_POINTS),
        dynamicFeeEnabled: z.boolean(),
        curvePhaseFeeSplit: curveFeeSplitSchema,
      })
      .strict()
      .superRefine((policy, context) => {
        if (policy.endingFeeBps > policy.startingFeeBps) {
          context.addIssue({
            code: 'custom',
            message: 'Ending fee cannot exceed starting fee for an initial preset.',
          });
        }
      }),
    migration: z
      .object({
        target: z.literal('damm-v2'),
        feeOption: z.int().min(0).max(6),
        graduationThresholdQuoteUnits: z.string().regex(/^\d+$/),
      })
      .strict(),
    liquidityAllocation: liquidityAllocationSchema,
  })
  .strict();

export const launchDraftSchema = z
  .object({
    preset: presetSchema,
    presetDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    token: z
      .object({
        name: z.string().min(1).max(32),
        symbol: z.string().regex(/^[A-Z0-9]{2,10}$/),
        supplyBaseUnits: z.string().regex(/^\d+$/),
        decimals: z.int().min(0).max(255),
      })
      .strict(),
    recipients: z
      .object({
        creator: recipientAddress,
        partner: recipientAddress,
        leftoverReceiver: recipientAddress,
      })
      .strict(),
  })
  .strict()
  .superRefine((draft, context) => {
    if (draft.presetDigest !== createPresetDigest(draft.preset)) {
      context.addIssue({
        code: 'custom',
        message: 'Preset digest does not match the selected preset version.',
      });
    }
  });

export type Preset = z.infer<typeof presetSchema>;
export type LaunchDraft = z.infer<typeof launchDraftSchema>;
export type CurveFeeSplit = z.infer<typeof curveFeeSplitSchema>;
export type LiquidityAllocation = z.infer<typeof liquidityAllocationSchema>;

export type LifecycleEvent =
  | Readonly<{ type: 'draft-created'; occurredAt: string }>
  | Readonly<{
      type: 'curve-created';
      occurredAt: string;
      virtualPoolAddress: string;
      signature: string;
      slot: number;
    }>
  | Readonly<{
      type: 'graduated';
      occurredAt: string;
      dammV2PoolAddress: string;
      signature: string;
      slot: number;
    }>;

export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`)
    .join(',')}}`;
}

export function createPresetDigest(preset: Preset): string {
  const digest = createHash('sha256').update(canonicalize(preset)).digest('hex');
  return `sha256:${digest}`;
}
