"use client";

import { useState } from 'react';
import { MOCK_ORGANISMS_EXPANDED, OrganismDetail } from '@/lib/mockData';
import { Search, Shield, MapPin, Beaker, Network, Sparkles, Filter, X, CheckCircle2, ChevronRight, Activity, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function MicrobesPage() {
  const [organisms, setOrganisms] = useState<OrganismDetail[]>(MOCK_ORGANISMS_EXPANDED);
  const [selectedOrg, setSelectedOrg] = useState<OrganismDetail | null>(MOCK_ORGANISMS_EXPANDED[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGram, setSelectedGram] = useState<string>('All');
  const [eskapeeOnly, setEskapeeOnly] = useState<boolean>(false);

  // Filtering logic
  const filteredOrganisms = organisms.filter(org => {
    const matchesSearch = `${org.genus} ${org.species} ${org.clinicalRelevance}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGram = selectedGram === 'All' || org.gramStatus === selectedGram;
    const matchesEskapee = !eskapeeOnly || org.eskapee;
    return matchesSearch && matchesGram && matchesEskapee;
  });

  // Mock kinetic data generator for preview
  const mockKineticPreview = [
    { time: 0, signal: 0 },
    { time: 10, signal: 0.1 },
    { time: 20, signal: 0.4 },
    { time: 30, signal: 1.8 },
    { time: 40, signal: 3.2 },
    { time: 50, signal: 4.1 },
    { time: 60, signal: 4.5 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Microbe Explorer</h1>
            <span className="badge badge-purple">Layer 1 & Layer 2 Engine</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            ATCC strain catalog expanded with VOC phenotype and real-time nanosensor kinetic signatures.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input 
            type="text" 
            placeholder="Filter by genus, species, or clinical keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%',
              background: 'var(--bg-tertiary)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px',
              padding: '8px 16px 8px 36px',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.85rem'
            }} 
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gram Class:</span>
          {['All', 'Gram-negative', 'Gram-positive', 'Fungi'].map(g => (
            <button
              key={g}
              onClick={() => setSelectedGram(g)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: selectedGram === g ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: selectedGram === g ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <input 
            type="checkbox" 
            checked={eskapeeOnly} 
            onChange={(e) => setEskapeeOnly(e.target.checked)} 
          />
          <span style={{ fontWeight: 600, color: eskapeeOnly ? '#f87171' : 'var(--text-secondary)' }}>ESKAPEE Pathogens Only</span>
        </label>
      </div>

      {/* Main Grid: Organism Cards + Detail Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* Left Column: Organism Selection Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredOrganisms.map(org => {
            const isSelected = selectedOrg?.id === org.id;
            return (
              <div 
                key={org.id} 
                onClick={() => setSelectedOrg(org)}
                className="glass-panel" 
                style={{ 
                  padding: '16px', 
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-glass)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)', fontStyle: 'italic', fontWeight: 700 }}>
                      {org.genus} {org.species}
                    </h3>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <span className={`badge ${org.gramStatus.includes('positive') ? 'badge-purple' : org.gramStatus.includes('Fungi') ? 'badge-amber' : 'badge-blue'}`}>
                        {org.gramStatus}
                      </span>
                      {org.eskapee && <span className="badge badge-red">ESKAPEE</span>}
                      <span className="badge badge-emerald">{org.bslLevel}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                </div>

                <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Strains:</strong> {org.strainCount} recorded</span>
                  <span><strong>Avg TTD:</strong> ~{org.ttdMinutes} mins</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full Organism Profile Inspector */}
        {selectedOrg && (
          <div className="glass-panel" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Header Title */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', margin: 0, fontStyle: 'italic', fontWeight: 800 }}>
                  {selectedOrg.genus} {selectedOrg.species}
                </h2>
                <span className="badge badge-emerald">Readiness Score: {selectedOrg.readinessScore}%</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                Clinical Relevance: {selectedOrg.clinicalRelevance}
              </p>
            </div>

            {/* Section A: Identity & Taxonomy */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Section A — Organism Identity & Relevance
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div><strong>Kingdom:</strong> {selectedOrg.kingdom}</div>
                <div><strong>Gram Class:</strong> {selectedOrg.gramStatus}</div>
                <div><strong>Biosafety Level:</strong> {selectedOrg.bslLevel}</div>
                <div><strong>ESKAPEE Status:</strong> {selectedOrg.eskapee ? 'High Priority ESKAPEE' : 'Standard'}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>DoD Relevance:</strong> {selectedOrg.dodRelevance}</div>
              </div>
            </div>

            {/* Section B: Source Provenance Diversity Table */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Section B — Source & Provenance Diversity
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '8px' }}>Strain Name</th>
                      <th style={{ padding: '8px' }}>Source Type</th>
                      <th style={{ padding: '8px' }}>Institution</th>
                      <th style={{ padding: '8px' }}>AMR Phenotype</th>
                      <th style={{ padding: '8px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrg.availableStrains.map((st, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>{st.strainName}</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{st.sourceType}</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{st.institution}</td>
                        <td style={{ padding: '8px' }}>
                          <span className={`badge ${st.amrStatus.includes('MRSA') || st.amrStatus.includes('MDR') ? 'badge-red' : 'badge-blue'}`}>
                            {st.amrStatus}
                          </span>
                        </td>
                        <td style={{ padding: '8px', color: 'var(--accent-secondary)' }}>{st.dataStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section C: Sensor Fingerprint Preview */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Section C — Kinetic Fingerprint & Time-to-Detection
              </h4>
              <div style={{ height: '140px', background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockKineticPreview}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                    <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="signal" stroke="var(--accent-primary)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section D: Metabolite VOC Signature */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Section D — Dominant VOC Chemical Features
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedOrg.dominantVOCs.map((voc, i) => (
                  <span key={i} className="badge badge-purple" style={{ textTransform: 'none' }}>
                    <Sparkles size={12} /> {voc}
                  </span>
                ))}
              </div>
            </div>

            {/* Section E: Application Readiness Badges */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Section E — Application Readiness Scores
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '6px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Wound Care</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>Ready (98%)</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '6px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Blood Culture</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Validated (94%)</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '6px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>NPWT Integration</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>Ready (92%)</div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
