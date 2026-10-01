import { CpAmm } from '@meteora-ag/cp-amm-sdk';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { Connection, PublicKey } from '@solana/web3.js';

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
