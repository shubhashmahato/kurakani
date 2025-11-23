import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error adding token to request:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const message = error.response?.data as any;
    
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // You can dispatch logout action here
      console.warn('Unauthorized - Token removed');
    }

    // Log error
    console.error('API Error:', {
      status: error.response?.status,
      message: message?.error || error.message,
      url: error.config?.url,
    });

    throw message || { error: error.message };
  }
);

// ==================== AUTH APIs ====================
export const authAPI = {
  // Firebase authentication
  firebaseAuth: (idToken: string) =>
    api.post<ApiResponse>('/auth/firebase', { firebaseToken: idToken }),

  // Get current user
  getMe: () =>
    api.get<ApiResponse>('/auth/me'),

  // Update push token
  updatePushToken: (pushToken: string, deviceId: string) =>
    api.post<ApiResponse>('/auth/push-token', { pushToken, deviceId }),

  // Logout
  logout: () =>
    api.post<ApiResponse>('/auth/logout'),
};

// ==================== CHAT APIs ====================
export const chatAPI = {
  // Get all chats
  getChats: () =>
    api.get<ApiResponse>('/chats'),

  // Get single chat
  getChat: (id: string) =>
    api.get<ApiResponse>(`/chats/${id}`),

  // Create private/secret chat
  createChat: (participantId: string, type: 'private' | 'secret' = 'private') =>
    api.post<ApiResponse>('/chats', { participantId, type }),

  // Create group chat
  createGroupChat: (name: string, participants: string[], avatar?: string) =>
    api.post<ApiResponse>('/chats/group', { name, participants, avatar }),

  // Update chat
  updateChat: (id: string, data: any) =>
    api.put<ApiResponse>(`/chats/${id}`, data),

  // Delete chat
  deleteChat: (id: string) =>
    api.delete<ApiResponse>(`/chats/${id}`),
};

// ==================== MESSAGE APIs ====================
export const messageAPI = {
  // Get messages (paginated)
  getMessages: (chatId: string, page = 1, limit = 50) =>
    api.get<ApiResponse>(`/messages/${chatId}?page=${page}&limit=${limit}`),

  // Get single message
  getMessage: (messageId: string) =>
    api.get<ApiResponse>(`/messages/${messageId}/single`),

  // Send message
  sendMessage: (chatId: string, type: string, content?: string, mediaUrl?: string, other?: any) =>
    api.post<ApiResponse>('/messages', {
      chatId,
      type,
      content,
      mediaUrl,
      ...other,
    }),

  // Edit message
  editMessage: (messageId: string, content: string) =>
    api.put<ApiResponse>(`/messages/${messageId}`, { content }),

  // Delete message
  deleteMessage: (messageId: string, deleteForEveryone = false) =>
    api.delete<ApiResponse>(`/messages/${messageId}?deleteForEveryone=${deleteForEveryone}`),

  // React to message
  reactToMessage: (messageId: string, emoji: string) =>
    api.post<ApiResponse>(`/messages/${messageId}/react`, { emoji }),

  // Mark messages as read
  markAsRead: (chatId: string, messageIds: string[]) =>
    api.post<ApiResponse>('/messages/read', { chatId, messageIds }),

  // Mark as delivered
  markAsDelivered: (messageIds: string[], chatId: string) =>
    api.post<ApiResponse>('/messages/delivered', { messageIds, chatId }),

  // Search messages
  searchMessages: (chatId: string, query: string) =>
    api.get<ApiResponse>(`/messages/${chatId}/search?query=${encodeURIComponent(query)}`),

  // Get message stats
  getMessageStats: (chatId: string) =>
    api.get<ApiResponse>(`/messages/${chatId}/stats`),

  // Clear chat history
  clearChatHistory: (chatId: string, deleteForEveryone = false) =>
    api.delete<ApiResponse>(`/messages/${chatId}/clear?deleteForEveryone=${deleteForEveryone}`),
};

