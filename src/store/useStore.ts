import { create } from "zustand";

export type ViewMode = "WEBSITE_MODE" | "FPS_MODE" | "VIEWING_OBJECT";

interface InteractiveObject {
  id: string;
  title: string;
  content: string;
}

interface StoreState {
  // View mode state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Active object being viewed
  activeObject: InteractiveObject | null;
  setActiveObject: (object: InteractiveObject | null) => void;

  // Controls lock state
  isPointerLocked: boolean;
  setPointerLocked: (locked: boolean) => void;

  // Utility actions
  enterFPSMode: () => void;
  exitFPSMode: () => void;
  viewObject: (object: InteractiveObject) => void;
  closeObject: () => void;
}

export const useStore = create<StoreState>((set) => ({
  viewMode: "WEBSITE_MODE",
  setViewMode: (mode) => set({ viewMode: mode }),

  activeObject: null,
  setActiveObject: (object) => set({ activeObject: object }),

  isPointerLocked: false,
  setPointerLocked: (locked) => set({ isPointerLocked: locked }),

  // Enter FPS mode from website
  enterFPSMode: () =>
    set({
      viewMode: "FPS_MODE",
      isPointerLocked: true,
    }),

  // Exit FPS mode back to website
  exitFPSMode: () =>
    set({
      viewMode: "WEBSITE_MODE",
      isPointerLocked: false,
    }),

  // View an interactive object
  viewObject: (object) =>
    set({
      viewMode: "VIEWING_OBJECT",
      activeObject: object,
      isPointerLocked: false,
    }),

  // Close object view and return to FPS
  closeObject: () =>
    set({
      viewMode: "FPS_MODE",
      activeObject: null,
      isPointerLocked: true,
    }),
}));
