// API Configuration
export const API_CONFIG = {
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Socket Configuration
export const SOCKET_CONFIG = {
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  transports: ['websocket'],
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  sound: 'default',
  badge: 1,
  priority: 'high' as const,
};

// Pagination
export const PAGINATION = {
  MESSAGES_PER_PAGE: 50,
  CHATS_PER_PAGE: 20,
  USERS_PER_PAGE: 20,
  STORIES_PER_PAGE: 10,
};

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  USER_PROFILE: 5 * 60 * 1000, // 5 minutes
  CHATS_LIST: 2 * 60 * 1000, // 2 minutes
  MESSAGES: 10 * 60 * 1000, // 10 minutes
  USER_SEARCH: 30 * 60 * 1000, // 30 minutes
};

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  VOICE: 'voice',
  DOCUMENT: 'document',
  LOCATION: 'location',
  CONTACT: 'contact',
  POLL: 'poll',
  STICKER: 'sticker',
  GIF: 'gif',
  LINK: 'link',
} as const;

// Chat Types
export const CHAT_TYPES = {
  PRIVATE: 'private',
  GROUP: 'group',
  SECRET: 'secret',
} as const;

// Call Types
export const CALL_TYPES = {
  VOICE: 'voice',
  VIDEO: 'video',
} as const;

// Call Status
export const CALL_STATUS = {
  INITIATED: 'initiated',
  RINGING: 'ringing',
  ONGOING: 'ongoing',
  ENDED: 'ended',
  MISSED: 'missed',
  DECLINED: 'declined',
  FAILED: 'failed',
} as const;

// Message Status
export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
} as const;

// User Status
export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy',
} as const;

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#075E54',
  SECONDARY: '#25D366',
  ACCENT: '#34B7F1',
  SUCCESS: '#34B7F1',
  ERROR: '#D32F2F',
  WARNING: '#FFA500',
  INFO: '#2196F3',
};

// Bubble Styles
export const BUBBLE_STYLES = [
  'whatsapp',
  'ios',
  'telegram',
  'android',
  'rounded',
  'square',
] as const;

// Privacy Settings
export const PRIVACY_OPTIONS = {
  EVERYONE: 'everyone',
  CONTACTS: 'contacts',
  NOBODY: 'nobody',
} as const;

// Font Sizes
export const FONT_SIZES = {
  SMALL: 12,
  NORMAL: 14,
  MEDIUM: 16,
  LARGE: 18,
  EXTRA_LARGE: 20,
} as const;

// Timeout Values (in milliseconds)
export const TIMEOUTS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 10000,
  EXTRA_LONG: 15000,
};

// API Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet.',
  UNAUTHORIZED: 'Unauthorized access. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_REQUEST: 'Invalid request. Please check your input.',
  TIMEOUT: 'Request timeout. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logout successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MESSAGE_SENT: 'Message sent!',
  CHAT_CREATED: 'Chat created successfully!',
  CALL_INITIATED: 'Call initiated...',
  STORY_POSTED: 'Story posted successfully!',
  USER_BLOCKED: 'User blocked successfully!',
  USER_UNBLOCKED: 'User unblocked successfully!',
  MESSAGE_DELETED: 'Message deleted!',
  CHAT_ARCHIVED: 'Chat archived!',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const;

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,}$/,
  PHONE: /^[\d\s\-\+\(\)]{10,}$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
} as const;

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 20,
  TIMEOUT_SECONDS: 30,
  MESSAGE_RETRY_COUNT: 3,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_AUDIO_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_DOCUMENT_SIZE: 20 * 1024 * 1024, // 20MB
  MAX_GROUP_MEMBERS: 10000,
  MAX_CHANNEL_SUBSCRIBERS: 100000,
  STORY_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  SECRET_CHAT_TIMER: [0, 5, 10, 30, 60, 300], // seconds
  TYPING_TIMEOUT: 3000, // 3 seconds
  MESSAGE_EDIT_TIMEOUT: 15 * 60 * 1000, // 15 minutes
  MESSAGE_DELETE_TIMEOUT: 60 * 60 * 1000, // 1 hour
};

// Routes
export const ROUTES = {
  // Auth routes
  LOGIN: '/(auth)/login',
  SIGNUP: '/(auth)/signup',
  PHONE_VERIFICATION: '/(auth)/phone-verification',
  
  // Main routes
  HOME: '/(main)/home',
  CHATS: '/(main)/chats',
  STORIES: '/(main)/stories',
  CHANNELS: '/(main)/channels',
  PROFILE: '/(main)/profile',
  
  // Chat routes
  CHAT_DETAIL: '/chat/[id]',
  GROUP_CHAT: '/chat/group/[id]',
  SECRET_CHAT: '/chat/secret/[id]',
  
  // User routes
  USER_PROFILE: '/user/[id]',
  EDIT_PROFILE: '/user/edit-profile',
  
  // Call routes
  CALLS: '/calls',
  INCOMING_CALL: '/calls/incoming/[id]',
  ACTIVE_CALL: '/calls/active/[id]',
  
  // Settings routes
  SETTINGS: '/settings',
  THEMES: '/settings/themes',
  NOTIFICATIONS: '/settings/notifications',
  PRIVACY: '/settings/privacy',
  BLOCKED: '/settings/blocked',
  APPEARANCE: '/settings/appearance',
} as const;

