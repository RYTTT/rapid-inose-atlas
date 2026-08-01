"use client";

import { useState } from 'react';
import { MOCK_PCA_DATA } from '@/lib/mockData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, BarChart, Bar } from 'recharts';
import { GitCompare, Sparkles, Activity, Layers, Cpu, ArrowLeftRight, CheckSquare, Square } from 'lucide-react';

export default function CompareLabPage() {
  const [selectedPreset, setSelectedPreset] = useState('1. Same Pathogen, Different Source');
  const [activeView, setActiveView] = useState<'PCA' | 'Curves' | 'Heatmap' | 'Waterfall'>('PCA');
  
  // Interactive checklist toggles for overlay curves
  const [selectedRuns, setSelectedRuns] = useState<Record<string, boolean>>({
    'P. aeruginosa (ATCC 27853)': true,
    'P. aeruginosa (Mayo Clinic)': true,
    'P. aeruginosa (HSS NPWT Effluent)': true,
    'S. aureus (MSSA)': true,
    'S. aureus (MRSA)': false,
    'K. pneumoniae (ESBL+)': false,
    'A. baumannii (CRAB)': false
  });

  const toggleRun = (name: string) => {
    setSelectedRuns(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const presets = [
    '1. Same Pathogen, Different Source',
    '2. Same Pathogen, Different Media',
    '3. Same Pathogen, Different Temp',
    '4. Gram+ vs Gram- vs Fungi',
    '5. Clinical Isolate vs ATCC',
    '6. 6-Sensor vs 40-Sensor Combo'
  ];

  const GRAM_COLORS: Record<string, string> = {
    'Gram-negative': '#3b82f6',
    'Gram-positive': '#8b5cf6',
    'Fungi': '#f59e0b',
    'Control': '#64748b'
  };

  // Overlay curves data generator based on active checklist
  const overlayKineticData = [
    { time: 0, 'P. aeruginosa (ATCC 27853)': 0, 'P. aeruginosa (Mayo Clinic)': 0, 'P. aeruginosa (HSS NPWT Effluent)': 0, 'S. aureus (MSSA)': 0, 'S. aureus (MRSA)': 0, 'K. pneumoniae (ESBL+)': 0, 'A. baumannii (CRAB)': 0 },
    { time: 15, 'P. aeruginosa (ATCC 27853)': 0.10, 'P. aeruginosa (Mayo Clinic)': 0.15, 'P. aeruginosa (HSS NPWT Effluent)': 0.25, 'S. aureus (MSSA)': 0.08, 'S. aureus (MRSA)': 0.12, 'K. pneumoniae (ESBL+)': 0.05, 'A. baumannii (CRAB)': 0.04 },
    { time: 30, 'P. aeruginosa (ATCC 27853)': 1.20, 'P. aeruginosa (Mayo Clinic)': 1.45, 'P. aeruginosa (HSS NPWT Effluent)': 1.90, 'S. aureus (MSSA)': 0.65, 'S. aureus (MRSA)': 0.85, 'K. pneumoniae (ESBL+)': 0.45, 'A. baumannii (CRAB)': 0.35 },
    { time: 45, 'P. aeruginosa (ATCC 27853)': 2.80, 'P. aeruginosa (Mayo Clinic)': 3.10, 'P. aeruginosa (HSS NPWT Effluent)': 3.65, 'S. aureus (MSSA)': 1.80, 'S. aureus (MRSA)': 2.10, 'K. pneumoniae (ESBL+)': 1.40, 'A. baumannii (CRAB)': 1.10 },
    { time: 60, 'P. aeruginosa (ATCC 27853)': 4.00, 'P. aeruginosa (Mayo Clinic)': 4.20, 'P. aeruginosa (HSS NPWT Effluent)': 4.40, 'S. aureus (MSSA)': 2.90, 'S. aureus (MRSA)': 3.40, 'K. pneumoniae (ESBL+)': 2.50, 'A. baumannii (CRAB)': 2.10 }
  ];

  // Waterfall TTD comparison data
  const ttdWaterfallData = [
    { name: 'P. aeruginosa (ATCC)', TTD: 28 },
    { name: 'P. aeruginosa (Clinical Mayo)', TTD: 26 },
    { name: 'P. aeruginosa (NPWT Effluent)', TTD: 22 },
    { name: 'S. aureus MSSA', TTD: 32 },
    { name: 'S. aureus MRSA', TTD: 30 },
    { name: 'K. pneumoniae ESBL+', TTD: 35 },
    { name: 'A. baumannii CRAB', TTD: 40 }
  ];

  const OVERLAY_COLORS: Record<string, string> = {
    'P. aeruginosa (ATCC 27853)': '#3b82f6',
    'P. aeruginosa (Mayo Clinic)': '#10b981',
    'P. aeruginosa (HSS NPWT Effluent)': '#f59e0b',
    'S. aureus (MSSA)': '#8b5cf6',
    'S. aureus (MRSA)': '#ef4444',
    'K. pneumoniae (ESBL+)': '#14b8a6',
    'A. baumannii (CRAB)': '#ec4899'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Compare Lab</h1>
            <span className="badge badge-purple">Multi-Dimensional Comparison Sandbox</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Cross-compare pathogen signatures across sources, growth media, temperatures, & sensor arrays.
          </p>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Select Strategic Comparison Scenario:</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPreset(p)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: selectedPreset === p ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'var(--bg-tertiary)',
                color: selectedPreset === p ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Overlay Checklist & Multi-View Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '24px' }}>
        
        {/* Left Column: Interactive Run Selector Checklist */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Toggle Runs to Compare
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            {Object.keys(selectedRuns).map(runName => {
              const isChecked = selectedRuns[runName];
              return (
                <div 
                  key={runName}
                  onClick={() => toggleRun(runName)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: isChecked ? 'var(--bg-tertiary)' : 'transparent',
                    border: '1px solid',
                    borderColor: isChecked ? OVERLAY_COLORS[runName] : 'var(--border-color)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    transition: 'all 0.15s'
                  }}
                >
                  {isChecked ? <CheckSquare size={16} color={OVERLAY_COLORS[runName]} /> : <Square size={16} color="var(--text-muted)" />}
                  <span style={{ color: isChecked ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: isChecked ? 600 : 400 }}>
                    {runName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Multi-View Visualizer */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {selectedPreset}
            </div>

            <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {(['PCA', 'Curves', 'Waterfall'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeView === v ? 'var(--accent-purple)' : 'transparent',
                    color: activeView === v ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {v === 'PCA' ? '2D PCA / UMAP Space' : v === 'Curves' ? 'Overlay Curves' : 'TTD Waterfall'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '360px', width: '100%', marginTop: '10px' }}>
            {activeView === 'PCA' && (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="x" type="number" stroke="var(--text-secondary)" label={{ value: 'Principal Component 1 (PCA-1)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis dataKey="y" type="number" stroke="var(--text-secondary)" label={{ value: 'Principal Component 2 (PCA-2)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    formatter={(val, name, props) => [`(${props.payload.x}, ${props.payload.y})`, props.payload.name]}
                  />
                  <Scatter name="Pathogen Clusters" data={MOCK_PCA_DATA}>
                    {MOCK_PCA_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GRAM_COLORS[entry.gram] || '#3b82f6'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}

            {activeView === 'Curves' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overlayKineticData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" label={{ value: 'Elapsed Time (minutes)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis stroke="var(--text-secondary)" label={{ value: 'Response ΔR/R0', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                  <Legend verticalAlign="top" height={36} />
                  {Object.keys(selectedRuns).filter(r => selectedRuns[r]).map(runName => (
                    <Line key={runName} type="monotone" name={runName} dataKey={runName} stroke={OVERLAY_COLORS[runName]} strokeWidth={2.5} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeView === 'Waterfall' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ttdWaterfallData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                  <XAxis type="number" stroke="var(--text-secondary)" label={{ value: 'Time-to-Detection (Minutes)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={180} tick={{ fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }} />
                  <Bar dataKey="TTD" fill="var(--accent-purple)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
