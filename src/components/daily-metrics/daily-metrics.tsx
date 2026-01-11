'use client';

import { useMemo, useState } from 'react';

import { useDailyMetrics } from '@/hooks/use-daily-metrics';
import { cn } from '@/lib/utils';

import { DailyMetricsChart } from './daily-metrics-chart';
import { DailyMetricsControls } from './daily-metrics-controls';
import {
  DailyMetricsEmpty,
  DailyMetricsError,
  DailyMetricsLoading,
} from './daily-metrics-states';
import type {
  ChartType,
  DailyMetric,
  MetricKey,
  MetricSelection,
  TimeRange,
} from './types';

const getVisibleMetrics = (selection: MetricSelection): MetricKey[] => {
  if (selection === 'all') return ['engagement', 'reach'];
  return [selection];
};

export const DailyMetrics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [metricSelection, setMetricSelection] =
    useState<MetricSelection>('all');
  const [chartType, setChartType] = useState<ChartType>('line');

  const { data, isPending, isFetching, error, refetch } =
    useDailyMetrics(timeRange);

  const visibleMetrics = useMemo(
    () => getVisibleMetrics(metricSelection),
    [metricSelection],
  );

  const hasData = data && (data as DailyMetric[]).length > 0;

  if (error && !hasData) {
    return (
      <div className='w-full'>
        <h2 className='text-2xl font-bold tracking-tight'>Daily Metrics</h2>
        <p className='text-sm text-muted-foreground'>
          Track your engagement and reach trends over time
        </p>
        <div className='mt-4 overflow-hidden rounded-md border p-4'>
          <DailyMetricsError onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <h2 className='text-2xl font-bold tracking-tight'>Daily Metrics</h2>
      <p className='mb-4 text-sm text-muted-foreground'>
        Track your engagement and reach trends over time
      </p>
      <DailyMetricsControls
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        metricSelection={metricSelection}
        onMetricSelectionChange={setMetricSelection}
        chartType={chartType}
        onChartTypeChange={setChartType}
        disabled={isFetching}
      />
      <div
        className={cn(
          'overflow-hidden rounded-md border p-4 transition-opacity',
          isFetching && 'pointer-events-none opacity-50',
        )}
      >
        {isPending ? (
          <DailyMetricsLoading />
        ) : !hasData ? (
          <DailyMetricsEmpty />
        ) : (
          <DailyMetricsChart
            data={data as DailyMetric[]}
            visibleMetrics={visibleMetrics}
            chartType={chartType}
            timeRange={timeRange}
          />
        )}
      </div>
    </div>
  );
};
