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
/* Real sensor data: FB-v0 dataset, LW60, mean of 3 replicates per organism.
   Source: rapid-inose-atlas-production.up.railway.app/api/public/v1/timeseries/ */
const kineticData = [
  {t:0,     'P. aeruginosa':-0.1276, 'E. coli':-0.0864, 'S. aureus':0.0313},
  {t:0.83,  'P. aeruginosa':-0.0101, 'E. coli':-0.02,   'S. aureus':-0.0189},
  {t:1.67,  'P. aeruginosa':-0.0003, 'E. coli':-0.0017, 'S. aureus':-0.0078},
  {t:2.5,   'P. aeruginosa':0.0022,  'E. coli':0.0004,  'S. aureus':-0.0027},
  {t:3.33,  'P. aeruginosa':0.0023,  'E. coli':-0.0002, 'S. aureus':0.0019},
  {t:4.17,  'P. aeruginosa':0.0059,  'E. coli':0.0056,  'S. aureus':0.006},
  {t:5,     'P. aeruginosa':0.0176,  'E. coli':0.0092,  'S. aureus':0.0116},
  {t:5.83,  'P. aeruginosa':0.0405,  'E. coli':0.0149,  'S. aureus':0.0234},
  {t:6.67,  'P. aeruginosa':0.0511,  'E. coli':0.0356,  'S. aureus':0.0398},
  {t:7.5,   'P. aeruginosa':0.0707,  'E. coli':0.1318,  'S. aureus':0.0545},
  {t:8.33,  'P. aeruginosa':0.1149,  'E. coli':0.1577,  'S. aureus':0.0648},
  {t:9.17,  'P. aeruginosa':0.1704,  'E. coli':0.1433,  'S. aureus':0.0726},
  {t:10,    'P. aeruginosa':0.2161,  'E. coli':0.134,   'S. aureus':0.0855},
  {t:10.83, 'P. aeruginosa':0.2489,  'E. coli':0.1286,  'S. aureus':0.0948},
  {t:11.67, 'P. aeruginosa':0.2722,  'E. coli':0.1531,  'S. aureus':0.105},
  {t:12.5,  'P. aeruginosa':0.2902,  'E. coli':0.2037,  'S. aureus':0.1201},
  {t:13.33, 'P. aeruginosa':0.3041,  'E. coli':0.2624,  'S. aureus':0.1379},
  {t:14.17, 'P. aeruginosa':0.3147,  'E. coli':0.2896,  'S. aureus':0.1529},
  {t:15,    'P. aeruginosa':0.3113,  'E. coli':0.303,   'S. aureus':0.1665},
  {t:15.83, 'P. aeruginosa':0.3045,  'E. coli':0.3138,  'S. aureus':0.18},
  {t:16.67, 'P. aeruginosa':0.311,   'E. coli':0.3128,  'S. aureus':0.1881},
  {t:17.5,  'P. aeruginosa':0.3202,  'E. coli':0.3166,  'S. aureus':0.1931},
  {t:18.33, 'P. aeruginosa':0.3318,  'E. coli':0.3331,  'S. aureus':0.2019},
  {t:20,    'P. aeruginosa':0.3532,  'E. coli':0.3241,  'S. aureus':0.2063},
  {t:22.5,  'P. aeruginosa':0.3822,  'E. coli':0.3068,  'S. aureus':0.2149},
  {t:25,    'P. aeruginosa':0.405,   'E. coli':0.2872,  'S. aureus':0.2244},
  {t:27.5,  'P. aeruginosa':0.4273,  'E. coli':0.2622,  'S. aureus':0.2355},
  {t:30,    'P. aeruginosa':0.4445,  'E. coli':0.2502,  'S. aureus':0.2411},
  {t:32.5,  'P. aeruginosa':0.4639,  'E. coli':0.2521,  'S. aureus':0.2521},
  {t:35,    'P. aeruginosa':0.4822,  'E. coli':0.2532,  'S. aureus':0.2623},
  {t:37.5,  'P. aeruginosa':0.4963,  'E. coli':0.2541,  'S. aureus':0.2721},
  {t:40,    'P. aeruginosa':0.5108,  'E. coli':0.2488,  'S. aureus':0.2791},
  {t:42.5,  'P. aeruginosa':0.5222,  'E. coli':0.2455,  'S. aureus':0.2878},
  {t:45,    'P. aeruginosa':0.5296,  'E. coli':0.2488,  'S. aureus':0.296},
];

const SENSOR_COLORS = ['#38bdf8', '#a78bfa', '#fb923c'];
const SENSOR_KEYS = ['P. aeruginosa', 'E. coli', 'S. aureus'];

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
                  type="number"
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  label={{ value: 'Time (hours)', position: 'insideBottom', offset: -4, fill: 'var(--text-muted)', fontSize: 10 }}
                  domain={[0, 'dataMax']}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => v.toFixed(2)}
                  width={42}
                  label={{ value: 'ΔR/R₀ (normalized)', angle: -90, position: 'insideLeft', offset: 16, fill: 'var(--text-muted)', fontSize: 9 }}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.78rem' }}
                  formatter={(v: unknown, name: unknown) => [(v as number).toFixed(4), name as string]}
                  labelFormatter={(l) => `${l}h`}
                />
                <Legend wrapperStyle={{ fontSize: '0.72rem', paddingTop: '8px' }} />
                <ReferenceLine x={6} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: 'Detection Onset', fill: '#f59e0b', fontSize: 9, position: 'top' }} />
                {SENSOR_KEYS.map((k, i) => (
                  <Line
                    key={k}
                    type="monotone"
                    dataKey={k}
                    stroke={SENSOR_COLORS[i]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
           )}
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center', fontStyle: 'italic' }}>
          Real published data · FB-v0 dataset · LW60 sensor · Mean of 3 replicates per organism · Source: NanoBioFAB RAPID-iNose Sensor Atlas
        </p>
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
