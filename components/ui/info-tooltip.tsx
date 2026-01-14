"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export const InfoTooltip = ({ content, className }: InfoTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center justify-center text-muted-foreground/60 hover:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full ${className}`}
          aria-label="More information"
        >
          <IconInfoCircle className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-left">{content}</TooltipContent>
    </Tooltip>
  );
};
