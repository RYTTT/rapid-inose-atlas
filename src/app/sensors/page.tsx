"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Network, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

/* ─── Types ─── */
interface Trace {
  name: string;
  well_id?: string;
  sensor: string;
  concentration?: number;
  concentration_label?: string;
  control_type?: string;
  growth?: string;
  color: string;
  dash?: string;
  x: number[];
  y: number[];
  kind?: string;
  role?: string;
  is_control?: boolean;
  batch_id?: string;
}

interface AstResponse {
  traces: Trace[];
  error?: string;
}

interface TimeseriesResponse {
  traces: Trace[];
  trace_count: number;
  point_count: number;
  configuration?: {
    organism?: string;
    sensors?: string[];
    datasets?: string[];
  };
  batches?: Array<{
    batch_id: string;
    name: string;
    samples_plotted: number;
    points_available: number;
  }>;
  error?: string;
}

/* ─── Config ─── */
type DataSourceType = 'ast' | 'timeseries';

interface DataSource {
  type: DataSourceType;
  label: string;
  description: string;
}

const DATA_SOURCES: DataSource[] = [
  { type: 'ast', label: 'AST Antibiotic Response', description: 'Ciprofloxacin & Gentamicin dose-response kinetics across 5 organisms' },
  { type: 'timeseries', label: 'Growth Detection (FB/LB)', description: 'VOC sensor kinetics for 40+ organisms across FB & LB media datasets' },
];

const AST_ORGANISMS = [
  { id: '54', name: 'E. coli ATCC 25922' },
  { id: '50', name: 'E. coli ATCC BAA-196 (ESBL)' },
  { id: '52', name: 'P. aeruginosa ATCC 27853' },
  { id: '55', name: 'P. aeruginosa ATCC BAA-2108 (MDR)' },
  { id: '53', name: 'S. aureus 252' },
];

const AST_DATASETS = [
  { id: '6', name: 'Ciprofloxacin (July 2026)' },
  { id: '5', name: 'Gentamicin (July 2026)' },
];

const TS_ORGANISMS = [
  { id: '1', name: 'Pseudomonas aeruginosa' },
  { id: '2', name: 'Staphylococcus aureus' },
  { id: '5', name: 'S. aureus subsp. aureus' },
  { id: '43', name: 'Escherichia coli' },
  { id: '8', name: 'Acinetobacter baumannii' },
  { id: '19', name: 'Klebsiella pneumoniae' },
  { id: '11', name: 'Staphylococcus epidermidis' },
  { id: '7', name: 'Enterobacter spp.' },
  { id: '6', name: 'Enterococcus faecium' },
  { id: '20', name: 'Enterococcus faecalis' },
  { id: '4', name: 'Staphylococcus simulans' },
  { id: '28', name: 'Proteus mirabilis' },
  { id: '31', name: 'Streptococcus pyogenes' },
  { id: '22', name: 'Serratia marcescens' },
  { id: '12', name: 'S. lugdunensis' },
  { id: '9', name: 'S. saprophyticus' },
  { id: '24', name: 'Chromobacterium violaceum' },
  { id: '27', name: 'Achromobacter xylosoxidans' },
];

const TS_DATASETS = [
  { id: '1', name: 'FB-v0 (FB Media)' },
  { id: '2', name: 'LB-v0 (LB Media)' },
];

const SENSORS = ['LW60', 'LW61', 'LW62', 'LW63', 'LW64', 'LW65'];
const SENSOR_COLORS: Record<string, string> = {
  LW60: '#ef4444', LW61: '#f59e0b', LW62: '#10b981',
  LW63: '#3b82f6', LW64: '#8b5cf6', LW65: '#ec4899',
};

