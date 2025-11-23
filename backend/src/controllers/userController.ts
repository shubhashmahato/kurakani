// =====================================================
// FILE: src/controllers/userController.ts
// Complete User Controller for Kurakani Backend
// =====================================================

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Chat from '../models/Chat';
import { IUser } from '../models/User';

// ========== GET OPERATIONS ==========

/**
 * Get current user profile
 */
export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
      .select('-appLock.pin -devices.pushToken')
      .populate('blockedUsers', 'username displayName profilePicture')
      .populate('pinnedChats', 'name type')
      .populate('archivedChats', 'name type');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (error: any) {
    console.error('Error fetching my profile:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-appLock.pin -devices.pushToken -email')
      .populate('blockedUsers', 'username displayName profilePicture')
      .populate('pinnedChats', 'name participants')
      .populate('archivedChats', 'name participants');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if current user has blocked this user
    const currentUser = await User.findById(req.userId);
    const isBlocked = (currentUser?.blockedUsers as any)?.includes(id);

    if (isBlocked) {
      res.status(403).json({ error: 'You have blocked this user' });
      return;
    }

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user by username
 */
export const getUserByUsername = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select('-appLock.pin -devices.pushToken -email')
      .populate('blockedUsers', 'username displayName profilePicture');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Search users by query (username, display name, email)
 */
export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q, limit = 20, page = 1 } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Search query required' });
      return;
    }

    if (q.length < 2) {
      res.status(400).json({ error: 'Search query must be at least 2 characters' });
      return;
    }

    const skip = ((parseInt(page as string) || 1) - 1) * parseInt(limit as string);
    const limitNum = Math.min(parseInt(limit as string) || 20, 50);

    const searchQuery = {
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
      _id: { $ne: req.userId }, // Exclude current user
    };

    const users = await User.find(searchQuery)
      .select('username displayName profilePicture bio isOnline')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await User.countDocuments(searchQuery);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page as string) || 1,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user settings
 */
