"use client";

import { useState } from 'react';
import { MOCK_VOC_HEATMAP } from '@/lib/mockData';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { FlaskConical, Sparkles, Search, Network, Layers, Activity } from 'lucide-react';

export default function MetabolitesPage() {
  const [activeQueryType, setActiveQueryType] = useState<'Metabolite' | 'Pathogen' | 'Sensor'>('Pathogen');
  const [queryInput, setQueryInput] = useState('P. aeruginosa');

  // Sample GC-MS Chromatogram Peak data
  const chromatogramPeaks = [
    { retentionTime: 2.4, intensity: 1800, compoundName: 'Ethanol', class: 'alcohol', matchScore: 98 },
    { retentionTime: 3.8, intensity: 4500, compoundName: 'Hydrogen Cyanide', class: 'nitrogen', matchScore: 99 },
    { retentionTime: 5.2, intensity: 8200, compoundName: '2-Aminoacetophenone', class: 'amine', matchScore: 97 },
    { retentionTime: 7.1, intensity: 3100, compoundName: 'Isoamyl alcohol', class: 'alcohol', matchScore: 95 },
    { retentionTime: 9.5, intensity: 6400, compoundName: '1-Undecene', class: 'hydrocarbon', matchScore: 96 },
    { retentionTime: 12.3, intensity: 2900, compoundName: 'Dimethyl disulfide', class: 'sulfur', matchScore: 94 },
  ];

  // VOC Chemical Class Distribution
  const vocClassData = [
    { name: 'Sulfur Compounds', value: 28 },
    { name: 'Amine / Nitrogens', value: 24 },
    { name: 'Alcohols', value: 18 },
    { name: 'Ketones & Aldehydes', value: 15 },
    { name: 'Hydrocarbons & Aromatics', value: 15 }
  ];

  const CLASS_COLORS = ['#ef4444', '#8b5cf6', '#3b82f6', '#f59e0b', '#10b981'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Metabolite Explorer (GC-MS)</h1>
            <span className="badge badge-purple">Layer 7 Chemical Signature</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Headspace Gas Chromatography-Mass Spectrometry (GC-MS) VOC catalog & sensor-metabolite correlation engine.
          </p>
        </div>
      </div>

      {/* Advanced Interactive Query Bar (PDF Page 20 Requirement) */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--accent-warning)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Chemical Lookup & Correlation Query</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {(['Pathogen', 'Metabolite', 'Sensor'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveQueryType(t)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeQueryType === t ? 'var(--accent-primary)' : 'transparent',
                  color: activeQueryType === t ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Search by {t}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: 12, top: 10 }} />
            <input 
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={`Enter ${activeQueryType.toLowerCase()} name...`}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 16px 8px 36px',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Query Output Banner */}
        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #8b5cf6', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Showing dominant VOC features and sensor channel correlation for <strong>{queryInput}</strong>. Correlated Sensor Channel: <strong>LW65 (Sulfur) & LW62 (Amine)</strong>.
        </div>
      </div>

      {/* Chromatogram Peaks & VOC Class Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* GC-MS Chromatogram Chart */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>
            Headspace GC-MS Chromatogram Peaks
          </h3>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chromatogramPeaks} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="retentionTime" stroke="var(--text-secondary)" label={{ value: 'Retention Time (min)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                <YAxis stroke="var(--text-secondary)" label={{ value: 'Abundance Intensity', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                  formatter={(val, name, props) => [`${val} (${props.payload.compoundName})`, 'Abundance']}
                />
                <Bar dataKey="intensity" barSize={6}>
                  {chromatogramPeaks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--accent-purple)" />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* VOC Chemical Class Distribution */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>VOC Chemical Classes</h3>
          <div style={{ height: '180px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vocClassData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                  {vocClassData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CLASS_COLORS[index % CLASS_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', marginTop: 'auto' }}>
            {vocClassData.map((v, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{v.name}</span>
                <span style={{ fontWeight: 600, color: CLASS_COLORS[i] }}>{v.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Pathogen x VOC Heatmap Table (PDF Page 30 Requirement) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
          Pathogen × VOC Relative Abundance Matrix
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Pathogen Species</th>
                {MOCK_VOC_HEATMAP.compounds.map((c, i) => (
                  <th key={i} style={{ padding: '8px' }}>{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_VOC_HEATMAP.matrix.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', fontStyle: 'italic' }}>
                    {row.pathogen}
                  </td>
                  {row.values.map((val, cIdx) => {
                    const opacity = Math.max(0.1, val / 100);
                    return (
                      <td key={cIdx} style={{ padding: '8px' }}>
                        <div style={{
                          background: `rgba(139, 92, 246, ${opacity})`,
                          color: val > 50 ? '#fff' : 'var(--text-secondary)',
                          borderRadius: '4px',
                          padding: '4px',
                          fontWeight: val > 70 ? 700 : 400
                        }}>
                          {val}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
