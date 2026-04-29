"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { ArrowUpRight, Activity, Database, Beaker, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function AtlasHome() {
  const [stats, setStats] = useState({
    organisms: 0,
    strains: 0,
    experiments: 0
  });

  useEffect(() => {
    // Fetch stats from API
    async function fetchStats() {
      try {
        const orgRes = await fetch('/api/organisms');
        const orgs = await orgRes.json();
        const runsRes = await fetch('/api/runs');
        const runs = await runsRes.json();
        
        let strainsCount = 0;
        orgs.forEach((o: any) => {
          strainsCount += o.strains.length;
        });

        setStats({
          organisms: orgs.length,
          strains: strainsCount,
          experiments: runs.length
        });
      } catch (error) {
        console.error("Failed to fetch stats");
      }
    }
    fetchStats();
  }, []);

  // Mock data for visualizations
  const coverageData = [
    { name: 'Wound', value: 45 },
    { name: 'Bloodstream', value: 25 },
    { name: 'Implant', value: 15 },
    { name: 'Food/Env', value: 15 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

  const maturityData = [
    { name: 'Gram-Positive', Reference: 10, Clinical: 25, GCMS: 5 },
    { name: 'Gram-Negative', Reference: 15, Clinical: 30, GCMS: 8 },
    { name: 'Fungi', Reference: 5, Clinical: 10, GCMS: 2 },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // We assume the first experiment is the target for this demo
    const expRes = await fetch('/api/runs');
    const runs = await expRes.json();
    if (runs.length === 0) {
      alert("No experiments found to attach data to.");
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('experimentId', runs[0].id);

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully ingested ${data.dataPointsSaved} sensor data points from ${data.rowsProcessed} rows!`);
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
      alert("Upload failed.");
    }
  };

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.title}>Atlas Executive Dashboard</h1>
          <p className={styles.subtitle}>Overview of RAPID-iNose Database coverage and maturity</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{ 
            background: 'var(--bg-tertiary)', 
            color: 'var(--text-primary)', 
            border: '1px solid var(--border-color)', 
            padding: '10px 20px', 
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Activity size={18} />
            Upload CSV
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
          <button style={{ 
            background: 'var(--accent-primary)', 
            color: '#fff', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ArrowUpRight size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={`glass-panel ${styles.kpiCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.kpiTitle}>Total Organisms</span>
            <Activity size={18} color="var(--accent-primary)" />
          </div>
          <span className={styles.kpiValue}>{stats.organisms || 102}</span>
          <div className={styles.kpiDelta}>
            <span className={styles.deltaPositive}>+12%</span>
            <span style={{ color: 'var(--text-muted)' }}>from last month</span>
          </div>
        </div>

        <div className={`glass-panel ${styles.kpiCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.kpiTitle}>Clinical Isolates</span>
            <Database size={18} color="var(--accent-secondary)" />
          </div>
          <span className={styles.kpiValue}>{stats.strains || 450}</span>
          <div className={styles.kpiDelta}>
            <span className={styles.deltaPositive}>+5%</span>
            <span style={{ color: 'var(--text-muted)' }}>from last month</span>
          </div>
        </div>

        <div className={`glass-panel ${styles.kpiCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.kpiTitle}>Sensor Runs</span>
            <Zap size={18} color="var(--accent-warning)" />
          </div>
          <span className={styles.kpiValue}>{stats.experiments || 1200}</span>
          <div className={styles.kpiDelta}>
            <span className={styles.deltaPositive}>+22%</span>
            <span style={{ color: 'var(--text-muted)' }}>from last month</span>
          </div>
        </div>

        <div className={`glass-panel ${styles.kpiCard}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.kpiTitle}>Growth Conditions</span>
            <Beaker size={18} color="var(--accent-purple)" />
          </div>
          <span className={styles.kpiValue}>24</span>
          <div className={styles.kpiDelta}>
            <span style={{ color: 'var(--text-muted)' }}>Active protocols</span>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={`glass-panel ${styles.chartCard}`}>
          <h2 className={styles.chartTitle}>Database Maturity by Pathogen Class</h2>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maturityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <Legend />
                <Bar dataKey="Reference" stackId="a" fill="var(--accent-primary)" />
                <Bar dataKey="Clinical" stackId="a" fill="var(--accent-secondary)" />
                <Bar dataKey="GCMS" stackId="a" fill="var(--accent-purple)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`glass-panel ${styles.chartCard}`}>
          <h2 className={styles.chartTitle}>Clinical Source Diversity</h2>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coverageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {coverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
