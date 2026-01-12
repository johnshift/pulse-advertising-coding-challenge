import { dailyMetricsResponseSchema, timeRangeSchema } from '@/lib/schemas';
import type { TimeRange } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const RANGE_DAYS: Record<TimeRange, number | null> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
  all: null,
};

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();

  // Auth Check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rangeParam = request.nextUrl.searchParams.get('range') ?? 'month';
  const parseResult = timeRangeSchema.safeParse(rangeParam);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid request parameters',
        details: parseResult.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const range = parseResult.data;
  const days = RANGE_DAYS[range];

  let query = supabase
    .from('daily_metrics')
    .select('date, engagement, reach')
    .eq('user_id', user.id);

  if (days !== null) {
    const fromDate = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000,
    ).toISOString();
    query = query.gte('date', fromDate);
  }

  const { data, error } = await query.order('date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const validationResult = dailyMetricsResponseSchema.safeParse(data);

  if (!validationResult.success) {
    console.error('Schema validation error:', validationResult.error);
    return NextResponse.json(
      { error: 'Data validation failed' },
      { status: 500 },
    );
  }

  return NextResponse.json(validationResult.data);
};
