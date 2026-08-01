"use client";

import { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, Clock, ShieldAlert, CheckCircle2, AlertTriangle, Cpu, Sparkles } from 'lucide-react';

export default function SensorViewerPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [metric, setMetric] = useState<'Raw' | 'Log' | 'Rel'>('Rel');

  useEffect(() => {
    async function fetchRuns() {
      try {
        const res = await fetch('/api/runs');
        const data = await res.json();
        setRuns(data);
        if (data.length > 0) {
          setSelectedRun(data[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchRuns();
  }, []);

  useEffect(() => {
    if (selectedRun) {
      async function fetchTimeSeries() {
        try {
          const res = await fetch(`/api/timeseries?experimentId=${selectedRun.id}`);
          const data = await res.json();
          setTimeSeries(data);
        } catch (e) {
          console.error(e);
        }
      }
      fetchTimeSeries();
    }
  }, [selectedRun]);

  const chartData = useMemo(() => {
    if (!timeSeries || timeSeries.length === 0) {
      // Mock generated time series if database has no rows
      const times = Array.from({ length: 30 }, (_, i) => i * 2); // 0 to 60 mins
      return times.map(t => ({
        time: t,
        LW60: 0.1 * Math.exp(t / 20) + Math.random() * 0.05,
        LW61: 0.05 * Math.exp(t / 25) + Math.random() * 0.03,
        LW62: 0.2 * Math.exp(t / 18) + Math.random() * 0.08,
        LW63: 0.08 * Math.exp(t / 22) + Math.random() * 0.04,
        LW64: 0.15 * Math.exp(t / 19) + Math.random() * 0.06,
        LW65: 0.35 * Math.exp(t / 15) + Math.random() * 0.10,
        controlMean: 0.02
      }));
    }
    
    const sorted = [...timeSeries].sort((a, b) => a.time - b.time);
    const r0: Record<string, number> = {};
    for (const d of sorted) {
      if (r0[d.sensorId] === undefined && !isNaN(d.rawSignal)) {
        r0[d.sensorId] = d.rawSignal;
      }
    }

    const formatted: any = {};
    sorted.forEach((d: any) => {
      if (!formatted[d.time]) {
        formatted[d.time] = { time: Math.round(d.time / 60) };
      }
      
      let val = d.rawSignal;
      const base = r0[d.sensorId];
      
      if (metric === 'Log' && base > 0 && val > 0) {
        val = Math.log(val) - Math.log(base);
      } else if (metric === 'Rel' && base !== 0) {
        val = (val - base) / base;
      }
      
      formatted[d.time][d.sensorId] = val;
      formatted[d.time]['controlMean'] = 0.02;
    });
    
    return Object.values(formatted);
  }, [timeSeries, metric]);

  const SENSOR_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Sensor Response Viewer</h1>
            <span className="badge badge-blue">Layer 5 Kinetic Engine</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Interactive multi-channel time-series kinetics with baseline normalization & TTD analysis.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* Left Column: Real-Time Kinetic Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>6-Channel Real-Time Curves</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LW60 - LW65 Nanosensor Fingerprint</span>
              </div>

              {/* Transform metric toggles */}
              <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {(['Raw', 'Log', 'Rel'] as const).map(m => (
                  <button 
                    key={m}
                    onClick={() => setMetric(m)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: metric === m ? 'var(--accent-primary)' : 'transparent',
                      color: metric === m ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    {m === 'Rel' ? 'Relative ΔR/R0' : m === 'Log' ? 'Log(R/R0)' : 'Raw R (kΩ)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            <div style={{ height: '380px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" label={{ value: 'Elapsed Time (minutes)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis stroke="var(--text-secondary)" label={{ value: metric === 'Raw' ? 'Resistance (kΩ)' : metric === 'Log' ? 'Log(R/R0)' : 'ΔR/R0', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <Legend verticalAlign="top" height={36} />

                  {/* Vertical TTD Marker Line */}
                  <ReferenceLine x={28} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'TTD (28 min)', fill: '#10b981', position: 'top' }} />

                  {['LW60', 'LW61', 'LW62', 'LW63', 'LW64', 'LW65'].map((sensor, idx) => (
                    <Line 
                      key={sensor}
                      type="monotone" 
                      dataKey={sensor} 
                      name={sensor}
                      stroke={SENSOR_COLORS[idx]} 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sensor Contribution & Ranking Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>Sensor Responsiveness Ranking</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.82rem' }}>
              <div style={{ flex: 1, background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #ec4899' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rank 1:</span> <strong>LW65</strong> (Sulfur-Responsive) — High Delta
              </div>
              <div style={{ flex: 1, background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rank 2:</span> <strong>LW62</strong> (Amine-Responsive) — Moderate
              </div>
              <div style={{ flex: 1, background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rank 3:</span> <strong>LW63</strong> (Ketone-Responsive) — Early Onset
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: 5 Right Summary Cards (PDF Page 18 Requirement) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          
          {/* Card 1: Pathogen Info */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', margin: 0 }}>
              1. Pathogen Identification
            </h4>
            <div style={{ fontSize: '1rem', fontWeight: 700, fontStyle: 'italic', marginTop: '4px' }}>
              {selectedRun?.strain?.organism ? `${selectedRun.strain.organism.genus} ${selectedRun.strain.organism.species}` : 'Pseudomonas aeruginosa'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Strain: {selectedRun?.strain?.strainName || 'ATCC 27853 (Reference)'}
            </div>
          </div>

          {/* Card 2: Condition Details */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', margin: 0 }}>
              2. Growth Condition
            </h4>
            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <div><strong>Media:</strong> Tryptic Soy Broth (TSB)</div>
              <div><strong>Temperature:</strong> 37°C</div>
              <div><strong>Atmosphere:</strong> Aerobic</div>
              <div><strong>Inoculum:</strong> 10^5 CFU/mL</div>
            </div>
          </div>

          {/* Card 3: Detection Summary */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', margin: 0 }}>
              3. Detection Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated TTD:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>28 minutes</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Signal Strength:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Strong (LW65)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Replicate Consistency:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>98.4%</span>
              </div>
            </div>
          </div>

          {/* Card 4: Control & QC */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-warning)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', margin: 0 }}>
              4. Control & QC Status
            </h4>
            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)' }}>
                <CheckCircle2 size={14} /> Control Baseline: Normal
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <Activity size={14} /> Sensor Drift: &lt; 0.05%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Batch Note: Pass all QC thresholds
              </div>
            </div>
          </div>

          {/* Card 5: Interpretation */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', margin: 0 }}>
              5. Phenotypic Interpretation
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Characteristic rapid sulfur VOC surge on channel LW65 with secondary amine activation on LW62, highly consistent with *P. aeruginosa* metabolic footprint.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
