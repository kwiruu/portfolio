import { useEffect, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface InteractiveObjectProps {
  position: [number, number, number];
  color: string;
  objectData: {
    id: string;
    title: string;
    content: string;
  };
}

export default function InteractiveObject({
  position,
  color,
  objectData,
}: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLookingAt, setIsLookingAt] = useState(false);
  const { camera } = useThree();
  const viewObject = useStore((state) => state.viewObject);
  const viewMode = useStore((state) => state.viewMode);
  const targetedObject = useStore((state) => state.targetedObject);
  const setTargetedObject = useStore((state) => state.setTargetedObject);

  // Animate object
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;

      // Gentle floating animation
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Scale up when hovered
      const targetScale = isHovered ? 1.2 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  // Check if camera is looking at this object
  useFrame(() => {
    if (viewMode !== "FPS_MODE" || !meshRef.current) {
      setIsLookingAt(false);
      return;
    }

    const raycaster = new THREE.Raycaster();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    raycaster.set(camera.position, cameraDirection);

    const intersects = raycaster.intersectObject(meshRef.current);

    if (intersects.length > 0 && intersects[0].distance < 5) {
      setIsLookingAt(true);
    } else {
      setIsLookingAt(false);
    }
  });

  useEffect(() => {
    if (isLookingAt) {
      setTargetedObject(objectData);
    } else if (targetedObject?.id === objectData.id) {
      setTargetedObject(null);
    }
  }, [isLookingAt, objectData, setTargetedObject, targetedObject]);

  useEffect(() => {
    return () => {
      if (targetedObject?.id === objectData.id) {
        setTargetedObject(null);
      }
    };
  }, [objectData, setTargetedObject, targetedObject]);

  // Handle interaction
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (viewMode !== "FPS_MODE") return;
    e.stopPropagation();
    viewObject(objectData);
  };

  // Handle hover effects
  const handlePointerOver = (e: ThreeEvent<MouseEvent>) => {
    if (viewMode !== "FPS_MODE") return;
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    document.body.style.cursor = "default";
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
      >
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered || isLookingAt ? 0.5 : 0.2}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Interaction prompt */}
      {isLookingAt && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Press E or Click to interact
        </Text>
      )}

      {/* Title label */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {objectData.title}
      </Text>
    </group>
  );
}
