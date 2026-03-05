"use client";

import { use } from "react";
import Link from "next/link";
import { useBlock } from "@/hooks/use-blocks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { HashDisplay } from "@/components/shared/hash-display";
import { AddressLink } from "@/components/shared/address-link";
import { Timestamp } from "@/components/shared/timestamp";
import { formatNumber } from "@/lib/formatters";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlockPage({ params }: { params: Promise<{ numberOrHash: string }> }) {
  const { numberOrHash } = use(params);
  const { data: block, isLoading, error } = useBlock(numberOrHash);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !block) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Block Not Found</h1>
        <p className="text-muted-foreground">
          Could not find block {numberOrHash}.
        </p>
      </div>
    );
  }

  const blockNumber = Number(block.number);
  const txCount = Array.isArray(block.transactions) ? block.transactions.length : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Block #{String(block.number)}</h1>
        <div className="flex gap-1">
          {blockNumber > 0 && (
            <Link href={`/block/${blockNumber - 1}`}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <Link href={`/block/${blockNumber + 1}`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Block Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4">
            <Row label="Block Hash">
              <HashDisplay hash={block.hash} shorten={false} />
            </Row>
            <Row label="Timestamp">
              <Timestamp unix={Number(block.timestamp)} />
            </Row>
            <Row label="Transactions">
              <Badge variant="secondary">{txCount} transactions</Badge>
            </Row>
            <Row label="Miner">
              <AddressLink address={block.miner} shorten={false} showCopy />
            </Row>
            <Row label="Gas Used">
              {formatNumber(Number(block.gasUsed))} / {formatNumber(Number(block.gasLimit))}
            </Row>
            {block.baseFeePerGas && (
              <Row label="Base Fee">
                {(Number(block.baseFeePerGas) / 1e9).toFixed(4)} Gwei
              </Row>
            )}
            <Row label="Size">
              {formatNumber(Number(block.size))} bytes
            </Row>
            <Row label="Parent Hash">
              <Link href={`/block/${blockNumber - 1}`} className="hover:underline">
                <HashDisplay hash={block.parentHash} shorten={false} showCopy={false} />
              </Link>
            </Row>
          </dl>
        </CardContent>
      </Card>

      {txCount > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Transactions ({txCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(block.transactions as string[]).slice(0, 50).map((tx: string) => {
                const txHash = typeof tx === "object" ? (tx as Record<string, string>).hash : tx;
                return (
                  <div key={txHash} className="flex items-center justify-between py-2 border-b last:border-0">
                    <Link href={`/tx/${txHash}`} className="hover:underline">
                      <HashDisplay hash={txHash} />
                    </Link>
                  </div>
                );
              })}
              {txCount > 50 && (
                <p className="text-sm text-muted-foreground pt-2">
                  Showing 50 of {txCount} transactions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm break-all">{children}</dd>
    </div>
  );
}