export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select(
      'privacySettings theme notificationSettings appLock'
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      settings: {
        privacy: user.privacySettings,
        theme: user.theme,
        notifications: user.notificationSettings,
        appLock: {
          enabled: user.appLock?.enabled,
          biometric: user.appLock?.biometric,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get blocked users list
 */
export const getBlockedUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
      .select('blockedUsers')
      .populate('blockedUsers', 'username displayName profilePicture bio');

    res.json({
      success: true,
      blockedUsers: user?.blockedUsers || [],
      count: user?.blockedUsers?.length || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get pinned chats
 */
export const getPinnedChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
      .select('pinnedChats')
      .populate('pinnedChats', 'name type participants');

    res.json({
      success: true,
      pinnedChats: user?.pinnedChats || [],
      count: user?.pinnedChats?.length || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get archived chats
 */
export const getArchivedChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
      .select('archivedChats')
      .populate('archivedChats', 'name type participants lastMessage');

    res.json({
      success: true,
      archivedChats: user?.archivedChats || [],
      count: user?.archivedChats?.length || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ========== UPDATE OPERATIONS ==========

/**
 * Update user profile (display name, bio, photos, etc.)
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { displayName, bio, pronouns, dateOfBirth, profilePicture, coverPhoto } = req.body;

    // Validate input lengths
    if (displayName && displayName.length > 50) {
      res.status(400).json({ error: 'Display name must be less than 50 characters' });
      return;
    }

    if (bio && bio.length > 150) {
      res.status(400).json({ error: 'Bio must be less than 150 characters' });
      return;
    }

    const updateData: any = {};

    if (displayName) updateData.displayName = displayName.trim();
    if (bio !== undefined) updateData.bio = bio?.trim() || '';
    if (pronouns) updateData.pronouns = pronouns.trim();
    if (dateOfBirth) {
      const date = new Date(dateOfBirth);
      if (date > new Date()) {
        res.status(400).json({ error: 'Invalid date of birth' });
        return;
      }
      updateData.dateOfBirth = date;
    }
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (coverPhoto) updateData.coverPhoto = coverPhoto;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-appLock.pin -devices.pushToken');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { privacySettings } = req.body;

    if (!privacySettings || typeof privacySettings !== 'object') {
      res.status(400).json({ error: 'Privacy settings object required' });
      return;
    }

    const allowedKeys = ['lastSeenVisible', 'profilePhotoVisible', 'readReceipts', 'onlineStatus'];
    const validSettings = {};

    for (const key of allowedKeys) {
      if (key in privacySettings) {
        (validSettings as any)[key] = Boolean(privacySettings[key]);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { privacySettings: validSettings },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Privacy settings updated',
      privacySettings: user?.privacySettings,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update theme settings
 */
export const updateTheme = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { color, darkMode, bubbleStyle, font } = req.body;

    const validColors = ['#008080', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
    const validBubbleStyles = ['rounded', 'square', 'pill'];
    const validFonts = ['default', 'serif', 'monospace'];

    const theme: any = {};

    if (color) {
      if (!validColors.includes(color)) {
        res.status(400).json({ error: 'Invalid color' });
        return;
      }
      theme.color = color;
    }

    if (darkMode !== undefined) theme.darkMode = Boolean(darkMode);
    if (bubbleStyle) {
      if (!validBubbleStyles.includes(bubbleStyle)) {
        res.status(400).json({ error: 'Invalid bubble style' });
        return;
      }
      theme.bubbleStyle = bubbleStyle;
    }
    if (font) {
      if (!validFonts.includes(font)) {
        res.status(400).json({ error: 'Invalid font' });
        return;
      }
      theme.font = font;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { theme },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Theme updated',
      theme: user?.theme,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { sound, vibration, preview, groupNotifications } = req.body;

    const notificationSettings: any = {};

    if (sound !== undefined) notificationSettings.sound = Boolean(sound);
    if (vibration !== undefined) notificationSettings.vibration = Boolean(vibration);
    if (preview !== undefined) notificationSettings.preview = Boolean(preview);
    if (groupNotifications !== undefined) notificationSettings.groupNotifications = Boolean(groupNotifications);

    const user = await User.findByIdAndUpdate(
      req.userId,
      { notificationSettings },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Notification settings updated',
      notificationSettings: user?.notificationSettings,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Enable or disable app lock
 */
export const updateAppLock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { enabled, pin, biometric } = req.body;

    if (enabled && (!pin || pin.length < 4)) {
      res.status(400).json({ error: 'PIN must be at least 4 characters' });
      return;
    }

    if (enabled && !/^\d+$/.test(pin)) {
      res.status(400).json({ error: 'PIN must contain only numbers' });
      return;
    }

    const appLock = {
      enabled: Boolean(enabled),
      pin: enabled ? pin : undefined,
      biometric: Boolean(biometric),
    };

    const user = await User.findByIdAndUpdate(
      req.userId,
      { appLock },
      { new: true }
    ).select('-appLock.pin');

    res.json({
      success: true,
      message: 'App lock updated',
      appLock: {
        enabled: user?.appLock?.enabled,
        biometric: user?.appLock?.biometric,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ========== BLOCK/UNBLOCK OPERATIONS ==========

/**
 * Block a user
 */
export const blockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Validate user ID format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    if (userId === req.userId) {
      res.status(400).json({ error: 'Cannot block yourself' });
      return;
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'Current user not found' });
      return;
    }

    // Check if already blocked
    const isAlreadyBlocked = (user.blockedUsers as any).some(
      (id: any) => id.toString() === userId
    );

    if (isAlreadyBlocked) {
      res.status(400).json({ error: 'User already blocked' });
      return;
    }

    user.blockedUsers.push(userId as any);
    await user.save();

    res.json({
      success: true,
      message: 'User blocked successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Unblock a user
 */
export const unblockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const initialLength = user.blockedUsers.length;
    user.blockedUsers = user.blockedUsers.filter((id: any) => id.toString() !== userId);

    if (user.blockedUsers.length === initialLength) {
      res.status(400).json({ error: 'User is not blocked' });
      return;
    }

    await user.save();

    res.json({
      success: true,
      message: 'User unblocked successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ========== PIN/UNPIN CHAT OPERATIONS ==========

/**
 * Pin a chat
 */
export const pinChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

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
      res.status(403).json({ error: 'Not a participant in this chat' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isAlreadyPinned = (user.pinnedChats as any).some(
      (id: any) => id.toString() === chatId
    );

    if (isAlreadyPinned) {
      res.status(400).json({ error: 'Chat already pinned' });
      return;
    }

    // Limit pinned chats to 5
    if (user.pinnedChats.length >= 5) {
      res.status(400).json({ error: 'Maximum 5 chats can be pinned' });
      return;
    }

    user.pinnedChats.push(chatId as any);
    await user.save();

    res.json({
      success: true,
      message: 'Chat pinned successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Unpin a chat
 */
export const unpinChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const initialLength = user.pinnedChats.length;
    user.pinnedChats = (user.pinnedChats as any).filter(
      (id: any) => id.toString() !== chatId
    );

    if (user.pinnedChats.length === initialLength) {
      res.status(400).json({ error: 'Chat is not pinned' });
      return;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Chat unpinned successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ========== ARCHIVE/UNARCHIVE CHAT OPERATIONS ==========

/**
 * Archive a chat
 */
export const archiveChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

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
      res.status(403).json({ error: 'Not a participant in this chat' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isAlreadyArchived = (user.archivedChats as any).some(
      (id: any) => id.toString() === chatId
    );

    if (isAlreadyArchived) {
      res.status(400).json({ error: 'Chat already archived' });
      return;
    }

    user.archivedChats.push(chatId as any);
    await user.save();

    res.json({
      success: true,
      message: 'Chat archived successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Unarchive a chat
 */
export const unarchiveChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const initialLength = user.archivedChats.length;
    user.archivedChats = (user.archivedChats as any).filter(
      (id: any) => id.toString() !== chatId
    );

    if (user.archivedChats.length === initialLength) {
      res.status(400).json({ error: 'Chat is not archived' });
      return;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Chat unarchived successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ========== UTILITY OPERATIONS ==========

/**
 * Check username availability
 */
export const checkUsernameAvailability = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
      res.status(400).json({ error: 'Username required' });
      return;
    }

    if (username.length < 3) {
      res.status(400).json({ error: 'Username must be at least 3 characters' });
      return;
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });

    res.json({
      success: true,
      available: !existingUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user online status
 */
export const getOnlineStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('isOnline lastSeen');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      status: {
        userId,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update user online status
 */
export const updateOnlineStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { isOnline } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        isOnline: Boolean(isOnline),
        lastSeen: new Date(),
      },
      { new: true }
    ).select('isOnline lastSeen');

    res.json({
      success: true,
      status: {
        isOnline: user?.isOnline,
        lastSeen: user?.lastSeen,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete user account
 */
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { password } = req.body;

    // In production, verify password before deletion
    if (!password) {
      res.status(400).json({ error: 'Password required for account deletion' });
      return;
    }

    // Delete user and all related data
    await User.findByIdAndDelete(req.userId);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Star a message
 */
export const starMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isAlreadyStarred = (user.starredMessages as any).includes(messageId);

    if (isAlreadyStarred) {
      res.status(400).json({ error: 'Message already starred' });
      return;
    }

    user.starredMessages.push(messageId as any);
    await user.save();

    res.json({
      success: true,
      message: 'Message starred successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Unstar a message
 */
export const unstarMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.starredMessages = (user.starredMessages as any).filter(
      (id: any) => id.toString() !== messageId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Message unstarred successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get starred messages
 */
export const getStarredMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
      .select('starredMessages')
      .populate({
        path: 'starredMessages',
        model: 'Message',
        populate: [
          { path: 'sender', select: 'username displayName profilePicture' },
          { path: 'chatId', select: 'name type' },
        ],
      });

    res.json({
      success: true,
      starredMessages: user?.starredMessages || [],
      count: user?.starredMessages?.length || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};