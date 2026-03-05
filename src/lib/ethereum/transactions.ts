import { publicClient } from "./client";
import { withCache } from "../cache/memory-cache";
import { rateLimitedCall } from "../rate-limiter";
import { CACHE_TTLS } from "../constants";

export async function getTransaction(hash: string) {
  const cacheKey = `tx:${hash}`;
  return withCache(cacheKey, CACHE_TTLS.TRANSACTION, () =>
    rateLimitedCall(() =>
      publicClient.getTransaction({ hash: hash as `0x${string}` })
    )
  );
}

export async function getTransactionReceipt(hash: string) {
  const cacheKey = `txReceipt:${hash}`;
  return withCache(cacheKey, CACHE_TTLS.TRANSACTION, () =>
    rateLimitedCall(() =>
      publicClient.getTransactionReceipt({ hash: hash as `0x${string}` })
    )
  );
}
