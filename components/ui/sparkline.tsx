'use client';

import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
  showArea?: boolean;
}

export const Sparkline = ({
  data,
  color = 'var(--chart-1)',
  height = 24,
  className,
  showArea = true,
}: SparklineProps) => {
  const chartData = useMemo(
    () => data.map((value, index) => ({ index, value })),
    [data]
  );

  const trend = useMemo(() => {
    if (data.length < 2) return 'neutral';
    const first = data[0];
    const last = data[data.length - 1];
    if (last > first * 1.05) return 'up';
    if (last < first * 0.95) return 'down';
    return 'neutral';
  }, [data]);

  const strokeColor = useMemo(() => {
    if (color !== 'auto') return color;
    if (trend === 'up') return 'var(--color-success)';
    if (trend === 'down') return 'var(--color-destructive)';
    return 'var(--chart-1)';
  }, [color, trend]);

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={`sparkline-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill={showArea ? `url(#sparkline-gradient-${color})` : 'transparent'}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Smaller variant for inline use
interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export const MiniSparkline = ({
  data,
  width = 48,
  height = 16,
  color = 'currentColor',
}: MiniSparklineProps) => {
  const points = useMemo(() => {
    if (data.length < 2) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data, width, height]);

  if (data.length < 2) return null;

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
