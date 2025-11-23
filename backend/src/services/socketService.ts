import { Server, Socket } from 'socket.io';
import User from '../models/User';
import Chat from '../models/Chat';

interface TypingUser {
  userId: string;
  username: string;
  isTyping: boolean;
}

/**
 * Handle user typing indicator
 */
export const handleTyping = (
  io: Server,
  chatId: string,
  userId: string,
  username: string
): void => {
  io.to(chatId).emit('typing:indicator', {
    userId,
    username,
    isTyping: true,
    timestamp: new Date(),
  });
};

/**
 * Handle typing stop
 */
export const handleTypingStop = (
  io: Server,
  chatId: string,
  userId: string
): void => {
  io.to(chatId).emit('typing:stop', {
    userId,
    timestamp: new Date(),
  });
};

/**
 * Handle message delivery
 */
export const handleMessageDelivery = (
  io: Server,
  chatId: string,
  messageId: string,
  deliveredBy?: string
): void => {
  io.to(chatId).emit('message:delivered', {
    messageId,
    deliveredBy,
    deliveredAt: new Date(),
  });
};

/**
 * Handle message read
 */
export const handleMessageRead = (
  io: Server,
  chatId: string,
  messageId: string,
  userId: string
): void => {
  io.to(chatId).emit('message:read', {
    messageId,
    userId,
    readAt: new Date(),
  });
};

/**
 * Send call notification
 */
export const sendCallNotification = (
  io: Server,
  userId: string,
  callData: any
): void => {
  io.to(`user:${userId}`).emit('call:incoming', {
    ...callData,
    timestamp: new Date(),
  });
};

/**
 * Send call status update
 */
export const sendCallStatusUpdate = (
  io: Server,
  chatId: string,
  status: string,
  callId: string
): void => {
  io.to(chatId).emit('call:status', {
    callId,
    status,
    timestamp: new Date(),
  });
};

/**
 * Broadcast user online status
 */
export const broadcastUserStatus = (
  io: Server,
  userId: string,
  status: 'online' | 'offline',
  lastSeen?: Date
): void => {
  io.emit('user:status:changed', {
    userId,
    status,
    lastSeen: lastSeen || new Date(),
    timestamp: new Date(),
  });
};

/**
 * Send message reaction update
 */
export const sendReactionUpdate = (
  io: Server,
  chatId: string,
  messageId: string,
  userId: string,
  emoji: string,
  action: 'add' | 'remove'
): void => {
  io.to(chatId).emit('message:reaction:update', {
    messageId,
    userId,
    emoji,
    action,
    timestamp: new Date(),
  });
};

/**
 * Notify group members of new member
 */
export const notifyGroupNewMember = (
  io: Server,
  chatId: string,
  newMemberId: string,
  memberName: string
): void => {
  io.to(chatId).emit('group:member:added', {
    newMemberId,
    memberName,
    timestamp: new Date(),
  });
};

/**
 * Notify group members of member removal
 */
export const notifyGroupMemberRemoved = (
  io: Server,
  chatId: string,
  removedMemberId: string,
  memberName: string
): void => {
  io.to(chatId).emit('group:member:removed', {
    removedMemberId,
    memberName,
    timestamp: new Date(),
  });
};

/**
 * Send story view notification
 */
export const sendStoryViewNotification = (
  io: Server,
  storyOwnerId: string,
  viewerId: string,
  viewerName: string
): void => {
  io.to(`user:${storyOwnerId}`).emit('story:viewed', {
    viewerId,
    viewerName,
    timestamp: new Date(),
  });
};

/**
 * Send story reaction notification
 */
export const sendStoryReactionNotification = (
  io: Server,
  storyOwnerId: string,
  storyId: string,
  reactorId: string,
  reactorName: string,
  emoji: string
): void => {
  io.to(`user:${storyOwnerId}`).emit('story:reacted', {
    storyId,
    reactorId,
    reactorName,
    emoji,
    timestamp: new Date(),
  });
};