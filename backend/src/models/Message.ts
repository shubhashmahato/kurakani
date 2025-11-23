import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chatId: string;
  sender: string;
  type: string;
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  contact?: {
    name: string;
    phoneNumber: string;
  };
  poll?: {
    question: string;
    options: Array<{ text: string; votes: number }>;
  };
  replyTo?: string;
  mentions?: string[];
  reactions: Array<{
    userId: string;
    emoji: string;
    timestamp: Date;
  }>;
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;
  status: 'sent' | 'delivered' | 'read';
  isEdited: boolean;
  editHistory?: Array<{
    content: string;
    editedAt: Date;
  }>;
  isDeleted: boolean;
  deletedForEveryone: boolean;
  deletedFor: string[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'text',
        'image',
        'video',
        'audio',
        'document',
        'location',
        'contact',
        'poll',
        'sticker',
        'link',
      ],
      default: 'text',
    },
    content: String,
    mediaUrl: String,
    thumbnailUrl: String,
    fileName: String,
    fileSize: Number,
    mimeType: String,
    duration: Number,
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    contact: {
      name: String,
      phoneNumber: String,
    },
    poll: {
      question: String,
      options: [
        {
          text: String,
          votes: { type: Number, default: 0 },
        },
      ],
    },
    replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    reactions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        emoji: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    readBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    isEdited: { type: Boolean, default: false },
    editHistory: [
      {
        content: String,
        editedAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: { type: Boolean, default: false },
    deletedForEveryone: { type: Boolean, default: false },
    deletedFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);