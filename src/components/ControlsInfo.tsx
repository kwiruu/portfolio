import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import arrowKeysSvg from "../assets/arrow-keys.svg";
import escKeySvg from "../assets/esc-key.svg";
import eKeySvg from "../assets/e-key.svg";

export default function ControlsInfo() {
  const viewMode = useStore((state) => state.viewMode);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (viewMode === "FPS_MODE") {
      // Fade in
      const fadeIn = setTimeout(() => setOpacity(1), 200);
      // Fade out after 5 seconds
      const fadeOut = setTimeout(() => setOpacity(0), 10000);
      return () => {
        clearTimeout(fadeIn);
        clearTimeout(fadeOut);
      };
    }
  }, [viewMode]);

  if (viewMode !== "FPS_MODE") return null;

  return (
    <div
      className="fixed bottom-0 text-white z-50 pointer-events-none transition-opacity w-full flex justify-between px-8 duration-500"
      style={{ opacity }}
    >
      <div className="flex gap-8 items-center text-sm align-baseline">
        <div className="flex items-center gap-2">
          <img src={arrowKeysSvg} alt="Arrow Keys" className="h-24 w-24 pb-8" />
          <strong>Move</strong>
        </div>
        <div className="flex items-center gap-2">
          <img src={eKeySvg} alt="E Key" className="h-8 w-8" />
          <strong>Interact</strong>
        </div>
      </div> 
        <div className="flex items-center gap-2">
          <img src={escKeySvg} alt="ESC Key" className="h-8 w-8" />
          <strong>Exit</strong>
        </div>
    </div>
  );
}