// File Picker Options
export const FILE_PICKER_OPTIONS = {
  imageOnly: {
    mediaTypes: 'Images',
    allowsMultipleSelection: false,
    quality: 0.8,
  },
  videoOnly: {
    mediaTypes: 'Videos',
    allowsMultipleSelection: false,
  },
  audioOnly: {
    mediaTypes: 'Audios',
    allowsMultipleSelection: false,
  },
  documentOnly: {
    type: '*/*',
    copyToCacheDirectory: true,
  },
  all: {
    mediaTypes: 'All',
  },
} as const;

// Image Compression Options
export const IMAGE_COMPRESSION = {
  compress: 0.7,
  maxWidth: 1280,
  maxHeight: 1280,
  format: 'JPEG' as const,
};

// Video Compression Options
export const VIDEO_COMPRESSION = {
  compress: 'high' as const,
};

// Audio Recording Options
export const AUDIO_RECORDING = {
  android: {
    extension: '.m4a',
    outputFormat: 2, // MPEG_4
    audioEncoder: 3, // AAC
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: 'mpeg4aac',
    audioQuality: 'high',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

// Camera Options
export const CAMERA_OPTIONS = {
  mediaTypes: 'All',
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
};

// Location Options
export const LOCATION_OPTIONS = {
  accuracy: 'high' as const,
  distanceInterval: 10,
  timeInterval: 5000,
};

// Notification Sounds
export const NOTIFICATION_SOUNDS = [
  { id: 'default', name: 'Default', file: 'notification.wav' },
  { id: 'bell', name: 'Bell', file: 'bell.wav' },
  { id: 'chime', name: 'Chime', file: 'chime.wav' },
  { id: 'ding', name: 'Ding', file: 'ding.wav' },
  { id: 'pop', name: 'Pop', file: 'pop.wav' },
  { id: 'swoosh', name: 'Swoosh', file: 'swoosh.wav' },
];

// Ringtones
export const RINGTONES = [
  { id: 'default', name: 'Default', file: 'ringtone.mp3' },
  { id: 'classic', name: 'Classic', file: 'classic.mp3' },
  { id: 'digital', name: 'Digital', file: 'digital.mp3' },
  { id: 'marimba', name: 'Marimba', file: 'marimba.mp3' },
  { id: 'guitar', name: 'Guitar', file: 'guitar.mp3' },
];

// Vibration Patterns (in milliseconds)
export const VIBRATION_PATTERNS = {
  default: [0, 400, 200, 400],
  short: [0, 200],
  long: [0, 1000],
  double: [0, 200, 200, 200],
  triple: [0, 200, 200, 200, 200, 200],
};

// App Icons
export const APP_ICONS = [
  { id: 'default', name: 'Default', preview: require('../../assets/icon.png') },
  { id: 'blue', name: 'Blue', preview: require('../../assets/icons/blue.png') },
  { id: 'red', name: 'Red', preview: require('../../assets/icons/red.png') },
  { id: 'green', name: 'Green', preview: require('../../assets/icons/green.png') },
  { id: 'purple', name: 'Purple', preview: require('../../assets/icons/purple.png') },
  { id: 'orange', name: 'Orange', preview: require('../../assets/icons/orange.png') },
  { id: 'pink', name: 'Pink', preview: require('../../assets/icons/pink.png') },
  { id: 'dark', name: 'Dark', preview: require('../../assets/icons/dark.png') },
  { id: 'minimal', name: 'Minimal', preview: require('../../assets/icons/minimal.png') },
  { id: 'gradient', name: 'Gradient', preview: require('../../assets/icons/gradient.png') },
];

// Font Families
export const FONT_FAMILIES = [
  { id: 'system', name: 'System Default' },
  { id: 'roboto', name: 'Roboto' },
  { id: 'opensans', name: 'Open Sans' },
  { id: 'lato', name: 'Lato' },
  { id: 'montserrat', name: 'Montserrat' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'raleway', name: 'Raleway' },
  { id: 'nunito', name: 'Nunito' },
  { id: 'ubuntu', name: 'Ubuntu' },
  { id: 'playfair', name: 'Playfair Display' },
  { id: 'merriweather', name: 'Merriweather' },
  { id: 'sourcecodepro', name: 'Source Code Pro' },
];

// Emoji Styles
export const EMOJI_STYLES = [
  { id: 'ios', name: 'Apple (iOS)', preview: '😊' },
  { id: 'android', name: 'Google (Android)', preview: '😊' },
  { id: 'twitter', name: 'Twitter', preview: '😊' },
  { id: 'facebook', name: 'Facebook', preview: '😊' },
];

// Default Reactions
export const DEFAULT_REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏', '🔥', '👏', '🎉', '💯'];

// Story Background Colors
export const STORY_BACKGROUNDS = [
  '#075E54', '#128C7E', '#25D366', '#34B7F1',
  '#FF6B6B', '#FFA500', '#FFD700', '#9370DB',
  '#FF1493', '#00CED1', '#32CD32', '#FF4500',
  '#8B4513', '#2F4F4F', '#483D8B', '#008B8B',
];

// Story Fonts
export const STORY_FONTS = [
  'System',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Playfair Display',
  'Courier New',
];

// Layout Styles
export const LAYOUT_STYLES = [
  { id: 'tabs', name: 'Tabs (Top)', icon: '📑' },
  { id: 'sidebar', name: 'Sidebar', icon: '📋' },
  { id: 'bottom', name: 'Bottom Navigation', icon: '📱' },
];

// Group Permissions
export const GROUP_PERMISSIONS = {
  SEND_MESSAGES: 'send_messages',
  SEND_MEDIA: 'send_media',
  ADD_MEMBERS: 'add_members',
  CHANGE_INFO: 'change_info',
  PIN_MESSAGES: 'pin_messages',
};

// Channel Categories
export const CHANNEL_CATEGORIES = [
  'News',
  'Entertainment',
  'Technology',
  'Sports',
  'Education',
  'Business',
  'Lifestyle',
  'Gaming',
  'Music',
  'Art',
  'Food',
  'Travel',
  'Health',
  'Science',
  'Other',
];

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
];

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM d',
  MEDIUM: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  FULL: 'EEEE, MMMM d, yyyy',
  TIME: 'h:mm a',
  TIME_24: 'HH:mm',
  DATETIME: 'MMM d, h:mm a',
  DATETIME_FULL: 'MMM d, yyyy h:mm a',
};

