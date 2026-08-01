import { NextResponse } from 'next/server';

const RAILWAY_BASE = 'https://rapid-inose-atlas-production.up.railway.app/api/public/v1/ast-timeseries/';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const dataset_batch = searchParams.get('dataset_batch') || '6';
  const organism = searchParams.get('organism') || '52';
  const signal_mode = searchParams.get('signal_mode') || 'normalized';
  const show_controls = searchParams.get('show_controls') || '1';
  const sensor = searchParams.get('sensor') || 'LW60';

  const url = `${RAILWAY_BASE}?dataset_batch=${dataset_batch}&organism=${organism}&signal_mode=${signal_mode}&show_controls=${show_controls}&sensor=${sensor}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour
    if (!res.ok) throw new Error(`Railway API returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch sensor data from Railway API', detail: String(err) },
      { status: 502 }
    );
  }
}
