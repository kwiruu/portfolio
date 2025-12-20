import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useCollisionStore } from "../store/useCollisionStore";

interface CollisionBoxProps {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  visible?: boolean; // For debugging
  rotation?: [number, number, number];
}

export default function CollisionBox({
  id,
  position,
  size,
  visible = false,
  rotation = [0, 0, 0],
}: CollisionBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const addCollisionBox = useCollisionStore((state) => state.addCollisionBox);
  const removeCollisionBox = useCollisionStore(
    (state) => state.removeCollisionBox
  );

  useEffect(() => {
    if (!meshRef.current) return;

    // Create OBB data for proper rotated collision detection
    const center = new THREE.Vector3(position[0], position[1], position[2]);
    const halfSize = new THREE.Vector3(size[0] / 2, size[1] / 2, size[2] / 2);

    // Create rotation matrix
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(rotation[0], rotation[1], rotation[2])
    );

    // Also create a regular bounding box for fallback/debug
    const boundingBox = new THREE.Box3().setFromCenterAndSize(
      center,
      new THREE.Vector3(size[0], size[1], size[2])
    );

    // Add to collision store with OBB data
    addCollisionBox(id, boundingBox, center, halfSize, rotationMatrix);

    // Cleanup on unmount
    return () => {
      removeCollisionBox(id);
    };
  }, [id, position, size, rotation, addCollisionBox, removeCollisionBox]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      visible={visible}
      rotation={rotation}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial
        color="#ff0000"
        transparent
        opacity={0.3}
        wireframe={visible}
      />
    </mesh>
  );
}
