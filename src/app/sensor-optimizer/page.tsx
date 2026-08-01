"use client";

import { useState } from 'react';
import { MOCK_SENSOR_COMBOS } from '@/lib/mockData';
import { Cpu, Lock, Eye, Sparkles, Activity, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function SensorOptimizerPage() {
  const [targetApp, setTargetApp] = useState('Wound Infection');
  const [internalViewMode, setInternalViewMode] = useState(false);

  // Customer-facing vs Internal Sensor Data Schema
  const sensorElements = [
    {
      publicId: 'NBF-S01',
      family: 'Sulfur-Responsive Family',
      generation: 'Gen-3 Optimized Pathogen Panel',
      qcStatus: 'Pass',
      targetVOC: '2-Aminoacetophenone, Hydrogen Cyanide',
      internalComposition: 'SnO2 / Reduced Graphene Oxide',
      internalDopant: '0.5 wt% Pt Nanoparticles',
      internalAnnealing: '450°C for 2 hours in Air'
    },
    {
      publicId: 'NBF-S02',
      family: 'Amine-Responsive Family',
      generation: 'Gen-3 Optimized Pathogen Panel',
      qcStatus: 'Pass',
      targetVOC: 'Indole, Trimethylamine, Ammonia',
      internalComposition: 'ZnO Nanowire Array',
      internalDopant: '1.0 wt% Au Functionalized',
      internalAnnealing: '400°C for 1.5 hours'
    },
    {
      publicId: 'NBF-S03',
      family: 'Alcohol / Ketone-Responsive Family',
      generation: 'Gen-2 Fresh Sensor',
      qcStatus: 'Pass',
      targetVOC: 'Isoamyl alcohol, Acetoin, 2-Nonanone',
      internalComposition: 'WO3 Thin Film',
      internalDopant: '0.2 wt% Pd Dopant',
      internalAnnealing: '500°C for 3 hours'
    },
    {
      publicId: 'NBF-S04',
      family: 'Broad VOC Response Family',
      generation: 'Gen-1 Feasibility Sensor',
      qcStatus: 'Caution (Drift Correction Active)',
      targetVOC: 'Broad Hydrocarbons & Aromatics',
      internalComposition: 'TiO2 Nanotube Matrix',
      internalDopant: 'Undoped Polymer Coated',
      internalAnnealing: '350°C for 1 hour'
    },
    {
      publicId: 'NBF-S05',
      family: 'Humidity-Compensating Channel',
      generation: 'Gen-3 Reference Channel',
      qcStatus: 'Pass',
      targetVOC: 'Water Vapor / Humidity Reference',
      internalComposition: 'PANI / CNT Composite',
      internalDopant: 'Hydrophobic Fluoropolymer',
      internalAnnealing: '120°C Soft Bake'
    },
    {
      publicId: 'NBF-S06',
      family: 'Sulfur-Sensitive High-Gain Channel',
      generation: 'Gen-3 Optimized Pathogen Panel',
      qcStatus: 'Pass',
      targetVOC: 'Dimethyl disulfide, H2S',
      internalComposition: 'In2O3 Nanofiber',
      internalDopant: '0.8 wt% Ag Doped',
      internalAnnealing: '420°C for 2 hours'
    }
  ];

  const featureImportance = [
    { sensor: 'NBF-S01 (Sulfur)', importance: 92 },
    { sensor: 'NBF-S02 (Amine)', importance: 88 },
    { sensor: 'NBF-S03 (Ketone)', importance: 78 },
    { sensor: 'NBF-S06 (High-Gain Sulfur)', importance: 85 },
    { sensor: 'NBF-S04 (Broad VOC)', importance: 62 },
    { sensor: 'NBF-S05 (Humidity Ref)', importance: 45 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & IP Toggle */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Sensor Panel Optimizer</h1>
            <span className="badge badge-blue">Layer 4 Nanosensor Array IP Engine</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            6-Sensor feasibility array vs 40-sensor combination screening matrix & application-specific sensor subset optimization.
          </p>
        </div>

        {/* Dual Mode View Toggle (PDF Page 8 Requirement) */}
        <button
          onClick={() => setInternalViewMode(!internalViewMode)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: internalViewMode ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-tertiary)',
            color: internalViewMode ? '#f87171' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          {internalViewMode ? <Lock size={16} /> : <Eye size={16} />}
          <span>{internalViewMode ? 'Internal R&D IP View' : 'Customer-Facing Public View'}</span>
        </button>
      </div>

      {/* Target Application Subset Selection */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target Application Domain:</span>
          {['Wound Infection', 'Gram Triage', 'Species ID', 'AMR Phenotype', 'Blood Culture', 'Food Safety'].map(app => (
            <button
              key={app}
              onClick={() => setTargetApp(app)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: targetApp === app ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: targetApp === app ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {app}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Array Elements Table (Customer vs Internal View) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
            {internalViewMode ? 'Internal R&D Nanosensor Formulation Database' : 'Customer-Facing Sensor Array Catalog'}
          </h3>
          <span className={`badge ${internalViewMode ? 'badge-red' : 'badge-emerald'}`}>
            {internalViewMode ? 'CONFIDENTIAL / PROPRIETARY FORMULATION' : 'PUBLIC IP SAFE'}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Sensor Code</th>
                <th style={{ padding: '10px' }}>Sensor Family</th>
                <th style={{ padding: '10px' }}>Generation</th>
                <th style={{ padding: '10px' }}>Target VOC Group</th>
                {internalViewMode ? (
                  <>
                    <th style={{ padding: '10px', color: '#f87171' }}>Base Material</th>
                    <th style={{ padding: '10px', color: '#f87171' }}>Dopant / Recipe</th>
                    <th style={{ padding: '10px', color: '#f87171' }}>Annealing</th>
                  </>
                ) : (
                  <th style={{ padding: '10px' }}>QC Status</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sensorElements.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--accent-primary)' }}>{s.publicId}</td>
                  <td style={{ padding: '10px', color: 'var(--text-primary)' }}>{s.family}</td>
                  <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{s.generation}</td>
                  <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{s.targetVOC}</td>
                  {internalViewMode ? (
                    <>
                      <td style={{ padding: '10px', color: '#f87171', fontWeight: 600 }}>{s.internalComposition}</td>
                      <td style={{ padding: '10px', color: '#f87171' }}>{s.internalDopant}</td>
                      <td style={{ padding: '10px', color: '#f87171' }}>{s.internalAnnealing}</td>
                    </>
                  ) : (
                    <td style={{ padding: '10px' }}>
                      <span className={`badge ${s.qcStatus.includes('Pass') ? 'badge-emerald' : 'badge-amber'}`}>
                        {s.qcStatus}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance & Combination Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Feature Importance Bar */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>
            Sensor Feature Importance for {targetApp}
          </h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" domain={[0, 100]} />
                <YAxis type="category" dataKey="sensor" stroke="var(--text-secondary)" width={150} tick={{ fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)' }} />
                <Bar dataKey="importance" fill="var(--accent-teal)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 40-Sensor Screening Matrix Comparison */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
            Array Combination Screening Matrix
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', marginTop: '6px' }}>
            {MOCK_SENSOR_COMBOS.map(combo => (
              <div key={combo.id} style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{combo.name}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Target: {combo.targetApp} | {combo.sensors} Sensors</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-secondary)', fontSize: '0.95rem' }}>{combo.accuracy}% Acc</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg TTD: {combo.ttdAvgMin} min</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
