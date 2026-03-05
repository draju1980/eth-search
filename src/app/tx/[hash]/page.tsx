"use client";

import { use } from "react";
import Link from "next/link";
import { useTransaction } from "@/hooks/use-transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { HashDisplay } from "@/components/shared/hash-display";
import { AddressLink } from "@/components/shared/address-link";
import { EthValue } from "@/components/shared/eth-value";

export default function TransactionPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  const { data, isLoading, error } = useTransaction(hash);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Transaction Not Found</h1>
        <p className="text-muted-foreground">Could not find transaction {hash}.</p>
      </div>
    );
  }

  const { transaction: tx, receipt } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Transaction Details</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Overview
            {receipt && (
              <Badge variant={receipt.status === "success" ? "default" : "destructive"}>
                {receipt.status === "success" ? "Success" : "Failed"}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4">
            <Row label="Transaction Hash">
              <HashDisplay hash={tx.hash} shorten={false} />
            </Row>
            {tx.blockNumber && (
              <Row label="Block">
                <Link
                  href={`/block/${tx.blockNumber}`}
                  className="text-primary hover:underline font-mono text-sm"
                >
                  {String(tx.blockNumber)}
                </Link>
              </Row>
            )}
            <Row label="From">
              <AddressLink address={tx.from} shorten={false} showCopy />
            </Row>
            <Row label="To">
              {tx.to ? (
                <AddressLink address={tx.to} shorten={false} showCopy />
              ) : (
                <Badge variant="outline">Contract Creation</Badge>
              )}
            </Row>
            {receipt?.contractAddress && (
              <Row label="Contract Created">
                <AddressLink address={receipt.contractAddress} shorten={false} showCopy />
              </Row>
            )}
            <Row label="Value">
              <EthValue wei={String(tx.value)} />
            </Row>
          </dl>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Gas Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4">
            <Row label="Gas Limit">
              {Number(tx.gas).toLocaleString()}
            </Row>
            {receipt && (
              <Row label="Gas Used">
                {Number(receipt.gasUsed).toLocaleString()}
              </Row>
            )}
            {tx.gasPrice && (
              <Row label="Gas Price">
                {(Number(tx.gasPrice) / 1e9).toFixed(4)} Gwei
              </Row>
            )}
            {tx.maxFeePerGas && (
              <Row label="Max Fee Per Gas">
                {(Number(tx.maxFeePerGas) / 1e9).toFixed(4)} Gwei
              </Row>
            )}
            {tx.maxPriorityFeePerGas && (
              <Row label="Max Priority Fee">
                {(Number(tx.maxPriorityFeePerGas) / 1e9).toFixed(4)} Gwei
              </Row>
            )}
            {receipt && (
              <Row label="Transaction Fee">
                <EthValue wei={String(BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice))} />
              </Row>
            )}
          </dl>
        </CardContent>
      </Card>

      {tx.input && tx.input !== "0x" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs font-mono break-all whitespace-pre-wrap">
              {tx.input}
            </pre>
          </CardContent>
        </Card>
      )}

      {receipt?.logs && receipt.logs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Event Logs ({receipt.logs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receipt.logs.slice(0, 20).map((log: { address: string; topics: string[]; data: string; logIndex: number }) => (
                <div key={log.logIndex} className="rounded-md border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{log.logIndex}</Badge>
                    <AddressLink address={log.address} showCopy />
                  </div>
                  {log.topics.map((topic: string, i: number) => (
                    <div key={i} className="text-xs font-mono text-muted-foreground break-all">
                      <span className="text-foreground">Topic {i}:</span> {topic}
                    </div>
                  ))}
                  {log.data !== "0x" && (
                    <div className="text-xs font-mono text-muted-foreground break-all">
                      <span className="text-foreground">Data:</span> {log.data}
                    </div>
                  )}
                </div>
              ))}
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
