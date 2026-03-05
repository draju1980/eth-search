import { NextResponse } from "next/server";
import { getLatestBlocks } from "@/lib/ethereum/blocks";
import { bigIntToString } from "@/lib/formatters";
import type { SerializedBlock } from "@/types/block";

function serializeBlock(block: Record<string, unknown>): SerializedBlock {
  return {
    number: String(block.number),
    hash: String(block.hash),
    parentHash: String(block.parentHash),
    timestamp: String(block.timestamp),
    miner: String(block.miner),
    gasUsed: String(block.gasUsed),
    gasLimit: String(block.gasLimit),
    baseFeePerGas: block.baseFeePerGas != null ? String(block.baseFeePerGas) : null,
    transactionCount: Array.isArray(block.transactions) ? block.transactions.length : 0,
    size: String(block.size),
    extraData: String(block.extraData),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Math.min(parseInt(searchParams.get("count") || "10", 10), 50);

  try {
    const blocks = await getLatestBlocks(count);
    const serialized = blocks.map((b) => serializeBlock(bigIntToString(b) as Record<string, unknown>));
    return NextResponse.json({ data: serialized });
  } catch (error) {
    console.error("Failed to fetch blocks:", error);
    return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 });
  }
}
