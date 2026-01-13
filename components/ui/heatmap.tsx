'use client';

import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

interface HeatmapCell {
  label: string;
  value: number;
  tooltip?: string;
}

interface HeatmapGridProps {
  data: HeatmapCell[][];
  rowLabels?: string[];
  columnLabels?: string[];
  colorScale?: 'green' | 'orange' | 'blue' | 'neutral';
  className?: string;
  cellSize?: number;
  gap?: number;
}

const colorScales = {
  green: {
    0: 'bg-muted/30',
    1: 'bg-emerald-100 dark:bg-emerald-900/30',
    2: 'bg-emerald-200 dark:bg-emerald-800/40',
    3: 'bg-emerald-300 dark:bg-emerald-700/50',
    4: 'bg-emerald-500 dark:bg-emerald-600/70',
  },
  orange: {
    0: 'bg-muted/30',
    1: 'bg-orange-100 dark:bg-orange-900/30',
    2: 'bg-orange-200 dark:bg-orange-800/40',
    3: 'bg-orange-300 dark:bg-orange-700/50',
    4: 'bg-orange-500 dark:bg-orange-600/70',
  },
  blue: {
    0: 'bg-muted/30',
    1: 'bg-blue-100 dark:bg-blue-900/30',
    2: 'bg-blue-200 dark:bg-blue-800/40',
    3: 'bg-blue-300 dark:bg-blue-700/50',
    4: 'bg-blue-500 dark:bg-blue-600/70',
  },
  neutral: {
    0: 'bg-muted/30',
    1: 'bg-muted/50',
    2: 'bg-muted/70',
    3: 'bg-muted-foreground/30',
    4: 'bg-muted-foreground/50',
  },
};

export const HeatmapGrid = ({
  data,
  rowLabels,
  columnLabels,
  colorScale = 'green',
  className,
  cellSize = 20,
  gap = 2,
}: HeatmapGridProps) => {
  const { maxValue, getIntensity } = useMemo(() => {
    const allValues = data.flat().map((cell) => cell.value);
    const max = Math.max(...allValues, 1);
    return {
      maxValue: max,
      getIntensity: (value: number) => {
        if (value === 0) return 0;
        const ratio = value / max;
        if (ratio < 0.25) return 1;
        if (ratio < 0.5) return 2;
        if (ratio < 0.75) return 3;
        return 4;
      },
    };
  }, [data]);

  const colors = colorScales[colorScale];

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Column labels */}
      {columnLabels && (
        <div
          className="flex mb-1"
          style={{ marginLeft: rowLabels ? '2rem' : 0, gap }}
        >
          {columnLabels.map((label, i) => (
            <div
              key={i}
              className="text-[10px] text-muted-foreground text-center"
              style={{ width: cellSize }}
            >
              {label}
            </div>
          ))}
        </div>
      )}

      {/* Grid rows */}
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center" style={{ gap }}>
          {/* Row label */}
          {rowLabels && (
            <div
              className="text-[10px] text-muted-foreground w-8 text-right pr-2"
            >
              {rowLabels[rowIndex]}
            </div>
          )}

          {/* Cells */}
          {row.map((cell, colIndex) => (
            <Tooltip key={colIndex}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'rounded-sm transition-colors cursor-default',
                    colors[getIntensity(cell.value) as keyof typeof colors]
                  )}
                  style={{ width: cellSize, height: cellSize }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <div className="font-medium">{cell.label}</div>
                  {cell.tooltip || `${cell.value.toLocaleString()} activities`}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      ))}
    </div>
  );
};

// Calendar-style heatmap (weeks as columns, days as rows)
interface CalendarHeatmapProps {
  data: { date: string; value: number }[];
  colorScale?: 'green' | 'orange' | 'blue' | 'neutral';
  className?: string;
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarHeatmap = ({
  data,
  colorScale = 'green',
  className,
}: CalendarHeatmapProps) => {
  const { weeks, months } = useMemo(() => {
    if (data.length === 0) return { weeks: [], months: [] };

    // Sort data by date
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by weeks (7 days each)
    const weekMap: Map<number, HeatmapCell[]> = new Map();
    const monthMarkers: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;

    sorted.forEach((item) => {
      const date = new Date(item.date);
      const dayOfWeek = date.getDay();
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - dayOfWeek);
      const weekKey = weekStart.getTime();

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, Array(7).fill(null).map(() => ({ label: '', value: 0 })));
      }

      const week = weekMap.get(weekKey)!;
      week[dayOfWeek] = {
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.value,
        tooltip: `${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: ${item.value.toLocaleString()}`,
      };

      // Track month changes
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthMarkers.push({
          weekIndex: Array.from(weekMap.keys()).indexOf(weekKey),
          label: date.toLocaleDateString('en-US', { month: 'short' }),
        });
        lastMonth = month;
      }
    });

    // Convert to array of weeks
    const weeksArray = Array.from(weekMap.values());

    return { weeks: weeksArray, months: monthMarkers };
  }, [data]);

  if (weeks.length === 0) return null;

  // Transpose: we want days as rows, weeks as columns
  const transposed: HeatmapCell[][] = Array(7)
    .fill(null)
    .map((_, dayIndex) => weeks.map((week) => week[dayIndex]));

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* Month labels */}
      <div className="flex ml-8 gap-0.5 text-[10px] text-muted-foreground h-4">
        {months.map((marker, i) => (
          <div
            key={i}
            className="absolute"
            style={{ marginLeft: marker.weekIndex * 14 }}
          >
            {marker.label}
          </div>
        ))}
      </div>

      {/* Grid with day labels */}
      <HeatmapGrid
        data={transposed}
        rowLabels={dayLabels}
        colorScale={colorScale}
        cellSize={12}
        gap={2}
      />
    </div>
  );
};
