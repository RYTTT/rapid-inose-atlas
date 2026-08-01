"use client";

import { useState } from 'react';
import { MOCK_CUSTOMER_SECTORS } from '@/lib/mockData';
import { Users, Building2, Shield, HeartPulse, Sparkles, Activity, FileSpreadsheet, ArrowRight, Award } from 'lucide-react';

export default function CustomerSolutionsPage() {
  const [selectedSectorId, setSelectedSectorId] = useState('dod');

  const activeSector = MOCK_CUSTOMER_SECTORS.find(s => s.id === selectedSectorId) || MOCK_CUSTOMER_SECTORS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Customer Solutions Dashboard</h1>
            <span className="badge badge-amber">Commercial Customer View Switcher</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Tailored scientific intelligence views designed specifically for enterprise partners and acquirers.
          </p>
        </div>
      </div>

      {/* Customer Sector Dropdown & Selector Bar (PDF Page 23 Requirement) */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={20} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Select Partner Sector:</span>
        </div>

        <select
          value={selectedSectorId}
          onChange={(e) => setSelectedSectorId(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-highlight)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {MOCK_CUSTOMER_SECTORS.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.tagline}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Sector Profile View */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Sector Focus & Visualizations Package */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Enterprise Solutions Profile
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
                {activeSector.name}
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', fontWeight: 600, marginTop: '2px' }}>
                {activeSector.tagline}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                What Enterprise Partners Care About
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {activeSector.focus}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Recommended Visualizations Package for {activeSector.name}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {activeSector.recommendedVisualizations.map((vis, i) => (
                  <div key={i} style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
                    <Sparkles size={14} color="var(--accent-warning)" />
                    <span>{vis}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Key Commercial Metrics & Commercial Deck Export */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Partner Value KPIs
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeSector.keyMetrics.map((km, i) => (
                <div key={i} style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{km.label}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{km.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Business Deck Integration</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Export this tailored sector package formatted for executive business proposals & NDA data room presentations.
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#fff',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              Export Enterprise Data Package
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
