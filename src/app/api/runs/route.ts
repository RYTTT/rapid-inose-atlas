import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const runs = await prisma.experiment.findMany({
      include: {
        strain: {
          include: {
            organism: true
          }
        },
        condition: true,
        sensorArray: true
      }
    });
    return NextResponse.json(runs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch runs' }, { status: 500 });
  }
}
