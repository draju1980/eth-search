export interface AddressInfo {
  address: string;
  balance: string;
  transactionCount: number;
  isContract: boolean;
  ensName: string | null;
}
