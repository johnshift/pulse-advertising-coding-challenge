'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type DailyMetricsCardProps = {
  children: React.ReactNode;
};

export const DailyMetricsCard = ({ children }: DailyMetricsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Metrics</CardTitle>
        <CardDescription>
          Track your engagement and reach trends over time
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
