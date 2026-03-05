"use client";

import { useLatestBlocks } from "@/hooks/use-blocks";
import { TxCard } from "./tx-card";
import { Skeleton } from "@/components/ui/skeleton";

interface SimpleTx {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: string;
}

export function TxList() {
  const { data: blocks, isLoading, error } = useLatestBlocks(3);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Failed to load transactions</p>;
  }

  // Since blocks API returns block summaries (not full tx data), we show
  // block-level transaction counts. Full tx list requires fetching each block with txs.
  // For home page, we show a simplified view from blocks data.
  if (!blocks?.length) {
    return <p className="text-sm text-muted-foreground">No recent transactions</p>;
  }

  return (
    <div className="space-y-3">
      <LatestTxsFromApi />
    </div>
  );
}

function LatestTxsFromApi() {
  // Fetch recent transactions from latest blocks
  const { data, isLoading } = useLatestTransactions();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No recent transactions</p>;
  }

  return (
    <>
      {data.slice(0, 10).map((tx: SimpleTx) => (
        <TxCard key={tx.hash} {...tx} />
      ))}
    </>
  );
}

import { useQuery } from "@tanstack/react-query";

function useLatestTransactions() {
  return useQuery({
    queryKey: ["latestTransactions"],
    queryFn: async () => {
      const res = await fetch("/api/blocks?count=2");
      const json = await res.json();
      if (!json.data) return [];
      // Fetch full block data for first 2 blocks to get transactions
      const txs: SimpleTx[] = [];
      for (const block of json.data) {
        const blockRes = await fetch(`/api/blocks/${block.number}`);
        const blockJson = await blockRes.json();
        if (blockJson.data?.transactions) {
          for (const tx of blockJson.data.transactions.slice(0, 5)) {
            if (typeof tx === "object" && tx.hash) {
              txs.push({
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: String(tx.value),
                blockNumber: String(blockJson.data.number),
              });
            }
          }
        }
      }
      return txs;
    },
    refetchInterval: 12000,
  });
}
