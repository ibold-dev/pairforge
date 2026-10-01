import { createPresetDigest, type LaunchDraft } from './preset.js';

export type SdkVersionManifest = Readonly<{
  dbc: string;
  dammV2: string;
}>;

export type CompiledLaunchManifest = Readonly<{
  schemaVersion: 1;
  preset: Readonly<{ id: string; version: number; digest: string }>;
  token: LaunchDraft['token'];
  recipients: LaunchDraft['recipients'];
  dbc: Readonly<{
    curveIntent: LaunchDraft['preset']['curve']['intent'];
    durationSeconds: number;
    tradingFee: Readonly<{
      startingFeeBps: number;
      endingFeeBps: number;
      creatorPercentage: number;
      partnerPercentage: number;
    }>;
    migration: LaunchDraft['preset']['migration'];
    liquidityDistribution: Readonly<{
      creatorClaimablePercentage: number;
      creatorLockedPercentage: number;
      partnerClaimablePercentage: number;
      partnerLockedPercentage: number;
    }>;
  }>;
  sdkVersions: SdkVersionManifest;
}>;

const percentage = (basisPoints: number) => basisPoints / 100;

export function compileLaunchManifest(
  draft: LaunchDraft,
  sdkVersions: SdkVersionManifest,
): CompiledLaunchManifest {
  const digest = createPresetDigest(draft.preset);
  if (draft.presetDigest !== digest) {
    throw new Error('Launch draft preset digest does not match its preset.');
  }

  const { feePolicy, liquidityAllocation, migration, curve } = draft.preset;

  return {
    schemaVersion: 1,
    preset: { id: draft.preset.id, version: draft.preset.version, digest },
    token: draft.token,
    recipients: draft.recipients,
    dbc: {
      curveIntent: curve.intent,
      durationSeconds: curve.durationSeconds,
      tradingFee: {
        startingFeeBps: feePolicy.startingFeeBps,
        endingFeeBps: feePolicy.endingFeeBps,
        creatorPercentage: percentage(feePolicy.curvePhaseFeeSplit.creatorBps),
        partnerPercentage: percentage(feePolicy.curvePhaseFeeSplit.partnerBps),
      },
      migration,
      liquidityDistribution: {
        creatorClaimablePercentage: percentage(liquidityAllocation.creatorClaimableBps),
        creatorLockedPercentage: percentage(liquidityAllocation.creatorLockedBps),
        partnerClaimablePercentage: percentage(liquidityAllocation.partnerClaimableBps),
        partnerLockedPercentage: percentage(liquidityAllocation.partnerLockedBps),
      },
    },
    sdkVersions,
  };
}
