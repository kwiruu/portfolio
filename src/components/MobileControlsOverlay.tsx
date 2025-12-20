import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useStore } from "../store/useStore";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window === "undefined") return false;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const touchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const narrow = window.innerWidth <= 1024 || window.innerHeight <= 768;
      const uaMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      return coarse || touchCapable || narrow || uaMobile;
    };

    setIsMobile(check());

    const onResize = () => setIsMobile(check());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile;
}

export default function MobileControlsOverlay() {
  const viewMode = useStore((state) => state.viewMode);
  const targetedObject = useStore((state) => state.targetedObject);
  const viewObject = useStore((state) => state.viewObject);
  const setMobileMove = useStore((state) => state.setMobileMove);

  const isMobile = useIsMobile();
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);

  useEffect(() => {
    return () => setMobileMove({ x: 0, z: 0 });
  }, [setMobileMove]);

  if (!isMobile || viewMode !== "FPS_MODE") return null;

  const updateMove = (clientX: number, clientY: number) => {
    if (!baseRef.current || !knobRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);

    const limit = rect.width / 2;
    const clampedX = Math.max(-limit, Math.min(limit, dx));
    const clampedY = Math.max(-limit, Math.min(limit, dy));

    const normX = clampedX / limit;
    const normY = clampedY / limit;

    knobRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
    setMobileMove({ x: normX, z: normY * -1 });
  };

  const resetMove = () => {
    if (knobRef.current) {
      knobRef.current.style.transform = "translate(0px, 0px)";
    }
    setMobileMove({ x: 0, z: 0 });
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    activePointer.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateMove(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== e.pointerId) return;
    updateMove(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== e.pointerId) return;
    activePointer.current = null;
    resetMove();
  };

  const handleInteract = () => {
    if (targetedObject) {
      viewObject(targetedObject);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-end justify-between p-6">
      <div className="pointer-events-auto">
        <div
          ref={baseRef}
          className="relative h-28 w-28 rounded-full border border-neutral-200 bg-white/90 shadow-lg backdrop-blur"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="absolute inset-2 rounded-full border border-neutral-100" />
          <div
            ref={knobRef}
            className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-800 text-white shadow-md transition-transform"
          />
        </div>
      </div>

      <div className="pointer-events-auto flex flex-col items-end gap-3 pb-4">
        <button
          onClick={handleInteract}
          disabled={!targetedObject}
          className="rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {targetedObject ? "Interact" : "Look at an object"}
        </button>
      </div>
    </div>
  );
}
