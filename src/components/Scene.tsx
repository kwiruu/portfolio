import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import Room from "../experience/Room";
import Controls from "../experience/Controls";
import TourController from "../experience/TourController";
import SplitModeParallax from "../experience/SplitModeParallax";
import * as THREE from "three";

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(3.265, 1.78, 2.24);
    camera.lookAt(new THREE.Vector3(0, 1.7, 160));
  }, [camera]);
  return null;
}

export default function Scene() {
  const viewMode = useStore((state) => state.viewMode);

  return (
    <Canvas
      camera={{
        position: [40, 1.7, 5],
        fov: 75,
      }}
      className="fixed top-0 left-0 w-full h-full z-[1]"
      style={{ background: "#fff" }}
    >
      <CameraSetup />
      <SplitModeParallax />
      {/* Main 3D Room */}
      <Room />
      {/* FPS Controls (only active in FPS_MODE) */}
      {viewMode === "FPS_MODE" && <Controls />}
      {/* Tour Controller (only active in TOUR_MODE) */}
      {viewMode === "TOUR_MODE" && <TourController />}
    </Canvas>
  );
}
