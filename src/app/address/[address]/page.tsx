"use client";

import { use } from "react";
import { useAddress } from "@/hooks/use-address";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";
import { EthValue } from "@/components/shared/eth-value";

export default function AddressPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const { data, isLoading, error } = useAddress(address);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-96 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Address Not Found</h1>
        <p className="text-muted-foreground">Could not find information for {address}.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold">
          {data.isContract ? "Contract" : "Address"}
        </h1>
        {data.ensName && (
          <Badge variant="secondary" className="text-base">
            {data.ensName}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6 bg-muted rounded-md px-4 py-3">
        <span className="font-mono text-sm break-all">{data.address}</span>
        <CopyButton value={data.address} />
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EthValue wei={data.balance} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-semibold">
              {data.transactionCount.toLocaleString()}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={data.isContract ? "default" : "outline"}>
              {data.isContract ? "Contract" : "EOA"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
