"use client";

import { useState } from 'react';
import { MOCK_AMR_KINETICS, MOCK_BIOFILM_KINETICS } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ShieldAlert, Cpu, Sparkles, Clock, CheckCircle2, AlertTriangle, Layers, Sliders, Activity } from 'lucide-react';

export default function AmrBiofilmPage() {
  const [activeTab, setActiveTab] = useState<'AMR' | 'Biofilm'>('AMR');
  const [selectedPair, setSelectedPair] = useState('MRSA vs MSSA');
  const [abxConcentration, setAbxConcentration] = useState<'None' | 'Sub-MIC' | 'Therapeutic MIC' | 'High Dose'>('Therapeutic MIC');
  const [biofilmStage, setBiofilmStage] = useState<'Attachment' | 'Early Biofilm' | 'Mature Biofilm' | 'Disrupted'>('Mature Biofilm');

  // Dynamic AMR kinetics based on antibiotic concentration
  const abxFactor = abxConcentration === 'None' ? 1.0 : abxConcentration === 'Sub-MIC' ? 0.7 : abxConcentration === 'Therapeutic MIC' ? 0.1 : 0.02;

  const amrChartData = MOCK_AMR_KINETICS.timeMinutes.map((t, idx) => ({
    time: t,
    mssa_no_abx: MOCK_AMR_KINETICS.mssa_no_abx[idx],
    mssa_with_oxacillin: +(MOCK_AMR_KINETICS.mssa_no_abx[idx] * abxFactor).toFixed(2),
    mrsa_no_abx: MOCK_AMR_KINETICS.mrsa_no_abx[idx],
    mrsa_with_oxacillin: MOCK_AMR_KINETICS.mrsa_with_oxacillin[idx], // Resistant!
  }));

  // Dynamic Biofilm kinetics
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
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>AMR Strain Pair:</span>
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

            {/* Antibiotic Dose Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Antibiotic Dose:</span>
              {(['None', 'Sub-MIC', 'Therapeutic MIC', 'High Dose'] as const).map(dose => (
                <button
                  key={dose}
                  onClick={() => setAbxConcentration(dose)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: abxConcentration === dose ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: abxConcentration === dose ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {dose}
                </button>
              ))}
            </div>
          </div>

          {/* Paired Strain Response Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Paired Strain Kinetics ({selectedPair})</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dose Exposure: {abxConcentration}</span>
                </div>
                <span className="badge badge-red">Earliest Diff: 45 Minutes</span>
              </div>

              <div style={{ height: '340px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={amrChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--text-secondary)" label={{ value: 'Time Under Antibiotic Exposure (minutes)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" label={{ value: 'Sensor Signal ΔR/R0', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Legend verticalAlign="top" height={36} />

                    <ReferenceLine x={45} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Earliest AMR Diff (45 min)', fill: '#ef4444', position: 'top' }} />

                    <Line type="monotone" name="Susceptible Strain (No Antibiotic)" dataKey="mssa_no_abx" stroke="#60a5fa" strokeWidth={2} dot={false} />
                    <Line type="monotone" name={`Susceptible Strain (+ ${abxConcentration})`} dataKey="mssa_with_oxacillin" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="Resistant Strain (No Antibiotic)" dataKey="mrsa_no_abx" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" name={`Resistant Strain (+ ${abxConcentration} RESISTANT)`} dataKey="mrsa_with_oxacillin" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AMR Confusion Matrix & Performance Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-danger)', textTransform: 'uppercase', marginBottom: '12px', margin: 0 }}>
                  AMR Classifier Confusion Matrix
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', textAlign: 'center', marginTop: '10px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '6px', border: '1px solid #10b981' }}>
                    <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.2rem' }}>148</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>True Resistant (TP)</div>
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '6px', border: '1px solid #ef4444' }}>
                    <div style={{ color: '#f87171', fontWeight: 800, fontSize: '1.2rem' }}>3</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>False Resistant (FP)</div>
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '6px', border: '1px solid #ef4444' }}>
                    <div style={{ color: '#f87171', fontWeight: 800, fontSize: '1.2rem' }}>4</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>False Suscept (FN)</div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '6px', border: '1px solid #10b981' }}>
                    <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.2rem' }}>185</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>True Suscept (TN)</div>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Pharma AST Value</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Accelerates functional AST from 48 hours to &lt; 1 hour, allowing targeted drug therapy selection.
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Biofilm Sub-module */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Biofilm Growth Stage Selector:</span>
            {(['Attachment', 'Early Biofilm', 'Mature Biofilm', 'Disrupted'] as const).map(stg => (
              <button
                key={stg}
                onClick={() => setBiofilmStage(stg)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: biofilmStage === stg ? 'var(--accent-secondary)' : 'var(--bg-tertiary)',
                  color: biofilmStage === stg ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {stg}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
                Planktonic vs Biofilm Maturation Kinetics
              </h3>

              <div style={{ height: '340px', width: '100%' }}>
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
                  Biofilm Validation Specs
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div>• Crystal Violet Staining (OD 595nm)</div>
                  <div>• Confocal Laser Scanning Microscopy</div>
                  <div>• EPS Extracellular Matrix Quantification</div>
                  <div>• CDC Biofilm Reactor Model</div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Target for Zimmer Biomet</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Distinguishes low-grade prosthetic joint biofilms from acute floating planktonic infections.
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
