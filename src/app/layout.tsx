"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import "./globals.css";
import styles from "./layout.module.css";
import { 
  Database, Home, Activity, Beaker, Network, FlaskConical, ShieldAlert, 
  GitCompare, Cpu, Brain, Users, ShieldCheck, Search, FileText, Lock, Eye, CheckCircle2
} from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const [dataTier, setDataTier] = useState<'Bronze' | 'Silver' | 'Gold'>('Silver');
  const [viewMode, setViewMode] = useState<'Customer' | 'Internal R&D'>('Customer');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const savedTier = localStorage.getItem('rapid_data_tier') as any;
    if (savedTier) setDataTier(savedTier);

    const savedMode = localStorage.getItem('rapid_view_mode') as any;
    if (savedMode) setViewMode(savedMode);
  }, []);

  const handleTierChange = (tier: 'Bronze' | 'Silver' | 'Gold') => {
    setDataTier(tier);
    localStorage.setItem('rapid_data_tier', tier);
  };

  const handleModeChange = (mode: 'Customer' | 'Internal R&D') => {
    setViewMode(mode);
    localStorage.setItem('rapid_view_mode', mode);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/microbes?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navItems = [
    { href: '/', label: 'Atlas Home', icon: Home },
    { href: '/microbes', label: 'Microbe Explorer', icon: Activity },
    { href: '/conditions', label: 'Condition Explorer', icon: Beaker },
    { href: '/sensors', label: 'Sensor Viewer', icon: Network },
    { href: '/metabolites', label: 'Metabolite Explorer', icon: FlaskConical },
    { href: '/amr-biofilm', label: 'AMR & Biofilm Module', icon: ShieldAlert },
    { href: '/compare', label: 'Compare Lab', icon: GitCompare },
    { href: '/sensor-optimizer', label: 'Sensor Optimizer', icon: Cpu },
    { href: '/ai-models', label: 'AI Model Center', icon: Brain },
    { href: '/customer-solutions', label: 'Customer Solutions', icon: Users },
    { href: '/governance', label: 'Data Governance & IP', icon: ShieldCheck },
    { href: '/reports', label: 'Reports & Export', icon: FileText },
  ];

  return (
    <html lang="en">
      <head>
        <title>RAPID-iNose™ Microbial VOC & Sensor Intelligence Atlas</title>
        <meta name="description" content="Microbial VOC & Nanosensor Response Intelligence Atlas" />
      </head>
      <body>
        <div className={styles.layoutContainer}>
          {/* Left Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={20} color="#fff" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.5px' }}>RAPID-iNose™</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Microbial Intelligence</span>
              </div>
            </div>
            
            <nav className={styles.navLinks}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Sidebar Footer Status */}
            <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dataset Status</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Maturity Tier</span>
                <span className={`badge ${dataTier === 'Gold' ? 'badge-amber' : dataTier === 'Silver' ? 'badge-blue' : 'badge-emerald'}`}>
                  {dataTier}
                </span>
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className={styles.mainContent}>
            {/* Topbar Header */}
            <header className={styles.topbar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  RAPID-iNose Atlas Platform
                </span>
                <span style={{ height: 16, width: 1, background: 'var(--border-color)' }}></span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['Bronze', 'Silver', 'Gold'] as const).map(tier => (
                    <button
                      key={tier}
                      onClick={() => handleTierChange(tier)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        background: dataTier === tier ? 'var(--accent-primary)' : 'transparent',
                        color: dataTier === tier ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.topbarActions}>
                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                  <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: 12, top: 10 }} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search organism, VOC, sensor..." 
                    style={{ 
                      background: 'var(--bg-tertiary)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '20px',
                      padding: '7px 16px 7px 36px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '0.85rem',
                      width: '240px'
                    }} 
                  />
                </form>

                {/* View Mode Toggle Button */}
                <button
                  onClick={() => handleModeChange(viewMode === 'Customer' ? 'Internal R&D' : 'Customer')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: viewMode === 'Internal R&D' ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-tertiary)',
                    color: viewMode === 'Internal R&D' ? '#c084fc' : 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {viewMode === 'Internal R&D' ? <Lock size={14} /> : <Eye size={14} />}
                  <span>{viewMode} View</span>
                </button>

                {/* User Avatar */}
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  AI
                </div>
              </div>
            </header>
            
            {/* Viewport Content */}
            <div className={styles.pageContainer}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
