'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface GaugeProps {
  value: number;
  max?: number;
  target?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'danger' | 'auto';
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

const sizes = {
  sm: { width: 80, stroke: 6, fontSize: 'text-sm', labelSize: 'text-[10px]' },
  md: { width: 120, stroke: 8, fontSize: 'text-xl', labelSize: 'text-xs' },
  lg: { width: 160, stroke: 10, fontSize: 'text-3xl', labelSize: 'text-sm' },
};

const colorClasses = {
  default: 'stroke-chart-1',
  success: 'stroke-emerald-500 dark:stroke-emerald-400',
  warning: 'stroke-amber-500 dark:stroke-amber-400',
  danger: 'stroke-rose-500 dark:stroke-rose-400',
};

export const Gauge = ({
  value,
  max = 100,
  target,
  label,
  size = 'md',
  color = 'default',
  showValue = true,
  valueFormatter = (v) => `${Math.round(v)}%`,
  className,
}: GaugeProps) => {
  const { width, stroke, fontSize, labelSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * Math.PI; // Semi-circle

  const percentage = useMemo(() => Math.min(value / max, 1), [value, max]);

  const strokeColor = useMemo(() => {
    if (color !== 'auto') return colorClasses[color];
    if (target) {
      const ratio = value / target;
      if (ratio >= 1) return colorClasses.success;
      if (ratio >= 0.8) return colorClasses.warning;
      return colorClasses.danger;
    }
    if (percentage >= 0.8) return colorClasses.success;
    if (percentage >= 0.5) return colorClasses.warning;
    return colorClasses.danger;
  }, [color, value, target, percentage]);

  const targetAngle = useMemo(() => {
    if (!target) return null;
    const targetPercentage = Math.min(target / max, 1);
    return -180 + targetPercentage * 180;
  }, [target, max]);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        width={width}
        height={width / 2 + stroke}
        viewBox={`0 0 ${width} ${width / 2 + stroke}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${stroke / 2} ${width / 2} A ${radius} ${radius} 0 0 1 ${width - stroke / 2} ${width / 2}`}
          fill="none"
          className="stroke-muted"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Value arc */}
        <path
          d={`M ${stroke / 2} ${width / 2} A ${radius} ${radius} 0 0 1 ${width - stroke / 2} ${width / 2}`}
          fill="none"
          className={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percentage)}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />

        {/* Target marker */}
        {target && targetAngle !== null && (
          <g transform={`translate(${width / 2}, ${width / 2}) rotate(${targetAngle})`}>
            <line
              x1={radius - stroke / 2 - 2}
              y1="0"
              x2={radius + stroke / 2 + 2}
              y2="0"
              className="stroke-foreground"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Center value */}
        {showValue && (
          <text
            x={width / 2}
            y={width / 2 - 4}
            textAnchor="middle"
            className={cn('fill-foreground font-semibold tabular-nums', fontSize)}
          >
            {valueFormatter(value)}
          </text>
        )}

        {/* Label */}
        {label && (
          <text
            x={width / 2}
            y={width / 2 + 12}
            textAnchor="middle"
            className={cn('fill-muted-foreground', labelSize)}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
};

// Progress ring - full circle variant
interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressRing = ({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  color = 'var(--chart-1)',
  label,
  showPercentage = true,
  className,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(value / max, 1);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percentage)}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-sm font-semibold tabular-nums">
            {Math.round(percentage * 100)}%
          </span>
        )}
        {label && (
          <span className="text-[10px] text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  );
};

// Multiple stacked progress rings
interface StackedRingsProps {
  rings: {
    value: number;
    max: number;
    color: string;
    label: string;
  }[];
  size?: number;
  className?: string;
}

export const StackedRings = ({
  rings,
  size = 120,
  className,
}: StackedRingsProps) => {
  const strokeWidth = 8;
  const gap = 4;

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      {rings.map((ring, index) => {
        const ringSize = size - index * (strokeWidth + gap) * 2;
        const offset = index * (strokeWidth + gap);

        return (
          <div
            key={index}
            className="absolute"
            style={{ top: offset, left: offset }}
          >
            <ProgressRing
              value={ring.value}
              max={ring.max}
              size={ringSize}
              strokeWidth={strokeWidth}
              color={ring.color}
              showPercentage={false}
            />
          </div>
        );
      })}
      {/* Center legend */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {rings.map((ring, index) => (
          <div key={index} className="flex items-center gap-1 text-[10px]">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: ring.color }}
            />
            <span className="text-muted-foreground">{ring.label}</span>
            <span className="font-medium">{Math.round((ring.value / ring.max) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
