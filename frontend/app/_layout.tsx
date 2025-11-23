import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../src/store/authStore';
import socketService from '../src/services/socket';
import '../global.css';

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(main)/home');
    }

    // Hide splash screen
    SplashScreen.hideAsync();
  }, [isAuthenticated, isLoading, segments]);

  // Setup socket listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleNewMessage = (message: any) => {
      // Handle new message notification
      console.log('New message received:', message);
    };

    const handleIncomingCall = (call: any) => {
      // Navigate to incoming call screen
      router.push(`/calls/incoming/${call._id}`);
    };

    socketService.on('message:new', handleNewMessage);
    socketService.on('call:incoming', handleIncomingCall);

    return () => {
      socketService.off('message:new', handleNewMessage);
      socketService.off('call:incoming', handleIncomingCall);
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="calls" options={{ headerShown: false }} />
        <Stack.Screen name="user" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}