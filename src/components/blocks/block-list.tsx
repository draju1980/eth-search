"use client";

import { useLatestBlocks } from "@/hooks/use-blocks";
import { BlockCard } from "./block-card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlockList() {
  const { data, isLoading, error } = useLatestBlocks();

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
    return <p className="text-sm text-destructive">Failed to load blocks</p>;
  }

  return (
    <div className="space-y-3">
      {data?.map((block) => (
        <BlockCard key={block.number} block={block} />
      ))}
    </div>
  );
}
