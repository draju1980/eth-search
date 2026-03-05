import Link from "next/link";
import { shortenAddress } from "@/lib/formatters";
import { KNOWN_ADDRESSES } from "@/lib/constants";
import { CopyButton } from "./copy-button";

interface AddressLinkProps {
  address: string;
  shorten?: boolean;
  showCopy?: boolean;
}

export function AddressLink({ address, shorten = true, showCopy = false }: AddressLinkProps) {
  const label = KNOWN_ADDRESSES[address] || (shorten ? shortenAddress(address) : address);

  return (
    <span className="inline-flex items-center gap-1">
      <Link
        href={`/address/${address}`}
        className="font-mono text-sm text-primary hover:underline"
        title={address}
      >
        {label}
      </Link>
      {showCopy && <CopyButton value={address} />}
    </span>
  );
}
