"use client";

import { useState } from 'react';
import Image from 'next/image';
import { MOCK_AMR_KINETICS, MOCK_BIOFILM_KINETICS } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

/* ─── Well IDs sorted high→low dose (matching MicroBiology repo) ── */
const SORTED_WELLS = [
  { id: 'A1', dose: '50 µg/mL',    status: 'healthy' },
  { id: 'A2', dose: '32 µg/mL',    status: 'healthy' },
  { id: 'A3', dose: '16 µg/mL',    status: 'healthy' },
  { id: 'A4', dose: '8 µg/mL',     status: 'healthy' },
  { id: 'B4', dose: '4 µg/mL',     status: 'subhealthy' },
  { id: 'B3', dose: '2 µg/mL',     status: 'infected' },
  { id: 'B2', dose: '1 µg/mL',     status: 'infected' },
  { id: 'B1', dose: '0.5 µg/mL',   status: 'infected' },
  { id: 'C1', dose: '0.25 µg/mL',  status: 'infected' },
  { id: 'C2', dose: '0.125 µg/mL', status: 'infected' },
  { id: 'C3', dose: '0.06 µg/mL',  status: 'infected' },
  { id: 'C4', dose: '0 (ctrl)',     status: 'infected' },
];

const STATUS_BORDER: Record<string, string> = {
  healthy: '#10b981',
  subhealthy: '#f59e0b',
  infected: '#ef4444',
};

