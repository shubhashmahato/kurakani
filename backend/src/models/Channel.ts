import mongoose, { Schema, Document } from 'mongoose';

export interface IChannel extends Document {
  owner: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverPhoto?: string;
  isVerified: boolean;
  isPrivate: boolean;
  subscribers: string[];
  admins: string[];
  posts: string[];
  totalSubscribers: number;
  totalViews: number;
  totalPosts: number;
  settings: {
    slowMode: boolean;
    requireSignature: boolean;
    commentsEnabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const channelSchema = new Schema<IChannel>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: { type: String, required: true, unique: true, lowercase: true },
    displayName: { type: String, required: true },
    bio: { type: String, maxlength: 150 },
    avatar: String,
    coverPhoto: String,
    isVerified: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    subscribers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'ChannelPost' }],
    totalSubscribers: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    settings: {
      slowMode: { type: Boolean, default: false },
      requireSignature: { type: Boolean, default: false },
      commentsEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

channelSchema.index({ username: 1 });
channelSchema.index({ owner: 1 });

export default mongoose.model<IChannel>('Channel', channelSchema);