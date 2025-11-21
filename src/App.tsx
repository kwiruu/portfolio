import "./App.css";
import Scene from "./components/Scene";
import WebsiteOverlay from "./components/WebsiteOverlay";
import ObjectViewer from "./components/ObjectViewer";
import ControlsInfo from "./components/ControlsInfo";

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* 3D Scene (always rendered in background) */}
      <Scene />

      {/* Website Mode Overlay */}
      <WebsiteOverlay />

      {/* Object Viewer Modal */}
      <ObjectViewer />

      {/* Controls Info */}
      <ControlsInfo />
    </div>
  );
}

export default App;
