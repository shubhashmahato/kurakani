import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private listeners: Map<string, Set<Function>> = new Map();
  private isConnecting = false;

  /**
   * Connect to socket server
   */
  async connect(userId?: string): Promise<boolean> {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return true;
    }

    if (this.isConnecting) {
      console.log('Socket connection in progress');
      return new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(checkConnection);
            resolve(true);
          }
        }, 100);
      });
    }

    try {
      this.isConnecting = true;
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        console.error('No auth token found for socket connection');
        this.isConnecting = false;
        return false;
      }

      this.socket = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        transports: ['websocket'],
        forceNew: true,
      });

      this.setupListeners();

      return new Promise((resolve) => {
        this.socket!.once('connect', () => {
          console.log('✅ Socket connected:', this.socket!.id);
          if (userId) {
            this.socket!.emit('user:online', userId);
          }
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          resolve(true);
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          if (!this.socket?.connected) {
            console.error('Socket connection timeout');
            this.isConnecting = false;
            resolve(false);
          }
        }, 10000);
      });
    } catch (error) {
      console.error('❌ Socket connection error:', error);
      this.isConnecting = false;
      return false;
    }
  }

  /**
   * Setup default socket listeners
   */
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.reconnectAttempts++;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error event:', error);
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...', this.reconnectAttempts);
    });
  }

  /**
   * Listen to socket event
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    this.socket?.on(event, callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (data: any) => void): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  /**
   * Listen to event once
   */
  once(event: string, callback: (data: any) => void): void {
    this.socket?.once(event, callback);
  }

  /**
   * Emit event to server
   */
  emit(event: string, data?: any): void {
    if (!this.socket?.connected) {
      console.warn('❌ Socket not connected. Event queued:', event);
      return;
    }
    this.socket.emit(event, data);
  }

  // ==================== CHAT EVENTS ====================

  /**
   * Join chat room
   */
  joinChat(chatId: string): void {
    this.emit('chat:join', chatId);
  }

  /**
   * Leave chat room
   */
  leaveChat(chatId: string): void {
    this.emit('chat:leave', chatId);
  }

  /**
   * Start typing indicator
   */
  startTyping(chatId: string, username: string): void {
    this.emit('typing:start', { chatId, username });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(chatId: string): void {
    this.emit('typing:stop', { chatId });
  }

  // ==================== MESSAGE EVENTS ====================

  /**
   * Send message
   */
  sendMessage(messageData: any): void {
    this.emit('message:send', messageData);
  }

  /**
   * Mark message as delivered
   */
  messageDelivered(messageId: string, chatId: string): void {
    this.emit('message:delivered', { messageId, chatId });
  }

  /**
   * Mark message as read
   */
  messageRead(messageId: string, chatId: string): void {
    this.emit('message:read', { messageId, chatId });
  }

  /**
   * React to message
   */
  reactMessage(messageId: string, emoji: string, chatId: string): void {
    this.emit('message:react', { messageId, emoji, chatId });
  }

  /**
   * Delete message
   */
  deleteMessage(messageId: string, chatId: string, deleteForEveryone?: boolean): void {
    this.emit('message:delete', { messageId, chatId, deleteForEveryone });
  }

  /**
   * Edit message
   */
  editMessage(messageId: string, content: string, chatId: string): void {
    this.emit('message:edit', { messageId, content, chatId });
  }

  // ==================== USER STATUS EVENTS ====================

  /**
   * Set user online
   */
  setUserOnline(userId: string): void {
    this.emit('user:online', userId);
  }

  /**
   * Set user offline
   */
  setUserOffline(userId: string): void {
    this.emit('user:offline', userId);
  }

  // ==================== CALL EVENTS ====================

  /**
   * Initiate call
   */
  initiateCall(receiverId: string, type: 'voice' | 'video'): void {
    this.emit('call:initiate', { receiverId, type });
  }

  /**
   * Accept call
   */
  acceptCall(callId: string): void {
    this.emit('call:accept', { callId });
  }

  /**
   * Reject call
   */
  rejectCall(callId: string): void {
    this.emit('call:reject', { callId });
  }

  /**
   * End call
   */
  endCall(callId: string): void {
    this.emit('call:end', { callId });
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get socket ID
   */
  getId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('Socket disconnected');
    }
  }

  /**
   * Reconnect socket
   */
  reconnect(): void {
    this.disconnect();
    this.connect();
  }
}

export default new SocketService();