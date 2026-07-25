"use client";

import { useEffect, useState } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export default function MetabolitesPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [gcmsData, setGcmsData] = useState<any[]>([]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function fetchRuns() {
      try {
        const res = await fetch('/api/runs');
        const data = await res.json();
        setRuns(data);
        if (data.length > 0) {
          setSelectedRun(data[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchRuns();
  }, []);

  useEffect(() => {
    if (selectedRun) {
      async function fetchGCMS() {
        try {
          const res = await fetch(`/api/chromatograms?experimentId=${selectedRun.id}`);
          const data = await res.json();
          if (data && data.length > 0) {
            setGcmsData(data[0].peaks);
          } else {
            // Mock data if none exists
            setGcmsData([
              { retentionTime: 2.4, intensity: 1500, compoundName: 'Ethanol' },
              { retentionTime: 4.1, intensity: 3200, compoundName: 'Acetic Acid' },
              { retentionTime: 5.8, intensity: 800, compoundName: 'Isoamyl alcohol' },
              { retentionTime: 8.2, intensity: 4500, compoundName: 'Acetoin' },
              { retentionTime: 12.5, intensity: 2100, compoundName: '2-Nonanone' },
            ]);
          }
        } catch (e) {
          console.error(e);
        }
      }
      fetchGCMS();
    }
  }, [selectedRun]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Metabolite Explorer (GC-MS)</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Visualize volatile organic compound (VOC) profiles extracted via Gas Chromatography.</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Chromatogram Peaks</h2>
        <div style={{ height: '400px', width: '100%' }}>
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={gcmsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis 
                dataKey="retentionTime" 
                type="number" 
                domain={['dataMin - 1', 'dataMax + 1']}
                stroke="var(--text-secondary)" 
                label={{ value: 'Retention Time (min)', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)' }} 
              />
              <YAxis stroke="var(--text-secondary)" label={{ value: 'Intensity (Abundance)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                labelFormatter={(label) => `RT: ${label} min`}
                formatter={(value: any, name: any, props: any) => [value, props.payload.compoundName || 'Unknown']}
              />
              {/* Using Bar with minimal width to simulate peaks/sticks often used in simple mass spec vis */}
              <Bar dataKey="intensity" barSize={4}>
                {gcmsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="var(--accent-purple)" />
                ))}
              </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
