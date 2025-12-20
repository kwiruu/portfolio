import "./App.css";
import Scene from "./components/Scene";
import WebsiteOverlay from "./components/WebsiteOverlay";
import ObjectViewer from "./components/ObjectViewer";
import ControlsInfo from "./components/ControlsInfo";
import SplitModeOverlay from "./components/SplitModeOverlay";
import ProjectsOverlay from "./components/ProjectsOverlay";
import AboutOverlay from "./components/AboutOverlay";
import TechnicalOverlay from "./components/TechnicalOverlay";

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* 3D Scene (always rendered in background) */}
      <Scene />

      {/* Website Mode Overlay */}
      <WebsiteOverlay />

      {/* Split Mode Overlay (left half with content, right half shows 3D) */}
      <SplitModeOverlay />
      <ProjectsOverlay />
      <AboutOverlay />
      <TechnicalOverlay />

      {/* Object Viewer Modal */}
      <ObjectViewer />

      {/* Controls Info */}
      <ControlsInfo />
    </div>
  );
}

export default App;
