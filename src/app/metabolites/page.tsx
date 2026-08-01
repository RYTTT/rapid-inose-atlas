"use client";

import { useState } from 'react';
import { MOCK_VOC_HEATMAP } from '@/lib/mockData';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, ScatterChart, Scatter } from 'recharts';
import { FlaskConical, Sparkles, Search, Network, Layers, Activity, Clock, Filter, ArrowRight } from 'lucide-react';

export default function MetabolitesPage() {
  const [activeQueryType, setActiveQueryType] = useState<'Metabolite' | 'Pathogen' | 'Sensor' | 'Antibiotic'>('Pathogen');
  const [queryInput, setQueryInput] = useState('P. aeruginosa');
  const [timeCourseDay, setTimeCourseDay] = useState<'Day 1' | 'Day 2' | 'Day 7'>('Day 1');

  // Time-course peak intensity modifier based on incubation day
  const dayMultiplier = timeCourseDay === 'Day 1' ? 1.0 : timeCourseDay === 'Day 2' ? 1.8 : 2.5;

  const chromatogramPeaks = [
    { retentionTime: 2.4, intensity: Math.round(1800 * dayMultiplier), compoundName: 'Ethanol', class: 'alcohol', matchScore: 98, formula: 'C2H6O', mass: 46.07 },
    { retentionTime: 3.8, intensity: Math.round(4500 * dayMultiplier), compoundName: 'Hydrogen Cyanide', class: 'nitrogen', matchScore: 99, formula: 'HCN', mass: 27.03 },
    { retentionTime: 5.2, intensity: Math.round(8200 * dayMultiplier), compoundName: '2-Aminoacetophenone', class: 'amine', matchScore: 97, formula: 'C8H9NO', mass: 135.16 },
    { retentionTime: 7.1, intensity: Math.round(3100 * dayMultiplier), compoundName: 'Isoamyl alcohol', class: 'alcohol', matchScore: 95, formula: 'C5H12O', mass: 88.15 },
    { retentionTime: 9.5, intensity: Math.round(6400 * dayMultiplier), compoundName: '1-Undecene', class: 'hydrocarbon', matchScore: 96, formula: 'C11H22', mass: 154.29 },
    { retentionTime: 12.3, intensity: Math.round(2900 * dayMultiplier), compoundName: 'Dimethyl disulfide', class: 'sulfur', matchScore: 94, formula: 'C2H6S2', mass: 94.20 },
  ];

  // Differential VOC Volcano Plot Data (Log2 Fold Change vs -Log10 P-Value)
  const volcanoData = [
    { name: '2-Aminoacetophenone', foldChange: 3.5, pValue: 5.2, class: 'amine' },
    { name: 'Hydrogen Cyanide', foldChange: 4.1, pValue: 6.8, class: 'nitrogen' },
    { name: '1-Undecene', foldChange: 2.8, pValue: 4.1, class: 'hydrocarbon' },
    { name: 'Isoamyl alcohol', foldChange: -1.2, pValue: 1.5, class: 'alcohol' },
    { name: 'Acetoin', foldChange: -2.1, pValue: 2.9, class: 'ketone' },
    { name: 'Indole', foldChange: 3.9, pValue: 5.9, class: 'aromatic' },
    { name: 'Isovaleric acid', foldChange: 1.8, pValue: 3.2, class: 'acid' },
    { name: 'Dimethyl disulfide', foldChange: 3.1, pValue: 4.8, class: 'sulfur' }
  ];

  const vocClassData = [
    { name: 'Sulfur Compounds', value: 28 },
    { name: 'Amine / Nitrogens', value: 24 },
    { name: 'Alcohols', value: 18 },
    { name: 'Ketones & Aldehydes', value: 15 },
    { name: 'Hydrocarbons & Aromatics', value: 15 }
  ];

  const CLASS_COLORS = ['#ef4444', '#8b5cf6', '#3b82f6', '#f59e0b', '#10b981'];

  // Dynamic Query Results based on input
  const getQueryResult = () => {
    if (activeQueryType === 'Pathogen') {
      return {
        title: `Pathogen Signature: ${queryInput}`,
        producedVOCs: ['2-Aminoacetophenone', 'Hydrogen Cyanide', '1-Undecene', 'Pyocyanin precursor'],
        correlatedSensor: 'LW65 (Sulfur-Responsive) & LW62 (Amine-Responsive)',
        confidence: '98.5% NIST Match Score'
      };
    } else if (activeQueryType === 'Metabolite') {
      return {
        title: `Metabolite Analysis: ${queryInput}`,
        producedVOCs: ['Produced primarily by P. aeruginosa & Burkholderia cepacia'],
        correlatedSensor: 'LW65 Nanosensor (Sensitivity Limit: 5 ppb)',
        confidence: 'High-Confidence Biomarker'
      };
    } else if (activeQueryType === 'Sensor') {
      return {
        title: `Sensor Channel Mapping: ${queryInput}`,
        producedVOCs: ['Responds to Sulfur & Nitrogen VOC classes'],
        correlatedSensor: 'LW65 / NBF-S01 Sulfur-Sensitive Channel',
        confidence: 'Primary Diagnostic Channel'
      };
    } else {
      return {
        title: `Antibiotic Pressure Shift: ${queryInput}`,
        producedVOCs: ['Rapid shutdown of 2-Aminoacetophenone synthesis within 45 min'],
        correlatedSensor: 'LW65 & LW60 Kinetic Decoupling',
        confidence: 'Functional AST Biomarker'
      };
    }
  };

  const queryResult = getQueryResult();

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
            Headspace Gas Chromatography-Mass Spectrometry (GC-MS) VOC catalog, time-course evolution, & volcano plots.
          </p>
        </div>
      </div>

      {/* Advanced Interactive Query Engine */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent-warning)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Interactive Sensor-Metabolite Correlation Engine</h3>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {(['Pathogen', 'Metabolite', 'Sensor', 'Antibiotic'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveQueryType(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeQueryType === t ? 'var(--accent-primary)' : 'transparent',
                  color: activeQueryType === t ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {t} Lookup
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: 12, top: 10 }} />
            <input 
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={`Type ${activeQueryType.toLowerCase()} name (e.g. ${activeQueryType === 'Pathogen' ? 'P. aeruginosa' : activeQueryType === 'Metabolite' ? '2-Aminoacetophenone' : activeQueryType === 'Sensor' ? 'LW65' : 'Oxacillin'})...`}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-highlight)',
                borderRadius: '8px',
                padding: '8px 16px 8px 36px',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Live Query Results Card */}
        <div style={{ background: 'rgba(139, 92, 246, 0.12)', padding: '14px 18px', borderRadius: '8px', borderLeft: '4px solid #8b5cf6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{queryResult.title}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px' }}>
              Associated Features: {queryResult.producedVOCs.join(', ')}
            </div>
            <div style={{ color: '#c084fc', fontSize: '0.8rem', marginTop: '2px', fontWeight: 600 }}>
              Correlated Sensor Channel: {queryResult.correlatedSensor}
            </div>
          </div>
          <span className="badge badge-purple">{queryResult.confidence}</span>
        </div>
      </div>

      {/* GC-MS Chromatogram & Time-Course Evolution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* GC-MS Chromatogram Chart */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              Headspace GC-MS Chromatogram Peak Spectrum
            </h3>
            
            {/* Time Course Selector */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '6px' }}>
              {(['Day 1', 'Day 2', 'Day 7'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setTimeCourseDay(d)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: timeCourseDay === d ? 'var(--accent-purple)' : 'transparent',
                    color: timeCourseDay === d ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chromatogramPeaks} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="retentionTime" stroke="var(--text-secondary)" label={{ value: 'Retention Time (min)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                <YAxis stroke="var(--text-secondary)" label={{ value: 'Peak Intensity', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                  formatter={(val, name, props) => [`Intensity: ${val} (Formula: ${props.payload.formula})`, props.payload.compoundName]}
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
          <div style={{ height: '170px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vocClassData} cx="50%" cy="50%" innerRadius={40} outerRadius={68} paddingAngle={4} dataKey="value">
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

      {/* Differential VOC Volcano Plot */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
          Differential VOC Volcano Plot (Pathogen vs Media Control)
        </h3>

        <div style={{ height: '260px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="foldChange" type="number" stroke="var(--text-secondary)" label={{ value: 'Log2 Fold-Change (Enrichment)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis dataKey="pValue" type="number" stroke="var(--text-secondary)" label={{ value: '-Log10 P-Value (Significance)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                formatter={(val, name, props) => [`-Log10 P: ${props.payload.pValue}`, props.payload.name]}
              />
              <Scatter name="Enriched VOCs" data={volcanoData} fill="var(--accent-teal)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
