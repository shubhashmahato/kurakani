import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Call from '../models/Call';
import User from '../models/User';

export const initiateCall = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, type } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({ error: 'Receiver not found' });
      return;
    }

    const call = await Call.create({
      initiator: req.userId,
      receiver: receiverId,
      type,
      status: 'initiated',
    });

    res.status(201).json({ success: true, call });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCallHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const calls = await Call.find({
      $or: [
        { initiator: req.userId },
        { receiver: req.userId },
      ],
    })
      .populate('initiator', 'username displayName profilePicture')
      .populate('receiver', 'username displayName profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, calls });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptCall = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { callId } = req.params;

    const call = await Call.findByIdAndUpdate(
      callId,
      {
        status: 'ongoing',
        startTime: new Date(),
      },
      { new: true }
    );

    res.json({ success: true, call });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectCall = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { callId } = req.params;

    const call = await Call.findByIdAndUpdate(
      callId,
      { status: 'rejected' },
      { new: true }
    );

    res.json({ success: true, call });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const endCall = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);
    if (!call) {
      res.status(404).json({ error: 'Call not found' });
      return;
    }

    const duration = call.startTime
      ? Math.floor((Date.now() - call.startTime.getTime()) / 1000)
      : 0;

    const updated = await Call.findByIdAndUpdate(
      callId,
      {
        status: 'ended',
        endTime: new Date(),
        duration,
      },
      { new: true }
    );

    res.json({ success: true, call: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};