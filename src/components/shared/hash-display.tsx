import { shortenHash } from "@/lib/formatters";
import { CopyButton } from "./copy-button";

interface HashDisplayProps {
  hash: string;
  shorten?: boolean;
  showCopy?: boolean;
}

export function HashDisplay({ hash, shorten = true, showCopy = true }: HashDisplayProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="font-mono text-sm" title={hash}>
        {shorten ? shortenHash(hash) : hash}
      </span>
      {showCopy && <CopyButton value={hash} />}
    </span>
  );
}
