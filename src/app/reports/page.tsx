"use client";

import { FileText, Download, FileSpreadsheet, Lock, ShieldCheck, Sparkles } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Reports & Data Export</h1>
            <span className="badge badge-blue">Layer 14/15 Export API Engine</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Generate clinical reports, download raw datasets, and export enterprise NDA presentation packages.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Dataset Export Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <FileSpreadsheet size={24} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Batch Dataset Export</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Download aggregated sensor time-series kinetics, GC-MS peak tables, and clinical metadata for offline analysis.
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
            <button style={{ 
              flex: 1, padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
            }}>
              <Download size={16} /> CSV Format
            </button>
            <button style={{ 
              flex: 1, padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
            }}>
              <Download size={16} /> JSON API
            </button>
          </div>
        </div>

        {/* Clinical Phenotype Report Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <FileText size={24} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Clinical Phenotype Report</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Generate a standardized PDF report summarizing VOC biomarkers, time-to-detection, and diagnostic confidence scores.
          </p>
          <button style={{ 
            marginTop: 'auto', width: '100%', padding: '10px', background: 'var(--accent-secondary)', border: 'none', 
            color: '#fff', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700
          }}>
            Generate Clinical PDF Report
          </button>
        </div>

        {/* Regulatory Export Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <ShieldCheck size={24} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>FDA Technical Package</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Compile complete end-to-end SOP traceability logs, sensor array QC flags, and raw data required for FDA submission.
          </p>
          <button style={{ 
            marginTop: 'auto', width: '100%', padding: '10px', background: 'var(--accent-purple)', border: 'none', 
            color: '#fff', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700
          }}>
            Export Gold Regulatory Package
          </button>
        </div>

      </div>
    </div>
  );
}
