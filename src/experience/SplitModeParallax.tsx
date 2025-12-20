import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import * as THREE from "three";

const ACTIVATION_DELAY_MS = 800;
const MAX_ROTATION_OFFSET = 0.02;
const SMOOTHING = 0.06;

export default function SplitModeParallax() {
  const { camera } = useThree();
  const viewMode = useStore((state) => state.viewMode);
  const splitModeContent = useStore((state) => state.splitModeContent);

  const targetOffset = useRef({ x: 0, y: 0 });
  const baseQuaternion = useRef(new THREE.Quaternion());
  const right = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3());
  const targetEuler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const targetQuaternion = useRef(new THREE.Quaternion());
  const isActive = useRef(false);
  const activationTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const xNorm = (event.clientX / window.innerWidth - 0.5) * 2;
      const yNorm = (event.clientY / window.innerHeight - 0.5) * 2;
      targetOffset.current.x = THREE.MathUtils.clamp(xNorm, -1, 1);
      targetOffset.current.y = THREE.MathUtils.clamp(yNorm, -1, 1);
    };

    const overlayActive =
      viewMode === "SPLIT_MODE" &&
      (splitModeContent === "about" ||
        splitModeContent === "technical" ||
        splitModeContent === "projects" ||
        splitModeContent === "certifications");

    if (overlayActive) {
      window.addEventListener("mousemove", handleMouseMove);
      targetOffset.current.x = 0;
      targetOffset.current.y = 0;

      if (activationTimeout.current !== null) {
        window.clearTimeout(activationTimeout.current);
      }

      activationTimeout.current = window.setTimeout(() => {
        baseQuaternion.current.copy(camera.quaternion);
        isActive.current = true;
      }, ACTIVATION_DELAY_MS);
    } else {
      isActive.current = false;
    }

    return () => {
      if (activationTimeout.current !== null) {
        window.clearTimeout(activationTimeout.current);
        activationTimeout.current = null;
      }
      window.removeEventListener("mousemove", handleMouseMove);
      isActive.current = false;
    };
  }, [viewMode, splitModeContent, camera]);

  useFrame(() => {
    if (!isActive.current) return;

    const xOffset = targetOffset.current.x;
    const yOffset = targetOffset.current.y;

    right.current.set(1, 0, 0).applyQuaternion(baseQuaternion.current);
    up.current.set(0, 1, 0).applyQuaternion(baseQuaternion.current);

    targetEuler.current.setFromQuaternion(baseQuaternion.current, "YXZ");
    targetEuler.current.y += xOffset * MAX_ROTATION_OFFSET;
    targetEuler.current.x += -yOffset * MAX_ROTATION_OFFSET * 0.6;

    targetQuaternion.current.setFromEuler(targetEuler.current);
    camera.quaternion.slerp(targetQuaternion.current, SMOOTHING);
  });

  return null;
}
