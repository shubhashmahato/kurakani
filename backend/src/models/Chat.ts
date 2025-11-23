import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  type: 'private' | 'group' | 'secret';
  participants: string[];
  admins?: string[];
  name?: string;
  avatar?: string;
  description?: string;
  isEncrypted: boolean;
  lastMessage?: {
    text: string;
    sender: string;
    timestamp: Date;
    type: string;
  };
  createdBy?: string;
  groupSettings?: {
    onlyAdminsCanMessage: boolean;
    onlyAdminsCanAddMembers: boolean;
    showMembersList: boolean;
  };
  secretChatSettings?: {
    selfDestructTimer: number;
    disableScreenShot: boolean;
  };
  unreadCounts: Map<string, number>;
  pinnedMessages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    type: {
      type: String,
      enum: ['private', 'group', 'secret'],
      default: 'private',
    },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: String,
    avatar: String,
    description: String,
    isEncrypted: { type: Boolean, default: false },
    lastMessage: {
      text: String,
      sender: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: Date,
      type: String,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    groupSettings: {
      onlyAdminsCanMessage: { type: Boolean, default: false },
      onlyAdminsCanAddMembers: { type: Boolean, default: false },
      showMembersList: { type: Boolean, default: true },
    },
    secretChatSettings: {
      selfDestructTimer: { type: Number, default: 0 },
      disableScreenShot: { type: Boolean, default: true },
    },
    unreadCounts: { type: Map, of: Number, default: new Map() },
    pinnedMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });
chatSchema.index({ createdAt: -1 });

export default mongoose.model<IChat>('Chat', chatSchema);