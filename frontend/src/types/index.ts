// User Types
export interface User {
  _id: string;
  firebaseUid: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  displayName: string;
  bio?: string;
  profilePicture?: string;
  coverPhoto?: string;
  pronouns?: string;
  dateOfBirth?: Date;
  isOnline: boolean;
  lastSeen: Date;
  about?: string;
  privacySettings: PrivacySettings;
  theme: ThemeSettings;
  notificationSettings: NotificationSettings;
  appLock: AppLockSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrivacySettings {
  lastSeen: 'everyone' | 'contacts' | 'nobody';
  profilePhoto: 'everyone' | 'contacts' | 'nobody';
  about: 'everyone' | 'contacts' | 'nobody';
  status: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  groupAdd: 'everyone' | 'contacts' | 'nobody';
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'amoled';
  primaryColor: string;
  accentColor: string;
  bubbleStyle: 'ios' | 'android' | 'rounded' | 'square' | 'whatsapp' | 'telegram';
  chatBackground: string;
  fontFamily: string;
  fontSize: number;
  emojiStyle: 'ios' | 'android' | 'twitter' | 'facebook';
  appIcon: string;
  layoutStyle: 'tabs' | 'sidebar' | 'bottom';
  tickStyle: {
    color: string;
    shape: 'standard' | 'rounded' | 'filled';
  };
}

export interface NotificationSettings {
  messageSound: string;
  callRingtone: string;
  vibrationPattern: string;
  notificationPreview: boolean;
  inAppSounds: boolean;
  inAppVibrate: boolean;
}

export interface AppLockSettings {
  enabled: boolean;
  type: 'pin' | 'biometric';
  pin?: string;
}

// Chat Types
export interface Chat {
  _id: string;
  type: 'private' | 'group' | 'secret';
  participants: User[];
  name?: string;
  description?: string;
  avatar?: string;
  admins?: string[];
  createdBy?: string;
  groupSettings?: GroupSettings;
  isEncrypted?: boolean;
  selfDestructTimer?: number;
  lastMessage?: LastMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupSettings {
  onlyAdminsCanMessage: boolean;
  onlyAdminsCanEditGroupInfo: boolean;
  approvalRequired: boolean;
  allowMembersToAddOthers: boolean;
}

export interface LastMessage {
  text: string;
  sender: string;
  timestamp: Date;
  type: string;
}

// Message Types
export interface Message {
  _id: string;
  chatId: string;
  sender: User;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  location?: Location;
  contact?: Contact;
  poll?: Poll;
  replyTo?: Message;
  forwardedFrom?: string;
  reactions: Reaction[];
  status: MessageStatus;
  readBy: ReadReceipt[];
  deliveredTo: DeliveryReceipt[];
  isEdited: boolean;
  editHistory?: EditHistory[];
  isDeleted: boolean;
  deletedFor?: string[];
  deletedForEveryone: boolean;
  mentions?: string[];
  isEncrypted?: boolean;
  selfDestructAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'voice' 
  | 'document' 
  | 'location' 
  | 'contact' 
  | 'poll' 
  | 'gif' 
  | 'sticker';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Contact {
  name: string;
  phoneNumber: string;
}

export interface Poll {
  question: string;
  options: PollOption[];
  multipleAnswers: boolean;
  expiresAt?: Date;
}

export interface PollOption {
  text: string;
  votes: string[];
}

export interface Reaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface ReadReceipt {
  userId: string;
  readAt: Date;
}

export interface DeliveryReceipt {
  userId: string;
  deliveredAt: Date;
}

export interface EditHistory {
  content: string;
  editedAt: Date;
}

// Story Types
export interface Story {
  _id: string;
  userId: User;
  type: 'text' | 'image' | 'video';
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  visibility: 'everyone' | 'contacts' | 'custom';
  customViewers?: string[];
  hiddenFrom?: string[];
  views: StoryView[];
  reactions: Reaction[];
  replies: StoryReply[];
  expiresAt: Date;
  createdAt: Date;
}

export interface StoryView {
  userId: string;
  viewedAt: Date;
}

export interface StoryReply {
  userId: string;
  message: string;
  timestamp: Date;
}

// Call Types
export interface Call {
  _id: string;
  type: 'voice' | 'video';
  callType: 'one-to-one' | 'group';
  caller: User;
  participants: User[];
  status: CallStatus;
  channelName: string;
  agoraToken?: string;
  agoraUid?: number;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  maxParticipants?: number;
  activeParticipants?: string[];
  isScreenSharing?: boolean;
  screenSharingBy?: string;
  createdAt: Date;
}

export type CallStatus = 
  | 'initiated' 
  | 'ringing' 
  | 'ongoing' 
  | 'ended' 
  | 'missed' 
  | 'declined' 
  | 'failed';

// Channel Types
export interface Channel {
  _id: string;
  name: string;
  username: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  type: 'public' | 'private';
  category?: string;
  owner: User;
  admins: User[];
  subscribers: string[];
  settings: ChannelSettings;
  stats: ChannelStats;
  isVerified: boolean;
  isPaid?: boolean;
  subscriptionFee?: number;
  lastPostAt?: Date;
  createdAt: Date;
}

export interface ChannelSettings {
  slowMode: boolean;
  slowModeInterval?: number;
  signMessages: boolean;
  approveNewMembers: boolean;
  restrictSaving: boolean;
  historyVisibleToNewMembers: boolean;
}

export interface ChannelStats {
  subscriberCount: number;
  postCount: number;
  viewCount: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Socket Event Types
export interface SocketMessage {
  event: string;
  data: any;
}

export interface TypingEvent {
  userId: string;
  chatId: string;
}

export interface OnlineStatusEvent {
  userId: string;
  isOnline: boolean;
  lastSeen?: Date;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdateForm {
  displayName?: string;
  bio?: string;
  profilePicture?: string;
  coverPhoto?: string;
  pronouns?: string;
  dateOfBirth?: Date;
}

// Navigation Types
export type RootStackParamList = {
  '(auth)': undefined;
  '(main)': undefined;
  'chat/[id]': { id: string };
  'chat/group/[id]': { id: string };
  'chat/secret/[id]': { id: string };
  'user/[id]': { id: string };
  'user/edit-profile': undefined;
  'calls/incoming/[id]': { id: string };
  'calls/active/[id]': { id: string };
  'settings': undefined;
  'settings/themes': undefined;
  'settings/notifications': undefined;
  'settings/privacy': undefined;
  'settings/blocked': undefined;
  'settings/appearance': undefined;
};

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;