import { publicClient } from "./client";
import { withCache } from "../cache/memory-cache";
import { rateLimitedCall } from "../rate-limiter";
import { CACHE_TTLS } from "../constants";
import type { Block } from "viem";

export async function getBlock(
  numberOrHash: string
): Promise<Block> {
  const isHash = numberOrHash.startsWith("0x") && numberOrHash.length === 66;
  const cacheKey = `block:${numberOrHash}`;

  return withCache(cacheKey, CACHE_TTLS.FINALIZED_BLOCK, () =>
    rateLimitedCall(() =>
      isHash
        ? publicClient.getBlock({ blockHash: numberOrHash as `0x${string}` })
        : publicClient.getBlock({ blockNumber: BigInt(numberOrHash) })
    )
  );
}

export async function getLatestBlockNumber(): Promise<bigint> {
  return withCache("latestBlockNumber", CACHE_TTLS.LATEST_BLOCK_NUMBER, () =>
    rateLimitedCall(() => publicClient.getBlockNumber())
  );
}

export async function getLatestBlocks(count = 10): Promise<Block[]> {
  const latest = await getLatestBlockNumber();
  const blocks: Promise<Block>[] = [];
  for (let i = 0; i < count; i++) {
    const num = latest - BigInt(i);
    if (num < 0n) break;
    blocks.push(getBlock(num.toString()));
  }
  return Promise.all(blocks);
}
