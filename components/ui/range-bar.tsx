"use client";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface RangeBarProps {
  min: number;
  median: number;
  max: number;
  average?: number;
  label: string;
  unit?: string;
  color?: string;
  className?: string;
}

export const RangeBar = ({
  min,
  median,
  max,
  average,
  label,
  unit = "",
  color = "var(--chart-1)",
  className,
}: RangeBarProps) => {
  // Scale to percentage based on the max value with some padding
  const scale = (value: number) => (value / (max * 1.1)) * 100;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-xs text-muted-foreground w-20 truncate">
        {label}
      </span>
      <div className="relative flex-1 h-8">
        {/* Background track */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          <div className="w-full h-1.5 bg-muted rounded-full" />
        </div>

        {/* Range bar (min to max) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 rounded-full"
              style={{
                left: `${scale(min)}%`,
                width: `${scale(max) - scale(min)}%`,
                backgroundColor: color,
                opacity: 0.3,
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <div className="font-medium">{label}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1">
                <span className="text-muted-foreground">Min:</span>
                <span className="tabular-nums">
                  {min.toFixed(1)}
                  {unit}
                </span>
                <span className="text-muted-foreground">Median:</span>
                <span className="tabular-nums">
                  {median.toFixed(1)}
                  {unit}
                </span>
                <span className="text-muted-foreground">Max:</span>
                <span className="tabular-nums">
                  {max.toFixed(1)}
                  {unit}
                </span>
                {average !== undefined && (
                  <>
                    <span className="text-muted-foreground">Avg:</span>
                    <span className="tabular-nums">
                      {average.toFixed(1)}
                      {unit}
                    </span>
                  </>
                )}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Median marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-5 rounded-sm"
          style={{
            left: `${scale(median)}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: color,
          }}
        />

        {/* Average marker (optional) */}
        {average !== undefined && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-foreground"
            style={{
              left: `${scale(average)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* Min/Max labels */}
        <span
          className="absolute -bottom-4 text-[10px] text-muted-foreground tabular-nums"
          style={{ left: `${scale(min)}%`, transform: "translateX(-50%)" }}
        >
          {min.toFixed(1)}
        </span>
        <span
          className="absolute -bottom-4 text-[10px] text-muted-foreground tabular-nums"
          style={{ left: `${scale(max)}%`, transform: "translateX(-50%)" }}
        >
          {max.toFixed(1)}
        </span>
      </div>
      <span className="text-xs font-medium tabular-nums w-16 text-right">
        {median.toFixed(1)}
        {unit}
      </span>
    </div>
  );
};

// Multiple range bars stacked vertically
interface RangeBarGroupProps {
  bars: RangeBarProps[];
  className?: string;
}

export const RangeBarGroup = ({ bars, className }: RangeBarGroupProps) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {bars.map((bar, index) => (
        <RangeBar key={index} {...bar} />
      ))}
    </div>
  );
};
