"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface FunnelStage {
  label: string;
  value: number;
  color?: string;
}

interface HorizontalFunnelProps {
  stages: FunnelStage[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}

const defaultColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export const HorizontalFunnel = ({
  stages,
  height = 40,
  showLabels = true,
  showValues = true,
  className,
}: HorizontalFunnelProps) => {
  const total = useMemo(
    () => stages.reduce((sum, stage) => sum + stage.value, 0),
    [stages]
  );

  if (total === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      {/* Funnel bar */}
      <div
        className="flex w-full overflow-hidden rounded-md"
        style={{ height }}
      >
        {stages.map((stage, index) => {
          const percentage = (stage.value / total) * 100;
          const color =
            stage.color || defaultColors[index % defaultColors.length];

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className="relative flex items-center justify-center transition-all hover:opacity-80 cursor-default"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                    minWidth: percentage > 0 ? "20px" : 0,
                  }}
                >
                  {showValues && percentage >= 8 && (
                    <span className="text-xs font-medium text-white drop-shadow-sm">
                      {stage.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <div className="font-medium">{stage.label}</div>
                  <div className="text-muted-foreground">
                    {stage.value.toLocaleString()} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Labels below */}
      {showLabels && (
        <div className="flex mt-2 gap-4 flex-wrap">
          {stages.map((stage, index) => {
            const color =
              stage.color || defaultColors[index % defaultColors.length];
            const percentage = (stage.value / total) * 100;

            return (
              <div key={index} className="flex items-center gap-1.5 text-xs">
                <div
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-muted-foreground">{stage.label}</span>
                <span className="font-medium tabular-nums">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Vertical funnel for conversion flows
interface VerticalFunnelProps {
  stages: FunnelStage[];
  className?: string;
}

export const VerticalFunnel = ({ stages, className }: VerticalFunnelProps) => {
  const maxValue = useMemo(
    () => Math.max(...stages.map((s) => s.value)),
    [stages]
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {stages.map((stage, index) => {
        const widthPercent = (stage.value / maxValue) * 100;
        const color =
          stage.color || defaultColors[index % defaultColors.length];
        const conversionRate =
          index > 0
            ? ((stage.value / stages[index - 1].value) * 100).toFixed(1)
            : null;

        return (
          <div key={index} className="flex flex-col gap-1">
            {/* Conversion rate arrow */}
            {conversionRate && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-2">
                <span>↓</span>
                <span>{conversionRate}% conversion</span>
              </div>
            )}

            {/* Stage bar */}
            <div className="flex items-center gap-3">
              <div className="relative h-8 flex-1 bg-muted/30 rounded overflow-hidden">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute inset-y-0 left-0 flex items-center justify-end px-2 transition-all"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: color,
                        minWidth: stage.value > 0 ? "40px" : 0,
                      }}
                    >
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {stage.value.toLocaleString()}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <div className="font-medium">{stage.label}</div>
                      <div className="text-muted-foreground">
                        {stage.value.toLocaleString()} items
                        {conversionRate &&
                          ` (${conversionRate}% from previous)`}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-xs text-muted-foreground w-24 truncate">
                {stage.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Segmented progress bar (like GitHub language bar)
interface SegmentedBarProps {
  segments: {
    label: string;
    value: number;
    color: string;
  }[];
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export const SegmentedBar = ({
  segments,
  height = 8,
  showLegend = true,
  className,
}: SegmentedBarProps) => {
  const total = useMemo(
    () => segments.reduce((sum, seg) => sum + seg.value, 0),
    [segments]
  );

  if (total === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <div
        className="flex w-full overflow-hidden rounded-full"
        style={{ height }}
      >
        {segments.map((segment, index) => {
          const percentage = (segment.value / total) * 100;

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className="transition-all hover:opacity-80"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: segment.color,
                    minWidth: percentage > 0 ? "2px" : 0,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <span className="font-medium">{segment.label}</span>
                  <span className="text-muted-foreground ml-1">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {showLegend && (
        <div className="flex mt-3 gap-x-4 gap-y-1.5 flex-wrap">
          {segments.map((segment, index) => {
            const percentage = (segment.value / total) * 100;

            return (
              <div key={index} className="flex items-center gap-1.5 text-xs">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-muted-foreground">{segment.label}</span>
                <span className="font-medium tabular-nums">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
