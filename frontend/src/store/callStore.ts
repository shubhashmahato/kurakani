import { create } from 'zustand';
import { Call } from '../types';

interface CallState {
  activeCall: Call | null;
  incomingCall: Call | null;
  callHistory: Call[];
  isLoading: boolean;
  
  setActiveCall: (call: Call | null) => void;
  setIncomingCall: (call: Call | null) => void;
  setCallHistory: (calls: Call[]) => void;
  addToHistory: (call: Call) => void;
  setLoading: (loading: boolean) => void;
}

export const useCallStore = create<CallState>((set) => ({
  activeCall: null,
  incomingCall: null,
  callHistory: [],
  isLoading: false,

  setActiveCall: (call) => set({ activeCall: call }),
  setIncomingCall: (call) => set({ incomingCall: call }),
  setCallHistory: (calls) => set({ callHistory: calls }),
  addToHistory: (call) => set((state) => ({
    callHistory: [call, ...state.callHistory],
  })),
  setLoading: (loading) => set({ isLoading: loading }),
}));