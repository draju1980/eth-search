"use client";

import { useQuery } from "@tanstack/react-query";
import type { SerializedBlock } from "@/types/block";

export function useLatestBlocks(count = 10) {
  return useQuery<SerializedBlock[]>({
    queryKey: ["latestBlocks", count],
    queryFn: async () => {
      const res = await fetch(`/api/blocks?count=${count}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json.data;
    },
    refetchInterval: 12000,
  });
}

export function useBlock(numberOrHash: string) {
  return useQuery({
    queryKey: ["block", numberOrHash],
    queryFn: async () => {
      const res = await fetch(`/api/blocks/${numberOrHash}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json.data;
    },
    enabled: !!numberOrHash,
  });
}
