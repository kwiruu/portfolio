import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useStore } from "../store/useStore";
import enterKey from "../assets/enter-key.svg";

function checkIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  // Check for touch capability
  const touchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  // Check for coarse pointer (finger vs mouse)
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  // Check screen size (tablets and phones)
  const smallScreen = window.innerWidth <= 1024 || window.innerHeight <= 768;
  // Check user agent for mobile devices
  const uaMobile =
    /Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  // Consider it mobile if touch-capable OR has coarse pointer OR is a known mobile UA
  return touchCapable || coarse || smallScreen || uaMobile;
}

function useIsMobile() {
  // Initialize with check result - runs client-side only in Vite
  const [isMobile, setIsMobile] = useState(() => checkIsMobile());

  useEffect(() => {
    const handleChange = () => setIsMobile(checkIsMobile());

    window.addEventListener("resize", handleChange);
    window.addEventListener("orientationchange", handleChange);

    // Also listen to media query changes
    const mq = window.matchMedia("(pointer: coarse)");
    if (mq.addEventListener) {
      mq.addEventListener("change", handleChange);
    }

    return () => {
      window.removeEventListener("resize", handleChange);
      window.removeEventListener("orientationchange", handleChange);
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handleChange);
      }
    };
  }, []);

  return isMobile;
}

export default function MobileControlsOverlay() {
  const viewMode = useStore((state) => state.viewMode);
  const targetedObject = useStore((state) => state.targetedObject);
  const exitFPSMode = useStore((state) => state.exitFPSMode);
  const setMobileMove = useStore((state) => state.setMobileMove);

  const isMobile = useIsMobile();
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => setMobileMove({ x: 0, z: 0 });
  }, [setMobileMove]);

  // Don't render if not mobile or not in FPS mode
  if (!isMobile || viewMode !== "FPS_MODE") {
    return null;
  }

  const updateMove = (clientX: number, clientY: number) => {
    if (!baseRef.current || !knobRef.current) return;

    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;

    const limit = rect.width / 2;
    const clampedX = Math.max(-limit, Math.min(limit, dx));
    const clampedY = Math.max(-limit, Math.min(limit, dy));

    const normX = clampedX / limit;
    const normY = clampedY / limit;

    // Update knob position directly
    knobRef.current.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;

    // Update movement: pushing joystick up (negative Y) should move forward (negative Z)
    setMobileMove({ x: normX, z: normY });
  };

  const resetMove = () => {
    if (knobRef.current) {
      knobRef.current.style.transform = "translate(-50%, -50%)";
    }
    setMobileMove({ x: 0, z: 0 });
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    activePointer.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateMove(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== e.pointerId) return;
    e.preventDefault();
    updateMove(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== e.pointerId) return;
    e.preventDefault();
    activePointer.current = null;
    resetMove();
  };

  const handleInteract = () => {
    if (targetedObject) {
      // Dispatch a custom event that the 3D objects listen for
      window.dispatchEvent(new CustomEvent("mobile-interact"));
    }
  };

  const handleExit = () => {
    exitFPSMode();
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col justify-between p-6"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 24px), 24px)",
      }}
    >
      {/* Top bar with exit button */}
      <div className="pointer-events-auto flex justify-end">
        <button
          onClick={handleExit}
          className="px-4 py-2 text-sm font-semibold text-white "
          style={{ touchAction: "manipulation" }}
        >
          ✕ Exit
        </button>
      </div>

      {/* Bottom bar with joystick and interact */}
      <div className="flex items-end justify-between p-5">
        {/* Joystick - LEFT side */}
        <div className="pointer-events-auto" style={{ touchAction: "none" }}>
          <div
            ref={baseRef}
            className="relative h-28 w-28 rounded-full border-4 border-white"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: "none" }}
          >
            {/* Knob */}
            <div
              ref={knobRef}
              className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full bg-white text-white shadow-md"
              style={{
                transform: "translate(-50%, -50%)",
                touchAction: "none",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Interact button - RIGHT side */}
        <div className="pointer-events-auto flex flex-col items-end gap-3">
          {targetedObject ? (
            <button
              onClick={handleInteract}
              className="px-4 py-3 text-sm font-semibold text-white"
              style={{ touchAction: "manipulation" }}
              aria-label="Interact"
            >
              <img src={enterKey} alt="Interact" className="h-13 w-auto" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
