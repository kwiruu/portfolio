import { create } from "zustand";
import * as THREE from "three";

interface CollisionBox {
  id: string;
  box: THREE.Box3;
  // For OBB collision detection
  center: THREE.Vector3;
  halfSize: THREE.Vector3;
  rotation: THREE.Matrix4;
  invRotation: THREE.Matrix4;
}

interface CollisionState {
  collisionBoxes: CollisionBox[];
  addCollisionBox: (
    id: string,
    box: THREE.Box3,
    center: THREE.Vector3,
    halfSize: THREE.Vector3,
    rotation: THREE.Matrix4
  ) => void;
  removeCollisionBox: (id: string) => void;
  clearCollisionBoxes: () => void;
  checkCollision: (position: THREE.Vector3, radius?: number) => boolean;
}

export const useCollisionStore = create<CollisionState>((set, get) => ({
  collisionBoxes: [],

  addCollisionBox: (
    id: string,
    box: THREE.Box3,
    center: THREE.Vector3,
    halfSize: THREE.Vector3,
    rotation: THREE.Matrix4
  ) => {
    const invRotation = rotation.clone().invert();
    set((state) => ({
      collisionBoxes: [
        ...state.collisionBoxes,
        { id, box, center, halfSize, rotation, invRotation },
      ],
    }));
  },

  removeCollisionBox: (id: string) =>
    set((state) => ({
      collisionBoxes: state.collisionBoxes.filter((cb) => cb.id !== id),
    })),

  clearCollisionBoxes: () => set({ collisionBoxes: [] }),

  checkCollision: (position: THREE.Vector3, radius = 0.5) => {
    const { collisionBoxes } = get();

    for (const { center, halfSize, invRotation } of collisionBoxes) {
      // Transform the player position into the OBB's local space
      const localPos = position.clone().sub(center).applyMatrix4(invRotation);

      // Find the closest point on the box to the player (in local space)
      const closestPoint = new THREE.Vector3(
        Math.max(-halfSize.x, Math.min(halfSize.x, localPos.x)),
        Math.max(-halfSize.y, Math.min(halfSize.y, localPos.y)),
        Math.max(-halfSize.z, Math.min(halfSize.z, localPos.z))
      );

      // Check distance from player to closest point
      const distance = localPos.distanceTo(closestPoint);

      if (distance < radius) {
        return true; // Collision detected
      }
    }

    return false; // No collision
  },
}));
