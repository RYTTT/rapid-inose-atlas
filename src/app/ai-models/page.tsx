"use client";

import { useState } from 'react';
import { MOCK_AI_MODELS } from '@/lib/mockData';
import { Brain, Cpu, Sparkles, CheckCircle2, Play, Activity, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AiModelsPage() {
  const [selectedModel, setSelectedModel] = useState(MOCK_AI_MODELS[0]);
  const [timeWindow, setTimeWindow] = useState('30 min');
  const [inputSensors, setInputSensors] = useState('6-Channel Standard');

  // Simulation outputs based on input selection
  const [simResult, setSimResult] = useState({
    predictedPathogen: 'Pseudomonas aeruginosa',
    gramClass: 'Gram-negative',
    amrLikelihood: 12.4,
    biofilmLikelihood: 84.5,
    confidenceScore: 98.2,
    ttdMinutes: 28
  });

  const handleRunInference = () => {
    // Generate simulated updated predictions based on inputs
    const ttd = timeWindow === '15 min' ? 18 : timeWindow === '30 min' ? 28 : 35;
    const conf = inputSensors.includes('40') ? 99.6 : 98.2;
    setSimResult({
      predictedPathogen: 'Pseudomonas aeruginosa (PAO1)',
      gramClass: 'Gram-negative',
      amrLikelihood: 14.2,
      biofilmLikelihood: 88.1,
      confidenceScore: conf,
      ttdMinutes: ttd
    });
  };

  // ROC-AUC Curve Data
  const rocAucData = [
    { fpr: 0.00, tpr: 0.00 },
    { fpr: 0.02, tpr: 0.85 },
    { fpr: 0.05, tpr: 0.94 },
    { fpr: 0.10, tpr: 0.98 },
    { fpr: 0.20, tpr: 0.99 },
    { fpr: 1.00, tpr: 1.00 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>AI Model Center</h1>
            <span className="badge badge-purple">Layer 10 AI Diagnostic & Customer Layer</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.88rem' }}>
            AI-ready diagnostic foundation models for wound care, military medicine, blood culture, & food safety.
          </p>
        </div>
      </div>

      {/* Model Registry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {MOCK_AI_MODELS.map(model => {
          const isSelected = selectedModel.id === model.id;
          return (
            <div 
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className="glass-panel"
              style={{
                padding: '16px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-glass)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{model.type}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{model.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span className="badge badge-emerald">{model.accuracy}% Acc</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AUC: {model.rocAuc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Interactive Simulator + Performance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Real-Time Interactive Model Inference Simulator */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Live Model Inference Simulator
            </h3>
            <span className="badge badge-blue">Layer 10 Prediction Engine</span>
          </div>

          {/* Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Input Sensors</label>
              <select 
                value={inputSensors}
                onChange={(e) => setInputSensors(e.target.value)}
                style={{ width: '100%', padding: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.82rem' }}
              >
                <option>6-Channel Standard</option>
                <option>12-Channel Panel</option>
                <option>40-Combination Matrix</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Time Window</label>
              <select 
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                style={{ width: '100%', padding: '6px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.82rem' }}
              >
                <option>15 min</option>
                <option>30 min</option>
                <option>45 min</option>
                <option>60 min</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={handleRunInference}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Play size={14} /> Run Inference
              </button>
            </div>
          </div>

          {/* Prediction Outputs (PDF Page 14 Requirement) */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-highlight)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Model Prediction Output
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.88rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Predicted Pathogen Species</div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem', fontStyle: 'italic', marginTop: '2px' }}>
                  {simResult.predictedPathogen}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence Score</div>
                <div style={{ fontWeight: 800, color: 'var(--accent-secondary)', fontSize: '1.1rem', marginTop: '2px' }}>
                  {simResult.confidenceScore}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AMR Likelihood %</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{simResult.amrLikelihood}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Biofilm Likelihood %</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>{simResult.biofilmLikelihood}%</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Performance Suite & ROC-AUC */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>ROC-AUC Curve for {selectedModel.name}</h3>
            
            <div style={{ height: '180px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocAucData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="fpr" stroke="var(--text-secondary)" label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <YAxis dataKey="tpr" stroke="var(--text-secondary)" label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)' }} />
                  <Line type="monotone" dataKey="tpr" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Performance Metrics Suite</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sensitivity (TPR):</span>
              <span style={{ fontWeight: 700 }}>{selectedModel.sensitivity}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Specificity (TNR):</span>
              <span style={{ fontWeight: 700 }}>{selectedModel.specificity}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Precision:</span>
              <span style={{ fontWeight: 700 }}>{selectedModel.precision}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>F1-Score:</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{selectedModel.f1Score}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
