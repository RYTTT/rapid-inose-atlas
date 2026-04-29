import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const experimentId = formData.get('experimentId') as string;

    if (!file || !experimentId) {
      return NextResponse.json({ error: 'File and experimentId are required' }, { status: 400 });
    }

    const text = await file.text();
    // Assuming CSV has columns: Time, NBF-S01, NBF-S02, NBF-S03, NBF-S04, NBF-S05, NBF-S06
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      cast: true // Auto-cast numbers
    });

    const timeSeriesData = [];
    const sensors = ['NBF-S01', 'NBF-S02', 'NBF-S03', 'NBF-S04', 'NBF-S05', 'NBF-S06'];

    for (const record of records) {
      const time = record['Time'] || record['time'];
      if (time === undefined) continue;

      for (const sensor of sensors) {
        if (record[sensor] !== undefined) {
          timeSeriesData.push({
            experimentId,
            sensorId: sensor,
            time: Number(time),
            rawSignal: Number(record[sensor]),
            normalizedSignal: Number(record[sensor]) // Apply normalization logic here later
          });
        }
      }
    }

    if (timeSeriesData.length > 0) {
      // In a real scenario, you'd likely delete old data for this experiment first or handle duplicates
      await prisma.timeSeriesData.createMany({
        data: timeSeriesData
      });
    }

    return NextResponse.json({ success: true, rowsProcessed: records.length, dataPointsSaved: timeSeriesData.length });
  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: 'Failed to process CSV file', details: error.message }, { status: 500 });
  }
}
