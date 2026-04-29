import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const organisms = await prisma.organism.findMany({
      include: {
        strains: true
      }
    });
    return NextResponse.json(organisms);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organisms' }, { status: 500 });
  }
}
