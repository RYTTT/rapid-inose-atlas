"use client";

import { useState } from 'react';
import { Beaker, Thermometer, Wind, Box, ShieldCheck, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ConditionsPage() {
  const [selectedMedia, setSelectedMedia] = useState('Tryptic Soy Broth (TSB)');
  const [activeTemp, setActiveTemp] = useState<number>(37);
  const [activeAtmosphere, setActiveAtmosphere] = useState<'Aerobic' | 'Anaerobic' | 'CO2' | 'Microaerophilic'>('Aerobic');

  const mediaList = [
    { name: 'Tryptic Soy Broth (TSB)', type: 'Standard Growth Media', vendor: 'BD Difco', ph: 7.3, bgVoc: 'Low', target: 'General Bacteria', notes: 'Standard reference culture medium for ATCC quality control.' },
    { name: 'LB Broth', type: 'Standard Media', vendor: 'Sigma', ph: 7.0, bgVoc: 'Very Low', target: 'E. coli & Reference', notes: 'Minimal background VOC interference; ideal for baseline calibration.' },
    { name: 'BD Blood Culture Media', type: 'Clinical Sepsis Bottle', vendor: 'Becton Dickinson', ph: 7.4, bgVoc: 'Moderate', target: 'Bloodstream Pathogens', notes: 'Contains blood culture media background components requiring background subtraction.' },
    { name: 'Custom Wound-Mimic Media', type: 'Clinical Simulated Exudate', vendor: 'In-House Protocol', ph: 6.8, bgVoc: 'High', target: 'Wound Biofilm', notes: 'Simulates human chronic wound exudate with high protein background.' },
    { name: 'Sabouraud Dextrose Broth', type: 'Fungal Select Media', vendor: 'Thermo Scientific', ph: 5.6, bgVoc: 'Low', target: 'Candida & Fungi', notes: 'Low pH selective media optimized for yeast and mold VOC signatures.' },
    { name: 'MacConkey Broth', type: 'Gram-Negative Selective', vendor: 'BD', ph: 7.1, bgVoc: 'Moderate', target: 'Enterobacteriaceae', notes: 'Bile salts and crystal violet selective medium for Gram-negative enteric bacilli.' },
    { name: 'Anaerobic Blood Agar', type: 'Anaerobic Media', vendor: 'Anaerobe Systems', ph: 7.2, bgVoc: 'Moderate', target: 'Anaerobic Clostridium', notes: 'Pre-reduced media for strict anaerobic bacterial headspace kinetics.' }
  ];

  const currentMediaInfo = mediaList.find(m => m.name === selectedMedia) || mediaList[0];

  // Dynamic Temperature Shift Kinetics based on selected temperature
  const tempShiftData = [0, 10, 20, 30, 40, 50, 60].map(t => {
    const mult = activeTemp === 40 ? 1.25 : activeTemp === 37 ? 1.0 : 0.45;
    return {
      time: t,
      signal: +(0.15 * Math.exp(t / 20) * mult).toFixed(2),
      background: +(0.02 * (t / 10)).toFixed(2)
    };
  });

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

          {/* Selected Media Detail Inspector */}
          <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-highlight)', padding: '16px', borderRadius: '8px', marginTop: '8px', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
              Selected Media Specs: {currentMediaInfo.name}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{currentMediaInfo.notes}</div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.8rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Target Pathogens:</span> <strong>{currentMediaInfo.target}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Background VOC Subtraction:</span> <strong>Active ({currentMediaInfo.bgVoc})</strong></div>
            </div>
          </div>
        </div>

        {/* Right Column: Environmental Parameter Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Temperature Matrix Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Thermometer size={20} color="var(--accent-warning)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Temperature Matrix</h3>
              </div>

              {/* Temp Selector */}
              <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '6px' }}>
                {[25, 37, 40].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTemp(t)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      background: activeTemp === t ? 'var(--accent-warning)' : 'transparent',
                      color: activeTemp === t ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {t}°C
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ height: '160px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempShiftData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }} />
                  <Line type="monotone" name={`Pathogen Kinetic Signal (${activeTemp}°C)`} dataKey="signal" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" name="Media Background Baseline" dataKey="background" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
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
              {(['Aerobic', 'Anaerobic', 'CO2', 'Microaerophilic'] as const).map(atm => (
                <div 
                  key={atm}
                  onClick={() => setActiveAtmosphere(atm)}
                  style={{
                    background: activeAtmosphere === atm ? 'rgba(20, 184, 166, 0.2)' : 'var(--bg-tertiary)',
                    border: '1px solid',
                    borderColor: activeAtmosphere === atm ? 'var(--accent-teal)' : 'var(--border-color)',
                    padding: '10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: activeAtmosphere === atm ? 700 : 400
                  }}
                >
                  <div style={{ color: activeAtmosphere === atm ? '#2dd4bf' : 'var(--text-primary)' }}>{atm}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>Select to test kinetics</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* TTD by Media Chart Row */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
          Time-to-Detection (TTD) Shift across Media Types
        </h3>
        <div style={{ height: '200px', width: '100%' }}>
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
