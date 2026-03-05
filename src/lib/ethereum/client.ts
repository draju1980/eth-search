import { createPublicClient, http, fallback } from "viem";
import { mainnet } from "viem/chains";

function getRpcUrl(): string {
  const url = process.env.ETHEREUM_RPC_URL;
  if (!url) throw new Error("ETHEREUM_RPC_URL is required");
  return url;
}

function createTransport() {
  const primary = http(getRpcUrl());
  const fallbackUrl = process.env.ETHEREUM_RPC_URL_FALLBACK;
  if (fallbackUrl) {
    return fallback([primary, http(fallbackUrl)]);
  }
  return primary;
}

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: createTransport(),
});
