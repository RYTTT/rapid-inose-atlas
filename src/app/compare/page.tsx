"use client";

import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, BarChart, Bar } from 'recharts';
import { GitCompare, CheckSquare, Square } from 'lucide-react';

export default function CompareLabPage() {
  const [selectedPreset, setSelectedPreset] = useState('1. Same Pathogen, Different Source');
  const [activeView, setActiveView] = useState<'PCA' | 'Curves' | 'Waterfall'>('Curves');
  
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

  const activeRunNames = Object.keys(selectedRuns).filter(r => selectedRuns[r]);

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

  // PCA data — each run has x/y coordinates
  const PCA_RUN_DATA: Record<string, { x: number; y: number; gram: string }[]> = {
    'P. aeruginosa (ATCC 27853)':       [{ x: 2.1, y: 1.5, gram: 'Gram-negative' }, { x: 2.4, y: 1.2, gram: 'Gram-negative' }, { x: 1.9, y: 1.8, gram: 'Gram-negative' }],
    'P. aeruginosa (Mayo Clinic)':       [{ x: 2.6, y: 1.0, gram: 'Gram-negative' }, { x: 2.3, y: 0.8, gram: 'Gram-negative' }, { x: 2.8, y: 1.3, gram: 'Gram-negative' }],
    'P. aeruginosa (HSS NPWT Effluent)': [{ x: 3.1, y: 1.7, gram: 'Gram-negative' }, { x: 3.4, y: 2.0, gram: 'Gram-negative' }, { x: 2.9, y: 1.4, gram: 'Gram-negative' }],
    'S. aureus (MSSA)':                  [{ x: -1.8, y: -0.5, gram: 'Gram-positive' }, { x: -2.1, y: -0.8, gram: 'Gram-positive' }, { x: -1.5, y: -0.3, gram: 'Gram-positive' }],
    'S. aureus (MRSA)':                  [{ x: -1.2, y: -1.2, gram: 'Gram-positive' }, { x: -1.5, y: -1.5, gram: 'Gram-positive' }, { x: -0.9, y: -0.9, gram: 'Gram-positive' }],
    'K. pneumoniae (ESBL+)':             [{ x: 0.5, y: 2.5, gram: 'Gram-negative' }, { x: 0.8, y: 2.2, gram: 'Gram-negative' }, { x: 0.3, y: 2.8, gram: 'Gram-negative' }],
    'A. baumannii (CRAB)':               [{ x: 1.0, y: -2.0, gram: 'Gram-negative' }, { x: 1.3, y: -1.7, gram: 'Gram-negative' }, { x: 0.7, y: -2.3, gram: 'Gram-negative' }],
  };

  const filteredPcaData = activeRunNames.flatMap(name =>
    (PCA_RUN_DATA[name] || []).map(pt => ({ ...pt, name }))
  );

  const overlayKineticData = [
    { time: 0, 'P. aeruginosa (ATCC 27853)': 0, 'P. aeruginosa (Mayo Clinic)': 0, 'P. aeruginosa (HSS NPWT Effluent)': 0, 'S. aureus (MSSA)': 0, 'S. aureus (MRSA)': 0, 'K. pneumoniae (ESBL+)': 0, 'A. baumannii (CRAB)': 0 },
    { time: 15, 'P. aeruginosa (ATCC 27853)': 0.10, 'P. aeruginosa (Mayo Clinic)': 0.15, 'P. aeruginosa (HSS NPWT Effluent)': 0.25, 'S. aureus (MSSA)': 0.08, 'S. aureus (MRSA)': 0.12, 'K. pneumoniae (ESBL+)': 0.05, 'A. baumannii (CRAB)': 0.04 },
    { time: 30, 'P. aeruginosa (ATCC 27853)': 1.20, 'P. aeruginosa (Mayo Clinic)': 1.45, 'P. aeruginosa (HSS NPWT Effluent)': 1.90, 'S. aureus (MSSA)': 0.65, 'S. aureus (MRSA)': 0.85, 'K. pneumoniae (ESBL+)': 0.45, 'A. baumannii (CRAB)': 0.35 },
    { time: 45, 'P. aeruginosa (ATCC 27853)': 2.80, 'P. aeruginosa (Mayo Clinic)': 3.10, 'P. aeruginosa (HSS NPWT Effluent)': 3.65, 'S. aureus (MSSA)': 1.80, 'S. aureus (MRSA)': 2.10, 'K. pneumoniae (ESBL+)': 1.40, 'A. baumannii (CRAB)': 1.10 },
    { time: 60, 'P. aeruginosa (ATCC 27853)': 4.00, 'P. aeruginosa (Mayo Clinic)': 4.20, 'P. aeruginosa (HSS NPWT Effluent)': 4.40, 'S. aureus (MSSA)': 2.90, 'S. aureus (MRSA)': 3.40, 'K. pneumoniae (ESBL+)': 2.50, 'A. baumannii (CRAB)': 2.10 }
  ];

  const allTtdData: Record<string, number> = {
    'P. aeruginosa (ATCC 27853)': 28,
    'P. aeruginosa (Mayo Clinic)': 26,
    'P. aeruginosa (HSS NPWT Effluent)': 22,
    'S. aureus (MSSA)': 32,
    'S. aureus (MRSA)': 30,
    'K. pneumoniae (ESBL+)': 35,
    'A. baumannii (CRAB)': 40,
  };

  const filteredTtdData = activeRunNames.map(name => ({ name, TTD: allTtdData[name] || 0 }));

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
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <GitCompare size={22} color="#8b5cf6" />
          <h1 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 800, margin: 0 }}>Compare Lab</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>
          Cross-compare pathogen signatures across sources, growth media, and sensor arrays. Toggle organisms on the left — all charts update live.
        </p>
      </div>

      {/* Preset Selector */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {presets.map(p => (
          <button
            key={p}
            onClick={() => setSelectedPreset(p)}
            style={{
              padding: '7px 14px', borderRadius: '8px',
              border: `1px solid ${selectedPreset === p ? '#8b5cf6' : 'rgba(255,255,255,0.06)'}`,
              background: selectedPreset === p ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)',
              color: selectedPreset === p ? '#a78bfa' : 'var(--text-secondary)',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Main layout: toggles + chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px' }}>
        
        {/* Left: Toggle checklist */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
            Toggle Organisms
          </h3>
          {Object.keys(selectedRuns).map(runName => {
            const isChecked = selectedRuns[runName];
            return (
              <div 
                key={runName}
                onClick={() => toggleRun(runName)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 10px', borderRadius: '6px',
                  background: isChecked ? `${OVERLAY_COLORS[runName]}12` : 'transparent',
                  border: `1px solid ${isChecked ? OVERLAY_COLORS[runName] + '55' : 'rgba(255,255,255,0.04)'}`,
                  cursor: 'pointer', fontSize: '0.78rem', transition: 'all 0.15s',
                }}
              >
                {isChecked ? <CheckSquare size={14} color={OVERLAY_COLORS[runName]} /> : <Square size={14} color="var(--text-muted)" />}
                <span style={{ color: isChecked ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: isChecked ? 600 : 400 }}>
                  {runName}
                </span>
              </div>
            );
          })}
          <div style={{ marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {activeRunNames.length} of {Object.keys(selectedRuns).length} selected
          </div>
        </div>

        {/* Right: Chart */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          {/* View tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {selectedPreset}
            </div>
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px' }}>
              {(['PCA', 'Curves', 'Waterfall'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  style={{
                    padding: '5px 12px', borderRadius: '6px', border: 'none',
                    background: activeView === v ? '#8b5cf6' : 'transparent',
                    color: activeView === v ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {v === 'PCA' ? 'PCA Scatter' : v === 'Curves' ? 'Overlay Curves' : 'TTD Waterfall'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 340, width: '100%' }}>
            {activeRunNames.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Select at least one organism on the left to see data.
              </div>
            ) : (
              <>
                {activeView === 'PCA' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="x" type="number" stroke="var(--text-muted)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                        label={{ value: 'PC-1', position: 'insideBottom', offset: -8, fill: 'var(--text-muted)', fontSize: 10 }} />
                      <YAxis dataKey="y" type="number" stroke="var(--text-muted)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                        label={{ value: 'PC-2', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 10 }} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '0.76rem' }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(_val: any, _name: any, props: any) => [`(${props.payload.x}, ${props.payload.y})`, props.payload.name]}
                      />
                      <Scatter name="Pathogen Clusters" data={filteredPcaData}>
                        {filteredPcaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={OVERLAY_COLORS[entry.name] || GRAM_COLORS[entry.gram] || '#3b82f6'} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                )}

                {activeView === 'Curves' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overlayKineticData} margin={{ top: 8, right: 12, left: 4, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                        label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -8, fill: 'var(--text-muted)', fontSize: 10 }} />
                      <YAxis stroke="var(--text-muted)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                        label={{ value: 'ΔR/R₀', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 10 }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '0.76rem' }} />
                      <Legend wrapperStyle={{ fontSize: '0.68rem', paddingTop: '6px' }} />
                      {activeRunNames.map(runName => (
                        <Line key={runName} type="monotone" name={runName} dataKey={runName} stroke={OVERLAY_COLORS[runName]} strokeWidth={2} dot={false} animationDuration={500} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {activeView === 'Waterfall' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredTtdData} layout="vertical" margin={{ top: 8, right: 20, left: 10, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" stroke="var(--text-muted)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                        label={{ value: 'TTD (minutes)', position: 'insideBottom', offset: -4, fill: 'var(--text-muted)', fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" stroke="var(--text-muted)" width={160} tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', fontSize: '0.76rem' }} />
                      <Bar dataKey="TTD" radius={[0, 6, 6, 0]} animationDuration={500}>
                        {filteredTtdData.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={OVERLAY_COLORS[entry.name] || '#8b5cf6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
