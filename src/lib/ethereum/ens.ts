import { publicClient } from "./client";
import { withCache } from "../cache/memory-cache";
import { rateLimitedCall } from "../rate-limiter";
import { CACHE_TTLS } from "../constants";
import { normalize } from "viem/ens";

export async function resolveEnsName(
  name: string
): Promise<string | null> {
  const cacheKey = `ens:resolve:${name}`;
  return withCache(cacheKey, CACHE_TTLS.ENS, () =>
    rateLimitedCall(() =>
      publicClient.getEnsAddress({ name: normalize(name) })
    )
  );
}

export async function lookupEnsName(
  address: string
): Promise<string | null> {
  const cacheKey = `ens:lookup:${address}`;
  return withCache(cacheKey, CACHE_TTLS.ENS, () =>
    rateLimitedCall(() =>
      publicClient.getEnsName({ address: address as `0x${string}` })
    )
  );
}
