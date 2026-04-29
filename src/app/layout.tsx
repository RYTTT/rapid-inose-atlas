import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import { Database, Home, Activity, Search, Settings, HelpCircle, FileText, FlaskConical, Beaker, Network } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RAPID-iNose™ Atlas",
  description: "Microbial VOC & Sensor Intelligence Atlas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.layoutContainer}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <Database size={24} color="var(--accent-primary)" />
              <span>RAPID-iNose™ Atlas</span>
            </div>
            
            <nav className={styles.navLinks}>
              <a href="/" className={`${styles.navItem} ${styles.navItemActive}`}>
                <Home size={18} />
                Atlas Home
              </a>
              <a href="/microbes" className={styles.navItem}>
                <Activity size={18} />
                Microbe Explorer
              </a>
              <a href="/conditions" className={styles.navItem}>
                <Beaker size={18} />
                Condition Explorer
              </a>
              <a href="/sensors" className={styles.navItem}>
                <Network size={18} />
                Sensor Viewer
              </a>
              <a href="/metabolites" className={styles.navItem}>
                <FlaskConical size={18} />
                Metabolite Explorer
              </a>
              <a href="/reports" className={styles.navItem}>
                <FileText size={18} />
                Reports & Export
              </a>
            </nav>
            
            <div style={{ marginTop: 'auto', padding: '16px 12px' }}>
              <a href="#" className={styles.navItem}>
                <Settings size={18} />
                Settings
              </a>
              <a href="#" className={styles.navItem}>
                <HelpCircle size={18} />
                Help & Support
              </a>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={styles.mainContent}>
            {/* Topbar */}
            <header className={styles.topbar}>
              <div className={styles.pageTitle}>Dashboard</div>
              <div className={styles.topbarActions}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: 10, top: 8 }} />
                  <input 
                    type="text" 
                    placeholder="Search database..." 
                    style={{ 
                      background: 'var(--bg-tertiary)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '16px',
                      padding: '8px 16px 8px 36px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }} 
                  />
                </div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  A
                </div>
              </div>
            </header>
            
            {/* Page Content */}
            <div className={styles.pageContainer}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
