"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ReferenceLine, ResponsiveContainer, Legend
} from 'recharts';
import { ChevronRight, Zap, Clock, Target, Shield } from 'lucide-react';

/* ─────────────────────────────────────────────
   DATA
────────────────────────────────────────────── */

const kineticData = Array.from({ length: 25 }, (_, i) => {
  const t = i * 0.5;
  return {
    t: t.toFixed(1),
    'P. aeruginosa': +(Math.min(0.98, 0.02 + 0.35 * (1 - Math.exp(-1.8 * Math.max(0, t - 1.2))) + (Math.random() * 0.015))).toFixed(3),
    'E. coli':        +(Math.min(0.92, 0.01 + 0.28 * (1 - Math.exp(-1.4 * Math.max(0, t - 2.0))) + (Math.random() * 0.015))).toFixed(3),
    'S. aureus':      +(Math.min(0.85, 0.02 + 0.22 * (1 - Math.exp(-1.1 * Math.max(0, t - 2.8))) + (Math.random() * 0.015))).toFixed(3),
    'Control':        +(0.01 + Math.random() * 0.012).toFixed(3),
  };
});

const SENSOR_COLORS = ['#38bdf8', '#a78bfa', '#fb923c', '#475569'];
const SENSOR_KEYS = ['P. aeruginosa', 'E. coli', 'S. aureus', 'Control'];

/* ─────────────────────────────────────────────
   PAGE
────────────────────────────────────────────── */

export default function AtlasHome() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', maxWidth: '960px', margin: '0 auto' }}>

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '24px 0 0' }}>
        <div style={{
          display: 'inline-block',
          padding: '5px 16px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
          border: '1px solid rgba(59,130,246,0.25)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#60a5fa',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}>
          RAPID-iNose™ Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(1.6rem, 4.5vw, 2.6rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          margin: '0 auto 18px',
          maxWidth: '600px',
        }}>
          Identify Wound Pathogens in{' '}
          <span style={{
            background: 'linear-gradient(90deg, #38bdf8, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Under 25 Minutes
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(0.88rem, 2vw, 1rem)',
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          A nanosensor array that detects microbial VOCs in real time — species identification and antibiotic resistance, without culture.
        </p>
      </section>

      {/* ── KEY METRICS ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
      }}>
        {[
          { icon: <Target size={20} />, value: '102', label: 'Organisms Profiled', color: '#3b82f6' },
          { icon: <Clock size={20} />, value: '< 25 min', label: 'Time-to-Detection', color: '#10b981' },
          { icon: <Zap size={20} />, value: '99.1%', label: 'AI Triage Accuracy', color: '#a78bfa' },
          { icon: <Shield size={20} />, value: '1,280', label: 'Validated Runs', color: '#f59e0b' },
        ].map((stat) => (
          <div key={stat.label} style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '20px 22px',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            transition: 'border-color 0.2s',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: '12px',
              background: `${stat.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center' }}>
          How It Works
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {[
            { n: 1, icon: '🧪', title: 'Sample Introduction', desc: 'Wound exudate or body fluid enters the iNose sensing chamber. No preparation.' },
            { n: 2, icon: '📡', title: 'VOC Detection', desc: '6-channel nanosensor array detects volatile organic compounds emitted by live bacteria in real time.' },
            { n: 3, icon: '✅', title: 'Species ID + AMR', desc: 'AI classifier identifies pathogen species and flags antibiotic resistance — in under 25 minutes.' },
          ].map(s => (
            <div key={s.n} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '28px 20px', textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                border: '1px solid rgba(59,130,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', marginBottom: '14px',
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#60a5fa', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Step {s.n}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{s.title}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DOSE-RESPONSE IMAGE ── */}
      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Antibiotic Resistance, Made Visible
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.6, marginBottom: '20px' }}>
          Our sensor array tracks bacterial response across a full antibiotic dose gradient.
          The <strong style={{ color: '#fbbf24' }}>MIC</strong> — the critical clinical decision point — emerges automatically.
        </p>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {[
            { color: '#10b981', label: 'No Growth (Effective)' },
            { color: '#f59e0b', label: 'MIC Boundary' },
            { color: '#ef4444', label: 'Bacterial Growth' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Composite Image */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '3/1', minHeight: 120 }}>
            <Image
              src="/microbiology/sorted_wells_colorbars.png"
              alt="Dose-response wells sorted by antibiotic concentration with health transition color-bars"
              fill
              style={{ objectFit: 'contain', padding: '12px' }}
              sizes="100vw"
              priority
            />
          </div>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center', fontStyle: 'italic' }}>
          Ciprofloxacin × <em>E. coli</em> ATCC 25922 — 12 wells sorted high → low concentration
        </p>
      </section>

      {/* ── SENSOR KINETICS ── */}
      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Real-Time Pathogen Detection
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.6, marginBottom: '20px' }}>
          Each pathogen emits a unique VOC fingerprint. Sensor response diverges from baseline within hours — far before conventional culture shows results.
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '20px',
        }}>
          {isMounted && (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={kineticData} margin={{ top: 8, right: 12, left: -4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="t"
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  label={{ value: 'Time (hours)', position: 'insideBottom', offset: -4, fill: 'var(--text-muted)', fontSize: 10 }}
                  ticks={['0.0','2.0','4.0','6.0','8.0','10.0','12.0']}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  domain={[0, 1]}
                  tickFormatter={(v) => `${Math.round(v * 100)}%`}
                  width={38}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.78rem' }}
                  formatter={(v: unknown, name: unknown) => [`${((v as number) * 100).toFixed(1)}%`, name as string]}
                  labelFormatter={(l) => `${l}h`}
                />
                <Legend wrapperStyle={{ fontSize: '0.72rem', paddingTop: '8px' }} />
                <ReferenceLine x="2.5" stroke="#f59e0b" strokeDasharray="4 3" label={{ value: 'Onset', fill: '#f59e0b', fontSize: 10, position: 'top' }} />
                {SENSOR_KEYS.map((k, i) => (
                  <Line
                    key={k}
                    type="monotone"
                    dataKey={k}
                    stroke={SENSOR_COLORS[i]}
                    strokeWidth={k === 'Control' ? 1 : 2}
                    dot={false}
                    strokeDasharray={k === 'Control' ? '4 4' : undefined}
                    opacity={k === 'Control' ? 0.4 : 1}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* ── VALIDATION + MARKET ── */}
      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
          Validated & Market-Ready
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {[
            { icon: '🏥', title: 'Clinical Validation', lines: ['18 hospital & clinical sources', 'Mayo Clinic · HSS · Zimmer Biomet', '450+ reference & clinical isolates'] },
            { icon: '🎯', title: 'Target Markets', lines: ['Wound Care Diagnostics', 'Blood Culture Identification', 'Military & Austere Medicine'] },
            { icon: '📋', title: 'Regulatory Path', lines: ['FDA 510(k) Pathway', 'ISO 13485 QMS alignment', 'CLIA-waived target configuration'] },
          ].map(card => (
            <div key={card.title} style={{
              padding: '22px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{card.icon}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>{card.title}</div>
              {card.lines.map((l, i) => (
                <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06))',
        border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
            Explore the Full Dataset
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            102 organisms, live sensor data, AMR resistance, and AI model results.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/microbes" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff', fontWeight: 700, fontSize: '0.85rem',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            Microbe Explorer <ChevronRight size={15} />
          </Link>
          <Link href="/sensors" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            Live Sensor Data <ChevronRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
}
