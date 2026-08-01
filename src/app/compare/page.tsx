"use client";

import { useState } from 'react';
import { MOCK_PCA_DATA } from '@/lib/mockData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { GitCompare, Sparkles, Activity, Layers, Cpu, ArrowLeftRight } from 'lucide-react';

export default function CompareLabPage() {
  const [selectedPreset, setSelectedPreset] = useState('1. Same Pathogen, Different Source');
  const [activeView, setActiveView] = useState<'PCA' | 'Curves' | 'Heatmap' | 'Waterfall'>('PCA');

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

  // Waterfall TTD comparison data
  const ttdWaterfallData = [
    { name: 'P. aeruginosa (ATCC)', TTD: 28, group: 'P. aeruginosa' },
    { name: 'P. aeruginosa (Clinical Mayo)', TTD: 26, group: 'P. aeruginosa' },
    { name: 'P. aeruginosa (NPWT Effluent)', TTD: 22, group: 'P. aeruginosa' },
    { name: 'S. aureus MSSA', TTD: 32, group: 'S. aureus' },
    { name: 'S. aureus MRSA', TTD: 30, group: 'S. aureus' },
    { name: 'K. pneumoniae ESBL+', TTD: 35, group: 'K. pneumoniae' },
    { name: 'A. baumannii CRAB', TTD: 40, group: 'A. baumannii' }
  ];

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
            Cross-compare pathogen signatures across sources, growth media, temperatures, and sensor arrays.
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

      {/* Main Viewport Container */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* View Switcher Controls */}
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

        {/* View Content Renderers */}
        <div style={{ height: '400px', width: '100%', marginTop: '10px' }}>
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
              <LineChart data={[
                { time: 0, Pa_ATCC: 0, Pa_Mayo: 0, Pa_NPWT: 0 },
                { time: 15, Pa_ATCC: 0.1, Pa_Mayo: 0.15, Pa_NPWT: 0.25 },
                { time: 30, Pa_ATCC: 1.2, Pa_Mayo: 1.45, Pa_NPWT: 1.90 },
                { time: 45, Pa_ATCC: 2.8, Pa_Mayo: 3.10, Pa_NPWT: 3.65 },
                { time: 60, Pa_ATCC: 4.0, Pa_Mayo: 4.20, Pa_NPWT: 4.40 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)' }} />
                <Legend />
                <Line type="monotone" name="Pa (ATCC Reference)" dataKey="Pa_ATCC" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" name="Pa (Mayo Clinical Isolate)" dataKey="Pa_Mayo" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" name="Pa (HSS NPWT Effluent)" dataKey="Pa_NPWT" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeView === 'Waterfall' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ttdWaterfallData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" label={{ value: 'TTD (Minutes)', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)' }} />
                <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={180} tick={{ fontSize: 11 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }} />
                <Line type="monotone" dataKey="TTD" stroke="var(--accent-purple)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Value Callout Footer */}
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid #3b82f6', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <strong>Strategic Insight:</strong> Demonstrates to investors, DoD, and clinical partners that the RAPID-iNose database is not a single static dataset, but a robust real-world asset capable of discriminating clinical isolates across diverse hospital origins and media shifts.
        </div>

      </div>

    </div>
  );
}
