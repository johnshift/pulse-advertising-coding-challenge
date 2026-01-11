'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import type { ChartType, MetricSelection, TimeRange } from './types';

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: 'quarter', label: 'Last Quarter' },
  { value: 'year', label: 'Last Year' },
  { value: 'all', label: 'All time' },
];

const METRIC_OPTIONS: { value: MetricSelection; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'reach', label: 'Reach' },
];

const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
];

type DailyMetricsControlsProps = {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
  metricSelection: MetricSelection;
  onMetricSelectionChange: (value: MetricSelection) => void;
  chartType: ChartType;
  onChartTypeChange: (value: ChartType) => void;
  disabled?: boolean;
};

export const DailyMetricsControls = ({
  timeRange,
  onTimeRangeChange,
  metricSelection,
  onMetricSelectionChange,
  chartType,
  onChartTypeChange,
  disabled = false,
}: DailyMetricsControlsProps) => {
  return (
    <div className='flex flex-wrap items-center gap-4 pb-4'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>Range:</span>
        <Select
          value={timeRange}
          onValueChange={(value) => onTimeRangeChange(value as TimeRange)}
          disabled={disabled}
        >
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Select range' />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>Chart:</span>
        <div className='flex gap-1'>
          {CHART_TYPE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={chartType === option.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => onChartTypeChange(option.value)}
              disabled={disabled}
              className={cn(
                chartType === option.value && 'pointer-events-none',
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-2 sm:ml-auto'>
        <span className='text-sm text-muted-foreground'>Metric:</span>
        <div className='flex gap-1'>
          {METRIC_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={metricSelection === option.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => onMetricSelectionChange(option.value)}
              disabled={disabled}
              className={cn(
                metricSelection === option.value && 'pointer-events-none',
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
