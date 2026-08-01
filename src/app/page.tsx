"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { ArrowUpRight, Activity, Database, Beaker, Zap, ShieldCheck, Cpu, Layers, AlertCircle, Sparkles, Clock, CheckCircle, Award } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';

export default function AtlasHome() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 12 KPI Metrics according to Strategic Specification
  const kpiList = [
    { title: 'Total Organisms', value: '102', delta: '+12%', sub: 'Bacteria & Fungi', color: 'var(--accent-primary)', icon: Activity },
    { title: 'Total Species', value: '48', delta: '+8%', sub: 'Pathogen Species', color: 'var(--accent-teal)', icon: Layers },
    { title: 'Strains & Isolates', value: '450', delta: '+15%', sub: 'ATCC & Clinical', color: 'var(--accent-secondary)', icon: Database },
    { title: 'Clinical Sources', value: '18', delta: '+3', sub: 'Mayo, HSS, Zimmer, Labcorp', color: '#60a5fa', icon: Award },
    { title: 'Sensor Runs', value: '1,280', delta: '+22%', sub: 'Kinetic Time-Series', color: 'var(--accent-warning)', icon: Zap },
    { title: 'Growth Conditions', value: '24', delta: 'Active', sub: 'Media & Temp Matrix', color: 'var(--accent-purple)', icon: Beaker },
    { title: 'Media Types', value: '12', delta: 'Standardized', sub: 'LB, Blood Agar, TSB, BD', color: '#c084fc', icon: Beaker },
    { title: 'Temperature Matrix', value: '3', delta: '25°/37°/40°C', sub: 'Environmental Control', color: '#fbbf24', icon: Activity },
    { title: 'GC-MS Samples', value: '320', delta: '+45', sub: 'VOC Validated Runs', color: 'var(--accent-pink)', icon: Sparkles },
    { title: 'AMR Strain Pairs', value: '64', delta: '+12', sub: 'MRSA, VRE, CRE, CRAB', color: 'var(--accent-danger)', icon: ShieldCheck },
    { title: 'Biofilm Models', value: '16', delta: '+4', sub: 'Implant & Wound', color: '#34d399', icon: Cpu },
    { title: 'Validated AI Models', value: '8', delta: 'Regulatory Ready', sub: 'Diagnostic Classifiers', color: '#60a5fa', icon: CheckCircle }
  ];

  // Maturity Progress Data across Database Layers
  const maturityData = [
    { layer: 'Organism Identity', Reference: 98, Clinical: 92, GCMS: 85 },
    { layer: 'Source Provenance', Reference: 95, Clinical: 88, GCMS: 78 },
    { layer: 'Growth Condition', Reference: 92, Clinical: 82, GCMS: 70 },
    { layer: 'Sensor Kinetics', Reference: 99, Clinical: 95, GCMS: 90 },
    { layer: 'GC-MS VOC Profile', Reference: 85, Clinical: 72, GCMS: 88 },
    { layer: 'AMR Phenotyping', Reference: 78, Clinical: 84, GCMS: 65 },
    { layer: 'Biofilm Maturation', Reference: 65, Clinical: 70, GCMS: 55 },
    { layer: 'AI Diagnostic', Reference: 90, Clinical: 86, GCMS: 82 },
  ];

  // Clinical Source Diversity breakdown
  const sourceDiversity = [
    { name: 'Clinical Wound Isolates', value: 38 },
    { name: 'ATCC Reference Strains', value: 25 },
    { name: 'Blood Culture Bottled', value: 18 },
    { name: 'Implant & NPWT Effluent', value: 12 },
    { name: 'Food & Environmental', value: 7 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Atlas Home / Executive Dashboard
            </h1>
            <span className="badge badge-blue">10-Layer Intelligence Platform</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
            Microbial VOC & Nanosensor Kinetics Database — Supporting Wound Care, Military Medicine, Blood Culture, & AI Commercialization.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ 
            background: 'var(--bg-tertiary)', 
            color: 'var(--text-primary)', 
            border: '1px solid var(--border-color)', 
            padding: '8px 16px', 
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}>
            Quick Export CSV
          </button>
          <button style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
            color: '#fff', 
            border: 'none', 
            padding: '8px 18px', 
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <ArrowUpRight size={16} />
            Generate Executive Briefing
          </button>
        </div>
      </div>

      {/* 12 KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {kpiList.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.title}</span>
                <Icon size={16} color={kpi.color} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{kpi.value}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{kpi.delta}</span>
                <span style={{ color: 'var(--text-muted)' }}>{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Visualizations Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Database Maturity & Layer Coverage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Database Maturity Bar Chart */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Database Layer Maturity & Validation Coverage</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comparing Reference Strain Data vs Clinical Isolate & GC-MS Data</span>
              </div>
              <span className="badge badge-purple">Layer 1 - 10 Standard</span>
            </div>

            <div style={{ height: '300px', width: '100%' }}>
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maturityData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="layer" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} angle={-15} textAnchor="end" />
                    <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} domain={[0, 100]} unit="%" />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }} />
                    <Bar dataKey="Reference" name="Reference Strain Data (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Clinical" name="Clinical Isolate Data (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="GCMS" name="GC-MS Validated (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* 4D Pathogen & Condition Matrix Coverage */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
              4D Matrix Coverage (Organism × Media × Temperature × Source)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Real-world clinical diversity matrix tracking experimental coverage across key target environments.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LB & TSB Media</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-secondary)', marginTop: '4px' }}>100% Covered</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>102/102 Species</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BD Blood Culture Media</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>84% Covered</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>86/102 Species</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wound-Mimic Exudate</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-warning)', marginTop: '4px' }}>76% Covered</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>78/102 Species</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>40°C Austere Condition</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-purple)', marginTop: '4px' }}>62% Covered</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>63/102 Species</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Strategic Insights & Data Gaps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Source Diversity Pie */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>Clinical Source Diversity</h3>
            <div style={{ height: '200px', width: '100%' }}>
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceDiversity}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {sourceDiversity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', fontSize: '0.8rem' }}>
              {sourceDiversity.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Executive Insights Panel */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--accent-warning)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Executive Intelligence</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                <div style={{ fontWeight: 600, color: '#60a5fa' }}>Fastest Detected Organisms</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>*P. aeruginosa* & *E. coli* exhibit distinct kinetic onset in &lt; 25 minutes.</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                <div style={{ fontWeight: 600, color: '#34d399' }}>Highest AI Confidence</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Gram Triage Classifier achieves 99.1% accuracy across all 450 strains.</div>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                <div style={{ fontWeight: 600, color: '#f87171' }}>Priority Data Gap</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Expand fungal isolates (*C. auris*) & ex vivo burn wound exudate replicates.</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