export default function AmrBiofilmPage() {
  const [activeTab, setActiveTab] = useState<'Microplate' | 'AMR' | 'Biofilm'>('Microplate');
  const [selectedPair, setSelectedPair] = useState('MRSA vs MSSA');
  const [abxConcentration, setAbxConcentration] = useState<'None' | 'Sub-MIC' | 'Therapeutic MIC' | 'High Dose'>('Therapeutic MIC');
  const [biofilmStage, setBiofilmStage] = useState<'Attachment' | 'Early Biofilm' | 'Mature Biofilm' | 'Disrupted'>('Mature Biofilm');
  const [selectedWell, setSelectedWell] = useState<string | null>(null);

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

  const tabStyle = (tab: string, color: string) => ({
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    background: activeTab === tab ? color : 'transparent',
    color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: 700 as const,
    cursor: 'pointer' as const,
    transition: 'all 0.2s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <ShieldAlert size={22} color="#ef4444" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>AMR & Antibiotic Resistance</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.88rem' }}>
          Microplate dose-response imaging, sensor-based AST kinetics, and biofilm maturation detection.
        </p>
      </div>

      {/* ── Tab Switcher ── */}
      <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
        <button onClick={() => setActiveTab('Microplate')} style={tabStyle('Microplate', '#10b981')}>
          Dose-Response Imaging
        </button>
        <button onClick={() => setActiveTab('AMR')} style={tabStyle('AMR', '#ef4444')}>
          AMR Sensor Kinetics
        </button>
        <button onClick={() => setActiveTab('Biofilm')} style={tabStyle('Biofilm', '#3b82f6')}>
          Biofilm Maturation
        </button>
      </div>

      {/* ────────────────────────────────────────── */}
      {/* TAB 1: MICROPLATE DOSE-RESPONSE IMAGING   */}
      {/* ────────────────────────────────────────── */}
      {activeTab === 'Microplate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* ── Investor-facing narrative ── */}
          <section>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Antibiotic Dose-Response — MIC Determination
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '700px' }}>
              Our platform automatically determines the <strong style={{ color: '#f59e0b' }}>Minimum Inhibitory Concentration (MIC)</strong> — the lowest antibiotic dose that stops bacterial growth. Wells are sorted from highest to lowest drug concentration, with color-coded health transitions.
            </p>
          </section>

          {/* ── Legend ── */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <span style={{ width: 14, height: 14, borderRadius: '3px', background: '#10b981', display: 'inline-block' }} />
              <span style={{ color: '#34d399', fontWeight: 600 }}>No Growth (Effective Dose)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <span style={{ width: 14, height: 14, borderRadius: '3px', background: '#f59e0b', display: 'inline-block' }} />
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>MIC Boundary</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <span style={{ width: 14, height: 14, borderRadius: '3px', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ color: '#f87171', fontWeight: 600 }}>Bacterial Growth (Sub-Inhibitory)</span>
            </div>
          </div>

          {/* ── Main Result: Composite Visualization ── */}
          <section>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '3/1' }}>
                <Image
                  src="/microbiology/sorted_wells_colorbars.png"
                  alt="Sorted wells and growth curves with health transition color bars — high to low antibiotic dose"
                  fill
                  style={{ objectFit: 'contain', padding: '12px' }}
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center', fontStyle: 'italic' }}>
              Ciprofloxacin × <em>E. coli</em> ATCC 25922 — 12 wells sorted by antibiotic concentration with health transition color-bars
            </p>
          </section>

          {/* ── Individual Well Gallery (clickable) ── */}
          <section>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Individual Well Extractions — Click to Inspect
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
              {SORTED_WELLS.map((w) => {
                const isSelected = selectedWell === w.id;
                const borderColor = STATUS_BORDER[w.status];
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWell(isSelected ? null : w.id)}
                    style={{
                      background: isSelected ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `2px solid ${isSelected ? '#3b82f6' : borderColor + '66'}`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? `0 0 16px ${borderColor}40` : 'none',
                    }}
                  >
                    {/* Well image */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
                      <Image
                        src={`/microbiology/carved_wells/well_${w.id}.png`}
                        alt={`Well ${w.id}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 50vw, 16vw"
                      />
                    </div>
                    {/* Label */}
                    <div style={{ padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: borderColor }}>{w.id}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{w.dose}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Selected Well Detail (well + chart side by side) ── */}
          {selectedWell && (
            <section style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Well {selectedWell} — Detail View
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Carved well image */}
                <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <Image
                    src={`/microbiology/carved_wells/well_${selectedWell}.png`}
                    alt={`Well ${selectedWell} extracted`}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="50vw"
                  />
                </div>
                {/* Corresponding growth curve chart */}
                <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <Image
                    src={`/microbiology/split_charts/chart_${selectedWell}.png`}
                    alt={`Growth curve chart ${selectedWell}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="50vw"
                  />
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Well {selectedWell}</strong>
                {' · '}
                {SORTED_WELLS.find(w => w.id === selectedWell)?.dose}
                {' · Status: '}
                <span style={{ color: STATUS_BORDER[SORTED_WELLS.find(w => w.id === selectedWell)?.status || 'infected'], fontWeight: 700 }}>
                  {SORTED_WELLS.find(w => w.id === selectedWell)?.status === 'healthy' ? 'Healthy (No Growth)' :
                   SORTED_WELLS.find(w => w.id === selectedWell)?.status === 'subhealthy' ? 'Sub-Healthy (MIC Boundary)' :
                   'Infected (Bacterial Growth)'}
                </span>
              </div>
            </section>
          )}

          {/* ── Reference Comparison ── */}
          <section>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Reference Benchmark (Claude AI Result)
            </h3>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '2.5/1' }}>
                <Image
                  src="/microbiology/claude_result.png"
                  alt="Claude AI reference benchmark visualization"
                  fill
                  style={{ objectFit: 'contain', padding: '12px' }}
                  sizes="100vw"
                />
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center', fontStyle: 'italic' }}>
              Side-by-side comparison — our automated pipeline output vs. Claude AI-generated reference
            </p>
          </section>

        </div>
      )}

      {/* ────────────────────────────────────────── */}
      {/* TAB 2: AMR SENSOR KINETICS                */}
      {/* ────────────────────────────────────────── */}
      {activeTab === 'AMR' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Strain Pair:</span>
            {['MRSA vs MSSA', 'VRE vs VSE', 'CRE vs Susceptible', 'CRAB vs Susceptible'].map(pair => (
              <button
                key={pair}
                onClick={() => setSelectedPair(pair)}
                style={{
                  padding: '6px 14px', borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: selectedPair === pair ? 'rgba(239,68,68,0.15)' : 'var(--bg-tertiary)',
                  color: selectedPair === pair ? '#f87171' : 'var(--text-secondary)',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                }}
              >{pair}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Antibiotic Dose:</span>
            {(['None', 'Sub-MIC', 'Therapeutic MIC', 'High Dose'] as const).map(dose => (
              <button
                key={dose}
                onClick={() => setAbxConcentration(dose)}
                style={{
                  padding: '5px 12px', borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: abxConcentration === dose ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: abxConcentration === dose ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                }}
              >{dose}</button>
            ))}
          </div>

          {/* Chart + sidebar */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Paired Strain Kinetics ({selectedPair})</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dose Exposure: {abxConcentration}</span>
                </div>
                <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  Earliest Diff: 45 min
                </span>
              </div>

              <div style={{ height: '340px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={amrChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--text-muted)" label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-muted)" label={{ value: 'Sensor Signal ΔR/R0', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Legend verticalAlign="top" height={36} />
                    <ReferenceLine x={45} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Earliest AMR Diff', fill: '#ef4444', position: 'top' }} />
                    <Line type="monotone" name="Susceptible (No Abx)" dataKey="mssa_no_abx" stroke="#60a5fa" strokeWidth={2} dot={false} />
                    <Line type="monotone" name={`Susceptible (+ ${abxConcentration})`} dataKey="mssa_with_oxacillin" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="Resistant (No Abx)" dataKey="mrsa_no_abx" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" name={`Resistant (+ ${abxConcentration})`} dataKey="mrsa_with_oxacillin" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
              }}>
                <h4 style={{ fontSize: '0.85rem', color: '#f87171', textTransform: 'uppercase', marginBottom: '12px', margin: 0 }}>
                  AMR Classifier Confusion Matrix
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', textAlign: 'center', marginTop: '12px' }}>
                  <div style={{ background: 'rgba(16,185,129,0.12)', padding: '12px', borderRadius: '8px', border: '1px solid #10b98144' }}>
                    <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.2rem' }}>148</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>True Resistant</div>
                  </div>
                  <div style={{ background: 'rgba(239,68,68,0.08)', padding: '12px', borderRadius: '8px', border: '1px solid #ef444444' }}>
                    <div style={{ color: '#f87171', fontWeight: 800, fontSize: '1.2rem' }}>3</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>False Resistant</div>
                  </div>
                  <div style={{ background: 'rgba(239,68,68,0.08)', padding: '12px', borderRadius: '8px', border: '1px solid #ef444444' }}>
                    <div style={{ color: '#f87171', fontWeight: 800, fontSize: '1.2rem' }}>4</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>False Susceptible</div>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.12)', padding: '12px', borderRadius: '8px', border: '1px solid #10b98144' }}>
                    <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.2rem' }}>185</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>True Susceptible</div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px', fontSize: '0.82rem',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Why This Matters</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.6 }}>
                  Accelerates functional AST from 48 hours to &lt; 1 hour, enabling targeted therapy selection at the point of care.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────── */}
      {/* TAB 3: BIOFILM MATURATION                 */}
      {/* ────────────────────────────────────────── */}
      {activeTab === 'Biofilm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Biofilm Stage:</span>
            {(['Attachment', 'Early Biofilm', 'Mature Biofilm', 'Disrupted'] as const).map(stg => (
              <button
                key={stg}
                onClick={() => setBiofilmStage(stg)}
                style={{
                  padding: '6px 14px', borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: biofilmStage === stg ? '#3b82f6' : 'var(--bg-tertiary)',
                  color: biofilmStage === stg ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                }}
              >{stg}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
                Planktonic vs Biofilm Maturation Kinetics
              </h3>
              <div style={{ height: '340px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={biofilmChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="hours" stroke="var(--text-muted)" label={{ value: 'Time (hours)', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-muted)" label={{ value: 'Biofilm Index', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" name="Planktonic Control" dataKey="planktonic" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="Early Biofilm" dataKey="biofilm_early" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="Mature Biofilm" dataKey="biofilm_mature" stroke="#10b981" strokeWidth={3} dot={false} />
                    <Line type="monotone" name="Disrupted" dataKey="biofilm_disrupted" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
              }}>
                <h4 style={{ fontSize: '0.82rem', color: '#60a5fa', textTransform: 'uppercase', marginBottom: '10px', margin: 0 }}>
                  Validation Methods
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                  <div>• Crystal Violet Staining (OD 595nm)</div>
                  <div>• Confocal Laser Scanning Microscopy</div>
                  <div>• EPS Matrix Quantification</div>
                  <div>• CDC Biofilm Reactor Model</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px', fontSize: '0.82rem',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Clinical Application</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.6 }}>
                  Distinguishes low-grade prosthetic joint biofilms from acute planktonic infections — critical for Zimmer Biomet implant monitoring.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
