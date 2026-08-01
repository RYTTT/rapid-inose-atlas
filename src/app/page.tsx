"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ReferenceLine, ResponsiveContainer, Legend
} from 'recharts';
import { ArrowRight, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   DATA
────────────────────────────────────────────── */

// Sensor kinetics — normalized signal vs time (hours)
const kineticData = Array.from({ length: 25 }, (_, i) => {
  const t = i * 0.5; // 0 to 12 hours
  return {
    t: t.toFixed(1),
    'P. aeruginosa': +(Math.min(0.98, 0.02 + 0.35 * (1 - Math.exp(-1.8 * Math.max(0, t - 1.2))) + (Math.random() * 0.015))).toFixed(3),
    'E. coli':        +(Math.min(0.92, 0.01 + 0.28 * (1 - Math.exp(-1.4 * Math.max(0, t - 2.0))) + (Math.random() * 0.015))).toFixed(3),
    'S. aureus':      +(Math.min(0.85, 0.02 + 0.22 * (1 - Math.exp(-1.1 * Math.max(0, t - 2.8))) + (Math.random() * 0.015))).toFixed(3),
    'Control':        +(0.01 + Math.random() * 0.012).toFixed(3),
  };
});

// Microplate dose-response wells: 12 wells A1-C4, sorted high→low antibiotic concentration
const WELLS = [
  { id: 'A1', dose: 50,   label: '50 µg/mL', status: 'healthy',    mic: false },
  { id: 'A2', dose: 32,   label: '32 µg/mL', status: 'healthy',    mic: false },
  { id: 'A3', dose: 16,   label: '16 µg/mL', status: 'healthy',    mic: false },
  { id: 'A4', dose: 8,    label: '8 µg/mL',  status: 'healthy',    mic: false },
  { id: 'B4', dose: 4,    label: '4 µg/mL',  status: 'subhealthy', mic: true  },
  { id: 'B3', dose: 2,    label: '2 µg/mL',  status: 'infected',   mic: false },
  { id: 'B2', dose: 1,    label: '1 µg/mL',  status: 'infected',   mic: false },
  { id: 'B1', dose: 0.5,  label: '0.5 µg/mL',status: 'infected',   mic: false },
  { id: 'C1', dose: 0.25, label: '0.25 µg/mL',status:'infected',   mic: false },
  { id: 'C2', dose: 0.125,label: '0.125 µg/mL',status:'infected',  mic: false },
  { id: 'C3', dose: 0.06, label: '0.06 µg/mL',status:'infected',   mic: false },
  { id: 'C4', dose: 0,    label: '0 (ctrl)',  status: 'infected',   mic: false },
];

const STATUS_COLORS: Record<string, { bg: string; border: string; bar: string; label: string }> = {
  healthy:    { bg: '#052e16', border: '#10b981', bar: '#10b981', label: 'Healthy' },
  subhealthy: { bg: '#451a03', border: '#f59e0b', bar: '#f59e0b', label: 'MIC Boundary' },
  infected:   { bg: '#2d0a0a', border: '#ef4444', bar: '#ef4444', label: 'Infection' },
};

const SENSOR_COLORS = ['#38bdf8', '#a78bfa', '#fb923c', '#6b7280'];
const SENSOR_KEYS = ['P. aeruginosa', 'E. coli', 'S. aureus', 'Control'];

/* ─────────────────────────────────────────────
   COMPONENTS
────────────────────────────────────────────── */

function HeroStat({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '28px 36px',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${accent}33`,
      borderRadius: '16px',
      flex: 1,
      minWidth: '160px',
    }}>
      <span style={{ fontSize: '2.6rem', fontWeight: 900, color: accent, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center', lineHeight: 1.4 }}>{label}</span>
    </div>
  );
}

function StepCard({ n, icon, title, desc }: { n: number; icon: string; title: string; desc: string }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '28px 24px', textAlign: 'center',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', marginBottom: '14px',
        boxShadow: '0 0 24px rgba(59,130,246,0.3)',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Step {n}</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

function MarketCard({ icon, title, lines }: { icon: string; title: string; lines: string[] }) {
  return (
    <div style={{
      flex: 1, padding: '22px 24px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>{title}</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {l}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
────────────────────────────────────────────── */

export default function AtlasHome() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── SECTION 1: Hero ── */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 16px',
            borderRadius: '20px',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.3)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#60a5fa',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            Investor Overview — RAPID-iNose™ Platform
          </div>
          <h1 style={{
            fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            margin: '0 auto 16px',
            maxWidth: '680px',
          }}>
            Microbial VOC Detection,{' '}
            <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Faster Than Any Current Standard
            </span>
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            A nanosensor array platform that identifies wound pathogens and antibiotic resistance in under 30 minutes — without culture, without delay.
          </p>
        </div>

        {/* Hero stats row */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <HeroStat value="102"    label="Pathogen Organisms Profiled"     accent="#3b82f6" />
          <HeroStat value="< 25m"  label="Time-to-Detection (TTD)"         accent="#10b981" />
          <HeroStat value="99.1%"  label="AI Gram Triage Accuracy"         accent="#8b5cf6" />
          <HeroStat value="1,280"  label="Validated Sensor Runs"           accent="#f59e0b" />
        </div>
      </section>

      {/* ── SECTION 2: How It Works ── */}
      <section>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center' }}>
          How It Works
        </h2>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '12px', flexWrap: 'wrap' }}>
          <StepCard n={1} icon="🦠" title="Patient Sample" desc="Wound exudate, blood culture, or body fluid is introduced to the iNose chamber. No preparation required." />
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
            <ArrowRight size={22} color="var(--text-muted)" />
          </div>
          <StepCard n={2} icon="📡" title="Nanosensor Array" desc="64 polymer sensors detect volatile organic compounds (VOCs) emitted by live bacteria in real time." />
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
            <ArrowRight size={22} color="var(--text-muted)" />
          </div>
          <StepCard n={3} icon="✅" title="Species ID + Resistance Call" desc="An AI classifier identifies the pathogen species and flags antibiotic resistance — in under 25 minutes." />
        </div>
      </section>

      {/* ── SECTION 3: Dose-Response Visual (the MicroBiology showcase) ── */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Antibiotic Resistance, Made Visible
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.6 }}>
            The iNose sensor array tracks how bacteria respond across a full antibiotic dose gradient. The Minimum Inhibitory Concentration (MIC) — the critical clinical decision point — emerges automatically from sensor patterns.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {Object.entries(STATUS_COLORS).map(([, v]) => (
            <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: v.bar, display: 'inline-block' }} />
              {v.label}
            </div>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Ciprofloxacin × <em>E. coli</em> ATCC 25922 — sorted high → low concentration
          </div>
        </div>

        {/* Microplate dose-response row */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px 20px',
          overflowX: 'auto',
        }}>
          {/* Well row */}
          <div style={{ display: 'flex', gap: '0px', minWidth: '820px', alignItems: 'flex-start' }}>
            {WELLS.map((w, idx) => {
              const s = STATUS_COLORS[w.status];
              const prevWell = idx > 0 ? WELLS[idx - 1] : null;
              const showBar = prevWell && prevWell.status !== w.status;
              return (
                <div key={w.id} style={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                  {/* Transition color bar */}
                  {showBar && (
                    <div style={{
                      width: '6px', flexShrink: 0, alignSelf: 'stretch',
                      background: `linear-gradient(to bottom, ${STATUS_COLORS[prevWell!.status].bar}, ${s.bar})`,
                      borderRadius: '3px',
                      margin: '0 2px',
                    }} />
                  )}
                  {/* Well + label */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                    {/* Well circle */}
                    <div style={{
                      width: 54, height: 54,
                      borderRadius: '50%',
                      border: `2px solid ${s.border}`,
                      background: s.bg,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 ${w.mic ? 16 : 6}px ${s.border}${w.mic ? '80' : '30'}`,
                      transition: 'box-shadow 0.3s',
                      position: 'relative',
                    }}>
                      {w.mic && (
                        <span style={{
                          position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                          fontSize: '0.6rem', fontWeight: 700, background: '#f59e0b',
                          color: '#000', borderRadius: '4px', padding: '1px 4px', whiteSpace: 'nowrap',
                        }}>MIC</span>
                      )}
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: s.border }}>{w.id}</span>
                      <span style={{ fontSize: '0.55rem', color: s.border, opacity: 0.8 }}>{w.dose > 0 ? `${w.dose}` : 'ctrl'}</span>
                    </div>
                    {/* Dose label */}
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3, maxWidth: 58 }}>{w.label}</span>
                    {/* Status bar strip */}
                    <div style={{ width: '100%', height: 6, borderRadius: 3, background: s.bar, opacity: 0.7 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis label */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 4px', minWidth: '820px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>← High Antibiotic Dose (50 µg/mL)</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Low / No Antibiotic (0 µg/mL) →</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Sensor Kinetics ── */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Real-Time Detection in Action
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.6 }}>
            Each pathogen species produces a unique VOC fingerprint detectable within hours of exposure. The dashed line marks average detection onset — before conventional culture shows any result.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
        }}>
          {isMounted && (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={kineticData} margin={{ top: 8, right: 20, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="t"
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  label={{ value: 'Time (hours)', position: 'insideBottom', offset: -4, fill: 'var(--text-muted)', fontSize: 11 }}
                  ticks={['0.0','2.0','4.0','6.0','8.0','10.0','12.0']}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  domain={[0, 1]}
                  tickFormatter={(v) => `${Math.round(v * 100)}%`}
                  label={{ value: 'Normalized Signal', angle: -90, position: 'insideLeft', offset: 12, fill: 'var(--text-muted)', fontSize: 11 }}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                  formatter={(v: unknown, name: unknown) => [`${((v as number) * 100).toFixed(1)}%`, name as string]}
                  labelFormatter={(l) => `Time: ${l}h`}
                />
                <Legend
                  wrapperStyle={{ fontSize: '0.82rem', paddingTop: '12px' }}
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
                />
                {/* Detection onset marker */}
                <ReferenceLine x="2.5" stroke="#f59e0b" strokeDasharray="4 3" label={{ value: 'Onset', fill: '#f59e0b', fontSize: 11, position: 'top' }} />
                {SENSOR_KEYS.map((k, i) => (
                  <Line
                    key={k}
                    type="monotone"
                    dataKey={k}
                    stroke={SENSOR_COLORS[i]}
                    strokeWidth={k === 'Control' ? 1 : 2}
                    dot={false}
                    strokeDasharray={k === 'Control' ? '4 4' : undefined}
                    opacity={k === 'Control' ? 0.5 : 1}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* ── SECTION 5: Market & Validation Strip ── */}
      <section>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
          Validated. Market-Ready. Defensible.
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <MarketCard
            icon="🏥"
            title="Clinical Validation"
            lines={[
              '18 hospital & clinical sources',
              'Mayo Clinic · HSS · Zimmer Biomet · Labcorp',
              '450 reference & clinical isolates tested',
            ]}
          />
          <MarketCard
            icon="🎯"
            title="Target Markets"
            lines={[
              'Wound Care Diagnostics',
              'Blood Culture Identification',
              'Military & Austere Medicine',
              'Implant Infection Surveillance',
            ]}
          />
          <MarketCard
            icon="📋"
            title="Regulatory Path"
            lines={[
              'FDA 510(k) Pathway',
              'Pre-submission in progress',
              'ISO 13485 QMS alignment',
              'CLIA-waived target configuration',
            ]}
          />
        </div>
      </section>

      {/* ── SECTION 6: CTA ── */}
      <section style={{
        padding: '36px 40px',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, marginBottom: '6px' }}>
            Explore the Full Dataset
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Browse all 102 organisms, live sensor traces, AMR resistance data, and AI model results.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/microbes" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff', fontWeight: 700, fontSize: '0.88rem',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
          }}>
            Microbe Explorer <ChevronRight size={16} />
          </Link>
          <Link href="/amr-biofilm" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.88rem',
            textDecoration: 'none',
          }}>
            AMR Data <ChevronRight size={16} />
          </Link>
          <Link href="/reports" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.88rem',
            textDecoration: 'none',
          }}>
            Download Reports <ChevronRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
