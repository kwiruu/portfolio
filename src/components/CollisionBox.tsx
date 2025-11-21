import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useCollisionStore } from "../store/useCollisionStore";

interface CollisionBoxProps {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  visible?: boolean; // For debugging
}

export default function CollisionBox({
  id,
  position,
  size,
  visible = false,
}: CollisionBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const addCollisionBox = useCollisionStore((state) => state.addCollisionBox);
  const removeCollisionBox = useCollisionStore(
    (state) => state.removeCollisionBox
  );

  useEffect(() => {
    if (!meshRef.current) return;

    // Create bounding box from the mesh geometry
    const geometry = meshRef.current.geometry;
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox!.clone();

    // Apply position to the bounding box
    const matrix = new THREE.Matrix4().makeTranslation(
      position[0],
      position[1],
      position[2]
    );
    boundingBox.applyMatrix4(matrix);

    // Add to collision store
    addCollisionBox(id, boundingBox);

    // Cleanup on unmount
    return () => {
      removeCollisionBox(id);
    };
  }, [id, position, size, addCollisionBox, removeCollisionBox]);

  return (
    <mesh ref={meshRef} position={position} visible={visible}>
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
