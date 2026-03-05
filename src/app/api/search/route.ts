import { NextResponse } from "next/server";
import { classifySearch } from "@/lib/search";
import { resolveEnsName } from "@/lib/ethereum/ens";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const result = classifySearch(query);

  if (result.type === "ens") {
    try {
      const address = await resolveEnsName(query);
      if (address) {
        return NextResponse.json({
          data: { type: "address", query, redirect: `/address/${address}`, resolvedAddress: address },
        });
      }
      return NextResponse.json({ error: "ENS name not found" }, { status: 404 });
    } catch {
      return NextResponse.json({ error: "Failed to resolve ENS name" }, { status: 500 });
    }
  }

  if (result.type === "unknown") {
    return NextResponse.json({ error: "Could not identify search input" }, { status: 400 });
  }

  return NextResponse.json({ data: result });
}
