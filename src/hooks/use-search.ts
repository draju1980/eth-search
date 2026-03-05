"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { classifySearch } from "@/lib/search";

export function useSearch() {
  const router = useRouter();

  const search = useCallback(
    async (query: string) => {
      const result = classifySearch(query.trim());

      if (result.type === "ens") {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.data?.redirect) {
          router.push(data.data.redirect);
          return { success: true };
        }
        return { success: false, error: "ENS name not found" };
      }

      if (result.type === "unknown") {
        return { success: false, error: "Could not identify search input" };
      }

      router.push(result.redirect);
      return { success: true };
    },
    [router]
  );

  return { search };
}
