import { create } from "zustand";
import * as THREE from "three";

interface CollisionBox {
  id: string;
  box: THREE.Box3;
}

interface CollisionState {
  collisionBoxes: CollisionBox[];
  addCollisionBox: (id: string, box: THREE.Box3) => void;
  removeCollisionBox: (id: string) => void;
  clearCollisionBoxes: () => void;
  checkCollision: (position: THREE.Vector3, radius?: number) => boolean;
}

export const useCollisionStore = create<CollisionState>((set, get) => ({
  collisionBoxes: [],

  addCollisionBox: (id: string, box: THREE.Box3) =>
    set((state) => ({
      collisionBoxes: [...state.collisionBoxes, { id, box }],
    })),

  removeCollisionBox: (id: string) =>
    set((state) => ({
      collisionBoxes: state.collisionBoxes.filter((cb) => cb.id !== id),
    })),

  clearCollisionBoxes: () => set({ collisionBoxes: [] }),

  checkCollision: (position: THREE.Vector3, radius = 0.5) => {
    const { collisionBoxes } = get();

    // Create a bounding sphere around the player position
    const playerSphere = new THREE.Sphere(position, radius);

    for (const { box } of collisionBoxes) {
      // Check if the player sphere intersects with any collision box
      if (box.intersectsSphere(playerSphere)) {
        return true; // Collision detected
      }
    }

    return false; // No collision
  },
}));
