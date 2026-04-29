import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const experimentId = searchParams.get('experimentId');

  try {
    const timeSeries = await prisma.timeSeriesData.findMany({
      where: experimentId ? { experimentId } : undefined,
      orderBy: { time: 'asc' }
    });
    return NextResponse.json(timeSeries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch time series data' }, { status: 500 });
  }
}
