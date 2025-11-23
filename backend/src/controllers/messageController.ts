import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import Chat from '../models/Chat';
import { emitToChat, emitToUser } from '../config/socket';

// Get all messages for a chat
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Verify user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    const isParticipant = (chat.participants as any).some(
      (p: any) => p.toString() === req.userId
    );

    if (!isParticipant) {
      res.status(403).json({ error: 'Not authorized to view this chat' });
      return;
    }

    // Get messages with proper filtering
    const messages = await Message.find({
      chatId,
      $or: [
        { deletedFor: { $ne: req.userId } },
        { deletedForEveryone: false },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'username displayName profilePicture')
      .populate('replyTo', 'content sender type')
      .populate('mentions', 'username displayName')
      .exec();

    const total = await Message.countDocuments({
      chatId,
      $or: [
        { deletedFor: { $ne: req.userId } },
        { deletedForEveryone: false },
      ],
    });

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single message
export const getMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId)
      .populate('sender', 'username displayName profilePicture')
      .populate('replyTo', 'content sender type')
      .populate('mentions', 'username displayName')
      .populate('reactions.userId', 'username profilePicture');

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    res.status(200).json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Send message
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const io = req.app.get('io');
    const {
      chatId,
      type,
      content,
      mediaUrl,
      thumbnailUrl,
      fileName,
      fileSize,
      mimeType,
      duration,
      location,
      contact,
      poll,
      replyTo,
      mentions,
    } = req.body;

    // Validate required fields
    if (!chatId) {
      res.status(400).json({ error: 'Chat ID required' });
      return;
    }

    if (!type) {
      res.status(400).json({ error: 'Message type required' });
      return;
    }

    // Verify chat exists and user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    const isParticipant = (chat.participants as any).some(
      (p: any) => p.toString() === req.userId
    );

    if (!isParticipant) {
      res.status(403).json({ error: 'Not authorized to send messages to this chat' });
      return;
    }

    // Check group permissions
    if (chat.type === 'group' && (chat.groupSettings as any)?.onlyAdminsCanMessage) {
      const isAdmin = (chat.admins as any)?.some((a: any) => a.toString() === req.userId);
      if (!isAdmin) {
        res.status(403).json({ error: 'Only admins can send messages in this group' });
        return;
      }
    }

    // Create message
    const message = await Message.create({
      chatId,
      sender: req.userId,
      type,
      content,
      mediaUrl,
      thumbnailUrl,
      fileName,
      fileSize,
      mimeType,
      duration,
      location,
      contact,
      poll,
      replyTo,
      mentions,
      status: 'sent',
    });

    await message.populate('sender', 'username displayName profilePicture');
    if (replyTo) {
      await message.populate('replyTo', 'content sender type');
    }
    if (mentions && mentions.length > 0) {
      await message.populate('mentions', 'username displayName');
    }

    // Update chat last message
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: {
        text: content || type,
        sender: req.userId,
        timestamp: new Date(),
        type,
      },
    });

    // Emit to chat participants via Socket.io
    emitToChat(io, chatId, 'message:new', {
      message,
      chatId,
    });

    // Send notifications to mentioned users
    if (mentions && mentions.length > 0) {
      mentions.forEach((userId: string) => {
        emitToUser(io, userId, 'message:mentioned', {
          messageId: message._id,
          senderId: req.userId,
          chatId,
          content,
        });
      });
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Edit message
export const editMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const io = req.app.get('io');
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: 'Content required' });
      return;
    }

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    if (message.sender.toString() !== req.userId) {
      res.status(403).json({ error: 'Not authorized to edit this message' });
      return;
    }

    // Check if message is less than 1 hour old
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (message.createdAt < hourAgo) {
      res.status(400).json({ error: 'Can only edit messages within 1 hour' });
      return;
    }

    // Save edit history
    if (!message.editHistory) {
      message.editHistory = [];
    }
    message.editHistory.push({
      content: message.content || '',
      editedAt: new Date(),
    });

    message.content = content;
    message.isEdited = true;
    await message.save();

    // Emit update via Socket.io
    emitToChat(io, message.chatId.toString(), 'message:edit', {
      messageId,
      content,
      isEdited: true,
      editedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete message (for self or everyone)
export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const io = req.app.get('io');
    const { messageId } = req.params;
    const { deleteForEveryone } = req.query;

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    if (message.sender.toString() !== req.userId) {
      res.status(403).json({ error: 'Not authorized to delete this message' });
      return;
    }

    if (deleteForEveryone === 'true') {
      // Check if message is less than 1 hour old
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (message.createdAt < hourAgo) {
        res.status(400).json({ error: 'Can only delete for everyone within 1 hour' });
        return;
      }

      message.deletedForEveryone = true;
      message.isDeleted = true;
      await message.save();

      emitToChat(io, message.chatId.toString(), 'message:delete', {
        messageId,
        deleteForEveryone: true,
      });
    } else {
      // Delete for self only
      if (!message.deletedFor) {
        message.deletedFor = [];
      }
      if (!message.deletedFor.includes(req.userId as any)) {
        message.deletedFor.push(req.userId as any);
        await message.save();
      }

      emitToUser(io, req.userId, 'message:delete', {
        messageId,
        deleteForEveryone: false,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// React to message (add/remove emoji reaction)
export const reactToMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const io = req.app.get('io');
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      res.status(400).json({ error: 'Emoji required' });
      return;
    }

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    // Check if user already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      (r: any) => r.userId.toString() === req.userId && r.emoji === emoji
    );

    if (existingReactionIndex !== -1) {
      // Remove reaction
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      // Add reaction
      message.reactions.push({
        userId: req.userId as any,
        emoji,
        timestamp: new Date(),
      });
    }

    await message.save();

    emitToChat(io, message.chatId.toString(), 'message:react', {
      messageId,
      userId: req.userId,
      emoji,
      action: existingReactionIndex !== -1 ? 'remove' : 'add',
      reactions: message.reactions,
    });

    res.status(200).json({
      success: true,
      reactions: message.reactions,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const io = req.app.get('io');
    const { chatId, messageIds } = req.body;

    if (!chatId || !messageIds || messageIds.length === 0) {
      res.status(400).json({ error: 'Chat ID and message IDs required' });
      return;
    }

    const readAt = new Date();

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        chatId,
        sender: { $ne: req.userId },
      },
      {
        $addToSet: {
          readBy: {
            userId: req.userId,
            readAt,
          },
        },
        status: 'read',
      }
    );

    // Emit read receipt via Socket.io
    emitToChat(io, chatId, 'message:read', {
      userId: req.userId,
      messageIds,
      readAt,
    });

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Mark message as delivered
export const markAsDelivered = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const io = req.app.get('io');
    const { messageIds, chatId } = req.body;

    if (!messageIds || messageIds.length === 0) {
      res.status(400).json({ error: 'Message IDs required' });
      return;
    }

    await Message.updateMany(
      { _id: { $in: messageIds } },
      { status: 'delivered' }
    );

    emitToChat(io, chatId, 'message:delivered', {
      messageIds,
      deliveredAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Messages marked as delivered',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Search messages in a chat
export const searchMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ error: 'Search query required' });
      return;
    }

    // Verify user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    const isParticipant = (chat.participants as any).some(
      (p: any) => p.toString() === req.userId
    );

    if (!isParticipant) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const messages = await Message.find({
      chatId,
      content: { $regex: query, $options: 'i' },
      deletedForEveryone: false,
      deletedFor: { $ne: req.userId },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username displayName profilePicture')
      .populate('replyTo', 'content sender type')
      .exec();

    res.status(200).json({
      success: true,
      messages,
      count: messages.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get message statistics for a chat
export const getMessageStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

    // Verify user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    const isParticipant = (chat.participants as any).some(
      (p: any) => p.toString() === req.userId
    );

    if (!isParticipant) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const stats = await Message.aggregate([
      { $match: { chatId: require('mongoose').Types.ObjectId(chatId) } },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          textMessages: {
            $sum: { $cond: [{ $eq: ['$type', 'text'] }, 1, 0] },
          },
          mediaMessages: {
            $sum: {
              $cond: [
                { $in: ['$type', ['image', 'video', 'audio', 'document']] },
                1,
                0,
              ],
            },
          },
          totalReactions: { $sum: { $size: '$reactions' } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalMessages: 0,
        textMessages: 0,
        mediaMessages: 0,
        totalReactions: 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Clear chat history
export const clearChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { deleteForEveryone } = req.query;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    const isParticipant = (chat.participants as any).some(
      (p: any) => p.toString() === req.userId
    );

    if (!isParticipant) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    if (deleteForEveryone === 'true') {
      // Delete all messages in chat
      await Message.deleteMany({ chatId });
    } else {
      // Mark all messages as deleted for this user
      await Message.updateMany(
        { chatId },
        { $addToSet: { deletedFor: req.userId } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Chat history cleared',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};