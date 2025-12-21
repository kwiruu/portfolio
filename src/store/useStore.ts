import { create } from "zustand";

export type ViewMode =
  | "WEBSITE_MODE"
  | "FPS_MODE"
  | "VIEWING_OBJECT"
  | "SPLIT_MODE"
  | "TOUR_MODE";

export type SplitModeContent =
  | "certifications"
  | "projects"
  | "about"
  | "technical"
  | null;

interface InteractiveObject {
  id: string;
  title: string;
  content: string;
}

interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

interface StoreState {
  // View mode state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Split mode content type
  splitModeContent: SplitModeContent;
  setSplitModeContent: (content: SplitModeContent) => void;

  // Camera target for split mode navigation
  cameraTarget: CameraTarget | null;
  setCameraTarget: (target: CameraTarget | null) => void;

  // Active object being viewed
  activeObject: InteractiveObject | null;
  setActiveObject: (object: InteractiveObject | null) => void;

  // Object currently in focus (e.g., centered crosshair)
  targetedObject: InteractiveObject | null;
  setTargetedObject: (object: InteractiveObject | null) => void;

  // Mobile movement input
  mobileMove: { x: number; z: number };

  // Landscape prompt for mobile portrait users
  showLandscapePrompt: boolean;
  setShowLandscapePrompt: (show: boolean) => void;
  setMobileMove: (input: { x: number; z: number }) => void;

  // Controls lock state
  isPointerLocked: boolean;
  setPointerLocked: (locked: boolean) => void;

  // Tour state
  isTourActive: boolean;
  currentTourStep: number;
  hasPlayedTour: boolean;

  // Utility actions
  enterFPSMode: () => void;
  exitFPSMode: () => void;
  enterSplitMode: (content: SplitModeContent) => void;
  exitSplitMode: () => void;
  viewObject: (object: InteractiveObject) => void;
  closeObject: () => void;
  startTour: () => void;
  nextTourStep: () => void;
  endTour: () => void;
}

export const useStore = create<StoreState>((set) => ({
  viewMode: "WEBSITE_MODE",
  setViewMode: (mode) => set({ viewMode: mode }),

  splitModeContent: null,
  setSplitModeContent: (content) => set({ splitModeContent: content }),

  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),

  activeObject: null,
  setActiveObject: (object) => set({ activeObject: object }),

  targetedObject: null,
  setTargetedObject: (object) => set({ targetedObject: object }),

  mobileMove: { x: 0, z: 0 },
  setMobileMove: (input) => set({ mobileMove: input }),

  showLandscapePrompt: false,
  setShowLandscapePrompt: (show) => set({ showLandscapePrompt: show }),

  isPointerLocked: false,
  setPointerLocked: (locked) => set({ isPointerLocked: locked }),

  // Tour state
  isTourActive: false,
  currentTourStep: 0,
  hasPlayedTour: false,

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

  // Start guided tour
  startTour: () =>
    set({
      viewMode: "TOUR_MODE",
      isTourActive: true,
      currentTourStep: 0,
      isPointerLocked: false,
    }),

  // Move to next tour step
  nextTourStep: () =>
    set((state) => ({
      currentTourStep: state.currentTourStep + 1,
    })),

  // End tour and enter FPS mode
  endTour: () =>
    set({
      viewMode: "FPS_MODE",
      isTourActive: false,
      currentTourStep: 0,
      hasPlayedTour: true,
      isPointerLocked: true,
    }),
}));