// ==================== USER APIs ====================
export const userAPI = {
  // Get my profile
  getProfile: () =>
    api.get<ApiResponse>('/users/me'),

  // Get user by ID
  getUserById: (id: string) =>
    api.get<ApiResponse>(`/users/${id}`),

  // Get user by username
  getUserByUsername: (username: string) =>
    api.get<ApiResponse>(`/users/username/${username}`),

  // Search users
  searchUsers: (q: string, limit = 20, page = 1) =>
    api.get<ApiResponse>(`/users/search?q=${encodeURIComponent(q)}&limit=${limit}&page=${page}`),

  // Update profile
  updateProfile: (data: any) =>
    api.put<ApiResponse>('/users/profile', data),

  // Update privacy settings
  updatePrivacy: (privacySettings: any) =>
    api.put<ApiResponse>('/users/privacy', { privacySettings }),

  // Update theme
  updateTheme: (theme: any) =>
    api.put<ApiResponse>('/users/theme', { theme }),

  // Update notifications
  updateNotifications: (notificationSettings: any) =>
    api.put<ApiResponse>('/users/notifications', { notificationSettings }),

  // Update app lock
  updateAppLock: (enabled: boolean, pin?: string, biometric?: boolean) =>
    api.put<ApiResponse>('/users/app-lock', { enabled, pin, biometric }),

  // Get settings
  getSettings: () =>
    api.get<ApiResponse>('/users/settings'),

  // Block user
  blockUser: (userId: string) =>
    api.post<ApiResponse>(`/users/${userId}/block`),

  // Unblock user
  unblockUser: (userId: string) =>
    api.post<ApiResponse>(`/users/${userId}/unblock`),

  // Get blocked users
  getBlockedUsers: () =>
    api.get<ApiResponse>('/users/blocked/list'),

  // Pin chat
  pinChat: (chatId: string) =>
    api.post<ApiResponse>(`/users/chat/${chatId}/pin`),

  // Unpin chat
  unpinChat: (chatId: string) =>
    api.post<ApiResponse>(`/users/chat/${chatId}/unpin`),

  // Get pinned chats
  getPinnedChats: () =>
    api.get<ApiResponse>('/users/pinned/chats'),

  // Archive chat
  archiveChat: (chatId: string) =>
    api.post<ApiResponse>(`/users/chat/${chatId}/archive`),

  // Unarchive chat
  unarchiveChat: (chatId: string) =>
    api.post<ApiResponse>(`/users/chat/${chatId}/unarchive`),

  // Get archived chats
  getArchivedChats: () =>
    api.get<ApiResponse>('/users/archived/chats'),

  // Check username availability
  checkUsername: (username: string) =>
    api.get<ApiResponse>(`/users/check-username?username=${encodeURIComponent(username)}`),

  // Get online status
  getOnlineStatus: (userId: string) =>
    api.get<ApiResponse>(`/users/status/${userId}`),

  // Update online status
  updateOnlineStatus: (isOnline: boolean) =>
    api.put<ApiResponse>('/users/status', { isOnline }),

  // Star message
  starMessage: (messageId: string) =>
    api.post<ApiResponse>(`/users/message/${messageId}/star`),

  // Unstar message
  unstarMessage: (messageId: string) =>
    api.post<ApiResponse>(`/users/message/${messageId}/unstar`),

  // Get starred messages
  getStarredMessages: () =>
    api.get<ApiResponse>('/users/starred/messages'),
};

// ==================== STORY APIs ====================
export const storyAPI = {
  // Get stories
  getStories: () =>
    api.get<ApiResponse>('/stories'),

  // Create story
  createStory: (type: string, content?: string, mediaUrl?: string, other?: any) =>
    api.post<ApiResponse>('/stories', {
      type,
      content,
      mediaUrl,
      ...other,
    }),

  // View story
  viewStory: (storyId: string) =>
    api.post<ApiResponse>(`/stories/${storyId}/view`),

  // React to story
  reactToStory: (storyId: string, emoji: string) =>
    api.post<ApiResponse>(`/stories/${storyId}/react`, { emoji }),

  // Delete story
  deleteStory: (storyId: string) =>
    api.delete<ApiResponse>(`/stories/${storyId}`),
};

// ==================== CALL APIs ====================
export const callAPI = {
  // Initiate call
  initiateCall: (receiverId: string, type: 'voice' | 'video') =>
    api.post<ApiResponse>('/calls/initiate', { receiverId, type }),

  // Get call history
  getCallHistory: () =>
    api.get<ApiResponse>('/calls/history'),

  // Accept call
  acceptCall: (callId: string) =>
    api.post<ApiResponse>(`/calls/${callId}/accept`),

  // Reject call
  rejectCall: (callId: string) =>
    api.post<ApiResponse>(`/calls/${callId}/reject`),

  // End call
  endCall: (callId: string) =>
    api.post<ApiResponse>(`/calls/${callId}/end`),
};

// ==================== CHANNEL APIs ====================
export const channelAPI = {
  // Get subscribed channels
  getChannels: () =>
    api.get<ApiResponse>('/channels'),

  // Get channel by username
  getChannelByUsername: (username: string) =>
    api.get<ApiResponse>(`/channels/${username}`),

  // Create channel
  createChannel: (username: string, displayName: string, bio?: string, avatar?: string) =>
    api.post<ApiResponse>('/channels', { username, displayName, bio, avatar }),

  // Subscribe to channel
  subscribeChannel: (channelId: string) =>
    api.post<ApiResponse>(`/channels/${channelId}/subscribe`),

  // Unsubscribe from channel
  unsubscribeChannel: (channelId: string) =>
    api.post<ApiResponse>(`/channels/${channelId}/unsubscribe`),
};

export default api;