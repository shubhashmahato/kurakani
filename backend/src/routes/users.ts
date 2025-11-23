import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get user by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-appLock.pin -devices.pushToken');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by username
router.get('/username/:username', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-appLock.pin -devices.pushToken');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Search users
router.get('/search', async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      res.status(400).json({ error: 'Search query required' });
      return;
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } },
        { phoneNumber: q },
      ],
    })
      .select('username displayName profilePicture bio')
      .limit(20);

    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const { displayName, bio, profilePicture, coverPhoto, pronouns, dateOfBirth } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        displayName,
        bio,
        profilePicture,
        coverPhoto,
        pronouns,
        dateOfBirth,
      },
      { new: true }
    ).select('-appLock.pin -devices.pushToken');

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update privacy settings
router.put('/privacy', async (req: AuthRequest, res: Response) => {
  try {
    const { privacySettings } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { privacySettings },
      { new: true }
    );

    res.json({ success: true, privacySettings: user?.privacySettings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update theme
router.put('/theme', async (req: AuthRequest, res: Response) => {
  try {
    const { theme } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { theme },
      { new: true }
    );

    res.json({ success: true, theme: user?.theme });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update notification settings
router.put('/notifications', async (req: AuthRequest, res: Response) => {
  try {
    const { notificationSettings } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { notificationSettings },
      { new: true }
    );

    res.json({ success: true, notificationSettings: user?.notificationSettings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Block user
router.post('/:id/block', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.blockedUsers.includes(req.params.id as any)) {
      user.blockedUsers.push(req.params.id as any);
      await user.save();
    }

    res.json({ success: true, message: 'User blocked' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Unblock user
router.post('/:id/unblock', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.blockedUsers = user.blockedUsers.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();

    res.json({ success: true, message: 'User unblocked' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;