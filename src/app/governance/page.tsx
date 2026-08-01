"use client";

import { useState } from 'react';
import { ShieldCheck, Lock, Award, FileSpreadsheet, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export default function GovernancePage() {
  const [activeTier, setActiveTier] = useState<'Bronze' | 'Silver' | 'Gold'>('Silver');

  const tiers = [
    {
      id: 'Bronze',
      name: 'Bronze Dataset — Minimum Viable Version (MVP)',
      target: 'Proof of database structure & initial AI demonstration.',
      requirements: [
        '1 Reference strain per organism',
        '1 Media type (LB or recommended media)',
        '1 Temperature (37°C)',
        '3 Biological replicates',
        '6 Nanosensor real-time curves',
        'Media blank controls & basic QC',
        'Preliminary TTD & PCA/UMAP positioning'
      ]
    },
    {
      id: 'Silver',
      name: 'Silver Dataset — Commercial Showcase Version',
      target: 'Presentation package for DoD, wound care, BD, ATCC, & AI partners.',
      requirements: [
        '1-2 Reference strains + 2-5 Clinical isolates',
        '2-3 Media types & 2 Temperature settings',
        '3-5 Biological replicates',
        '6 Nanosensors + 40-combination panel screening',
        'GC-MS representative VOC subset',
        'Source metadata & media-specific controls',
        'AI classification model & TTD confidence scores'
      ]
    },
    {
      id: 'Gold',
      name: 'Gold Dataset — Regulatory & Licensing Version',
      target: 'Big tech licensing, co-development, & FDA technical submission package.',
      requirements: [
        'Multi-hospital clinical isolates',
        'AMR confirmed strain pairs',
        'Biofilm maturation & ex vivo wound models',
        'NPWT integration & blood culture media datasets',
        'GC-MS validated VOC features & independent validation set',
        'SOP-linked traceability & locked audit trails'
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Data Governance & IP Control</h1>
            <span className="badge badge-amber">Section 6 & 9 Schema Compliance</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Dataset maturity tiering (Bronze / Silver / Gold), access permissions, & regulatory audit logs.
          </p>
        </div>
      </div>

      {/* Dataset Tier Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {tiers.map(t => {
          const isSelected = activeTier === t.id;
          return (
            <div 
              key={t.id}
              onClick={() => setActiveTier(t.id as any)}
              className="glass-panel"
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-glass)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${t.id === 'Gold' ? 'badge-amber' : t.id === 'Silver' ? 'badge-blue' : 'badge-emerald'}`}>
                  {t.id} Tier
                </span>
                {isSelected && <CheckCircle2 size={18} color="var(--accent-primary)" />}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '10px 0 4px 0', color: 'var(--text-primary)' }}>
                {t.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{t.target}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Tier Requirements Detail */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
          Requirements & Data Standard for {activeTier} Dataset
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {tiers.find(t => t.id === activeTier)?.requirements.map((req, i) => (
            <div key={i} style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={16} color="var(--accent-secondary)" />
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Audit Log & Exporter */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>FDA & Regulatory Data Package Exporter</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Generate SOP-linked traceability records, sensor QC logs, and locked validation datasets for regulatory submission.
          </p>
        </div>

        <button style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.88rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldCheck size={18} /> Export Regulatory Package
        </button>
      </div>

    </div>
  );
}
