import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Timestamp } from "@/components/shared/timestamp";
import { AddressLink } from "@/components/shared/address-link";
import type { SerializedBlock } from "@/types/block";

export function BlockCard({ block }: { block: SerializedBlock }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <Link
            href={`/block/${block.number}`}
            className="font-mono text-sm font-medium text-primary hover:underline"
          >
            Block #{block.number}
          </Link>
          <Timestamp unix={parseInt(block.timestamp)} />
        </div>
        <div className="flex flex-col items-end gap-1 text-sm">
          <span className="text-muted-foreground">
            {block.transactionCount} txns
          </span>
          <AddressLink address={block.miner} />
        </div>
      </CardContent>
    </Card>
  );
}
