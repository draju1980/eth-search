export interface SerializedTransaction {
  hash: string;
  blockNumber: string | null;
  blockHash: string | null;
  from: string;
  to: string | null;
  value: string;
  gas: string;
  gasPrice: string | null;
  maxFeePerGas: string | null;
  maxPriorityFeePerGas: string | null;
  nonce: number;
  input: string;
  transactionIndex: number | null;
  type: string;
}

export interface SerializedTransactionReceipt {
  transactionHash: string;
  blockNumber: string;
  blockHash: string;
  from: string;
  to: string | null;
  contractAddress: string | null;
  gasUsed: string;
  effectiveGasPrice: string;
  cumulativeGasUsed: string;
  status: "success" | "reverted";
  logs: SerializedLog[];
}

export interface SerializedLog {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  transactionHash: string;
  logIndex: number;
}
