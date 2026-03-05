import { NextResponse } from "next/server";
import { getBalance, getCode, getTransactionCount } from "@/lib/ethereum/addresses";
import { lookupEnsName } from "@/lib/ethereum/ens";
import type { AddressInfo } from "@/types/address";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  try {
    const [balance, code, txCount, ensName] = await Promise.all([
      getBalance(address),
      getCode(address).catch(() => null),
      getTransactionCount(address),
      lookupEnsName(address).catch(() => null),
    ]);

    const info: AddressInfo = {
      address,
      balance: balance.toString(),
      transactionCount: txCount,
      isContract: !!code && code !== "0x",
      ensName,
    };

    return NextResponse.json({ data: info });
  } catch (error) {
    console.error("Failed to fetch address info:", error);
    return NextResponse.json({ error: "Failed to fetch address info" }, { status: 500 });
  }
}
