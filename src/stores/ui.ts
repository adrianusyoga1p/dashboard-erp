import { create } from "zustand";

interface UIState {
  showSidebar: boolean;
  setShow: (show: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  showSidebar: true,
  setShow: (show) => set({ showSidebar: show }),
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
}));
