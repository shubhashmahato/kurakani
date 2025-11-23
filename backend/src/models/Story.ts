import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  userId: string;
  type: 'text' | 'image' | 'video';
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  textColor?: string;
  backgroundColor?: string;
  font?: string;
  privacy: 'public' | 'contacts' | 'custom';
  visibleTo?: string[];
  hiddenFrom?: string[];
  views: Array<{
    userId: string;
    viewedAt: Date;
  }>;
  reactions: Array<{
    userId: string;
    emoji: string;
    timestamp: Date;
  }>;
  replies: Array<{
    userId: string;
    message: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  expiresAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video'],
      default: 'image',
    },
    content: String,
    mediaUrl: String,
    thumbnailUrl: String,
    textColor: { type: String, default: '#000000' },
    backgroundColor: { type: String, default: '#FFFFFF' },
    font: { type: String, default: 'default' },
    privacy: {
      type: String,
      enum: ['public', 'contacts', 'custom'],
      default: 'contacts',
    },
    visibleTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    hiddenFrom: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    views: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    reactions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        emoji: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    replies: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

storySchema.index({ userId: 1, createdAt: -1 });
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IStory>('Story', storySchema);