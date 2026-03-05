import { formatEther } from "viem";

interface EthValueProps {
  wei: string;
  showUnit?: boolean;
  precision?: number;
}

export function EthValue({ wei, showUnit = true, precision = 6 }: EthValueProps) {
  const eth = formatEther(BigInt(wei));
  const formatted = parseFloat(eth).toFixed(precision);
  const display = parseFloat(formatted).toString();

  return (
    <span className="font-mono text-sm">
      {display}
      {showUnit && <span className="ml-1 text-muted-foreground">ETH</span>}
    </span>
  );
}
