"use client";

import { useEffect, useState } from 'react';
import { Shield, MapPin, Beaker, Network } from 'lucide-react';

export default function MicrobesPage() {
  const [organisms, setOrganisms] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrganisms() {
      try {
        const res = await fetch('/api/organisms');
        const data = await res.json();
        setOrganisms(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchOrganisms();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Microbe Explorer</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Detailed profiles of pathogens, sources, and functional phenotypes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {organisms.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading organisms...</p>
        ) : (
          organisms.map(org => (
            <div key={org.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                  {org.genus} {org.species}
                </h3>
                <span style={{ 
                  display: 'inline-block', 
                  marginTop: '8px',
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  background: org.gramStatus.includes('positive') ? 'var(--accent-purple)' : 'var(--accent-danger)',
                  color: '#fff',
                  fontWeight: 600
                }}>
                  {org.gramStatus}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Shield size={16} />
                  <span><strong>Relevance:</strong> {org.clinicalRelevance}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <MapPin size={16} />
                  <span><strong>Strains:</strong> {org.strains.length} isolates recorded</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <button style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  View Full Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