// App Version
export const APP_VERSION = '1.0.0';
export const API_VERSION = 'v1';

// Environment
export const IS_DEV = __DEV__;
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const IS_WEB = Platform.OS === 'web';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
  DEVICE_ID: 'deviceId',
  PUSH_TOKEN: 'pushToken',
  LAST_SYNC: 'lastSync',
  OFFLINE_MESSAGES: 'offlineMessages',
  CACHED_CHATS: 'cachedChats',
  CACHED_USERS: 'cachedUsers',
};

// Feature Flags
export const FEATURES = {
  VOICE_MESSAGES: true,
  VIDEO_CALLS: true,
  GROUP_CALLS: true,
  STORIES: true,
  CHANNELS: true,
  SECRET_CHATS: true,
  POLLS: true,
  LOCATION_SHARING: true,
  CONTACT_SHARING: true,
  STICKERS: true,
  GIFS: true,
  LIVE_LOCATION: false, // Coming soon
  VOICE_ROOMS: false, // Coming soon
  MINI_APPS: false, // Coming soon
};

// Rate Limits
export const RATE_LIMITS = {
  MESSAGE_SEND: { limit: 100, window: 60000 }, // 100 messages per minute
  SEARCH: { limit: 20, window: 60000 }, // 20 searches per minute
  API_CALL: { limit: 1000, window: 60000 }, // 1000 API calls per minute
};

// Export all
export default {
  API_CONFIG,
  SOCKET_CONFIG,
  NOTIFICATION_CONFIG,
  PAGINATION,
  CACHE_DURATION,
  MESSAGE_TYPES,
  CHAT_TYPES,
  CALL_TYPES,
  CALL_STATUS,
  MESSAGE_STATUS,
  USER_STATUS,
  THEME_COLORS,
  BUBBLE_STYLES,
  PRIVACY_OPTIONS,
  FONT_SIZES,
  TIMEOUTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REGEX,
  DEFAULTS,
  ROUTES,
  FILE_PICKER_OPTIONS,
  IMAGE_COMPRESSION,
  VIDEO_COMPRESSION,
  AUDIO_RECORDING,
  CAMERA_OPTIONS,
  LOCATION_OPTIONS,
  NOTIFICATION_SOUNDS,
  RINGTONES,
  VIBRATION_PATTERNS,
  APP_ICONS,
  FONT_FAMILIES,
  EMOJI_STYLES,
  DEFAULT_REACTIONS,
  STORY_BACKGROUNDS,
  STORY_FONTS,
  LAYOUT_STYLES,
  GROUP_PERMISSIONS,
  CHANNEL_CATEGORIES,
  SUPPORTED_LANGUAGES,
  DATE_FORMATS,
  APP_VERSION,
  API_VERSION,
  IS_DEV,
  IS_ANDROID,
  IS_IOS,
  IS_WEB,
  STORAGE_KEYS,
  FEATURES,
  RATE_LIMITS,
};