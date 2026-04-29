"use client";

import { FileText, Download, FileSpreadsheet, Lock } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Reports & Export</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Generate clinical reports, download raw datasets, and manage regulatory submissions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Dataset Export Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <FileSpreadsheet size={24} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Batch Dataset Export</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Download aggregated sensor time-series data and clinical metadata for offline analysis.
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
            <button style={{ 
              flex: 1, padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <Download size={16} /> CSV
            </button>
            <button style={{ 
              flex: 1, padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <Download size={16} /> JSON
            </button>
          </div>
        </div>

        {/* Clinical Report Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <FileText size={24} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Clinical Phenotype Report</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Generate a standardized PDF report summarizing VOC biomarkers and detection algorithms for a selected cohort.
          </p>
          <button style={{ 
            marginTop: 'auto', width: '100%', padding: '10px', background: 'var(--accent-secondary)', border: 'none', 
            color: '#fff', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
          }}>
            Generate PDF
          </button>
        </div>

        {/* Regulatory Export Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <Lock size={24} color="var(--text-muted)" />
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>FDA / Regulatory Package</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Compile complete end-to-end traceability logs, sensor array QC, and raw data required for regulatory submission.
          </p>
          <button disabled style={{ 
            marginTop: 'auto', width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
            color: 'var(--text-muted)', borderRadius: '6px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            Requires Gold Dataset Access
          </button>
        </div>

      </div>
    </div>
  );
}
