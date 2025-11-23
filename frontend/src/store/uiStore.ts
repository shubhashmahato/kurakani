import { create } from 'zustand';

interface UIState {
  isBottomSheetVisible: boolean;
  selectedMessage: string | null;
  searchQuery: string;
  showNotification: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  setBottomSheet: (visible: boolean) => void;
  setSelectedMessage: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  showNotificationAlert: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBottomSheetVisible: false,
  selectedMessage: null,
  searchQuery: '',
  showNotification: false,
  notification: null,

  setBottomSheet: (visible) => set({ isBottomSheetVisible: visible }),
  setSelectedMessage: (id) => set({ selectedMessage: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  showNotificationAlert: (message, type) =>
    set({ showNotification: true, notification: { message, type } }),
  hideNotification: () => set({ showNotification: false, notification: null }),
}));