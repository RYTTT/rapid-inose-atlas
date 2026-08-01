import { NextResponse } from 'next/server';

const RAILWAY_BASE = 'https://rapid-inose-atlas-production.up.railway.app/api/public/v1/timeseries/';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Forward all search params to Railway API
  const params = new URLSearchParams();

  // Multi-value params (dataset_batches, sensors)
  searchParams.getAll('dataset_batches').forEach(v => params.append('dataset_batches', v));
  searchParams.getAll('sensors').forEach(v => params.append('sensors', v));

  // Single-value params
  const singles = ['organism', 'view_mode', 'signal_mode', 'time_unit', 'y_scale', 'max_samples_per_batch', 'focused_sensor'];
  singles.forEach(key => {
    const val = searchParams.get(key);
    if (val) params.set(key, val);
  });

  // Toggles
  if (searchParams.get('show_individual')) params.set('show_individual', 'on');
  if (searchParams.get('show_controls')) params.set('show_controls', 'on');

  const url = `${RAILWAY_BASE}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Railway API returned ${res.status}: ${errorBody}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch timeseries from Railway API', detail: String(err) },
      { status: 502 }
    );
  }
}
