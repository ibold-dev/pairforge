import { CpAmm } from '@meteora-ag/cp-amm-sdk';
import {
  ActivationType,
  BaseFeeMode,
  buildCurve,
  CollectFeeMode,
  DynamicBondingCurveClient,
  MigrationFeeOption,
  MigrationOption,
  TokenAuthorityOption,
  TokenDecimal,
  TokenType,
} from '@meteora-ag/dynamic-bonding-curve-sdk';
import { Connection, PublicKey } from '@solana/web3.js';

import type { CompiledLaunchManifest } from '@pairforge/core';

export const METEORA_SDK_VERSIONS = {
  dammV2: '1.5.1',
  dbc: '1.5.13',
} as const;

export const DEVNET_USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

export type MeteoraReadClients = Readonly<{
  connection: Connection;
  dbc: DynamicBondingCurveClient;
  dammV2: CpAmm;
}>;

export function createMeteoraReadClients(rpcEndpoint: string): MeteoraReadClients {
  const connection = new Connection(rpcEndpoint, 'confirmed');

  return {
    connection,
    dbc: new DynamicBondingCurveClient(connection, 'confirmed'),
    dammV2: new CpAmm(connection),
  };
}

export async function findDbcPoolByBaseMint(
  clients: MeteoraReadClients,
  baseMint: string,
): Promise<unknown> {
  return clients.dbc.state.getPoolByBaseMint(new PublicKey(baseMint));
}

export async function findDammV2PoolsByMint(
  clients: MeteoraReadClients,
  mint: string,
): Promise<unknown> {
  return clients.dammV2.fetchPoolStatesByTokenMint(new PublicKey(mint));
}

export type CurveBuildInput = Readonly<{
  manifest: CompiledLaunchManifest;
  baseTokenSupply: number;
  baseTokenDecimals: TokenDecimal;
  quoteTokenDecimals: number;
  migrationQuoteThreshold: number;
  percentageSupplyOnMigration: number;
}>;

export function buildDbcCurve(input: CurveBuildInput): unknown {
  const { manifest } = input;
  const { tradingFee, liquidityDistribution, migration } = manifest.dbc;

  return buildCurve({
    token: {
      tokenType: TokenType.SPLToken,
      tokenBaseDecimal: input.baseTokenDecimals,
      tokenQuoteDecimal: input.quoteTokenDecimals,
      tokenAuthorityOption: TokenAuthorityOption.Immutable,
      totalTokenSupply: input.baseTokenSupply,
      leftover: 0,
    },
    fee: {
      baseFeeParams: {
        baseFeeMode: BaseFeeMode.FeeSchedulerLinear,
        feeSchedulerParam: {
          startingFeeBps: tradingFee.startingFeeBps,
          endingFeeBps: tradingFee.endingFeeBps,
          numberOfPeriod: 1,
          totalDuration: manifest.dbc.durationSeconds,
        },
      },
      dynamicFeeEnabled: true,
      collectFeeMode: CollectFeeMode.QuoteToken,
      creatorTradingFeePercentage: tradingFee.creatorPercentage,
      poolCreationFee: 0,
      enableFirstSwapWithMinFee: false,
    },
    migration: {
      migrationOption: MigrationOption.MET_DAMM_V2,
      migrationFeeOption: migration.feeOption as MigrationFeeOption,
      migrationFee: { feePercentage: 0, creatorFeePercentage: 0 },
    },
    liquidityDistribution: {
      creatorLiquidityPercentage: liquidityDistribution.creatorClaimablePercentage,
      creatorPermanentLockedLiquidityPercentage: liquidityDistribution.creatorLockedPercentage,
      partnerLiquidityPercentage: liquidityDistribution.partnerClaimablePercentage,
      partnerPermanentLockedLiquidityPercentage: liquidityDistribution.partnerLockedPercentage,
    },
    lockedVesting: {
      totalLockedVestingAmount: 0,
      numberOfVestingPeriod: 0,
      cliffUnlockAmount: 0,
      totalVestingDuration: 0,
      cliffDurationFromMigrationTime: 0,
    },
    activationType: ActivationType.Timestamp,
    percentageSupplyOnMigration: input.percentageSupplyOnMigration,
    migrationQuoteThreshold: input.migrationQuoteThreshold,
  });
}
