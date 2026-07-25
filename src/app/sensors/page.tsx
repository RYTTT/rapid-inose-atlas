"use client";

import { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Clock, ShieldAlert } from 'lucide-react';

export default function SensorViewerPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [metric, setMetric] = useState('Raw');

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
    if (!timeSeries || timeSeries.length === 0) return [];
    
    // Sort timeSeries by time to ensure chronological order
    const sorted = [...timeSeries].sort((a, b) => a.time - b.time);
    
    // Calculate baseline (r0) using the first available data point for each sensor
    const r0: Record<string, number> = {};
    for (const d of sorted) {
      if (r0[d.sensorId] === undefined && !isNaN(d.rawSignal)) {
        r0[d.sensorId] = d.rawSignal;
      }
    }

    const formatted: any = {};
    sorted.forEach((d: any) => {
      if (!formatted[d.time]) {
        formatted[d.time] = { time: d.time / 60 }; // Convert to minutes
      }
      
      let val = d.rawSignal;
      const base = r0[d.sensorId];
      
      if (metric === 'Log' && base > 0 && val > 0) {
        val = Math.log(val) - Math.log(base);
      } else if (metric === 'Rel' && base !== 0) {
        val = (val - base) / base;
      }
      
      formatted[d.time][d.sensorId] = val;
    });
    
    return Object.values(formatted);
  }, [timeSeries, metric]);


  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Sensor Response Viewer</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Interactive visualization of multi-channel kinetic signatures.</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 0 }}>
        {/* Left Column: Chart */}
        <div className="glass-panel" style={{ flex: 2, display: 'flex', flexDirection: 'column', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Real-Time Sensor Kinetics</h2>
            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {['Raw', 'Log', 'Rel'].map(m => (
                <button 
                  key={m}
                  onClick={() => setMetric(m)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: metric === m ? 'var(--accent-primary)' : 'transparent',
                    color: metric === m ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    boxShadow: metric === m ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {m === 'Rel' ? 'Relative' : m}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ height: '400px', width: '100%' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)' }} />
                  <YAxis stroke="var(--text-secondary)" label={{ value: metric === 'Raw' ? 'Resistance (kΩ)' : metric === 'Log' ? 'Log(R/R0)' : 'ΔR/R0', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                  <Legend />
                  {['NBF-S01', 'NBF-S02', 'NBF-S03', 'NBF-S04', 'NBF-S05', 'NBF-S06'].map((sensor, idx) => (
                    <Line 
                      key={sensor}
                      type="monotone" 
                      dataKey={sensor} 
                      stroke={COLORS[idx]} 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Loading kinetic data...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interpretation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>Run Details</h3>
            {selectedRun ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pathogen</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedRun.strain.organism.genus} {selectedRun.strain.organism.species}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Strain & Source</div>
                  <div style={{ color: 'var(--text-primary)' }}>{selectedRun.strain.strainName} ({selectedRun.strain.sourceType})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Condition</div>
                  <div style={{ color: 'var(--text-primary)' }}>{selectedRun.condition.mediaName}, {selectedRun.condition.temperature}°C, {selectedRun.condition.oxygenCondition}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sensor Array</div>
                  <div style={{ color: 'var(--text-primary)' }}>{selectedRun.sensorArray.arrayVersion} ({selectedRun.sensorArray.sensorGeneration})</div>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Loading run details...</p>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>Detection Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={20} color="var(--accent-secondary)" />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Time to Detection (TTD)</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Est. 45 minutes</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity size={20} color="var(--accent-primary)" />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Signal Strength</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Strong response on NBF-S06</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldAlert size={20} color="var(--accent-warning)" />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>QC Status</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>{selectedRun?.sensorArray.qcStatus || 'Pass'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
