import { Platform } from 'react-native';

/**
 * API Configuration
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL || 'https://kurakani.app';

/**
 * Firebase Configuration
 */
export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Agora Configuration
 */
export const AGORA_APP_ID = process.env.EXPO_PUBLIC_AGORA_APP_ID || '';

/**
 * Google Maps Configuration
 */
export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

/**
 * App Information
 */
export const APP_NAME = 'Kurakani';
export const APP_VERSION = '1.0.0';
export const APP_BUILD = '1';
export const API_VERSION = 'v1';

/**
 * Platform Detection
 */
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_WEB = Platform.OS === 'web';
export const IS_DEV = __DEV__;

/**
 * Screen Dimensions
 */
export const SCREEN_WIDTH = Platform.select({
  web: 768,
  default: require('react-native').Dimensions.get('window').width,
});

export const SCREEN_HEIGHT = Platform.select({
  web: 1024,
  default: require('react-native').Dimensions.get('window').height,
});

/**
 * API Endpoints
 */
export const ENDPOINTS = {
  // Auth
  AUTH_FIREBASE: '/auth/firebase',
  AUTH_ME: '/auth/me',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_PUSH_TOKEN: '/auth/push-token',
  
  // Users
  USERS: '/users',
  USERS_BY_ID: (id: string) => `/users/${id}`,
  USERS_BY_USERNAME: (username: string) => `/users/username/${username}`,
  USERS_SEARCH: '/users/search',
  USERS_PROFILE: '/users/profile',
  USERS_PRIVACY: '/users/privacy',
  USERS_THEME: '/users/theme',
  USERS_NOTIFICATIONS: '/users/notifications',
  USERS_BLOCK: (id: string) => `/users/${id}/block`,
  USERS_UNBLOCK: (id: string) => `/users/${id}/unblock`,
  
  // Chats
  CHATS: '/chats',
  CHATS_BY_ID: (id: string) => `/chats/${id}`,
  CHATS_GROUP: '/chats/group',
  
  // Messages
  MESSAGES: '/messages',
  MESSAGES_BY_CHAT: (chatId: string) => `/messages/${chatId}`,
  MESSAGES_BY_ID: (id: string) => `/messages/${id}`,
  MESSAGES_REACT: (id: string) => `/messages/${id}/react`,
  MESSAGES_READ: '/messages/read',
  MESSAGES_SEARCH: (chatId: string) => `/messages/${chatId}/search`,
  
  // Stories
  STORIES: '/stories',
  STORIES_BY_ID: (id: string) => `/stories/${id}`,
  STORIES_VIEW: (id: string) => `/stories/${id}/view`,
  STORIES_REACT: (id: string) => `/stories/${id}/react`,
  STORIES_REPLY: (id: string) => `/stories/${id}/reply`,
  
  // Calls
  CALLS: '/calls',
  CALLS_INITIATE: '/calls/initiate',
  CALLS_HISTORY: '/calls/history',
  CALLS_END: (id: string) => `/calls/${id}/end`,
  
  // Channels
  CHANNELS: '/channels',
  CHANNELS_BY_USERNAME: (username: string) => `/channels/${username}`,
  CHANNELS_SUBSCRIBE: (id: string) => `/channels/${id}/subscribe`,
  CHANNELS_UNSUBSCRIBE: (id: string) => `/channels/${id}/unsubscribe`,
  
  // Upload
  UPLOAD: '/upload',
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@kurakani:authToken',
  USER_DATA: '@kurakani:userData',
  DEVICE_ID: '@kurakani:deviceId',
  PUSH_TOKEN: '@kurakani:pushToken',
  THEME: '@kurakani:theme',
  LANGUAGE: '@kurakani:language',
  LAST_SYNC: '@kurakani:lastSync',
  OFFLINE_MESSAGES: '@kurakani:offlineMessages',
  CACHED_CHATS: '@kurakani:cachedChats',
  CACHED_USERS: '@kurakani:cachedUsers',
  CACHED_MESSAGES: '@kurakani:cachedMessages',
  SETTINGS: '@kurakani:settings',
  ONBOARDING_COMPLETE: '@kurakani:onboardingComplete',
};

