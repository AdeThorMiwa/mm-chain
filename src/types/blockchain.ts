export enum BlockchainMessageType {
  REQUEST_LATEST_BLOCK,
  RECEIVE_LATEST_BLOCK,
  REQUEST_BLOCKCHAIN,
  RECEIVE_BLOCKCHAIN,
}

export type BlockchainMessage = { type: BlockchainMessageType; data?: unknown };
