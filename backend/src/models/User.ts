import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  firebaseUid: string;
  username: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  coverPhoto?: string;
  bio?: string;
  pronouns?: string;
  dateOfBirth?: Date;
  isOnline: boolean;
  lastSeen: Date;
  blockedUsers: string[];
  pinnedChats: string[];
  archivedChats: string[];
  starredMessages: string[];
  privacySettings: {
    lastSeenVisible: boolean;
    profilePhotoVisible: boolean;
    readReceipts: boolean;
    onlineStatus: boolean;
  };
  theme: {
    color: string;
    darkMode: boolean;
    bubbleStyle: string;
    font: string;
  };
  notificationSettings: {
    sound: boolean;
    vibration: boolean;
    preview: boolean;
    groupNotifications: boolean;
  };
  appLock: {
    enabled: boolean;
    pin?: string;
    biometric: boolean;
  };
  devices: Array<{
    deviceId: string;
    pushToken?: string;
    lastActive: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: String,
    profilePicture: String,
    coverPhoto: String,
    bio: { type: String, maxlength: 150 },
    pronouns: String,
    dateOfBirth: Date,
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    pinnedChats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
    archivedChats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
    starredMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    privacySettings: {
      lastSeenVisible: { type: Boolean, default: true },
      profilePhotoVisible: { type: Boolean, default: true },
      readReceipts: { type: Boolean, default: true },
      onlineStatus: { type: Boolean, default: true },
    },
    theme: {
      color: { type: String, default: '#008080' },
      darkMode: { type: Boolean, default: false },
      bubbleStyle: { type: String, default: 'rounded' },
      font: { type: String, default: 'default' },
    },
    notificationSettings: {
      sound: { type: Boolean, default: true },
      vibration: { type: Boolean, default: true },
      preview: { type: Boolean, default: true },
      groupNotifications: { type: Boolean, default: true },
    },
    appLock: {
      enabled: { type: Boolean, default: false },
      pin: String,
      biometric: { type: Boolean, default: false },
    },
    devices: [
      {
        deviceId: String,
        pushToken: String,
        lastActive: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });

export default mongoose.model<IUser>('User', userSchema);