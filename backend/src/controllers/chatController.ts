import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Chat from '../models/Chat';
import Message from '../models/Message';

export const getChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chats = await Chat.find({ participants: req.userId })
      .populate('participants', 'username displayName profilePicture isOnline lastSeen')
      .populate('lastMessage.sender', 'username displayName')
      .sort({ 'lastMessage.timestamp': -1 });

    res.json({ success: true, chats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'username displayName profilePicture isOnline lastSeen')
      .populate('admins', 'username displayName profilePicture');

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    const isParticipant = (chat.participants as any).some(
      (p: any) => p._id.toString() === req.userId
    );

    if (!isParticipant) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    res.json({ success: true, chat });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPrivateChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { participantId, type = 'private' } = req.body;

    const existingChat = await Chat.findOne({
      type: { $in: ['private', 'secret'] },
      participants: { $all: [req.userId, participantId], $size: 2 },
    });

    if (existingChat) {
      res.json({ success: true, chat: existingChat });
      return;
    }

    const chat = await Chat.create({
      type,
      participants: [req.userId, participantId],
      isEncrypted: type === 'secret',
    });

    await chat.populate('participants', 'username displayName profilePicture');

    res.status(201).json({ success: true, chat });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createGroupChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, participants, avatar } = req.body;

    if (!name || !participants || participants.length < 2) {
      res.status(400).json({ error: 'Name and at least 2 participants required' });
      return;
    }

    const chat = await Chat.create({
      type: 'group',
      name,
      participants: [req.userId, ...participants],
      admins: [req.userId],
      createdBy: req.userId,
      avatar,
    });

    await chat.populate('participants', 'username displayName profilePicture');

    res.status(201).json({ success: true, chat });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, avatar, description, groupSettings } = req.body;
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (chat.type === 'group') {
      const isAdmin = (chat.admins as any)?.some(
        (a: any) => a.toString() === req.userId
      );

      if (!isAdmin) {
        res.status(403).json({ error: 'Only admins can edit group' });
        return;
      }
    }

    const updated = await Chat.findByIdAndUpdate(
      req.params.id,
      { name, avatar, description, groupSettings },
      { new: true }
    ).populate('participants', 'username displayName profilePicture');

    res.json({ success: true, chat: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Chat deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};