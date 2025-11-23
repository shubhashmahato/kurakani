import { Server } from 'socket.io';
import User from '../models/User';
import Chat from '../models/Chat';

const activeUsers = new Map();

export const initializeSocket = async (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);

    // User comes online
    socket.on('user:online', async (userId) => {
      try {
        activeUsers.set(userId, socket.id);
        socket.join(`user:${userId}`);
        
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: new Date(),
        });

        socket.broadcast.emit('user:status', {
          userId,
          status: 'online',
          timestamp: new Date(),
        });

        console.log(`🟢 User online: ${userId}`);
      } catch (error) {
        console.error('Error setting user online:', error);
      }
    });

    // Join chat room
    socket.on('chat:join', (chatId) => {
      socket.join(chatId);
      console.log(`📌 User joined chat: ${chatId}`);
    });

    // Leave chat room
    socket.on('chat:leave', (chatId) => {
      socket.leave(chatId);
      console.log(`📌 User left chat: ${chatId}`);
    });

    // Typing indicator
    socket.on('typing:start', ({ chatId, userId, username }) => {
      socket.broadcast.to(chatId).emit('typing:start', {
        userId,
        username,
        chatId,
      });
    });

    socket.on('typing:stop', ({ chatId, userId }) => {
      socket.broadcast.to(chatId).emit('typing:stop', {
        userId,
        chatId,
      });
    });

    // User goes offline
    socket.on('user:offline', async (userId) => {
      try {
        activeUsers.delete(userId);
        
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        socket.broadcast.emit('user:status', {
          userId,
          status: 'offline',
          lastSeen: new Date(),
        });

        console.log(`🔴 User offline: ${userId}`);
      } catch (error) {
        console.error('Error setting user offline:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`👤 User disconnected: ${socket.id}`);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

export const emitToChat = (io: Server, chatId: string, event: string, data: any) => {
  io.to(chatId).emit(event, data);
};

export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  const socketId = activeUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

export const getActiveUsers = () => activeUsers;