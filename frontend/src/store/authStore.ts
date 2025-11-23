import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import socketService from '../services/socket';
import { auth } from '../config/firebase';

interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  bio?: string;
  theme: any;
  privacySettings: any;
  notificationSettings: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (idToken: string, deviceInfo: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),
  
  setToken: async (token) => {
    await AsyncStorage.setItem('authToken', token);
    set({ token, isAuthenticated: true });
  },

  login: async (idToken, deviceInfo) => {
    try {
      set({ isLoading: true });
      
      const response = await api.firebaseAuth(idToken, deviceInfo);
      const { token, user } = response;
      
      await AsyncStorage.setItem('authToken', token);
      set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });

      // Connect socket
      await socketService.connect();
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      const deviceId = await AsyncStorage.getItem('deviceId');
      if (deviceId) {
        await api.logout(deviceId);
      }

      await auth.signOut();
      await AsyncStorage.removeItem('authToken');
      
      socketService.disconnect();
      
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.updateProfile(data);
      set({ user: { ...get().user!, ...response.user } });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.getMe();
      set({ user: response.user });
    } catch (error) {
      console.error('Fetch profile error:', error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        set({ token, isLoading: true });
        
        try {
          const response = await api.getMe();
          set({ 
            user: response.user, 
            isAuthenticated: true 
          });
          
          // Connect socket
          await socketService.connect();
        } catch (error) {
          // Token invalid, clear storage
          await AsyncStorage.removeItem('authToken');
          set({ token: null, isAuthenticated: false });
        }
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Initialize error:', error);
      set({ isLoading: false });
    }
  },
}));