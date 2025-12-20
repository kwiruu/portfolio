import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import gsap from "gsap";
import * as THREE from "three";

// Object positions to look at during the tour
// Order: About Me (PictureFrame), Technical Skills (Board), Projects (PC), Certificates (TrophyCup)
const TOUR_LOOK_TARGETS = [
  {
    name: "About Me",
    // PictureFrame position
    lookAt: [0.3, 0.7, 1.8] as [number, number, number],
  },
  {
    name: "Technical Skills",
    // Board position
    lookAt: [-1.4, 1.1, -2.7] as [number, number, number],
  },
  {
    name: "Projects",
    // PC position
    lookAt: [2.2, 1.15, -4.5] as [number, number, number],
  },
  {
    name: "Certifications",
    // TrophyCup position
    lookAt: [5.04, 1.21, 0.44] as [number, number, number],
  },
];

// Fixed camera position during tour (center of the room at eye level)
const TOUR_CAMERA_POSITION: [number, number, number] = [3.265, 1.78, 2.24];

export default function TourController() {
  const { camera, gl } = useThree();
  const viewMode = useStore((state) => state.viewMode);
  const isTourActive = useStore((state) => state.isTourActive);
  const endTour = useStore((state) => state.endTour);

  const isAnimating = useRef(false);
  const hasStartedTour = useRef(false);
  const currentStepRef = useRef(0);

  // Start tour animation when tour becomes active
  useEffect(() => {
    if (!isTourActive || viewMode !== "TOUR_MODE") {
      hasStartedTour.current = false;
      currentStepRef.current = 0;
      return;
    }

    if (hasStartedTour.current) return;
    hasStartedTour.current = true;

    // Set camera to fixed position and initial look direction to match Scene setup
    const camRef = { current: camera };
    camRef.current.position.set(...TOUR_CAMERA_POSITION);
    camRef.current.up.set(0, 1, 0);
    camRef.current.rotation.order = "YXZ";
    camRef.current.lookAt(new THREE.Vector3(0, 1.7, 160));
    // Normalize rotation to YXZ to avoid inverted pitch at start
    const startEuler = new THREE.Euler().setFromQuaternion(
      camRef.current.quaternion,
      "YXZ"
    );
    camRef.current.rotation.set(startEuler.x, startEuler.y, 0, "YXZ");

    // Try to lock the pointer (cursor) during the tour, similar to FPS mode
    setTimeout(() => {
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      }
    }, 50);

    // Function to look north and then end tour
    const lookNorthAndEndTour = () => {
      isAnimating.current = true;

      // North direction: looking along negative Z axis (yaw = 0)
      const targetYaw = 0;
      const targetPitch = 0; // Level with horizon

      const progress = {
        rotX: camera.rotation.x,
        rotY: camera.rotation.y,
      };

      gsap.to(progress, {
        rotX: targetPitch,
        rotY: targetYaw,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.rotation.set(progress.rotX, progress.rotY, 0, "YXZ");
        },
        onComplete: () => {
          isAnimating.current = false;
          // Keep pointer locked seamlessly into FPS after tour
          if (document.pointerLockElement !== gl.domElement) {
            gl.domElement.requestPointerLock();
          }
          // End tour and enter FPS mode to explore freely
          endTour();
        },
      });
    };

    // Function to animate to a specific step
    const animateToStep = (stepIndex: number) => {
      if (stepIndex >= TOUR_LOOK_TARGETS.length) {
        // Tour complete, look north then enter FPS mode
        setTimeout(() => {
          lookNorthAndEndTour();
        }, 500);
        return;
      }

      isAnimating.current = true;
      currentStepRef.current = stepIndex;
      const target = TOUR_LOOK_TARGETS[stepIndex];

      const cameraPos = new THREE.Vector3(...TOUR_CAMERA_POSITION);
      const lookAtPos = new THREE.Vector3(...target.lookAt);

      // Calculate the direction to look at
      const direction = new THREE.Vector3()
        .subVectors(lookAtPos, cameraPos)
        .normalize();

      // Calculate target yaw (Y rotation) and pitch (X rotation) from direction
      const targetYaw = Math.atan2(-direction.x, -direction.z);
      const targetPitch = Math.asin(direction.y);

      // Animation progress object
      const progress = {
        rotX: camera.rotation.x,
        rotY: camera.rotation.y,
      };

      // Animate camera rotation to look at the target
      gsap.to(progress, {
        rotX: targetPitch,
        rotY: targetYaw,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.rotation.set(progress.rotX, progress.rotY, 0, "YXZ");
        },
        onComplete: () => {
          isAnimating.current = false;
          // Wait a moment then move to next target
          setTimeout(() => {
            animateToStep(stepIndex + 1);
          }, 1000); // Pause for 1 second at each object
        },
      });
    };

    // Start looking at objects sequentially after a brief pause
    setTimeout(() => {
      animateToStep(0);
    }, 1000); // 1 second pause before first target
  }, [isTourActive, viewMode, camera, gl.domElement, endTour]);

  return null;
}
