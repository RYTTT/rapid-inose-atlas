"use client";

import { useState } from 'react';
import { MOCK_ORGANISMS_EXPANDED, OrganismDetail } from '@/lib/mockData';
import { Search, Shield, MapPin, Beaker, Network, Sparkles, Filter, X, CheckCircle2, ChevronRight, Activity, Cpu, Layers, Clock, FileText, FlaskConical, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function MicrobesPage() {
  const [organisms, setOrganisms] = useState<OrganismDetail[]>(MOCK_ORGANISMS_EXPANDED);
  const [selectedOrg, setSelectedOrg] = useState<OrganismDetail>(MOCK_ORGANISMS_EXPANDED[0]);
  const [activeTab, setActiveTab] = useState<'Identity' | 'Provenance' | 'Kinetics' | 'Metabolites' | 'Readiness'>('Identity');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGram, setSelectedGram] = useState<string>('All');
  const [eskapeeOnly, setEskapeeOnly] = useState<boolean>(false);
  const [selectedStrainIdx, setSelectedStrainIdx] = useState<number>(0);

  // Filtering logic
  const filteredOrganisms = organisms.filter(org => {
    const matchesSearch = `${org.genus} ${org.species} ${org.clinicalRelevance}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGram = selectedGram === 'All' || org.gramStatus === selectedGram;
    const matchesEskapee = !eskapeeOnly || org.eskapee;
    return matchesSearch && matchesGram && matchesEskapee;
  });

  // Generate dynamic multi-channel kinetic curves for the selected organism & strain
  const getKineticData = () => {
    const mult = selectedOrg.id === 'pa-01' ? 1.2 : selectedOrg.id === 'sa-02' ? 0.9 : 1.0;
    return [0, 5, 10, 15, 20, 25, 30, 45, 60].map(t => ({
      time: t,
      LW60: +(0.05 * Math.exp(t / 22) * mult).toFixed(2),
      LW61: +(0.03 * Math.exp(t / 25) * mult).toFixed(2),
      LW62: +(0.15 * Math.exp(t / 18) * mult).toFixed(2),
      LW63: +(0.08 * Math.exp(t / 20) * mult).toFixed(2),
      LW64: +(0.10 * Math.exp(t / 21) * mult).toFixed(2),
      LW65: +(0.32 * Math.exp(t / 15) * mult).toFixed(2)
    }));
  };

  const currentKineticData = getKineticData();
  const SENSOR_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  // GC-MS Peak Spectrum for selected organism
  const gcmsPeakData = [
    { rt: 2.4, intensity: selectedOrg.id === 'pa-01' ? 1200 : 2800, compound: 'Ethanol' },
    { rt: 3.8, intensity: selectedOrg.id === 'pa-01' ? 9500 : 100, compound: 'Hydrogen Cyanide' },
    { rt: 5.2, intensity: selectedOrg.id === 'pa-01' ? 8800 : 400, compound: '2-Aminoacetophenone' },
    { rt: 7.1, intensity: selectedOrg.id === 'sa-02' ? 9200 : 1500, compound: 'Isoamyl alcohol' },
    { rt: 8.5, intensity: selectedOrg.id === 'sa-02' ? 8900 : 2100, compound: 'Acetoin' },
    { rt: 11.4, intensity: selectedOrg.id === 'ec-06' ? 9600 : 600, compound: 'Indole' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* Top Title Banner */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Microbe Explorer & Strain Profile Engine</h1>
            <span className="badge badge-purple">Layer 1 & 2 Standard</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            Full taxonomy, clinical provenance diversity, 6-sensor kinetics, GC-MS VOC signatures, and application readiness.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input 
            type="text" 
            placeholder="Search genus, species, clinical relevance..." 
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

      {/* Main Multi-Pane Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* Left Column: Organism Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredOrganisms.map(org => {
            const isSelected = selectedOrg.id === org.id;
            return (
              <div 
                key={org.id} 
                onClick={() => { setSelectedOrg(org); setSelectedStrainIdx(0); }}
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
                    <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-primary)', fontStyle: 'italic', fontWeight: 800 }}>
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
                  <ChevronRight size={20} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                </div>

                <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>Strains:</strong> {org.strainCount} Isolates</span>
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Avg TTD: ~{org.ttdMinutes} mins</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Multi-Tab Organism Profile Inspector */}
        <div className="glass-panel" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header Bar of Selected Organism */}
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0, fontStyle: 'italic', fontWeight: 800, color: 'var(--text-primary)' }}>
                {selectedOrg.genus} {selectedOrg.species}
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Kingdom: {selectedOrg.kingdom} | BSL: {selectedOrg.bslLevel} | {selectedOrg.gramStatus}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                Application Readiness: {selectedOrg.readinessScore}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {selectedOrg.strainCount} Strains Cataloged
              </div>
            </div>
          </div>

          {/* 5-Tab Navigation Header */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            {[
              { id: 'Identity', label: 'Layer 1: Identity', icon: Shield },
              { id: 'Provenance', label: 'Layer 2: Provenance', icon: MapPin },
              { id: 'Kinetics', label: 'Layer 5: 6-Sensor Kinetics', icon: Activity },
              { id: 'Metabolites', label: 'Layer 7: GC-MS Profile', icon: FlaskConical },
              { id: 'Readiness', label: 'Layer 10: Application Readiness', icon: Award },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Identity & Taxonomy */}
          {activeTab === 'Identity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '10px', fontSize: '0.88rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Genus:</span> <strong>{selectedOrg.genus}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Species:</span> <strong>{selectedOrg.species}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Gram Classification:</span> <strong>{selectedOrg.gramStatus}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Biosafety Level:</span> <strong>{selectedOrg.bslLevel}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>ESKAPEE Status:</span> <strong>{selectedOrg.eskapee ? 'Yes (High Priority Pathogen)' : 'No'}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Average TTD:</span> <strong>~{selectedOrg.ttdMinutes} minutes</strong></div>
                <div style={{ gridColumn: 'span 2' }}><span style={{ color: 'var(--text-muted)' }}>Clinical Relevance:</span> <strong>{selectedOrg.clinicalRelevance}</strong></div>
                <div style={{ gridColumn: 'span 2' }}><span style={{ color: 'var(--text-muted)' }}>DoD Relevance:</span> <strong>{selectedOrg.dodRelevance}</strong></div>
              </div>
            </div>
          )}

          {/* Tab 2: Provenance & Source Diversity */}
          {activeTab === 'Provenance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Select Cataloged Strain / Isolate:</span>
                <select 
                  value={selectedStrainIdx}
                  onChange={(e) => setSelectedStrainIdx(Number(e.target.value))}
                  style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                >
                  {selectedOrg.availableStrains.map((st, idx) => (
                    <option key={idx} value={idx}>{st.strainName} ({st.sourceType})</option>
                  ))}
                </select>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px' }}>Strain Identifier</th>
                      <th style={{ padding: '10px' }}>Source Type</th>
                      <th style={{ padding: '10px' }}>Origin Institution</th>
                      <th style={{ padding: '10px' }}>Clinical Context</th>
                      <th style={{ padding: '10px' }}>AMR Status</th>
                      <th style={{ padding: '10px' }}>Replicates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrg.availableStrains.map((st, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: selectedStrainIdx === i ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}>
                        <td style={{ padding: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>{st.strainName}</td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{st.sourceType}</td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{st.institution}</td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{st.clinicalContext}</td>
                        <td style={{ padding: '10px' }}>
                          <span className={`badge ${st.amrStatus.includes('MRSA') || st.amrStatus.includes('MDR') || st.amrStatus.includes('ESBL') ? 'badge-red' : 'badge-blue'}`}>
                            {st.amrStatus}
                          </span>
                        </td>
                        <td style={{ padding: '10px', fontWeight: 600 }}>{st.replicates} runs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Sensor Kinetics */}
          {activeTab === 'Kinetics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Real-time Nanosensor Kinetic Fingerprint for <strong>{selectedOrg.availableStrains[selectedStrainIdx]?.strainName}</strong>
                </span>
                <span className="badge badge-blue">Sampling Interval: 60s</span>
              </div>

              <div style={{ height: '260px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentKineticData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--text-secondary)" label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" label={{ value: 'Relative Response ΔR/R0', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    {['LW60', 'LW61', 'LW62', 'LW63', 'LW64', 'LW65'].map((s, idx) => (
                      <Line key={s} type="monotone" dataKey={s} stroke={SENSOR_COLORS[idx]} strokeWidth={2} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tab 4: GC-MS Metabolites */}
          {activeTab === 'Metabolites' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Dominant volatile organic compound (VOC) features identified via GC-MS headspace sampling:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedOrg.dominantVOCs.map((voc, i) => (
                  <span key={i} className="badge badge-purple" style={{ textTransform: 'none', fontSize: '0.85rem', padding: '6px 12px' }}>
                    <Sparkles size={14} /> {voc}
                  </span>
                ))}
              </div>

              <div style={{ height: '200px', width: '100%', marginTop: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gcmsPeakData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="compound" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }} />
                    <Bar dataKey="intensity" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tab 5: Application Readiness */}
          {activeTab === 'Readiness' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Smart Wound Dressing Readiness</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-secondary)', marginTop: '4px' }}>98% Ready</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Ex-vivo validated in wound exudate.</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Blood Culture Sepsis Alert</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>94% Ready</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Faster TTD vs CO2 sensor bottles.</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>NPWT Suction Tubing Integration</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-warning)', marginTop: '4px' }}>92% Ready</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Continuous continuous effluent headspace monitoring.</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>DoD Field Deployment</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '4px' }}>90% Ready</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Tested up to 40°C austere temp.</div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
