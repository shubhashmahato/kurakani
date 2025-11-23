import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Story from '../models/Story';

export const getStories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stories = await Story.find({
      $or: [
        { userId: req.userId },
        { privacy: 'public' },
        { privacy: 'contacts', visibleTo: req.userId },
      ],
      expiresAt: { $gt: new Date() },
    })
      .populate('userId', 'username displayName profilePicture')
      .sort({ createdAt: -1 });

    res.json({ success: true, stories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createStory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, content, mediaUrl, textColor, backgroundColor, font, privacy, visibleTo } = req.body;

    const story = await Story.create({
      userId: req.userId,
      type,
      content,
      mediaUrl,
      textColor,
      backgroundColor,
      font,
      privacy,
      visibleTo,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await story.populate('userId', 'username displayName profilePicture');

    res.status(201).json({ success: true, story });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const viewStory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);
    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    const alreadyViewed = story.views.some(
      (v: any) => v.userId.toString() === req.userId
    );

    if (!alreadyViewed) {
      story.views.push({
        userId: req.userId as any,
        viewedAt: new Date(),
      });
      await story.save();
    }

    res.json({ success: true, story });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const reactToStory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { storyId } = req.params;
    const { emoji } = req.body;

    const story = await Story.findById(storyId);
    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    const existingReaction = story.reactions.find(
      (r: any) => r.userId.toString() === req.userId && r.emoji === emoji
    );

    if (existingReaction) {
      story.reactions = story.reactions.filter(
        (r: any) => !(r.userId.toString() === req.userId && r.emoji === emoji)
      );
    } else {
      story.reactions.push({
        userId: req.userId as any,
        emoji,
        timestamp: new Date(),
      });
    }

    await story.save();

    res.json({ success: true, reactions: story.reactions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    if (story.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Not authorized to delete this story' });
      return;
    }

    await Story.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Story deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};