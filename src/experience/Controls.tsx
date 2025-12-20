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
  const mobileMove = useStore((state) => state.mobileMove);
  const setMobileMove = useStore((state) => state.setMobileMove);
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

  const isMobileRef = useRef(false);
  useEffect(() => {
    const checkMobile = () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(max-width: 768px)").matches ||
        /Mobi|Android/i.test(navigator.userAgent));
    isMobileRef.current = checkMobile();

    const onResize = () => {
      isMobileRef.current = checkMobile();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Track if we've successfully locked the pointer at least once
  const hasLockedOnce = useRef(false);

  useEffect(() => {
    // Ensure camera rotation order is YXZ for FPS to avoid gimbal lock
    const camRef = { current: camera };
    const currentQuaternion = camera.quaternion.clone();
    camRef.current.rotation.order = "YXZ";
    camRef.current.rotation.setFromQuaternion(currentQuaternion);

    if (isMobileRef.current) {
      return () => {
        setMobileMove({ x: 0, z: 0 });
      };
    }

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
        hasLockedOnce.current = true;
      } else {
        console.log("Pointer unlocked");
        // Do not auto-exit on unlock; Escape handler will handle intentional exits
      }
    };

    const onPointerLockError = () => {
      console.error("Pointer lock error");
      // Do not auto-exit; allow user to click to lock again
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
          if (viewModeRef.current === "FPS_MODE") {
            exitFPSMode();
            if (document.pointerLockElement === gl.domElement) {
              document.exitPointerLock();
            }
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

      // Reset the lock flag when unmounting
      hasLockedOnce.current = false;

      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [camera, gl.domElement, exitFPSMode]);

  useEffect(() => {
    if (!isMobileRef.current) return;

    let lastX: number | null = null;
    let lastY: number | null = null;

    const onTouchMove = (e: TouchEvent) => {
      if (viewModeRef.current !== "FPS_MODE") return;
      const touch = e.touches[0];
      if (lastX === null || lastY === null) {
        lastX = touch.clientX;
        lastY = touch.clientY;
        return;
      }

      const deltaX = touch.clientX - lastX;
      const deltaY = touch.clientY - lastY;
      lastX = touch.clientX;
      lastY = touch.clientY;

      camera.rotation.y -= deltaX * SENSITIVITY;
      camera.rotation.x -= deltaY * SENSITIVITY;
      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x)
      );
    };

    const onTouchEnd = () => {
      lastX = null;
      lastY = null;
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [camera]);

  // Movement logic
  useFrame((_, delta) => {
    if (!isMobileRef.current && document.pointerLockElement !== gl.domElement)
      return;

    // Movement speed
    const speed = 0.5;
    const dampingFactor = 10.0;

    // Calculate movement direction
    direction.current.set(0, 0, 0);

    if (isMobileRef.current) {
      direction.current.x = mobileMove.x;
      direction.current.z = mobileMove.z;
    } else {
      if (moveState.current.forward) direction.current.z -= 1;
      if (moveState.current.backward) direction.current.z += 1;
      if (moveState.current.left) direction.current.x -= 1;
      if (moveState.current.right) direction.current.x += 1;
    }

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

    // Store old position for collision sliding
    const oldPosition = camera.position.clone();

    // Try moving on both axes first
    camera.position.add(velocity.current);

    // Check for collision with the new position
    if (checkCollision(camera.position, 0.3)) {
      // Collision detected, try sliding along walls

      // First, try moving only on X axis
      camera.position.copy(oldPosition);
      camera.position.x += velocity.current.x;

      if (checkCollision(camera.position, 0.3)) {
        // X movement blocked, revert X
        camera.position.x = oldPosition.x;
      }

      // Then try moving only on Z axis
      const afterXPosition = camera.position.clone();
      camera.position.z += velocity.current.z;

      if (checkCollision(camera.position, 0.3)) {
        // Z movement blocked, revert Z
        camera.position.z = afterXPosition.z;
      }
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
