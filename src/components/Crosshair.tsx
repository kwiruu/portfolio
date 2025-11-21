import { useStore } from "../store/useStore";

export default function Crosshair() {
  const viewMode = useStore((state) => state.viewMode);

  if (viewMode !== "FPS_MODE") return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-[100]">
      <div className="absolute w-0.5 h-full left-1/2 -translate-x-1/2 bg-white/80" />
      <div className="absolute w-full h-0.5 top-1/2 -translate-y-1/2 bg-white/80" />
    </div>
  );
}
