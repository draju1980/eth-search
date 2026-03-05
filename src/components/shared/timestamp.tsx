"use client";

import { timeAgo, formatTimestamp } from "@/lib/formatters";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TimestampProps {
  unix: number;
}

export function Timestamp({ unix }: TimestampProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-sm text-muted-foreground cursor-default">
          {timeAgo(unix)}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{formatTimestamp(unix)}</p>
      </TooltipContent>
    </Tooltip>
  );
}