/* ─── Page ─── */
export default function SensorViewerPage() {
  const [dataSource, setDataSource] = useState<DataSourceType>('ast');
  // AST controls
  const [astDataset, setAstDataset] = useState('6');
  const [astOrganism, setAstOrganism] = useState('52');
  const [astSignalMode, setAstSignalMode] = useState<'normalized' | 'raw'>('normalized');
  const [astShowControls, setAstShowControls] = useState(true);
  const [astSelectedSensor, setAstSelectedSensor] = useState('LW60');
  // Timeseries controls
  const [tsDataset, setTsDataset] = useState('1');
  const [tsOrganism, setTsOrganism] = useState('1');
  const [tsViewMode, setTsViewMode] = useState<'all' | 'single'>('all');
  const [tsFocusedSensor, setTsFocusedSensor] = useState('LW60');

  const [data, setData] = useState<AstResponse | TimeseriesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url: string;
      if (dataSource === 'ast') {
        url = `/api/ast-data?dataset_batch=${astDataset}&organism=${astOrganism}&signal_mode=${astSignalMode}&show_controls=${astShowControls ? '1' : '0'}`;
      } else {
        const params = new URLSearchParams();
        params.set('dataset_batches', tsDataset);
        params.set('organism', tsOrganism);
        params.set('view_mode', tsViewMode);
        params.set('signal_mode', 'normalized');
        params.set('time_unit', 'hours');
        params.set('y_scale', 'linear');
        params.set('max_samples_per_batch', '50');
        params.set('show_individual', 'on');
        SENSORS.forEach(s => params.append('sensors', s));
        if (tsViewMode === 'single') params.set('focused_sensor', tsFocusedSensor);
        url = `/api/timeseries-data?${params.toString()}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [dataSource, astDataset, astOrganism, astSignalMode, astShowControls, tsDataset, tsOrganism, tsViewMode, tsFocusedSensor]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── AST chart data (per sensor) ──
  const astTraces = useMemo(() => {
    if (dataSource !== 'ast' || !data?.traces) return [];
    return data.traces.filter((t: Trace) => t.sensor === astSelectedSensor);
  }, [data, dataSource, astSelectedSensor]);

  const astChartData = useMemo(() => {
    if (astTraces.length === 0) return [];
    const allTimes = new Set<number>();
    astTraces.forEach((t: Trace) => t.x.forEach((x: number) => allTimes.add(+x.toFixed(3))));
    const times = Array.from(allTimes).sort((a, b) => a - b);
    return times.map(t => {
      const point: Record<string, unknown> = { time: +t.toFixed(2) };
      astTraces.forEach((trace: Trace) => {
        const idx = trace.x.findIndex((x: number) => Math.abs(x - t) < 0.01);
        if (idx >= 0) point[trace.well_id || trace.name] = +trace.y[idx].toFixed(3);
      });
      return point;
    });
  }, [astTraces]);

  // ── Timeseries chart data (all 6 sensors or single) ──
  const tsTraces = useMemo(() => {
    if (dataSource !== 'timeseries' || !data?.traces) return [];
    return data.traces;
  }, [data, dataSource]);

  const tsChartData = useMemo(() => {
    if (tsTraces.length === 0) return [];
    const allTimes = new Set<number>();
    tsTraces.forEach((t: Trace) => t.x.forEach((x: number) => allTimes.add(+x.toFixed(3))));
    const times = Array.from(allTimes).sort((a, b) => a - b);
    return times.map(t => {
      const point: Record<string, unknown> = { time: +t.toFixed(2) };
      tsTraces.forEach((trace: Trace) => {
        const key = trace.name.length > 25 ? trace.name.slice(-20) : trace.name;
        const idx = trace.x.findIndex((x: number) => Math.abs(x - t) < 0.01);
        if (idx >= 0) point[key] = +trace.y[idx].toFixed(3);
      });
      return point;
    });
  }, [tsTraces]);

  const traceCount = data && 'trace_count' in data ? (data as TimeseriesResponse).trace_count : (data?.traces?.length || 0);
  const pointCount = data && 'point_count' in data ? (data as TimeseriesResponse).point_count : 0;
  const batchInfo = data && 'batches' in data ? (data as TimeseriesResponse).batches : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <Network size={22} color="#3b82f6" />
          <h1 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 800, margin: 0 }}>Live Sensor Data</h1>
          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '3px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
            Live from Railway API
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem', maxWidth: '600px' }}>
          Real published sensor data from the NanoBioFAB RAPID-iNose platform — {dataSource === 'ast' ? 'AST antibiotic dose-response kinetics' : 'VOC growth detection across 40+ organisms'}.
        </p>
      </div>

      {/* ── Data Source Tabs ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {DATA_SOURCES.map(ds => (
          <button key={ds.type} onClick={() => setDataSource(ds.type)} style={{
            padding: '10px 18px', borderRadius: '10px',
            border: `1px solid ${dataSource === ds.type ? '#3b82f6' : 'rgba(255,255,255,0.06)'}`,
            background: dataSource === ds.type ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.02)',
            color: dataSource === ds.type ? '#60a5fa' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{ds.label}</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '2px' }}>{ds.description}</div>
          </button>
        ))}
      </div>

      {/* ── Controls ── */}
      <div style={{
        display: 'flex', gap: '14px', alignItems: 'flex-end', flexWrap: 'wrap',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '14px 18px',
      }}>
        {dataSource === 'ast' ? (
          <>
            <div style={{ minWidth: 0 }}>
              <label style={labelStyle}>Antibiotic</label>
              <select value={astDataset} onChange={e => setAstDataset(e.target.value)} style={selectStyle}>
                {AST_DATASETS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div style={{ minWidth: 0 }}>
              <label style={labelStyle}>Organism</label>
              <select value={astOrganism} onChange={e => setAstOrganism(e.target.value)} style={selectStyle}>
                {AST_ORGANISMS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div style={{ minWidth: 0 }}>
              <label style={labelStyle}>Signal</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['normalized', 'raw'] as const).map(m => (
                  <button key={m} onClick={() => setAstSignalMode(m)} style={{
                    padding: '6px 10px', borderRadius: '6px', border: 'none',
                    background: astSignalMode === m ? '#3b82f6' : 'var(--bg-tertiary)',
                    color: astSignalMode === m ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer',
                  }}>
                    {m === 'normalized' ? 'Relative %' : 'Raw Ω'}
                  </button>
                ))}
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={astShowControls} onChange={e => setAstShowControls(e.target.checked)} />
              Controls
            </label>
          </>
        ) : (
          <>
            <div style={{ minWidth: 0 }}>
              <label style={labelStyle}>Dataset</label>
              <select value={tsDataset} onChange={e => setTsDataset(e.target.value)} style={selectStyle}>
                {TS_DATASETS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div style={{ minWidth: 0 }}>
              <label style={labelStyle}>Organism</label>
              <select value={tsOrganism} onChange={e => setTsOrganism(e.target.value)} style={selectStyle}>
                {TS_ORGANISMS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div style={{ minWidth: 0 }}>
              <label style={labelStyle}>View</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['all', 'single'] as const).map(m => (
                  <button key={m} onClick={() => setTsViewMode(m)} style={{
                    padding: '6px 10px', borderRadius: '6px', border: 'none',
                    background: tsViewMode === m ? '#3b82f6' : 'var(--bg-tertiary)',
                    color: tsViewMode === m ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer',
                  }}>
                    {m === 'all' ? 'All 6 Sensors' : 'Single Sensor'}
                  </button>
                ))}
              </div>
            </div>
            {tsViewMode === 'single' && (
              <div style={{ minWidth: 0 }}>
                <label style={labelStyle}>Sensor</label>
                <select value={tsFocusedSensor} onChange={e => setTsFocusedSensor(e.target.value)} style={selectStyle}>
                  {SENSORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Sensor Selector (AST only) ── */}
      {dataSource === 'ast' && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {SENSORS.map(s => (
            <button key={s} onClick={() => setAstSelectedSensor(s)} style={{
              padding: '7px 16px', borderRadius: '8px',
              border: `2px solid ${astSelectedSensor === s ? SENSOR_COLORS[s] : 'rgba(255,255,255,0.06)'}`,
              background: astSelectedSensor === s ? `${SENSOR_COLORS[s]}18` : 'rgba(255,255,255,0.02)',
              color: astSelectedSensor === s ? SENSOR_COLORS[s] : 'var(--text-secondary)',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Stats bar ── */}
      {!loading && traceCount > 0 && (
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span><strong style={{ color: 'var(--text-secondary)' }}>{traceCount}</strong> traces</span>
          {pointCount > 0 && <span><strong style={{ color: 'var(--text-secondary)' }}>{pointCount.toLocaleString()}</strong> data points</span>}
          {batchInfo && batchInfo.map(b => (
            <span key={b.batch_id}>{b.batch_id}: <strong style={{ color: 'var(--text-secondary)' }}>{b.samples_plotted}</strong> samples, {b.points_available.toLocaleString()} pts available</span>
          ))}
        </div>
      )}

      {/* ── Main Chart ── */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px', padding: '20px',
      }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 340, gap: '10px', color: 'var(--text-muted)' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.88rem' }}>Loading live sensor data…</span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 340, gap: '10px', color: '#f87171' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.85rem' }}>Failed to load: {error}</span>
          </div>
        )}

        {!loading && !error && (dataSource === 'ast' ? astChartData.length > 0 : tsChartData.length > 0) && (
          <div style={{ height: 380, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataSource === 'ast' ? astChartData : tsChartData} margin={{ top: 8, right: 16, left: 6, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="time" type="number"
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  label={{ value: 'Time (hours)', position: 'insideBottom', offset: -12, fill: 'var(--text-muted)', fontSize: 10 }}
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  width={42}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.72rem', maxWidth: 300 }}
                  labelFormatter={(l) => `${l}h`}
                />
                {dataSource === 'ast' ? (
                  <>
                    <Legend wrapperStyle={{ fontSize: '0.68rem', paddingTop: '8px' }} />
                    {astTraces.map((trace: Trace) => (
                      <Line
                        key={trace.well_id || trace.name}
                        type="monotone"
                        dataKey={trace.well_id || trace.name}
                        name={trace.concentration_label || trace.name}
                        stroke={trace.color === '#111827' ? '#6b7280' : trace.color}
                        strokeWidth={trace.control_type === 'test' ? 2 : 1}
                        strokeDasharray={trace.dash === 'dot' ? '3 3' : trace.dash === 'dash' ? '6 3' : undefined}
                        dot={false}
                        opacity={trace.control_type === 'test' ? 1 : 0.6}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    {tsTraces.length <= 12 && <Legend wrapperStyle={{ fontSize: '0.65rem', paddingTop: '8px' }} />}
                    {tsTraces.map((trace: Trace, i: number) => {
                      const key = trace.name.length > 25 ? trace.name.slice(-20) : trace.name;
                      const sensorColor = SENSOR_COLORS[trace.sensor] || SENSOR_COLORS['LW60'];
                      return (
                        <Line
                          key={i}
                          type="monotone"
                          dataKey={key}
                          name={trace.name}
                          stroke={sensorColor}
                          strokeWidth={trace.is_control ? 1 : 1.5}
                          strokeDasharray={trace.is_control ? '4 3' : undefined}
                          dot={false}
                          opacity={trace.is_control ? 0.4 : 0.8}
                        />
                      );
                    })}
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {!loading && !error && (dataSource === 'ast' ? astChartData.length === 0 : tsChartData.length === 0) && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 340, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No traces found for this combination. Try a different organism or dataset.
          </div>
        )}
      </div>

      {/* ── Trace Details Table (AST) ── */}
      {!loading && dataSource === 'ast' && astTraces.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '18px', overflowX: 'auto',
        }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Well Details — {astSelectedSensor}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={thStyle}>Well</th>
                <th style={thStyle}>Concentration</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Endpoint</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {astTraces.map((t: Trace) => (
                <tr key={t.well_id || t.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={tdStyle}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: t.color === '#111827' ? '#6b7280' : t.color, marginRight: 6 }} />
                    <strong>{t.well_id}</strong>
                  </td>
                  <td style={tdStyle}>{t.concentration_label}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600,
                      background: t.control_type === 'test' ? 'rgba(59,130,246,0.12)' : 'rgba(107,114,128,0.15)',
                      color: t.control_type === 'test' ? '#60a5fa' : '#9ca3af',
                    }}>
                      {t.control_type === 'test' ? 'Test' : 'Control'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: t.growth === 'growth' ? '#f87171' : '#34d399', fontWeight: 600 }}>
                      {t.growth === 'growth' ? '● Growth' : '○ No Growth'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{t.x.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Attribution ── */}
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0', display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center' }}>
        Data: <a href="https://rapid-inose-atlas-production.up.railway.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '3px' }}>
          NanoBioFAB RAPID-iNose Sensor Atlas <ExternalLink size={10} />
        </a>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Style helpers ─── */
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' };
const selectStyle: React.CSSProperties = { padding: '6px 10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600, outline: 'none', maxWidth: '220px' };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '6px 10px', color: 'var(--text-muted)', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '7px 10px', color: 'var(--text-secondary)' };
