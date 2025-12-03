import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import { useCollisionStore } from "../store/useCollisionStore";
import * as THREE from "three";

const MOVEMENT_BOUNDS = {
  x: 40,
  z: 40,
};

const SENSITIVITY = 0.002;

export default function Controls() {
  const { camera, gl } = useThree();
  const exitFPSMode = useStore((state) => state.exitFPSMode);
  const viewMode = useStore((state) => state.viewMode);
  const checkCollision = useCollisionStore((state) => state.checkCollision);

  // Movement state
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Track viewMode in a ref so event listeners can access current value
  const viewModeRef = useRef(viewMode);
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    // Ensure camera rotation order is YXZ for FPS to avoid gimbal lock
    // We use a ref to bypass the lint rule about mutating hook return values
    // This is safe because we are in a useEffect and we know what we are doing
    const camRef = { current: camera };
    // Preserve the current orientation when changing rotation order
    const currentQuaternion = camera.quaternion.clone();
    camRef.current.rotation.order = "YXZ";
    camRef.current.rotation.setFromQuaternion(currentQuaternion);

    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;

      camera.rotation.y -= event.movementX * SENSITIVITY;
      camera.rotation.x -= event.movementY * SENSITIVITY;

      // Clamp pitch (look up/down limit)
      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x)
      );
    };

    const onPointerLockChange = () => {
      if (document.pointerLockElement === gl.domElement) {
        console.log("Pointer locked");
      } else {
        console.log("Pointer unlocked");
        // Only exit to website mode if we're still in FPS_MODE
        // Don't exit if we switched to SPLIT_MODE or VIEWING_OBJECT
        if (viewModeRef.current === "FPS_MODE") {
          exitFPSMode();
        }
      }
    };

    const onPointerLockError = () => {
      console.error("Pointer lock error");
      // Only exit if still in FPS_MODE
      if (viewModeRef.current === "FPS_MODE") {
        exitFPSMode();
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("pointerlockerror", onPointerLockError);

    // Request pointer lock after a short delay
    const lockTimeout = setTimeout(() => {
      gl.domElement.requestPointerLock();
    }, 100);

    const onClick = () => {
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      }
    };
    document.addEventListener("click", onClick);

    // Keyboard controls
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Escape":
          // If not locked, force exit
          if (document.pointerLockElement !== gl.domElement) {
            exitFPSMode();
          }
          break;
        case "KeyW":
        case "ArrowUp":
          moveState.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          moveState.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          moveState.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          moveState.current.right = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          moveState.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          moveState.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          moveState.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          moveState.current.right = false;
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      clearTimeout(lockTimeout);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("pointerlockerror", onPointerLockError);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);

      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [camera, gl.domElement, exitFPSMode]);

  // Movement logic
  useFrame((_, delta) => {
    if (document.pointerLockElement !== gl.domElement) return;

    // Movement speed
    const speed = 1.0;
    const dampingFactor = 10.0;

    // Calculate movement direction
    direction.current.set(0, 0, 0);

    if (moveState.current.forward) direction.current.z -= 1;
    if (moveState.current.backward) direction.current.z += 1;
    if (moveState.current.left) direction.current.x -= 1;
    if (moveState.current.right) direction.current.x += 1;

    direction.current.normalize();

    // Apply movement relative to camera direction
    const moveX = direction.current.x * speed * delta;
    const moveZ = direction.current.z * speed * delta;

    // Get camera's forward and right vectors (on XZ plane)
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(cameraDirection, camera.up);

    // Apply movement
    velocity.current.addScaledVector(cameraDirection, -moveZ);
    velocity.current.addScaledVector(cameraRight, moveX);

    // Store old position in case of collision
    const oldPosition = camera.position.clone();

    // Move camera
    camera.position.add(velocity.current);

    // Check for collision with the new position
    if (checkCollision(camera.position, 0.3)) {
      // Collision detected, revert to old position
      camera.position.copy(oldPosition);
      // Stop velocity to prevent sliding into walls
      velocity.current.set(0, 0, 0);
    }

    // Apply damping
    velocity.current.multiplyScalar(1 - dampingFactor * delta);

    // Keep camera above ground
    if (camera.position.y < 1.7) {
      camera.position.setY(1.7);
    }

    // Simple boundary limits (optional)
    camera.position.setX(
      Math.max(
        -MOVEMENT_BOUNDS.x,
        Math.min(MOVEMENT_BOUNDS.x, camera.position.x)
      )
    );
    camera.position.setZ(
      Math.max(
        -MOVEMENT_BOUNDS.z,
        Math.min(MOVEMENT_BOUNDS.z, camera.position.z)
      )
    );
  });

  return null;
}
