import { create } from "zustand";

export type ViewMode =
  | "WEBSITE_MODE"
  | "FPS_MODE"
  | "VIEWING_OBJECT"
  | "SPLIT_MODE";

export type SplitModeContent = "certifications" | "projects" | null;

interface InteractiveObject {
  id: string;
  title: string;
  content: string;
}

interface StoreState {
  // View mode state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Split mode content type
  splitModeContent: SplitModeContent;
  setSplitModeContent: (content: SplitModeContent) => void;

  // Active object being viewed
  activeObject: InteractiveObject | null;
  setActiveObject: (object: InteractiveObject | null) => void;

  // Controls lock state
  isPointerLocked: boolean;
  setPointerLocked: (locked: boolean) => void;

  // Utility actions
  enterFPSMode: () => void;
  exitFPSMode: () => void;
  enterSplitMode: (content: SplitModeContent) => void;
  exitSplitMode: () => void;
  viewObject: (object: InteractiveObject) => void;
  closeObject: () => void;
}

export const useStore = create<StoreState>((set) => ({
  viewMode: "WEBSITE_MODE",
  setViewMode: (mode) => set({ viewMode: mode }),

  splitModeContent: null,
  setSplitModeContent: (content) => set({ splitModeContent: content }),

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

  // Enter split mode (half website, half 3D view)
  enterSplitMode: (content) =>
    set({
      viewMode: "SPLIT_MODE",
      splitModeContent: content,
      isPointerLocked: false,
    }),

  // Exit split mode back to FPS
  exitSplitMode: () =>
    set({
      viewMode: "FPS_MODE",
      splitModeContent: null,
      isPointerLocked: true,
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
