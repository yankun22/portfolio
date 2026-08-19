import { CanvasProvider, useCanvas } from './context/CanvasContext';
import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { InfiniteCanvas } from './components/InfiniteCanvas';
import { MiniMap } from './components/MiniMap';
import { ExportModal } from './components/ExportModal';

const AppContent: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen } = useCanvas();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Top Header Navbar */}
      <Navbar />

      {/* Floating Center Tools Bar */}
      <Toolbar />

      {/* Left Properties Panel */}
      <PropertiesPanel />

      {/* Infinite Canvas */}
      <InfiniteCanvas />

      {/* Bottom Right Mini-map Radar */}
      <MiniMap />

      {/* Export Dialogue */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <CanvasProvider>
      <AppContent />
    </CanvasProvider>
  );
}

export default App;
