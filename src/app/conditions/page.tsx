"use client";

import { useEffect, useState } from 'react';
import { Beaker, Thermometer, Wind } from 'lucide-react';

export default function ConditionsPage() {
  const [conditions, setConditions] = useState<any[]>([]);

  useEffect(() => {
    // In a real application, you'd fetch this from an API endpoint like /api/conditions
    // Since we don't have that endpoint yet, we'll fetch runs and extract unique conditions
    async function fetchConditions() {
      try {
        const res = await fetch('/api/runs');
        const data = await res.json();
        
        // Extract unique conditions
        const uniqueConditionsMap = new Map();
        data.forEach((run: any) => {
          if (run.condition && !uniqueConditionsMap.has(run.condition.id)) {
            uniqueConditionsMap.set(run.condition.id, run.condition);
          }
        });
        
        setConditions(Array.from(uniqueConditionsMap.values()));
      } catch (e) {
        console.error(e);
      }
    }
    fetchConditions();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Condition Explorer</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Library of experimental culture conditions and environmental variables.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {conditions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading conditions...</p>
        ) : (
          conditions.map(cond => (
            <div key={cond.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Beaker size={24} color="var(--accent-purple)" />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {cond.mediaName}
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Thermometer size={16} color="var(--accent-warning)" />
                  <span><strong>Temperature:</strong> {cond.temperature} °C</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Wind size={16} color="var(--accent-secondary)" />
                  <span><strong>Atmosphere:</strong> {cond.oxygenCondition}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
