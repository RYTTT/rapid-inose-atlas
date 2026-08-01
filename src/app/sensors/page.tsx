"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Network, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

/* ─── Types ─── */
interface Trace {
  name: string;
  well_id: string;
  sensor: string;
  concentration: number;
  concentration_label: string;
  control_type: string;
  growth: string;
  color: string;
  dash: string;
  x: number[];
  y: number[];
}

interface AstResponse {
  traces: Trace[];
  error?: string;
}

/* ─── Config ─── */
const ORGANISMS = [
  { id: '54', name: 'E. coli ATCC 25922', short: 'E. coli 25922' },
  { id: '50', name: 'E. coli ATCC BAA-196', short: 'E. coli BAA-196 (ESBL)' },
  { id: '52', name: 'P. aeruginosa ATCC 27853', short: 'P. aeruginosa 27853' },
  { id: '55', name: 'P. aeruginosa ATCC BAA-2108', short: 'P. aeruginosa BAA-2108 (MDR)' },
  { id: '53', name: 'S. aureus 252', short: 'S. aureus 252' },
];

const DATASETS = [
  { id: '6', name: 'AST-CIP-2026-07 · Ciprofloxacin', antibiotic: 'Ciprofloxacin' },
  { id: '5', name: 'AST-GENT-2026-07 · Gentamicin', antibiotic: 'Gentamicin' },
];

const SENSORS = ['LW60', 'LW61', 'LW62', 'LW63', 'LW64', 'LW65'];
const SENSOR_COLORS: Record<string, string> = {
  LW60: '#ef4444', LW61: '#f59e0b', LW62: '#10b981',
  LW63: '#3b82f6', LW64: '#8b5cf6', LW65: '#ec4899',
};

