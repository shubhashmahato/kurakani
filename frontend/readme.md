# Kurakani Frontend

React Native + Expo mobile app for iOS and Android.

## Features

- ✅ Cross-platform (iOS & Android)
- ✅ Expo SDK 52+
- ✅ TypeScript
- ✅ Expo Router (file-based routing)
- ✅ NativeWind (Tailwind CSS)
- ✅ Zustand state management
- ✅ Real-time Socket.io
- ✅ Firebase Authentication
- ✅ Agora video/audio calls
- ✅ Push notifications
- ✅ Offline support
- ✅ Image compression
- ✅ Dark mode support
- ✅ Biometric authentication

## Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (Mac only)
- Android: Android Studio
- Physical device with Expo Go app (recommended)

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## Environment Setup

Edit `.env` file:

```env
# Backend
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:5000

# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Agora
EXPO_PUBLIC_AGORA_APP_ID=your-agora-app-id

# Google Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

## Running the App

### Start Expo Development Server

```bash
npx expo start
```

### Run on Specific Platform

```bash
# iOS (Mac only)
npx expo start --ios

# Android
npx expo start --android

# Web (limited features)
npx expo start --web
```

### Run on Physical Device

1. Install **Expo Go** app from App Store or Play Store
2. Scan QR code from terminal
3. App will load on device

## Project Structure

```
frontend/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Auth flow
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── phone-verification.tsx
│   ├── (main)/            # Main app
│   │   ├── home.tsx
│   │   ├── chats.tsx
│   │   ├── stories.tsx
│   │   └── profile.tsx
│   ├── chat/              # Chat screens
│   │   ├── [id].tsx
│   │   ├── group/[id].tsx
│   │   └── secret/[id].tsx
│   ├── settings/          # Settings screens
│   ├── calls/             # Call screens
│   ├── user/              # User profile screens
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # React components
│   │   ├── chat/          # Chat components
│   │   ├── common/        # Shared components
│   │   ├── settings/      # Settings components
│   │   ├── calls/         # Call components
│   │   └── story/         # Story components
│   ├── hooks/             # Custom hooks
│   ├── store/             # Zustand stores
│   │   ├── authStore.ts
│   │   ├── chatStore.ts
│   │   └── themeStore.ts
│   ├── services/          # API & services
│   │   ├── api.ts
│   │   ├── socket.ts
│   │   └── firebaseAuth.ts
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── config/            # Configuration
├── assets/                # Static assets
├── .env                   # Environment variables
├── app.json               # Expo config
├── package.json
└── tailwind.config.js
```

## Key Libraries

| Library | Purpose |
|---------|---------|
| expo-router | File-based navigation |
| zustand | State management |
| socket.io-client | Real-time communication |
| nativewind | Tailwind CSS for React Native |
| expo-av | Audio/video playback |
| expo-camera | Camera access |
| expo-image-picker | Image selection |
| expo-notifications | Push notifications |
| expo-local-authentication | Biometric auth |
| agora-react-native-rtc | Video/audio calls |
| date-fns | Date formatting |
| @shopify/flash-list | High-performance lists |

## Navigation

### File-based Routing

Expo Router uses file-based routing:

```
app/
├── (auth)/
│   └── login.tsx          → /(auth)/login
├── (main)/
│   └── home.tsx           → /(main)/home
├── chat/
│   └── [id].tsx           → /chat/123
└── settings/
    └── themes.tsx         → /settings/themes
```

### Navigation Examples

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to chat
router.push(`/chat/${chatId}`);

// Navigate to settings
router.push('/settings/themes');

// Go back
router.back();

// Replace current screen
router.replace('/login');
```

## State Management

### Zustand Stores

```typescript
// authStore.ts
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  login: async (token) => { /* ... */ },
  logout: async () => { /* ... */ },
}));

// Usage in component
const { user, login } = useAuthStore();
```

## Styling with NativeWind

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
        Hello World
      </Text>
    </View>
  );
}
```

## Real-time Communication

```typescript
import socketService from '../services/socket';

// Connect
socketService.connect();

// Listen for messages
socketService.on('message:new', (message) => {
  // Handle new message
});

// Send message
socketService.sendMessage({ chatId, content, type });

// Typing indicator
socketService.startTyping(chatId);
socketService.stopTyping(chatId);
```

## Push Notifications

```typescript
import * as Notifications from 'expo-notifications';

// Request permissions
const { status } = await Notifications.requestPermissionsAsync();

// Get push token
const token = (await Notifications.getExpoPushTokenAsync()).data;

// Listen for notifications
Notifications.addNotificationReceivedListener((notification) => {
  // Handle notification
});
```

## Building for Production

### iOS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build
eas build --platform ios
```

### Android

```bash
# Build
eas build --platform android

# Or build locally
npx expo run:android --variant release
```

## App Configuration

Edit `app.json` for app settings:

```json
{
  "expo": {
    "name": "Kurakani",
    "slug": "kurakani",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "ios": {
      "bundleIdentifier": "com.kurakani.app"
    },
    "android": {
      "package": "com.kurakani.app"
    }
  }
}
```

## Theme Customization

Users can customize themes in the app:

```typescript
// Update theme
const { theme, updateTheme } = useThemeStore();

await updateTheme({
  mode: 'dark',
  primaryColor: '#075E54',
  accentColor: '#25D366',
  bubbleStyle: 'whatsapp',
  fontFamily: 'System',
  fontSize: 14,
});
```

## Offline Support

App works offline with automatic sync:

```typescript
// Messages are queued when offline
await sendMessage(messageData);

// Automatically sent when back online
socketService.on('reconnect', () => {
  // Sync pending messages
});
```

## Performance Optimization

### FlashList for Long Lists

```tsx
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={messages}
  renderItem={({ item }) => <MessageBubble message={item} />}
  estimatedItemSize={80}
/>
```

### Image Optimization

```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Common Issues

### Metro Bundler Issues

```bash
# Clear cache
npx expo start -c

# Reset node_modules
rm -rf node_modules
npm install
```

### iOS Simulator Not Working

```bash
# Reset simulator
xcrun simctl erase all

# Rebuild
npx expo run:ios --clean
```

### Android Build Errors

```bash
# Clean Gradle
cd android
./gradlew clean
cd ..

# Rebuild
npx expo run:android --clean
```

## Environment-specific Configuration

```typescript
// config/constants.ts
const ENV = {
  dev: {
    apiUrl: 'http://localhost:5000/api',
  },
  staging: {
    apiUrl: 'https://staging-api.kurakani.app/api',
  },
  production: {
    apiUrl: 'https://api.kurakani.app/api',
  },
};

export default ENV[process.env.NODE_ENV];
```

## Debugging

### React Native Debugger

```bash
# Install
brew install --cask react-native-debugger

# Open debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Flipper

```bash
# Install Flipper
brew install --cask flipper

# Enable in app
# Android: automatic
# iOS: enable in Xcode
```

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test on both iOS and Android
5. Submit pull request

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router Docs](https://expo.github.io/router/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)

## License

MIT

## Support

- Email: support@kurakani.app
- Discord: [discord.gg/kurakani](https://discord.gg/kurakani)
- Documentation: [docs.kurakani.app](https://docs.kurakani.app)
