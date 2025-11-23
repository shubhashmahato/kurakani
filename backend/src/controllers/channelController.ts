import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Channel from '../models/Channel';

export const getChannels = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const channels = await Channel.find({
      subscribers: req.userId,
    })
      .populate('owner', 'username displayName profilePicture')
      .sort({ createdAt: -1 });

    res.json({ success: true, channels });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getChannelByUsername = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const channel = await Channel.findOne({
      username: req.params.username,
    })
      .populate('owner', 'username displayName profilePicture')
      .populate('subscribers', 'username displayName profilePicture');

    if (!channel) {
      res.status(404).json({ error: 'Channel not found' });
      return;
    }

    res.json({ success: true, channel });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createChannel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, displayName, bio, avatar } = req.body;

    const existingChannel = await Channel.findOne({ username });
    if (existingChannel) {
      res.status(400).json({ error: 'Username already taken' });
      return;
    }

    const channel = await Channel.create({
      owner: req.userId,
      username,
      displayName,
      bio,
      avatar,
      subscribers: [req.userId],
      admins: [req.userId],
    });

    res.status(201).json({ success: true, channel });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const subscribeChannel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ error: 'Channel not found' });
      return;
    }

    if (!channel.subscribers.includes(req.userId as any)) {
      channel.subscribers.push(req.userId as any);
      channel.totalSubscribers += 1;
      await channel.save();
    }

    res.json({ success: true, message: 'Subscribed to channel' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const unsubscribeChannel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ error: 'Channel not found' });
      return;
    }

    channel.subscribers = channel.subscribers.filter(
      (s: any) => s.toString() !== req.userId
    );
    channel.totalSubscribers -= 1;
    await channel.save();

    res.json({ success: true, message: 'Unsubscribed from channel' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};