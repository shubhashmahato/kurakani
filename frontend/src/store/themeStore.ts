import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
  bubbleStyle: 'whatsapp' | 'ios' | 'telegram' | 'android' | 'rounded' | 'square';
  fontSize: number;
  
  setMode: (mode: 'light' | 'dark') => void;
  setPrimaryColor: (color: string) => void;
  setBubbleStyle: (style: any) => void;
  setFontSize: (size: number) => void;
  resetTheme: () => void;
}

const defaultTheme = {
  mode: 'light' as const,
  primaryColor: '#075E54',
  bubbleStyle: 'whatsapp' as const,
  fontSize: 14,
};

export const useThemeStore = create<ThemeState>(
  persist(
    (set) => ({
      ...defaultTheme,

      setMode: (mode) => set({ mode }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setBubbleStyle: (style) => set({ bubbleStyle: style }),
      setFontSize: (size) => set({ fontSize: size }),
      resetTheme: () => set(defaultTheme),
    }),
    {
      name: 'theme-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
