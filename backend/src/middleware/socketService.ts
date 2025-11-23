import { Server } from 'socket.io';

export const handleTyping = (io: Server, chatId: string, userId: string, username: string) => {
  io.to(chatId).emit('typing:indicator', { userId, username, isTyping: true });
};

export const handleMessageDelivery = (io: Server, chatId: string, messageId: string) => {
  io.to(chatId).emit('message:delivered', { messageId, timestamp: new Date() });
};

export const handleMessageRead = (io: Server, chatId: string, messageId: string, userId: string) => {
  io.to(chatId).emit('message:read', { messageId, userId, timestamp: new Date() });
};

export const handleCallNotification = (io: Server, userId: string, callData: any) => {
  io.to(`user:${userId}`).emit('call:incoming', callData);
};