/**
 * Request Timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  IMAGE_UPLOAD: 60000, // 60 seconds
  VIDEO_UPLOAD: 120000, // 2 minutes
  SOCKET_CONNECT: 10000, // 10 seconds
  TYPING_INDICATOR: 3000, // 3 seconds
};

/**
 * Cache Durations (in milliseconds)
 */
export const CACHE_DURATION = {
  USER_PROFILE: 5 * 60 * 1000, // 5 minutes
  CHATS_LIST: 2 * 60 * 1000, // 2 minutes
  MESSAGES: 10 * 60 * 1000, // 10 minutes
  STORIES: 1 * 60 * 1000, // 1 minute
  USER_SEARCH: 30 * 60 * 1000, // 30 minutes
};

/**
 * Pagination
 */
export const PAGINATION = {
  MESSAGES_PER_PAGE: 50,
  CHATS_PER_PAGE: 20,
  USERS_PER_PAGE: 20,
  STORIES_PER_PAGE: 10,
  CHANNELS_PER_PAGE: 20,
  CALLS_PER_PAGE: 50,
};

/**
 * File Size Limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  AUDIO: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 20 * 1024 * 1024, // 20MB
  VOICE: 10 * 1024 * 1024, // 10MB
  PROFILE_PICTURE: 2 * 1024 * 1024, // 2MB
  STORY: 10 * 1024 * 1024, // 10MB
};

/**
 * Media Dimensions
 */
export const MEDIA_DIMENSIONS = {
  THUMBNAIL_WIDTH: 200,
  THUMBNAIL_HEIGHT: 200,
  IMAGE_MAX_WIDTH: 1280,
  IMAGE_MAX_HEIGHT: 1280,
  PROFILE_PICTURE_SIZE: 400,
  COVER_PHOTO_WIDTH: 1200,
  COVER_PHOTO_HEIGHT: 400,
};

/**
 * Animation Durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

/**
 * Debounce Delays (in milliseconds)
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 500,
  TYPING: 1000,
  AUTO_SAVE: 2000,
};

/**
 * Feature Limits
 */
export const LIMITS = {
  MAX_GROUP_MEMBERS: 10000,
  MAX_CHANNEL_SUBSCRIBERS: 100000,
  MAX_MESSAGE_LENGTH: 10000,
  MAX_BIO_LENGTH: 500,
  MAX_USERNAME_LENGTH: 30,
  MAX_DISPLAY_NAME_LENGTH: 50,
  MAX_GROUP_NAME_LENGTH: 100,
  MAX_CHANNEL_NAME_LENGTH: 100,
  MAX_POLL_OPTIONS: 10,
  MAX_POLL_OPTION_LENGTH: 100,
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 6,
  MIN_PIN_LENGTH: 4,
  MAX_PIN_LENGTH: 6,
};

/**
 * Story Configuration
 */
export const STORY = {
  DURATION: 24 * 60 * 60 * 1000, // 24 hours
  MIN_DURATION: 3, // 3 seconds
  MAX_DURATION: 60, // 60 seconds
  MAX_TEXT_LENGTH: 500,
};

/**
 * Call Configuration
 */
export const CALL = {
  MAX_PARTICIPANTS_VOICE: 50,
  MAX_PARTICIPANTS_VIDEO: 8,
  RING_DURATION: 30000, // 30 seconds
  RECONNECT_ATTEMPTS: 3,
  RECONNECT_DELAY: 1000, // 1 second
};

/**
 * Message Edit/Delete Timeouts (in milliseconds)
 */
export const MESSAGE_TIMEOUTS = {
  EDIT: 15 * 60 * 1000, // 15 minutes
  DELETE_FOR_EVERYONE: 60 * 60 * 1000, // 1 hour
};

/**
 * Secret Chat Self-Destruct Times (in seconds)
 */
