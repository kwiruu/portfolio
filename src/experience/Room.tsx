import { useGLTF } from "@react-three/drei";
import { useMemo, useState, useEffect } from "react";
import TrophyCup from "./TrophyCup";
import PC from "./PC";
import PictureFrame from "./PictureFrame";
import Board from "./Board";
import CollisionBox from "../components/CollisionBox";

// Helper function to detect mobile devices
function checkIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  const touchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = window.innerWidth <= 1024 || window.innerHeight <= 768;
  return touchCapable || coarse || smallScreen;
}

// Camera targets for each interactive object
// Desktop: positioned for split-screen view (content on left, 3D on right)
// Mobile: positioned to show more of the scene in the smaller viewport
const CAMERA_TARGETS = {
  trophyCup: {
    desktop: {
      position: [2, 1.7, -0.5] as [number, number, number],
      lookAt: [70, 15, -20] as [number, number, number],
    },
    mobile: {
      position: [2, 1.7, 1.6] as [number, number, number],
      lookAt: [1.3, 0.5, 2.8] as [number, number, number],
    },
  },
  pc: {
    desktop: {
      position: [2, 1.7, -2.5] as [number, number, number],
      lookAt: [0, 1, -6] as [number, number, number],
    },
    mobile: {
      position: [2, 1.7, -2.5] as [number, number, number],
      lookAt: [-1, 1, -6] as [number, number, number],
    },
  },
  pictureFrame: {
    desktop: {
      position: [1.6, 1.7, 1.5] as [number, number, number],
      lookAt: [0.3, 0.5, 2.8] as [number, number, number],
    },
    mobile: {
      position: [2, 1.7, 1.6] as [number, number, number],
      lookAt: [1.3, 0.5, 2.8] as [number, number, number],
    },
  },
  board: {
    desktop: {
      position: [0, 1.7, -1.5] as [number, number, number],
      lookAt: [-2.5, 2, -1.7] as [number, number, number],
    },
    mobile: {
      position: [0, 1.7, -1.5] as [number, number, number],
      lookAt: [-2.5, 2, -1] as [number, number, number],
    },
  },
};

export default function Room() {
  const [isMobile, setIsMobile] = useState(checkIsMobile());

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load your 3D room model
  const roomModel = useMemo(
    () =>
      new URL(
        "../assets/vr_apartment_loft_interior__baked.glb",
        import.meta.url
      ).href,
    []
  );

  const { scene } = useGLTF(roomModel);

  return (
    <group>
      <ambientLight intensity={2} color="#ffffff" />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" />
      <directionalLight
        position={[-5, 8, -5]}
        intensity={1.5}
        color="#ffffff"
      />
      <pointLight position={[0.1, 2.2, 0]} intensity={1} distance={2000} />{" "}
      <pointLight position={[0, 2.7, 0.8]} intensity={1} distance={2000} />{" "}
      {/* Your custom 3D room model */}
      <primitive object={scene} scale={1} position={[0, 0, 0]} />
      {/* North wall */}
      <CollisionBox
        id="wall-north"
        position={[0, 1.5, -5.4]}
        size={[20, 3, 0.5]}
        visible={false}
      />
      {/* South wall */}
      <CollisionBox
        id="wall-south"
        position={[0, 1.5, 3]}
        size={[20, 3, 0.5]}
        visible={false}
      />
      {/* East wall */}
      <CollisionBox
        id="wall-east"
        position={[5.5, 1.5, 0]}
        size={[0.5, 3, 20]}
        visible={false}
      />
      {/* West wall */}
      <CollisionBox
        id="wall-west"
        position={[-3.3, 1.5, 0]}
        size={[0.5, 3, 20]}
        visible={false}
      />
      {/* Objects */}
      <CollisionBox
        id="pc-table"
        position={[2.3, 1, -4.4]}
        size={[3, 2, 0.4]}
        visible={false}
      />
      <CollisionBox
        id="pc-chair"
        position={[1.5, 1, -3.1]}
        size={[0.6, 2, 0.3]}
        visible={false}
      />
      <CollisionBox
        id="plant"
        position={[4.8, 1, -4.6]}
        size={[0.3, 2, 0.3]}
        visible={false}
      />
      <CollisionBox
        id="certificate-table"
        position={[4.8, 1, 0.5]}
        size={[0.6, 2, 2]}
        visible={false}
      />
      <CollisionBox
        id="shelf"
        position={[3.8, 1, 2.7]}
        size={[1.3, 2, 0.2]}
        visible={false}
      />
      <CollisionBox
        id="sofa"
        position={[-0.2, 1, 0.5]}
        size={[1, 2, 1]}
        visible={false}
      />
      <CollisionBox
        id="coffee-table"
        position={[0.3, 1, 1.7]}
        size={[0.2, 2, 0.2]}
        visible={false}
      />
      <CollisionBox
        id="white-board"
        position={[-1.45, 1, -2.75]}
        size={[2.3, 2, 0.2]}
        rotation={[0, 1.1, 0]}
        visible={false}
      />
      {/* Trophy Cup - Triggers Split Mode */}
      <TrophyCup
        position={[5.04, 1.21, 0.44]}
        scale={0.15}
        cameraTarget={
          isMobile
            ? CAMERA_TARGETS.trophyCup.mobile
            : CAMERA_TARGETS.trophyCup.desktop
        }
      />
      {/* PC - Triggers Projects Split Mode */}
      <PC
        position={[2.2, 1.15, -4.5]}
        scale={1}
        rotation={[0, 0, 0]}
        interactionRange={3}
        cameraTarget={
          isMobile ? CAMERA_TARGETS.pc.mobile : CAMERA_TARGETS.pc.desktop
        }
      />
      {/* Picture Frame - Triggers About Split Mode */}
      <PictureFrame
        position={[0.3, 0.7, 1.8]}
        scale={0.5}
        rotation={[0, 5.5, 0]}
        interactionRange={2.5}
        cameraTarget={
          isMobile
            ? CAMERA_TARGETS.pictureFrame.mobile
            : CAMERA_TARGETS.pictureFrame.desktop
        }
      />
      {/* Board - Triggers Technical Split Mode */}
      <Board
        position={[-1.4, 1.1, -2.7]}
        scale={0.8}
        rotation={[0, 1.15, 0]}
        interactionRange={3}
        cameraTarget={
          isMobile ? CAMERA_TARGETS.board.mobile : CAMERA_TARGETS.board.desktop
        }
      />
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload(
  new URL("../assets/vr_apartment_loft_interior__baked.glb", import.meta.url)
    .href
);
