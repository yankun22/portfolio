import { AudioEngineProvider } from './context/AudioEngineContext';
import { HeaderBar } from './components/layout/HeaderBar';
import { TransportControls } from './components/layout/TransportControls';
import { WaveformEditor } from './components/waveform/WaveformEditor';
import { FxRack } from './components/fx/FxRack';
import { DrumPadGrid } from './components/drumpad/DrumPadGrid';
import { VisualizerPanel } from './components/visualizer/VisualizerPanel';
import { MasterStrip } from './components/layout/MasterStrip';
import { ToastContainer } from './components/common/ToastContainer';

export function App() {
  return (
    <AudioEngineProvider>
      <div className="daw-container">
        {/* Top Studio Header */}
        <HeaderBar />

        {/* Transport & Timeline Control Bar */}
        <TransportControls />

        {/* Interactive Wavesurfer Waveform & Slicer */}
        <WaveformEditor />

        {/* 60fps Real-Time Oscilloscope & Spectrum Visualizer */}
        <VisualizerPanel />

        {/* 8-Pad Synthesized Drum Soundboard */}
        <DrumPadGrid />

        {/* Real-Time Audio FX Rack */}
        <FxRack />

        {/* Master Output & Routing Strip */}
        <MasterStrip />

        {/* Toast Notification Container */}
        <ToastContainer />
      </div>
    </AudioEngineProvider>
  );
}

export default App;
