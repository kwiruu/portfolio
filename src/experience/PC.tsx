import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useStore } from "../store/useStore";
import * as THREE from "three";
import gsap from "gsap";

interface PCProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  // Maximum distance to interact with the PC
  interactionRange?: number;
  // Camera position and look-at target when entering split mode
  cameraTarget?: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
}

// Default camera position for split mode view
const DEFAULT_CAMERA_TARGET = {
  position: [0, 5, 8] as [number, number, number],
  lookAt: [0, 0, 0] as [number, number, number],
};

export default function PC({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  interactionRange = 2.5,
  cameraTarget = DEFAULT_CAMERA_TARGET,
}: PCProps) {
  const { scene } = useGLTF("/src/assets/pc.glb");
  const groupRef = useRef<THREE.Group>(null);
  const pcRef = useRef<THREE.Group>(null);
  const [isLookingAt, setIsLookingAt] = useState(false);
  const { camera } = useThree();
  const viewMode = useStore((state) => state.viewMode);
  const enterSplitMode = useStore((state) => state.enterSplitMode);

  // Clone the scene only once using useMemo
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Reusable raycaster to avoid creating new objects every frame
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const cameraDirection = useMemo(() => new THREE.Vector3(), []);

  // State for camera transition
  const isTransitioning = useRef(false);
  const transitionProgress = useRef({
    posX: 0,
    posY: 0,
    posZ: 0,
    rotX: 0,
    rotY: 0,
  });

  // Animate camera during transition
  useFrame(() => {
    if (isTransitioning.current) {
      camera.position.set(
        transitionProgress.current.posX,
        transitionProgress.current.posY,
        transitionProgress.current.posZ
      );
      camera.rotation.set(
        transitionProgress.current.rotX,
        transitionProgress.current.rotY,
        0,
        "YXZ"
      );
    }
  });

  // Check if camera is looking at this object
  useFrame(() => {
    if (viewMode !== "FPS_MODE" || !pcRef.current || isTransitioning.current) {
      setIsLookingAt(false);
      return;
    }

    camera.getWorldDirection(cameraDirection);
    raycaster.set(camera.position, cameraDirection);

    // Only raycast against the PC model, not other children like sprites
    const intersects = raycaster.intersectObjects(pcRef.current.children, true);

    // Check if PC is within interaction range
    const pcPosition = new THREE.Vector3(...position);
    const distanceToPC = camera.position.distanceTo(pcPosition);

    if (
      intersects.length > 0 &&
      intersects[0].distance < 5 &&
      distanceToPC <= interactionRange
    ) {
      if (!isLookingAt) setIsLookingAt(true);
    } else {
      if (isLookingAt) setIsLookingAt(false);
    }
  });

  // Handle interaction (called by both E key and click)
  const handleInteraction = () => {
    // Calculate target position and rotation
    const targetPos = new THREE.Vector3(...cameraTarget.position);
    const lookAtPos = new THREE.Vector3(...cameraTarget.lookAt);

    // Calculate the direction to look at
    const direction = new THREE.Vector3()
      .subVectors(lookAtPos, targetPos)
      .normalize();

    // Calculate target yaw (Y rotation) and pitch (X rotation) from direction
    const targetYaw = Math.atan2(-direction.x, -direction.z);
    const targetPitch = Math.asin(direction.y);

    // IMPORTANT: Enter split mode FIRST, then release pointer lock
    // This prevents the Controls onPointerLockChange from triggering exitFPSMode
    enterSplitMode("projects");

    // Now release pointer lock
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }

    // Set up transition starting values
    transitionProgress.current = {
      posX: camera.position.x,
      posY: camera.position.y,
      posZ: camera.position.z,
      rotX: camera.rotation.x,
      rotY: camera.rotation.y,
    };
    isTransitioning.current = true;

    // Smooth camera transition using gsap
    gsap.to(transitionProgress.current, {
      posX: targetPos.x,
      posY: targetPos.y,
      posZ: targetPos.z,
      rotX: targetPitch,
      rotY: targetYaw,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        isTransitioning.current = false;
      },
    });
  };

  // Listen for E key press or click when looking at PC
  useEffect(() => {
    if (!isLookingAt || viewMode !== "FPS_MODE") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "KeyE") {
        handleInteraction();
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Only trigger on left click (button 0)
      if (e.button === 0) {
        handleInteraction();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("click", handleClick);
    };
  }, [isLookingAt, viewMode, enterSplitMode, camera, cameraTarget]);

  // Lighten materials when looking at the PC
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material.emissive) {
          if (isLookingAt) {
            material.emissive.setHex(0x777777); // Slight emission to lighten
          } else {
            material.emissive.setHex(0x000000); // Reset to no emission
          }
        }
      }
    });
  }, [isLookingAt, clonedScene]);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* PC model - separate ref for raycasting */}
      <group ref={pcRef}>
        <primitive object={clonedScene} scale={scale} />
        {/* Invisible hitbox for easier targeting */}
        <mesh visible={false}>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  );
}

// Preload the PC model
useGLTF.preload("/src/assets/pc.glb");
