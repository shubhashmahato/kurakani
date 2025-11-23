import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';

export const firebaseAuth = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      res.status(400).json({ error: 'Firebase token required' });
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      const username = email.split('@')[0] + Math.random().toString(36).substr(2, 9);

      user = await User.create({
        firebaseUid: uid,
        username,
        displayName: name || email,
        email,
        profilePicture: picture,
        isOnline: true,
        lastSeen: new Date(),
      });
    } else {
      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-appLock.pin');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePushToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pushToken, deviceId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const deviceIndex = user.devices.findIndex((d: any) => d.deviceId === deviceId);

    if (deviceIndex !== -1) {
      user.devices[deviceIndex].pushToken = pushToken;
      user.devices[deviceIndex].lastActive = new Date();
    } else {
      user.devices.push({
        deviceId,
        pushToken,
        lastActive: new Date(),
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Push token updated',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};