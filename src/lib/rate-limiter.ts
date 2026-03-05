import PQueue from "p-queue";

const concurrency = parseInt(process.env.RPC_MAX_CONCURRENT || "10", 10);
const rpsLimit = parseInt(process.env.RPC_REQUESTS_PER_SECOND || "25", 10);

export const rpcQueue = new PQueue({
  concurrency,
  interval: 1000,
  intervalCap: rpsLimit,
});

export function rateLimitedCall<T>(fn: () => Promise<T>): Promise<T> {
  return rpcQueue.add(fn) as Promise<T>;
}
