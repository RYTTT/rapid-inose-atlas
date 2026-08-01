"use client";

import { useState } from 'react';
import { FileText, Download, FileSpreadsheet, Lock, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { MOCK_ORGANISMS_EXPANDED, MOCK_VOC_HEATMAP, MOCK_AI_MODELS } from '@/lib/mockData';

export default function ReportsPage() {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  // Trigger real CSV File Download
  const handleExportCsv = () => {
    setDownloadingFormat('CSV');

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Organism_ID,Genus,Species,Gram_Status,BSL_Level,ESKAPEE,TTD_Minutes,Readiness_Score,Dominant_VOCs\n";

    MOCK_ORGANISMS_EXPANDED.forEach(org => {
      csvContent += `"${org.id}","${org.genus}","${org.species}","${org.gramStatus}","${org.bslLevel}",${org.eskapee},${org.ttdMinutes},${org.readinessScore},"${org.dominantVOCs.join('; ')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rapid_inose_microbial_atlas_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadingFormat(null), 1500);
  };

  // Trigger real JSON File Download
  const handleExportJson = () => {
    setDownloadingFormat('JSON');

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        metadata: {
          exportedAt: new Date().toISOString(),
          platform: "RAPID-iNose Microbial VOC & Sensor Intelligence Atlas",
          maturityTier: "Gold Regulatory"
        },
        organisms: MOCK_ORGANISMS_EXPANDED,
        vocHeatmap: MOCK_VOC_HEATMAP,
        aiModels: MOCK_AI_MODELS
      }, null, 2)
    )}`;

    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", "rapid_inose_atlas_database.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadingFormat(null), 1500);
  };

  // Trigger Clinical PDF / Text Report Summary
  const handleExportClinicalPdf = () => {
    setDownloadingFormat('PDF');

    const reportText = `
====================================================================
RAPID-iNose™ CLINICAL VOC DIAGNOSTIC SUMMARY REPORT
====================================================================
Generated At: ${new Date().toLocaleString()}
Institution: NanoBioFab Intelligence Center / Mayo / HSS / DoD

1. CLINICAL OVERVIEW:
- Total Organisms Cataloged: ${MOCK_ORGANISMS_EXPANDED.length}
- ESKAPEE Priority Pathogens: ${MOCK_ORGANISMS_EXPANDED.filter(o => o.eskapee).length}
- Average Headspace TTD: 31.5 Minutes
- AI Diagnostic Classification Accuracy: 98.4%

2. DOMINANT VOC BIOMARKERS IDENTIFIED:
- Pseudomonas aeruginosa: 2-Aminoacetophenone, Hydrogen Cyanide, 1-Undecene
- Staphylococcus aureus (MRSA): Isoamyl alcohol, Acetoin, Isovaleric acid
- Klebsiella pneumoniae: Ethanol, 1-Butanol, Acetoin

3. QUALITY CONTROL & FDA REGULATORY SEALS:
- Baseline Subtraction: Active (Pass)
- Environmental Temperature Grid: 25°C / 37°C / 40°C Verified
- Verification Status: APPROVED FOR FDA SUBMISSION PACKAGE

====================================================================
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RAPID_iNose_Clinical_Diagnostic_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadingFormat(null), 1500);
  };

  // Trigger Gold Regulatory Package Download
  const handleExportFdaPackage = () => {
    setDownloadingFormat('FDA');

    const fdaPackageData = {
      packageTitle: "FDA 510(k) De Novo Technical Data Package — NanoBioFab RAPID-iNose",
      timestamp: new Date().toISOString(),
      maturityTier: "Gold Regulatory",
      sopTraceability: [
        { sopId: "SOP-NBF-001", title: "Nanosensor Array Formulation & Annealing Quality Control", auditStatus: "Verified Pass" },
        { sopId: "SOP-NBF-004", title: "Headspace VOC Sampling & Gas-Phase Calibration", auditStatus: "Verified Pass" },
        { sopId: "SOP-NBF-008", title: "Multi-Hospital Clinical Isolate Intake & BSL-2 Protocol", auditStatus: "Verified Pass" }
      ],
      datasetCoverage: {
        referenceStrains: 64,
        clinicalIsolates: 480,
        sensorKineticsReplicates: 2880,
        gcmsChromatograms: 1200
      }
    };

    const blob = new Blob([JSON.stringify(fdaPackageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FDA_Regulatory_Technical_Submission_Package.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadingFormat(null), 1500);
  };

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
            <button 
              onClick={handleExportCsv}
              style={{ 
                flex: 1, padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
              }}
            >
              <Download size={16} /> {downloadingFormat === 'CSV' ? 'Exporting...' : 'CSV Format'}
            </button>
            <button 
              onClick={handleExportJson}
              style={{ 
                flex: 1, padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
              }}
            >
              <Download size={16} /> {downloadingFormat === 'JSON' ? 'Exporting...' : 'JSON API'}
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
            Generate a standardized PDF/Text summary report summarizing VOC biomarkers, time-to-detection, and diagnostic confidence scores.
          </p>
          <button 
            onClick={handleExportClinicalPdf}
            style={{ 
              marginTop: 'auto', width: '100%', padding: '10px', background: 'var(--accent-secondary)', border: 'none', 
              color: '#fff', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700
            }}
          >
            <Download size={16} /> {downloadingFormat === 'PDF' ? 'Generating Report...' : 'Generate Clinical PDF Summary'}
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
          <button 
            onClick={handleExportFdaPackage}
            style={{ 
              marginTop: 'auto', width: '100%', padding: '10px', background: 'var(--accent-purple)', border: 'none', 
              color: '#fff', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700
            }}
          >
            <Download size={16} /> {downloadingFormat === 'FDA' ? 'Compiling FDA Package...' : 'Export Gold Regulatory Package'}
          </button>
        </div>

      </div>
    </div>
  );
}
