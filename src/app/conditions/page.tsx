"use client";

import { useState } from 'react';
import { Beaker, Thermometer, Wind, Box, ShieldCheck, Activity, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ConditionsPage() {
  const [selectedMedia, setSelectedMedia] = useState('Tryptic Soy Broth (TSB)');

  const mediaList = [
    { name: 'Tryptic Soy Broth (TSB)', type: 'Standard Growth Media', vendor: 'BD Difco', ph: 7.3, bgVoc: 'Low', target: 'General Bacteria' },
    { name: 'LB Broth', type: 'Standard Media', vendor: 'Sigma', ph: 7.0, bgVoc: 'Very Low', target: 'E. coli & Reference' },
    { name: 'BD Blood Culture Media', type: 'Clinical Sepsis Bottle', vendor: 'Becton Dickinson', ph: 7.4, bgVoc: 'Moderate', target: 'Bloodstream Pathogens' },
    { name: 'Custom Wound-Mimic Media', type: 'Clinical Simulated Exudate', vendor: 'In-House Protocol', ph: 6.8, bgVoc: 'High', target: 'Wound Biofilm' },
    { name: 'Sabouraud Dextrose Broth', type: 'Fungal Select Media', vendor: 'Thermo Scientific', ph: 5.6, bgVoc: 'Low', target: 'Candida & Fungi' },
    { name: 'MacConkey Broth', type: 'Gram-Negative Selective', vendor: 'BD', ph: 7.1, bgVoc: 'Moderate', target: 'Enterobacteriaceae' },
    { name: 'Anaerobic Blood Agar', type: 'Anaerobic Media', vendor: 'Anaerobe Systems', ph: 7.2, bgVoc: 'Moderate', target: 'Anaerobic Clostridium' }
  ];

  // Temperature Shift Kinetics (25°C vs 37°C vs 40°C)
  const tempShiftData = [
    { time: 0, temp25: 0, temp37: 0, temp40: 0 },
    { time: 10, temp25: 0.05, temp37: 0.15, temp40: 0.22 },
    { time: 20, temp25: 0.15, temp37: 0.65, temp40: 0.95 },
    { time: 30, temp25: 0.35, temp37: 1.80, temp40: 2.10 },
    { time: 40, temp25: 0.70, temp37: 3.10, temp40: 3.40 },
    { time: 50, temp25: 1.20, temp37: 4.00, temp40: 4.10 },
    { time: 60, temp25: 1.80, temp37: 4.30, temp40: 4.35 }
  ];

  // TTD Impact by Media
  const ttdMediaData = [
    { media: 'LB Broth', TTD: 24 },
    { media: 'TSB Broth', TTD: 26 },
    { media: 'BD Blood Bottle', TTD: 22 },
    { media: 'Wound Exudate', TTD: 34 },
    { media: 'MacConkey', TTD: 30 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Condition Explorer</h1>
            <span className="badge badge-amber">Layer 3 Environmental Matrix</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Investigating growth media background VOCs, temperature matrix (25°/37°/40°C), oxygen conditions, & headspace vessel dynamics.
          </p>
        </div>
      </div>

      {/* Media Matrix & Environmental Variables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Media Library Grid */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Growth Media Library</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {mediaList.map((m, i) => {
              const isSelected = selectedMedia === m.name;
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedMedia(m.name)}
                  style={{
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-tertiary)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{m.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Vendor: {m.vendor}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.75rem' }}>
                    <span className="badge badge-purple">pH {m.ph}</span>
                    <span style={{ color: m.bgVoc === 'High' ? '#f87171' : 'var(--accent-secondary)' }}>BG VOC: {m.bgVoc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Environmental Parameter Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Temperature Matrix Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Thermometer size={20} color="var(--accent-warning)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Temperature Matrix (25°C / 37°C / 40°C)</h3>
            </div>
            
            <div style={{ height: '160px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempShiftData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }} />
                  <Line type="monotone" name="37°C Clinical Standard" dataKey="temp37" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" name="40°C DoD Fever / Austere" dataKey="temp40" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" name="25°C Ambient Storage" dataKey="temp25" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Atmosphere & Headspace Vessel Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Wind size={20} color="var(--accent-teal)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Atmosphere & Headspace Vessels</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.8rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Aerobic Atmosphere</div>
                <div style={{ color: 'var(--text-muted)' }}>Standard 21% O2</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Anaerobic Chamber</div>
                <div style={{ color: 'var(--text-muted)' }}>N2/CO2/H2 85:10:5</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>NPWT Tubing Model</div>
                <div style={{ color: 'var(--text-muted)' }}>Continuous flow headspace</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>BD Blood Culture Bottle</div>
                <div style={{ color: 'var(--text-muted)' }}>Sealed septum bottle</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* TTD by Media Chart Row */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
          Time-to-Detection (TTD) Shift across Media Types
        </h3>
        <div style={{ height: '220px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ttdMediaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="media" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11 }} label={{ value: 'TTD (Minutes)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} />
              <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              <Bar dataKey="TTD" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
