"use client";

import { useQuery } from "@tanstack/react-query";

export function useTransaction(hash: string) {
  return useQuery({
    queryKey: ["transaction", hash],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/${hash}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json.data;
    },
    enabled: !!hash,
  });
}
