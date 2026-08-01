"use client";

import { useState } from 'react';
import { MOCK_AMR_KINETICS, MOCK_BIOFILM_KINETICS } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ShieldAlert, Cpu, Sparkles, Clock, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function AmrBiofilmPage() {
  const [activeTab, setActiveTab] = useState<'AMR' | 'Biofilm'>('AMR');
  const [selectedPair, setSelectedPair] = useState('MRSA vs MSSA');

  // Format AMR kinetics for Recharts
  const amrChartData = MOCK_AMR_KINETICS.timeMinutes.map((t, idx) => ({
    time: t,
    mssa_no_abx: MOCK_AMR_KINETICS.mssa_no_abx[idx],
    mssa_with_oxacillin: MOCK_AMR_KINETICS.mssa_with_oxacillin[idx],
    mrsa_no_abx: MOCK_AMR_KINETICS.mrsa_no_abx[idx],
    mrsa_with_oxacillin: MOCK_AMR_KINETICS.mrsa_with_oxacillin[idx],
  }));

  // Format Biofilm kinetics for Recharts
  const biofilmChartData = MOCK_BIOFILM_KINETICS.timeHours.map((t, idx) => ({
    hours: t,
    planktonic: MOCK_BIOFILM_KINETICS.planktonic[idx],
    biofilm_early: MOCK_BIOFILM_KINETICS.biofilm_early[idx],
    biofilm_mature: MOCK_BIOFILM_KINETICS.biofilm_mature[idx],
    biofilm_disrupted: MOCK_BIOFILM_KINETICS.biofilm_disrupted[idx]
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Sub-module Selector */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>AMR & Biofilm Module</h1>
            <span className="badge badge-red">Layer 8 & Layer 9 High-Value Asset</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Functional antibiotic resistance phenotyping & surface biofilm maturation kinetics.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('AMR')}
            style={{
              padding: '6px 18px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'AMR' ? 'var(--accent-danger)' : 'transparent',
              color: activeTab === 'AMR' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            AMR Phenotype Layer
          </button>
          <button
            onClick={() => setActiveTab('Biofilm')}
            style={{
              padding: '6px 18px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'Biofilm' ? 'var(--accent-secondary)' : 'transparent',
              color: activeTab === 'Biofilm' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Biofilm Layer
          </button>
        </div>
      </div>

      {activeTab === 'AMR' ? (
        /* AMR Sub-module */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Controls Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Select AMR Pair:</span>
              {['MRSA vs MSSA', 'VRE vs VSE', 'CRE vs Susceptible', 'CRAB vs Susceptible'].map(pair => (
                <button
                  key={pair}
                  onClick={() => setSelectedPair(pair)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: selectedPair === pair ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-tertiary)',
                    color: selectedPair === pair ? '#f87171' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {pair}
                </button>
              ))}
            </div>

            <span className="badge badge-amber">Confirmed by AST & MIC</span>
          </div>

          {/* Paired Strain Response Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Paired Strain Antibiotic Pressure Kinetics</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Oxacillin Exposure (Sub-MIC to Clinical Dose)</span>
                </div>
              </div>

              <div style={{ height: '360px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={amrChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--text-secondary)" label={{ value: 'Time Under Antibiotic Exposure (minutes)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" label={{ value: 'Sensor Signal ΔR/R0', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Legend verticalAlign="top" height={36} />

                    <ReferenceLine x={45} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Earliest AMR Diff (45 min)', fill: '#ef4444', position: 'top' }} />

                    <Line type="monotone" name="MSSA (No Oxacillin)" dataKey="mssa_no_abx" stroke="#60a5fa" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="MSSA (+ Oxacillin Inhibited)" dataKey="mssa_with_oxacillin" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="MRSA (No Oxacillin)" dataKey="mrsa_no_abx" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="MRSA (+ Oxacillin RESISTANT)" dataKey="mrsa_with_oxacillin" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AMR Performance & Model Confidence Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-danger)', textTransform: 'uppercase', marginBottom: '12px', margin: 0 }}>
                  AMR Classifier Performance
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>ROC-AUC Score:</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>0.985</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>AMR Sensitivity:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>96.8%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>AMR Specificity:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>97.4%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Earliest Differentiation:</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-danger)' }}>45 mins</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', margin: 0 }}>
                  Value to Pharma & DoD
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Accelerates functional AST from 24-48 hours down to &lt; 1 hour, allowing targeted narrow-spectrum antibiotic selection during trauma resuscitation.
                </p>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Biofilm Sub-module */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
                Planktonic vs Biofilm Maturation Kinetics
              </h3>

              <div style={{ height: '360px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={biofilmChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="hours" stroke="var(--text-secondary)" label={{ value: 'Incubation Time (hours)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" label={{ value: 'Biofilm Nanosensor Index', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Legend verticalAlign="top" height={36} />

                    <Line type="monotone" name="Planktonic Floating Control" dataKey="planktonic" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="Early Attachment Biofilm" dataKey="biofilm_early" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="Mature Surface Biofilm" dataKey="biofilm_mature" stroke="#10b981" strokeWidth={3} dot={false} />
                    <Line type="monotone" name="Anti-Biofilm Treatment Disruption" dataKey="biofilm_disrupted" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '10px', margin: 0 }}>
                  Biofilm Validation Methods
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div>• Crystal Violet Staining (OD 595nm)</div>
                  <div>• Confocal Laser Scanning Microscopy</div>
                  <div>• EPS Extracellular Matrix Quantification</div>
                  <div>• CDC Biofilm Reactor Model</div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', margin: 0 }}>
                  Target for Implant & Orthopedics
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Essential for Zimmer Biomet and implant manufacturers seeking to differentiate low-grade prosthetic joint biofilms from acute floating infections.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
