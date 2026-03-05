export type SearchType = "block" | "transaction" | "address" | "ens" | "unknown";

export interface SearchResult {
  type: SearchType;
  query: string;
  redirect: string;
}

const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const BLOCK_NUMBER_REGEX = /^\d+$/;
const ENS_REGEX = /^[a-zA-Z0-9-]+\.eth$/;

export function classifySearch(input: string): SearchResult {
  const trimmed = input.trim();

  if (TX_HASH_REGEX.test(trimmed)) {
    return { type: "transaction", query: trimmed, redirect: `/tx/${trimmed}` };
  }

  if (ADDRESS_REGEX.test(trimmed)) {
    return {
      type: "address",
      query: trimmed,
      redirect: `/address/${trimmed}`,
    };
  }

  if (BLOCK_NUMBER_REGEX.test(trimmed)) {
    return {
      type: "block",
      query: trimmed,
      redirect: `/block/${trimmed}`,
    };
  }

  if (ENS_REGEX.test(trimmed)) {
    return { type: "ens", query: trimmed, redirect: `/address/${trimmed}` };
  }

  return { type: "unknown", query: trimmed, redirect: "" };
}