export const SELF_DESTRUCT_TIMES = [
  { label: 'Off', value: 0 },
  { label: '5 seconds', value: 5 },
  { label: '10 seconds', value: 10 },
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 300 },
  { label: '1 hour', value: 3600 },
  { label: '1 day', value: 86400 },
  { label: '1 week', value: 604800 },
];

/**
 * Notification Categories
 */
export const NOTIFICATION_CATEGORIES = {
  MESSAGE: 'MESSAGE',
  CALL: 'CALL',
  STORY: 'STORY',
  GROUP: 'GROUP',
  CHANNEL: 'CHANNEL',
  MENTION: 'MENTION',
  REPLY: 'REPLY',
  REACTION: 'REACTION',
};

/**
 * Deep Link Prefixes
 */
export const DEEP_LINK = {
  SCHEME: 'kurakani://',
  UNIVERSAL_LINK: 'https://kurakani.app',
  CHAT: 'chat',
  USER: 'user',
  GROUP: 'group',
  CHANNEL: 'channel',
  STORY: 'story',
  CALL: 'call',
};

/**
 * Social Share Messages
 */
export const SHARE_MESSAGES = {
  INVITE: `Join me on ${APP_NAME}! Download now: ${WEB_URL}`,
  CHANNEL: (name: string) => `Check out ${name} on ${APP_NAME}: ${WEB_URL}`,
  GROUP: (name: string) => `Join ${name} on ${APP_NAME}: ${WEB_URL}`,
};

/**
 * Error Retry Configuration
 */
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  BACKOFF_FACTOR: 2,
};

/**
 * Network Status
 */
export const NETWORK_STATUS = {
  OFFLINE: 'offline',
  ONLINE: 'online',
  SLOW: 'slow',
};

/**
 * Typing Indicator Configuration
 */
export const TYPING = {
  SHOW_DURATION: 3000, // Show for 3 seconds
  SEND_INTERVAL: 2000, // Send every 2 seconds
  MAX_USERS_DISPLAY: 3, // Max users to display in indicator
};

/**
 * Message Queue Configuration
 */
export const MESSAGE_QUEUE = {
  MAX_RETRY_ATTEMPTS: 5,
  RETRY_DELAY: 2000, // 2 seconds
  MAX_QUEUE_SIZE: 100,
};

/**
 * Image Compression Quality
 */
export const IMAGE_QUALITY = {
  THUMBNAIL: 0.5,
  PREVIEW: 0.7,
  UPLOAD: 0.8,
  ORIGINAL: 1.0,
};

/**
 * Video Compression Presets
 */
export const VIDEO_QUALITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

/**
 * Audio Recording Configuration
 */
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 44100,
  CHANNELS: 2,
  BIT_RATE: 128000,
  MAX_DURATION: 600, // 10 minutes
};

/**
 * Haptic Feedback Patterns
 */
export const HAPTIC = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  SELECTION: 'selection',
};

/**
 * Biometric Authentication Types
 */
export const BIOMETRIC_TYPES = {
  FINGERPRINT: 1,
  FACIAL_RECOGNITION: 2,
  IRIS: 3,
};

/**
 * App Lock Timeout Options (in milliseconds)
 */
export const APP_LOCK_TIMEOUTS = [
  { label: 'Immediately', value: 0 },
  { label: '1 minute', value: 60000 },
  { label: '5 minutes', value: 300000 },
  { label: '15 minutes', value: 900000 },
  { label: '30 minutes', value: 1800000 },
  { label: '1 hour', value: 3600000 },
];

/**
 * Online Status Update Interval (in milliseconds)
 */
export const ONLINE_STATUS_INTERVAL = 30000; // 30 seconds

/**
 * Message Delivery Status Update Interval (in milliseconds)
 */
export const MESSAGE_STATUS_UPDATE_INTERVAL = 2000; // 2 seconds

/**
 * Location Update Configuration
 */
export const LOCATION_CONFIG = {
  ACCURACY: 'high',
  DISTANCE_INTERVAL: 10, // meters
  TIME_INTERVAL: 5000, // 5 seconds
};

/**
 * Contact Sync Configuration
 */