/* ─── Page ─── */
export default function SensorViewerPage() {
  const [datasetBatch, setDatasetBatch] = useState('6');
  const [organismId, setOrganismId] = useState('52');
  const [signalMode, setSignalMode] = useState<'normalized' | 'raw'>('normalized');
  const [selectedSensor, setSelectedSensor] = useState('LW60');
  const [showControls, setShowControls] = useState(true);

  const [data, setData] = useState<AstResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://rapid-inose-atlas-production.up.railway.app/api/public/v1/ast-timeseries/?dataset_batch=${datasetBatch}&organism=${organismId}&signal_mode=${signalMode}&show_controls=${showControls ? '1' : '0'}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const json: AstResponse = await res.json();
      setData(json);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [datasetBatch, organismId, signalMode, showControls]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Filter traces by selected sensor
  const sensorTraces = useMemo(() => {
    if (!data?.traces) return [];
    return data.traces.filter(t => t.sensor === selectedSensor);
  }, [data, selectedSensor]);

  // Build chart data: merge all traces for selected sensor into a time-indexed table
  const chartData = useMemo(() => {
    if (sensorTraces.length === 0) return [];
    // Collect all unique time points
    const allTimes = new Set<number>();
    sensorTraces.forEach(t => t.x.forEach(x => allTimes.add(+x.toFixed(3))));
    const times = Array.from(allTimes).sort((a, b) => a - b);

    return times.map(t => {
      const point: Record<string, unknown> = { time: +t.toFixed(2) };
      sensorTraces.forEach(trace => {
        const idx = trace.x.findIndex(x => Math.abs(x - t) < 0.01);
        if (idx >= 0) {
          point[trace.well_id] = +trace.y[idx].toFixed(3);
        }
      });
      return point;
    });
  }, [sensorTraces]);

  // Count non-control vs control traces
  const testTraces = sensorTraces.filter(t => t.control_type === 'test');
  const controlTraces = sensorTraces.filter(t => t.control_type !== 'test');
  const currentOrganism = ORGANISMS.find(o => o.id === organismId);
  const currentDataset = DATASETS.find(d => d.id === datasetBatch);

  const railwayUrl = `https://rapid-inose-atlas-production.up.railway.app/ast/?dataset_batch=${datasetBatch === '6' ? 4 : 3}&organism=${organismId}&view=sensor_concentrations&sensor=${selectedSensor}&signal_mode=${signalMode}&show_controls=${showControls ? 1 : 0}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Network size={22} color="#3b82f6" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Live Sensor Data</h1>
          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '3px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
            Live from Railway API
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.88rem', maxWidth: '600px' }}>
          Real published AST sensor data from the NanoBioFAB RAPID-iNose platform. Six-channel nanosensor kinetics across antibiotic concentrations.
        </p>
      </div>

      {/* ── Controls ── */}
      <div style={{
        display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap',
        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
        borderRadius: '12px', padding: '16px 20px',
      }}>
        {/* Dataset */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Antibiotic Dataset
          </label>
          <select
            value={datasetBatch}
            onChange={e => setDatasetBatch(e.target.value)}
            style={{ padding: '7px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
          >
            {DATASETS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Organism */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Organism & Strain
          </label>
          <select
            value={organismId}
            onChange={e => setOrganismId(e.target.value)}
            style={{ padding: '7px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
          >
            {ORGANISMS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* Signal mode */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Signal View
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['normalized', 'raw'] as const).map(m => (
              <button key={m} onClick={() => setSignalMode(m)} style={{
                padding: '6px 12px', borderRadius: '6px', border: 'none',
                background: signalMode === m ? '#3b82f6' : 'var(--bg-tertiary)',
                color: signalMode === m ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
              }}>
                {m === 'normalized' ? 'Baseline-Relative %' : 'Raw Ω'}
              </button>
            ))}
          </div>
        </div>

        {/* Controls toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
          <input type="checkbox" checked={showControls} onChange={e => setShowControls(e.target.checked)} />
          Show control wells
        </label>
      </div>

      {/* ── Sensor Selector ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {SENSORS.map(s => (
          <button key={s} onClick={() => setSelectedSensor(s)} style={{
            padding: '8px 20px', borderRadius: '8px',
            border: `2px solid ${selectedSensor === s ? SENSOR_COLORS[s] : 'var(--border-color)'}`,
            background: selectedSensor === s ? `${SENSOR_COLORS[s]}18` : 'rgba(255,255,255,0.02)',
            color: selectedSensor === s ? SENSOR_COLORS[s] : 'var(--text-secondary)',
            fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* ── Main Chart ── */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
        borderRadius: '16px', padding: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              {selectedSensor} · {currentOrganism?.short} · {currentDataset?.antibiotic}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {signalMode === 'normalized' ? 'Signed baseline-relative response (%)' : 'Raw resistance (Ω)'} · {testTraces.length} concentration wells{controlTraces.length > 0 ? ` + ${controlTraces.length} controls` : ''}
            </p>
          </div>
          <a href={railwayUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.75rem', color: '#60a5fa', textDecoration: 'none',
          }}>
            View on Railway <ExternalLink size={12} />
          </a>
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 360, gap: '10px', color: 'var(--text-muted)' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.88rem' }}>Loading live sensor data…</span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 360, gap: '10px', color: '#f87171' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.88rem' }}>Failed to fetch data: {error}</span>
          </div>
        )}

        {!loading && !error && chartData.length > 0 && (
          <div style={{ height: 380, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 20, left: 10, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="time" type="number"
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  label={{ value: 'Elapsed Time (hours)', position: 'insideBottom', offset: -12, fill: 'var(--text-muted)', fontSize: 11 }}
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  label={{ value: signalMode === 'normalized' ? 'Baseline-Relative %' : 'Raw Ω', angle: -90, position: 'insideLeft', offset: 4, fill: 'var(--text-muted)', fontSize: 11 }}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.78rem' }}
                  labelFormatter={(l) => `${l}h`}
                />
                <Legend
                  wrapperStyle={{ fontSize: '0.72rem', paddingTop: '8px' }}
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
                />
                {sensorTraces.map((trace) => (
                  <Line
                    key={trace.well_id}
                    type="monotone"
                    dataKey={trace.well_id}
                    name={trace.concentration_label}
                    stroke={trace.color === '#111827' ? '#6b7280' : trace.color}
                    strokeWidth={trace.control_type === 'test' ? 2 : 1}
                    strokeDasharray={trace.dash === 'dot' ? '3 3' : trace.dash === 'dash' ? '6 3' : undefined}
                    dot={false}
                    opacity={trace.control_type === 'test' ? 1 : 0.6}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {!loading && !error && chartData.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 360, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No traces found for this sensor + organism combination.
          </div>
        )}
      </div>

      {/* ── Trace Details Table ── */}
      {!loading && sensorTraces.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
          borderRadius: '16px', padding: '20px', overflowX: 'auto',
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
            Well Details — {selectedSensor}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Well</th>
                <th style={{ textAlign: 'left', padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Concentration</th>
                <th style={{ textAlign: 'left', padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Type</th>
                <th style={{ textAlign: 'left', padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Visual Endpoint</th>
                <th style={{ textAlign: 'right', padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Data Points</th>
              </tr>
            </thead>
            <tbody>
              {sensorTraces.map(t => (
                <tr key={t.well_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: t.color === '#111827' ? '#6b7280' : t.color, marginRight: 8, verticalAlign: 'middle' }} />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.well_id}</span>
                  </td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{t.concentration_label}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600,
                      background: t.control_type === 'test' ? 'rgba(59,130,246,0.12)' : 'rgba(107,114,128,0.15)',
                      color: t.control_type === 'test' ? '#60a5fa' : '#9ca3af',
                    }}>
                      {t.control_type === 'test' ? 'Test' : t.control_type === 'growth_no_antibiotic' ? 'Growth Ctrl' : 'No-Bacteria Ctrl'}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      color: t.growth === 'growth' ? '#f87171' : '#34d399',
                      fontWeight: 600,
                    }}>
                      {t.growth === 'growth' ? '● Growth' : '○ No Growth'}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>{t.x.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Attribution ── */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>
        Data source: <a href="https://rapid-inose-atlas-production.up.railway.app/ast/" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>NanoBioFAB RAPID-iNose Published Sensor Atlas</a> · 15-minute locked AST profiles · {signalMode === 'normalized' ? 'Signed baseline-relative %' : 'Raw resistance Ω'}
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
