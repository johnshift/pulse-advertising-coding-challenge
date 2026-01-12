'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

import type { ChartType, DailyMetric, MetricKey, TimeRange } from './types';

const chartConfig = {
  engagement: {
    label: 'Engagement',
    theme: {
      light: 'oklch(0.5 0.2 350)',
      dark: 'oklch(0.7 0.2 350)',
    },
  },
  reach: {
    label: 'Reach',
    theme: {
      light: 'oklch(0.8 0.18 75)',
      dark: 'oklch(0.9 0.18 80)',
    },
  },
} satisfies ChartConfig;

type DailyMetricsChartProps = {
  data: DailyMetric[];
  visibleMetrics: MetricKey[];
  chartType: ChartType;
  timeRange: TimeRange;
};

const formatDate = (dateString: string, includeYear: boolean) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(includeYear && { year: 'numeric' }),
  });
};

const formatTooltipLabel = (value: string, includeYear: boolean) => {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(includeYear && { year: 'numeric' }),
  });
};

const getXAxisTicks = (data: DailyMetric[], targetLabelCount = 8) => {
  const length = data.length;
  if (length <= targetLabelCount) {
    return data.map((d) => d.date);
  }

  const indices: number[] = [0];
  const step = (length - 1) / (targetLabelCount - 1);
  for (let i = 1; i < targetLabelCount - 1; i++) {
    indices.push(Math.round(i * step));
  }
  indices.push(length - 1);

  return indices.map((i) => data[i].date);
};

export const DailyMetricsChart = ({
  data,
  visibleMetrics,
  chartType,
  timeRange,
}: DailyMetricsChartProps) => {
  const chartKey = `${chartType}-${visibleMetrics.join(',')}`;
  const xAxisTicks = getXAxisTicks(data);
  const includeYear = timeRange === 'all' || timeRange === 'year';

  if (chartType === 'area') {
    return (
      <ChartContainer config={chartConfig} className='h-[300px] w-full'>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          accessibilityLayer
          key={chartKey}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            dataKey='date'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => formatDate(v, includeYear)}
            ticks={xAxisTicks}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(v) => formatTooltipLabel(v, includeYear)}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {visibleMetrics.map((metric) => (
            <Area
              key={metric}
              type='monotone'
              dataKey={metric}
              stroke={`var(--color-${metric})`}
              fill={`var(--color-${metric})`}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer config={chartConfig} className='h-[300px] w-full'>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        accessibilityLayer
        key={chartKey}
      >
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis
          dataKey='date'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => formatDate(v, includeYear)}
          ticks={xAxisTicks}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(v) => formatTooltipLabel(v, includeYear)}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {visibleMetrics.map((metric) => (
          <Line
            key={metric}
            type='monotone'
            dataKey={metric}
            stroke={`var(--color-${metric})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};