export const CONTACT_SYNC = {
  INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  BATCH_SIZE: 100,
};

/**
 * Analytics Events
 */
export const ANALYTICS_EVENTS = {
  APP_OPENED: 'app_opened',
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  MESSAGE_SENT: 'message_sent',
  CALL_INITIATED: 'call_initiated',
  STORY_POSTED: 'story_posted',
  GROUP_CREATED: 'group_created',
  CHANNEL_CREATED: 'channel_created',
  THEME_CHANGED: 'theme_changed',
  LANGUAGE_CHANGED: 'language_changed',
};

/**
 * Keyboard Avoid Behavior
 */
export const KEYBOARD_BEHAVIOR = Platform.select({
  ios: 'padding',
  android: 'height',
  default: 'padding',
});

/**
 * Status Bar Styles
 */
export const STATUS_BAR_STYLE = {
  LIGHT: 'light-content',
  DARK: 'dark-content',
  AUTO: 'auto',
};

/**
 * Safe Area Insets
 */
export const SAFE_AREA = {
  TOP: Platform.select({ ios: 44, android: 0, default: 0 }),
  BOTTOM: Platform.select({ ios: 34, android: 0, default: 0 }),
};

/**
 * Tab Bar Height
 */
export const TAB_BAR_HEIGHT = Platform.select({
  ios: 49,
  android: 56,
  default: 49,
});

/**
 * Header Height
 */
export const HEADER_HEIGHT = Platform.select({
  ios: 44,
  android: 56,
  default: 44,
});

/**
 * Avatar Sizes
 */
export const AVATAR_SIZE = {
  SMALL: 32,
  MEDIUM: 48,
  LARGE: 64,
  XLARGE: 96,
  PROFILE: 120,
};

/**
 * Border Radius Values
 */
export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  XLARGE: 16,
  ROUND: 999,
};

/**
 * Spacing Values
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};

/**
 * Font Weights
 */
export const FONT_WEIGHT = {
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRABOLD: '800',
};

/**
 * Z-Index Levels
 */
export const Z_INDEX = {
  BELOW: -1,
  BASE: 0,
  ABOVE: 1,
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOAST: 70,
  TOOLTIP: 80,
};

/**
 * Export all constants
 */
export default {
  API_URL,
  SOCKET_URL,
  WEB_URL,
  FIREBASE_CONFIG,
  AGORA_APP_ID,
  GOOGLE_MAPS_API_KEY,
  APP_NAME,
  APP_VERSION,
  APP_BUILD,
  API_VERSION,
  IS_IOS,
  IS_ANDROID,
  IS_WEB,
  IS_DEV,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  ENDPOINTS,
  STORAGE_KEYS,
  TIMEOUTS,
  CACHE_DURATION,
  PAGINATION,
  FILE_SIZE_LIMITS,
  MEDIA_DIMENSIONS,
  ANIMATION_DURATION,
  DEBOUNCE_DELAY,
  LIMITS,
  STORY,
  CALL,
  MESSAGE_TIMEOUTS,
  SELF_DESTRUCT_TIMES,
  NOTIFICATION_CATEGORIES,
  DEEP_LINK,
  SHARE_MESSAGES,
  RETRY_CONFIG,
  NETWORK_STATUS,
  TYPING,
  MESSAGE_QUEUE,
  IMAGE_QUALITY,
  VIDEO_QUALITY,
  AUDIO_CONFIG,
  HAPTIC,
  BIOMETRIC_TYPES,
  APP_LOCK_TIMEOUTS,
  ONLINE_STATUS_INTERVAL,
  MESSAGE_STATUS_UPDATE_INTERVAL,
  LOCATION_CONFIG,
  CONTACT_SYNC,
  ANALYTICS_EVENTS,
  KEYBOARD_BEHAVIOR,
  STATUS_BAR_STYLE,
  SAFE_AREA,
  TAB_BAR_HEIGHT,
  HEADER_HEIGHT,
  AVATAR_SIZE,
  BORDER_RADIUS,
  SPACING,
  FONT_WEIGHT,
  Z_INDEX,
};