"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import "./globals.css";
import styles from "./layout.module.css";
import { 
  Database, Home, Activity, Beaker, Network, FlaskConical, ShieldAlert, 
  GitCompare, Cpu, Brain, Users, ShieldCheck, Search, FileText, Lock, Eye, Menu, X
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

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

  const navGroups = [
    {
      label: 'Explore',
      items: [
        { href: '/', label: 'Overview', icon: Home },
        { href: '/microbes', label: 'Microbe Explorer', icon: Activity },
        { href: '/amr-biofilm', label: 'AMR & Resistance', icon: ShieldAlert },
      ],
    },
    {
      label: 'Science',
      items: [
        { href: '/sensors', label: 'Sensor Data', icon: Network },
        { href: '/metabolites', label: 'Metabolites (VOCs)', icon: FlaskConical },
        { href: '/conditions', label: 'Growth Conditions', icon: Beaker },
      ],
    },
    {
      label: 'Platform',
      items: [
        { href: '/ai-models', label: 'AI Models', icon: Brain },
        { href: '/compare', label: 'Compare Lab', icon: GitCompare },
        { href: '/sensor-optimizer', label: 'Sensor Optimizer', icon: Cpu },
      ],
    },
    {
      label: 'Business',
      items: [
        { href: '/customer-solutions', label: 'Customer Solutions', icon: Users },
        { href: '/reports', label: 'Reports & Export', icon: FileText },
        { href: '/governance', label: 'Governance & IP', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <html lang="en">
      <head>
        <title>RAPID-iNose™ Microbial VOC & Sensor Intelligence Atlas</title>
        <meta name="description" content="Microbial VOC & Nanosensor Response Intelligence Atlas" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <div className={styles.layoutContainer}>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className={styles.sidebarOverlay} onClick={closeSidebar} />
          )}
          {/* Left Sidebar */}
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
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
              {navGroups.map((group) => (
                <div key={group.label}>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 12px 4px' }}>
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                        onClick={closeSidebar}
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
            
            {/* Sidebar Footer: Maturity Tier Selector */}
            <div style={{ marginTop: 'auto', padding: '14px 12px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Data Tier</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['Bronze', 'Silver', 'Gold'] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => handleTierChange(tier)}
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      borderRadius: '8px',
                      border: `1px solid ${dataTier === tier ? (tier === 'Gold' ? '#f59e0b' : tier === 'Silver' ? '#3b82f6' : '#10b981') : 'var(--border-color)'}`,
                      background: dataTier === tier ? (tier === 'Gold' ? 'rgba(245,158,11,0.15)' : tier === 'Silver' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)') : 'transparent',
                      color: dataTier === tier ? (tier === 'Gold' ? '#f59e0b' : tier === 'Silver' ? '#60a5fa' : '#34d399') : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className={styles.mainContent}>
            {/* Topbar Header — simplified for investors */}
            <header className={styles.topbar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className={styles.menuToggle}
                  onClick={() => setSidebarOpen(prev => !prev)}
                  aria-label="Toggle menu"
                >
                  {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.3px' }}>
                  RAPID-iNose™
                </span>
                <span className="hide-mobile" style={{ height: 14, width: 1, background: 'var(--border-color)' }}></span>
                <span className="hide-mobile" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Microbial Intelligence Atlas</span>
              </div>

              <div className={styles.topbarActions}>
                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                  <Search size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: 12, top: 9 }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search organisms, sensors..."
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '20px',
                      padding: '7px 16px 7px 34px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '0.82rem',
                      width: '220px',
                    }}
                  />
                </form>

                {/* View Mode Toggle */}
                <button
                  onClick={() => handleModeChange(viewMode === 'Customer' ? 'Internal R&D' : 'Customer')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: viewMode === 'Internal R&D' ? 'rgba(139,92,246,0.18)' : 'var(--bg-tertiary)',
                    color: viewMode === 'Internal R&D' ? '#c084fc' : 'var(--text-secondary)',
                    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {viewMode === 'Internal R&D' ? <Lock size={13} /> : <Eye size={13} />}
                  <span>{viewMode}</span>
                </button>

                {/* Status dot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  Live
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
