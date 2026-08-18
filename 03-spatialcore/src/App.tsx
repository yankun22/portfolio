import { StudioProvider } from './context/StudioContext';
import { Navbar } from './components/layout/Navbar';
import { StudioCanvas } from './components/canvas/StudioCanvas';
import { StudioToolbar } from './components/controls/StudioToolbar';
import { CameraViewBar } from './components/controls/CameraViewBar';
import { CustomizerSidebar } from './components/customizer/CustomizerSidebar';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { SnapshotModal } from './components/controls/SnapshotModal';
import { ToastContainer } from './components/common/ToastContainer';

export function App() {
  return (
    <StudioProvider>
      <div className="spatial-app">
        {/* Top Navigation */}
        <Navbar />

        {/* Studio Workspace */}
        <div className="studio-workspace">
          {/* 3D WebGL Canvas Viewport */}
          <StudioCanvas />

          {/* Floating Studio Controls HUD */}
          <StudioToolbar />

          {/* Floating Camera View Bar */}
          <CameraViewBar />

          {/* Right Customizer Panel */}
          <CustomizerSidebar />
        </div>

        {/* Slide-out Cart Drawer */}
        <CartDrawer />

        {/* Checkout Modal */}
        <CheckoutModal />

        {/* 4K Snapshot Modal */}
        <SnapshotModal />

        {/* Toast Alerts */}
        <ToastContainer />
      </div>
    </StudioProvider>
  );
}

export default App;
