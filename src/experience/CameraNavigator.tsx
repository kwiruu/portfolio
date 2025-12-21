import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import * as THREE from "three";
import gsap from "gsap";

/**
 * CameraNavigator - Animates the camera when navigating between split mode overlays
 * Listens to cameraTarget changes in the store and smoothly transitions the camera
 */
export default function CameraNavigator() {
  const { camera } = useThree();
  const cameraTarget = useStore((state) => state.cameraTarget);
  const setCameraTarget = useStore((state) => state.setCameraTarget);
  const viewMode = useStore((state) => state.viewMode);

  const isTransitioning = useRef(false);
  const transitionProgress = useRef({
    posX: 0,
    posY: 0,
    posZ: 0,
    rotX: 0,
    rotY: 0,
  });

  // Animate camera when cameraTarget changes
  useEffect(() => {
    if (!cameraTarget || viewMode !== "SPLIT_MODE") return;

    const targetPos = new THREE.Vector3(...cameraTarget.position);
    const lookAtPos = new THREE.Vector3(...cameraTarget.lookAt);

    // Calculate the direction to look at
    const direction = new THREE.Vector3()
      .subVectors(lookAtPos, targetPos)
      .normalize();

    // Calculate target yaw (Y rotation) and pitch (X rotation) from direction
    const targetYaw = Math.atan2(-direction.x, -direction.z);
    const targetPitch = Math.asin(direction.y);

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
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        isTransitioning.current = false;
        // Clear the target after animation completes
        setCameraTarget(null);
      },
    });
  }, [cameraTarget, camera, viewMode, setCameraTarget]);

  // Apply camera position/rotation during transition
  useFrame(() => {
    if (!isTransitioning.current) return;

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
  });

  return null;
}
