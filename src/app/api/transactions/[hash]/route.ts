import { NextResponse } from "next/server";
import { getTransaction, getTransactionReceipt } from "@/lib/ethereum/transactions";
import { bigIntToString } from "@/lib/formatters";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;

  try {
    const [tx, receipt] = await Promise.all([
      getTransaction(hash),
      getTransactionReceipt(hash).catch(() => null),
    ]);

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        transaction: bigIntToString(tx),
        receipt: receipt ? bigIntToString(receipt) : null,
      },
    });
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
  }
}
