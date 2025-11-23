import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import Chat from '../models/Chat';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();
router.use(authenticate);

// Get all chats for current user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const chats = await Chat.find({
      participants: req.userId,
    })
      .populate('participants', 'username displayName profilePicture isOnline lastSeen')
      .populate('lastMessage.sender', 'username displayName')
      .sort({ 'lastMessage.timestamp': -1 });

    res.json({ success: true, chats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'username displayName profilePicture isOnline lastSeen')
      .populate('admins', 'username displayName profilePicture');

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    // Verify user is participant
    const isParticipant = chat.participants.some(
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
});

// Create private or secret chat
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { participantId, type = 'private' } = req.body;

    // Check if chat already exists
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
});

// Create group chat
router.post('/group', async (req: AuthRequest, res: Response) => {
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
});

// Update chat (name, avatar, etc.)
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar, description, groupSettings } = req.body;
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    // Check if user is admin
    if (chat.type === 'group') {
      const isAdmin = chat.admins?.some(
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
});

// Delete chat
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Chat deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;