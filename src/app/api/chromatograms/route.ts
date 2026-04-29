import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const experimentId = searchParams.get('experimentId');

  try {
    const profiles = await prisma.metaboliteProfile.findMany({
      where: experimentId ? { experimentId } : undefined,
      include: {
        peaks: {
          orderBy: { retentionTime: 'asc' }
        }
      }
    });
    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch GC-MS data' }, { status: 500 });
  }
}
