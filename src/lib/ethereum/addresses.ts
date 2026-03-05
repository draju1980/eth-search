import { publicClient } from "./client";
import { withCache } from "../cache/memory-cache";
import { rateLimitedCall } from "../rate-limiter";
import { CACHE_TTLS } from "../constants";

export async function getBalance(address: string): Promise<bigint> {
  const cacheKey = `balance:${address}`;
  return withCache(cacheKey, CACHE_TTLS.ADDRESS_BALANCE, () =>
    rateLimitedCall(() =>
      publicClient.getBalance({ address: address as `0x${string}` })
    )
  );
}

export async function getCode(address: string): Promise<string> {
  const cacheKey = `code:${address}`;
  return withCache(cacheKey, CACHE_TTLS.FINALIZED_BLOCK, () =>
    rateLimitedCall(() =>
      publicClient.getCode({ address: address as `0x${string}` })
    )
  ) as Promise<string>;
}

export async function getTransactionCount(address: string): Promise<number> {
  const cacheKey = `txCount:${address}`;
  return withCache(cacheKey, CACHE_TTLS.ADDRESS_BALANCE, () =>
    rateLimitedCall(() =>
      publicClient.getTransactionCount({ address: address as `0x${string}` })
    )
  );
}
