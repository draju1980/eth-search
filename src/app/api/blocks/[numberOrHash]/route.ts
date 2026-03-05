import { NextResponse } from "next/server";
import { getBlock } from "@/lib/ethereum/blocks";
import { bigIntToString } from "@/lib/formatters";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ numberOrHash: string }> }
) {
  const { numberOrHash } = await params;

  try {
    const block = await getBlock(numberOrHash);
    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }
    return NextResponse.json({ data: bigIntToString(block) });
  } catch (error) {
    console.error("Failed to fetch block:", error);
    return NextResponse.json({ error: "Failed to fetch block" }, { status: 500 });
  }
}
