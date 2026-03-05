"use client";

import { useQuery } from "@tanstack/react-query";
import type { AddressInfo } from "@/types/address";

export function useAddress(address: string) {
  return useQuery<AddressInfo>({
    queryKey: ["address", address],
    queryFn: async () => {
      const res = await fetch(`/api/address/${address}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json.data;
    },
    enabled: !!address,
  });
}
