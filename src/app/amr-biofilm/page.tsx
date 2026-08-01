"use client";

import { useState } from 'react';
import { MOCK_AMR_KINETICS, MOCK_BIOFILM_KINETICS, MOCK_MICROPLATE_DOSE_DATA, MicroplateWellDose } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ShieldAlert, Cpu, Sparkles, Clock, CheckCircle2, AlertTriangle, Layers, Sliders, Activity, Grid, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function AmrBiofilmPage() {
  const [activeTab, setActiveTab] = useState<'Microplate' | 'AMR' | 'Biofilm'>('Microplate');
  const [selectedPair, setSelectedPair] = useState('MRSA vs MSSA');
  const [abxConcentration, setAbxConcentration] = useState<'None' | 'Sub-MIC' | 'Therapeutic MIC' | 'High Dose'>('Therapeutic MIC');
  const [biofilmStage, setBiofilmStage] = useState<'Attachment' | 'Early Biofilm' | 'Mature Biofilm' | 'Disrupted'>('Mature Biofilm');

  // Microplate & Railway AST Dataset States
  const [selectedAstDataset, setSelectedAstDataset] = useState<'AST-CIP-2026-07' | 'AST-GENT-2026-07'>('AST-CIP-2026-07');
  const [selectedOrganismId, setSelectedOrganismId] = useState<string>('52'); // P. aeruginosa ATCC 27853
  const [selectedWellId, setSelectedWellId] = useState<string>('B4'); // Default MIC boundary well
  const [astSignalView, setAstSignalView] = useState<'normalized' | 'raw'>('normalized');
  const [astEndpointHours, setAstEndpointHours] = useState<number>(20.5);

  const astOrganisms = [
    { id: '54', name: 'Escherichia coli ATCC 25922', type: 'Quality Control Standard' },
    { id: '50', name: 'Escherichia coli ATCC BAA-196', type: 'ESBL Resistant Reference' },
    { id: '52', name: 'Pseudomonas aeruginosa ATCC 27853', type: 'Canonical Reference Strain' },
    { id: '55', name: 'Pseudomonas aeruginosa ATCC BAA-2108', type: 'MDR Clinical Strain' },
    { id: '53', name: 'Staphylococcus aureus 252', type: 'MRSA Clinical Source' }
  ];

  // Currently selected well detail for Microbiology dose response
  const selectedWellInfo = MOCK_MICROPLATE_DOSE_DATA.find(w => w.wellId === selectedWellId) || MOCK_MICROPLATE_DOSE_DATA[4];

  // Dynamic AMR kinetics
  const abxFactor = abxConcentration === 'None' ? 1.0 : abxConcentration === 'Sub-MIC' ? 0.7 : abxConcentration === 'Therapeutic MIC' ? 0.1 : 0.02;

  const amrChartData = MOCK_AMR_KINETICS.timeMinutes.map((t, idx) => ({
    time: t,
    mssa_no_abx: MOCK_AMR_KINETICS.mssa_no_abx[idx],
    mssa_with_oxacillin: +(MOCK_AMR_KINETICS.mssa_no_abx[idx] * abxFactor).toFixed(2),
    mrsa_no_abx: MOCK_AMR_KINETICS.mrsa_no_abx[idx],
    mrsa_with_oxacillin: MOCK_AMR_KINETICS.mrsa_with_oxacillin[idx],
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>AMR & Microplate Dose-Response Module</h1>
            <span className="badge badge-red">Layer 8 Antibiotic Intelligence</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Integrating Microplate 12-Well Dose Alignment, Health Transition Color-Bars, & Published Railway AST Data.
          </p>
        </div>

        {/* 3-Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('Microplate')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'Microplate' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: activeTab === 'Microplate' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            12-Well Dose-Response & Transition
          </button>
          <button
            onClick={() => setActiveTab('AMR')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'AMR' ? 'var(--accent-danger)' : 'transparent',
              color: activeTab === 'AMR' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            AMR Phenotype Trajectories
          </button>
          <button
            onClick={() => setActiveTab('Biofilm')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'Biofilm' ? 'var(--accent-secondary)' : 'transparent',
              color: activeTab === 'Biofilm' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Biofilm Maturation
          </button>
        </div>
      </div>

      {activeTab === 'Microplate' ? (
        /* Tab 1: Microplate Well Extraction & Growth Curve Dose-Response Alignment (minyaozhu/MicroBiology + Railway AST Data) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Controls Bar for AST Dataset & Organism */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Published AST Dataset:</span>
              <select 
                value={selectedAstDataset}
                onChange={(e) => setSelectedAstDataset(e.target.value as any)}
                style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-highlight)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <option value="AST-CIP-2026-07">AST-CIP-2026-07 · Ciprofloxacin (July 2026)</option>
                <option value="AST-GENT-2026-07">AST-GENT-2026-07 · Gentamicin (July 2026)</option>
              </select>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: '12px' }}>Organism & Strain:</span>
              <select 
                value={selectedOrganismId}
                onChange={(e) => setSelectedOrganismId(e.target.value)}
                style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-highlight)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}
              >
                {astOrganisms.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-emerald">Signal View: {astSignalView === 'normalized' ? 'Signed Baseline-Relative %' : 'Raw Resistance'}</span>
              <span className="badge badge-amber">Endpoint: {astEndpointHours}h</span>
            </div>
          </div>

          {/* Health Status Transition Bar Legend Banner */}
          <div className="glass-panel" style={{ padding: '16px 20px', background: 'rgba(15, 23, 42, 0.85)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--accent-warning)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>In-Between Health Status Transition Color-Bars (Sorted High → Low Dose)</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '3px', background: '#10B981' }}></span>
                <span style={{ color: '#34d399' }}>Healthy (#1 ~ #4: 50.0 - 6.25 µg/mL)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '3px', background: '#F59E0B' }}></span>
                <span style={{ color: '#fbbf24' }}>Sub-Healthy MIC Threshold (#5: 3.13 µg/mL)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '3px', background: '#EF4444' }}></span>
                <span style={{ color: '#f87171' }}>Infection (#6 ~ #12: 1.56 - 0.0 µg/mL)</span>
              </div>
            </div>
          </div>

          {/* 12-Well Row Composite Visualizer with In-Between Transition Color-Bars */}
          <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              12-Well Microplate Extraction & Aligned Growth Curve Dose-Response Row
            </h3>

            <div style={{ display: 'flex', gap: '8px', minWidth: '1080px', paddingBottom: '8px' }}>
              {MOCK_MICROPLATE_DOSE_DATA.map((w, idx) => {
                const isSelected = selectedWellId === w.wellId;
                return (
                  <div key={w.wellId} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    
                    {/* Individual Well + Chart Card */}
                    <div 
                      onClick={() => setSelectedWellId(w.wellId)}
                      style={{
                        flex: 1,
                        background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-tertiary)',
                        border: '2px solid',
                        borderColor: isSelected ? 'var(--accent-primary)' : w.colorHex,
                        borderRadius: '10px',
                        padding: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none'
                      }}
                    >
                      {/* Well Rank & ID */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        <span>#{w.rank}</span>
                        <span style={{ color: 'var(--text-primary)' }}>{w.wellId}</span>
                      </div>

                      {/* Simulated Carved Well Circle */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        border: `3px solid ${w.colorHex}`,
                        background: w.status === 'Healthy' ? 'rgba(16, 185, 129, 0.2)' : w.status === 'Sub-Healthy' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(239, 68, 68, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: w.colorHex
                      }}>
                        {w.wellId}
                      </div>

                      {/* Concentration Label */}
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', color: 'var(--text-primary)', height: '24px', display: 'flex', alignItems: 'center' }}>
                        {w.doseVal > 0 ? `${w.doseVal} µg/mL` : '0 µg/mL'}
                      </div>

                      {/* Aligned Mini Growth Curve Chart */}
                      <div style={{ height: '60px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={w.growthCurve}>
                            <Line type="monotone" dataKey="signal" stroke={w.colorHex} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Status Badge */}
                      <div style={{
                        background: `${w.colorHex}22`,
                        color: w.colorHex,
                        border: `1px solid ${w.colorHex}55`,
                        borderRadius: '4px',
                        padding: '2px 4px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        width: '100%'
                      }}>
                        {w.status}
                      </div>
                    </div>

                    {/* In-Between Health Status Transition Color-Bar */}
                    {idx < MOCK_MICROPLATE_DOSE_DATA.length - 1 && (
                      <div style={{
                        width: '8px',
                        height: '100px',
                        margin: '0 4px',
                        borderRadius: '4px',
                        background: `linear-gradient(to bottom, ${w.colorHex}, ${MOCK_MICROPLATE_DOSE_DATA[idx+1].colorHex})`,
                        opacity: 0.8
                      }} />
                    )}

                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Well Coordinated Deep Inspector */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  Coordinated 6-Sensor Response for Well {selectedWellInfo.wellId} ({selectedWellInfo.doseStr})
                </h3>
                <span className="badge badge-purple" style={{ backgroundColor: `${selectedWellInfo.colorHex}22`, color: selectedWellInfo.colorHex, borderColor: selectedWellInfo.colorHex }}>
                  Health State: {selectedWellInfo.status}
                </span>
              </div>

              <div style={{ height: '280px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedWellInfo.growthCurve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--text-secondary)" label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" label={{ value: 'Response ΔR/R0', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Line type="monotone" name="Canonical Sensor Signal" dataKey="signal" stroke={selectedWellInfo.colorHex} strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Well Meta & MIC Callout Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', textTransform: 'uppercase', margin: 0 }}>
                  Well {selectedWellInfo.wellId} Metadata
                </h4>

                <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Concentration:</span> <strong>{selectedWellInfo.doseStr}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Health Transition:</span> <strong style={{ color: selectedWellInfo.colorHex }}>{selectedWellInfo.status}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>MIC Boundary:</span> <strong>{selectedWellInfo.micBoundary ? 'Yes (3.13 µg/mL Threshold)' : 'No'}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Manual Call:</span> <strong>{selectedWellInfo.status === 'Healthy' ? 'No Growth' : 'Growth'}</strong></div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 700, color: '#fbbf24' }}>MIC Boundary Callout</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Minimum Inhibitory Concentration (MIC) detected at <strong>3.13 µg/mL (Well B4)</strong>, transitioning from Healthy green to Infection red.
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : activeTab === 'AMR' ? (
        /* Tab 2: AMR Sub-module */
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
        /* Tab 3: Biofilm Sub-module */
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
