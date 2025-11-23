import mongoose, { Schema, Document } from 'mongoose';

export interface ICall extends Document {
  initiator: string;
  receiver: string;
  type: 'voice' | 'video';
  status: 'initiated' | 'ringing' | 'ongoing' | 'ended' | 'missed' | 'rejected';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  agoraChannelName?: string;
  agoraToken?: string;
  isGroupCall: boolean;
  participants?: string[];
  screenSharing?: boolean;
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const callSchema = new Schema<ICall>(
  {
    initiator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['voice', 'video'],
      required: true,
    },
    status: {
      type: String,
      enum: ['initiated', 'ringing', 'ongoing', 'ended', 'missed', 'rejected'],
      default: 'initiated',
    },
    startTime: Date,
    endTime: Date,
    duration: Number,
    agoraChannelName: String,
    agoraToken: String,
    isGroupCall: { type: Boolean, default: false },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    screenSharing: { type: Boolean, default: false },
    recordingUrl: String,
  },
  { timestamps: true }
);

callSchema.index({ initiator: 1, createdAt: -1 });
callSchema.index({ receiver: 1 });

export default mongoose.model<ICall>('Call', callSchema);