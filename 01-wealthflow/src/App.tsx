import { WealthProvider } from './context/WealthContext';
import { useWealth } from './context/useWealth';
import { Navbar } from './components/layout/Navbar';
import { HeaderStats } from './components/layout/HeaderStats';
import { PortfolioOverview } from './components/portfolio/PortfolioOverview';
import { MonteCarloView } from './components/monteCarlo/MonteCarloView';
import { FireView } from './components/fire/FireView';
import { RebalanceAdvisor } from './components/portfolio/RebalanceAdvisor';
import { ExportView } from './components/export/ExportView';
import { ToastContainer } from './components/common/ToastContainer';
import { HardDrive } from 'lucide-react';

const WealthAppContent: React.FC = () => {
  const { activeTab } = useWealth();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'monte-carlo':
        return <MonteCarloView />;
      case 'fire':
        return <FireView />;
      case 'rebalance':
        return <RebalanceAdvisor />;
      case 'export':
        return <ExportView />;
      case 'portfolio':
      default:
        return <PortfolioOverview />;
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Top Navigation */}
        <Navbar />

        {/* Top Global KPI Summary Cards */}
        <div style={{ marginTop: '24px' }}>
          <HeaderStats />
        </div>

        {/* Active Tab View */}
        <main style={{ minHeight: '520px' }}>{renderActiveView()}</main>

        {/* Subtle Footer */}
        <footer
          style={{
            marginTop: '48px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.775rem',
            color: 'var(--text-dim)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={14} color="#10b981" />
            <span>Local Storage Active: All portfolio & simulation data auto-saved in browser</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>WealthFlow™ v1.0 • Institutional Wealth & Monte Carlo Suite</span>
          </div>
        </footer>

        {/* Global Toast */}
        <ToastContainer />
      </div>
    </div>
  );
};

export function App() {
  return (
    <WealthProvider>
      <WealthAppContent />
    </WealthProvider>
  );
}

export default App;
