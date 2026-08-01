"use client";

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, Clock, ShieldAlert, CheckCircle2, AlertTriangle, Cpu, Sparkles, Filter, Sliders } from 'lucide-react';

export default function SensorViewerPage() {
  const [selectedRunId, setSelectedRunId] = useState('run-pa-01');
  const [metric, setMetric] = useState<'Raw' | 'Log' | 'Rel'>('Rel');
  const [timeOffset, setTimeOffset] = useState<number>(30); // 0 - 60 minutes slider
  const [noiseFilter, setNoiseFilter] = useState<boolean>(true);
  const [humidityComp, setHumidityComp] = useState<boolean>(true);

  const availableRuns = [
    { id: 'run-pa-01', pathogen: 'Pseudomonas aeruginosa', strain: 'ATCC 27853', media: 'TSB Broth', temp: '37°C', ttd: 28, signal: 'Strong (LW65)', qc: 'Pass' },
    { id: 'run-sa-mrsa', pathogen: 'Staphylococcus aureus', strain: 'ATCC 43300 (MRSA)', media: 'Wound Exudate-Mimic', temp: '37°C', ttd: 32, signal: 'Strong (LW62)', qc: 'Pass' },
    { id: 'run-kp-esbl', pathogen: 'Klebsiella pneumoniae', strain: 'ATCC 700603 (ESBL+)', media: 'BD Blood Culture', temp: '37°C', ttd: 35, signal: 'Moderate (LW60)', qc: 'Pass' },
    { id: 'run-ab-crab', pathogen: 'Acinetobacter baumannii', strain: 'DoD-AB-09 (CRAB)', media: 'LB Broth', temp: '40°C', ttd: 40, signal: 'Strong (LW61)', qc: 'Pass' },
    { id: 'run-ca-fungi', pathogen: 'Candida albicans', strain: 'ATCC 10231', media: 'Sabouraud Broth', temp: '37°C', ttd: 55, signal: 'Moderate (LW63)', qc: 'Pass' }
  ];

  const currentRun = availableRuns.find(r => r.id === selectedRunId) || availableRuns[0];

  // Dynamic Time Series Generator
  const chartData = useMemo(() => {
    const times = Array.from({ length: 31 }, (_, i) => i * 2); // 0, 2, 4 ... 60 mins
    const factor = selectedRunId.includes('pa') ? 1.4 : selectedRunId.includes('sa') ? 1.0 : selectedRunId.includes('kp') ? 1.1 : 0.8;

    return times.map(t => {
      const noise = noiseFilter ? 0 : (Math.random() * 0.1 - 0.05);
      const hum = humidityComp ? 0 : 0.05;

      const lw60 = +(0.05 * Math.exp(t / 22) * factor + noise + hum).toFixed(3);
      const lw61 = +(0.03 * Math.exp(t / 25) * factor + noise).toFixed(3);
      const lw62 = +(0.15 * Math.exp(t / 18) * factor + noise).toFixed(3);
      const lw63 = +(0.08 * Math.exp(t / 20) * factor + noise).toFixed(3);
      const lw64 = +(0.10 * Math.exp(t / 21) * factor + noise).toFixed(3);
      const lw65 = +(0.32 * Math.exp(t / 15) * factor + noise).toFixed(3);

      return {
        time: t,
        LW60: metric === 'Raw' ? (lw60 * 10 + 50) : metric === 'Log' ? Math.log(lw60 + 1) : lw60,
        LW61: metric === 'Raw' ? (lw61 * 10 + 48) : metric === 'Log' ? Math.log(lw61 + 1) : lw61,
        LW62: metric === 'Raw' ? (lw62 * 10 + 52) : metric === 'Log' ? Math.log(lw62 + 1) : lw62,
        LW63: metric === 'Raw' ? (lw63 * 10 + 49) : metric === 'Log' ? Math.log(lw63 + 1) : lw63,
        LW64: metric === 'Raw' ? (lw64 * 10 + 51) : metric === 'Log' ? Math.log(lw64 + 1) : lw64,
        LW65: metric === 'Raw' ? (lw65 * 10 + 55) : metric === 'Log' ? Math.log(lw65 + 1) : lw65,
      };
    });
  }, [selectedRunId, metric, noiseFilter, humidityComp]);

  const SENSOR_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Sensor Response Viewer</h1>
            <span className="badge badge-blue">Layer 5 Interactive Time-Series</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Interactive multi-channel kinetics with noise filtering, baseline normalization, & real-time TTD sliders.
          </p>
        </div>
      </div>

      {/* Control Bar: Run Selector & Signal Processors */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Select Experimental Run / Sample</label>
          <select 
            value={selectedRunId}
            onChange={(e) => setSelectedRunId(e.target.value)}
            style={{ padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-highlight)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: 600, outline: 'none' }}
          >
            {availableRuns.map(r => (
              <option key={r.id} value={r.id}>{r.pathogen} ({r.strain}) — {r.media}</option>
            ))}
          </select>
        </div>

        {/* Metric Transform Buttons */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Metric Transform</label>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {(['Raw', 'Log', 'Rel'] as const).map(m => (
              <button 
                key={m}
                onClick={() => setMetric(m)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: metric === m ? 'var(--accent-primary)' : 'transparent',
                  color: metric === m ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {m === 'Rel' ? 'Relative ΔR/R0' : m === 'Log' ? 'Log(R/R0)' : 'Raw R (kΩ)'}
              </button>
            ))}
          </div>
        </div>

        {/* Signal Processing Toggles */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginLeft: 'auto' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={noiseFilter} onChange={(e) => setNoiseFilter(e.target.checked)} />
            <span>Noise Filtering</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={humidityComp} onChange={(e) => setHumidityComp(e.target.checked)} />
            <span>Humidity Compensation</span>
          </label>
        </div>
      </div>

      {/* Main Content Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* Left Column: Real-Time Kinetics & Time Window Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>6-Channel Real-Time Curves ({currentRun.pathogen})</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LW60 - LW65 Nanosensor Kinetics</span>
              </div>
              <span className="badge badge-emerald">TTD Marker: {currentRun.ttd} mins</span>
            </div>

            {/* Chart Area */}
            <div style={{ height: '360px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" label={{ value: 'Elapsed Time (minutes)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis stroke="var(--text-secondary)" label={{ value: metric === 'Raw' ? 'Resistance (kΩ)' : metric === 'Log' ? 'Log(R/R0)' : 'ΔR/R0', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <Legend verticalAlign="top" height={36} />

                  <ReferenceLine x={currentRun.ttd} stroke="#10b981" strokeDasharray="5 5" label={{ value: `TTD (${currentRun.ttd} min)`, fill: '#10b981', position: 'top' }} />
                  <ReferenceLine x={timeOffset} stroke="#3b82f6" strokeWidth={2} label={{ value: `Inspector (${timeOffset}m)`, fill: '#60a5fa', position: 'insideTopRight' }} />

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

            {/* Time Window Slider */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Sliders size={18} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                Time Window Inspector: <strong>{timeOffset} min</strong>
              </span>
              <input 
                type="range" 
                min={0} 
                max={60} 
                step={2}
                value={timeOffset}
                onChange={(e) => setTimeOffset(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

        </div>

        {/* Right Column: 5 Diagnostic Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '6px', margin: 0 }}>
              1. Pathogen & Strain
            </h4>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, fontStyle: 'italic', color: 'var(--text-primary)' }}>
              {currentRun.pathogen}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Strain: {currentRun.strain}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', textTransform: 'uppercase', marginBottom: '6px', margin: 0 }}>
              2. Growth Environment
            </h4>
            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>Media:</strong> {currentRun.media}</div>
              <div><strong>Temperature:</strong> {currentRun.temp}</div>
              <div><strong>Atmosphere:</strong> Aerobic</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '6px', margin: 0 }}>
              3. Detection Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated TTD:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{currentRun.ttd} minutes</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Signal Onset:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentRun.signal}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-warning)', textTransform: 'uppercase', marginBottom: '6px', margin: 0 }}>
              4. Control & QC Status
            </h4>
            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>• Baseline Normal (Pass)</div>
              <div style={{ color: 'var(--text-muted)' }}>• Noise Level: Low</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#60a5fa', textTransform: 'uppercase', marginBottom: '6px', margin: 0 }}>
              5. Phenotypic Signature
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Distinct VOC kinetic surge on primary channel with minimal baseline drift, validated against GC-MS standards.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
