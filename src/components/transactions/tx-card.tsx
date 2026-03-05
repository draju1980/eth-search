import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { HashDisplay } from "@/components/shared/hash-display";
import { AddressLink } from "@/components/shared/address-link";
import { EthValue } from "@/components/shared/eth-value";

interface TxCardProps {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: string;
}

export function TxCard({ hash, from, to, value, blockNumber }: TxCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <Link href={`/tx/${hash}`} className="hover:underline">
            <HashDisplay hash={hash} showCopy={false} />
          </Link>
          <span className="text-xs text-muted-foreground">
            Block{" "}
            <Link href={`/block/${blockNumber}`} className="text-primary hover:underline">
              #{blockNumber}
            </Link>
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">From</span>
            <AddressLink address={from} />
          </div>
          {to && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">To</span>
              <AddressLink address={to} />
            </div>
          )}
          <EthValue wei={value} />
        </div>
      </CardContent>
    </Card>
  );
}
