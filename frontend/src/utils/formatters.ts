import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

/**
 * Format a date for message timestamps
 * Shows: "Just now", "5 min ago", "Yesterday", "Mon", "Jan 1", or "Jan 1, 2023"
 */
export const formatMessageTime = (date: Date | string): string => {
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (isToday(messageDate)) {
    return format(messageDate, 'h:mm a');
  } else if (isYesterday(messageDate)) {
    return 'Yesterday';
  } else if (isThisWeek(messageDate)) {
    return format(messageDate, 'EEE'); // Mon, Tue, etc.
  } else if (isThisYear(messageDate)) {
    return format(messageDate, 'MMM d'); // Jan 1
  } else {
    return format(messageDate, 'MMM d, yyyy'); // Jan 1, 2023
  }
};

/**
 * Format time for chat list (last message time)
 */
export const formatChatTime = (date: Date | string): string => {
  const chatDate = typeof date === 'string' ? new Date(date) : date;

  if (isToday(chatDate)) {
    return format(chatDate, 'h:mm a');
  } else if (isYesterday(chatDate)) {
    return 'Yesterday';
  } else if (isThisWeek(chatDate)) {
    return format(chatDate, 'EEE');
  } else {
    return format(chatDate, 'MMM d');
  }
};

/**
 * Format "last seen" time
 */
export const formatLastSeen = (date: Date | string): string => {
  const lastSeenDate = typeof date === 'string' ? new Date(date) : date;

  if (isToday(lastSeenDate)) {
    const diffInMinutes = Math.floor((new Date().getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'online';
    } else if (diffInMinutes < 60) {
      return `last seen ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return `last seen today at ${format(lastSeenDate, 'h:mm a')}`;
    }
  } else if (isYesterday(lastSeenDate)) {
    return `last seen yesterday at ${format(lastSeenDate, 'h:mm a')}`;
  } else {
    return `last seen ${format(lastSeenDate, 'MMM d')} at ${format(lastSeenDate, 'h:mm a')}`;
  }
};

/**
 * Format story time (e.g., "5h ago")
 */
export const formatStoryTime = (date: Date | string): string => {
  return formatDistanceToNow(typeof date === 'string' ? new Date(date) : date, { addSuffix: true });
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format call duration
 */
export const formatCallDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as: +1 (234) 567-8900
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Format username (remove special characters, lowercase)
 */
export const formatUsername = (username: string): string => {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 30);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Format number with abbreviation (1k, 1M, etc.)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

/**
 * Format message preview for notifications/chat list
 */
export const formatMessagePreview = (message: any): string => {
  switch (message.type) {
    case 'text':
      return truncateText(message.content || '', 50);
    case 'image':
      return '📷 Photo';
    case 'video':
      return '🎥 Video';
    case 'voice':
      return '🎤 Voice message';
    case 'audio':
      return '🎵 Audio';
    case 'document':
      return `📄 ${message.fileName || 'Document'}`;
    case 'location':
      return '📍 Location';
    case 'contact':
      return '👤 Contact';
    case 'poll':
      return '📊 Poll';
    case 'sticker':
      return '😊 Sticker';
    case 'gif':
      return 'GIF';
    default:
      return 'Message';
  }
};

/**
 * Format typing indicator text
 */
export const formatTypingText = (users: string[]): string => {
  if (users.length === 0) return '';
  if (users.length === 1) return `${users[0]} is typing...`;
  if (users.length === 2) return `${users[0]} and ${users[1]} are typing...`;
  return `${users[0]} and ${users.length - 1} others are typing...`;
};

/**
 * Format participant count
 */
export const formatParticipantCount = (count: number): string => {
  if (count === 1) return '1 participant';
  return `${formatNumber(count)} participants`;
};

/**
 * Format subscriber count
 */
export const formatSubscriberCount = (count: number): string => {
  if (count === 1) return '1 subscriber';
  return `${formatNumber(count)} subscribers`;
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

/**
 * Generate random color based on string (for avatars)
 */
export const getColorFromString = (str: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#F06292', '#7986CB',
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Format message status text
 */
export const formatMessageStatus = (status: string): string => {
  switch (status) {
    case 'sending':
      return 'Sending...';
    case 'sent':
      return 'Sent';
    case 'delivered':
      return 'Delivered';
    case 'read':
      return 'Read';
    case 'failed':
      return 'Failed to send';
    default:
      return '';
  }
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return Math.round((value / total) * 100) + '%';
};

/**
 * Parse mentions from text
 */
export const parseMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

/**
 * Highlight mentions in text
 */
export const highlightMentions = (text: string): string => {
  return text.replace(/@(\w+)/g, '<mention>@$1</mention>');
};

/**
 * Format poll results
 */
export const formatPollResults = (option: any, totalVotes: number): string => {
  const percentage = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
  return `${percentage}% (${option.votes.length} ${option.votes.length === 1 ? 'vote' : 'votes'})`;
};

export default {
  formatMessageTime,
  formatChatTime,
  formatLastSeen,
  formatStoryTime,
  formatFileSize,
  formatCallDuration,
  formatPhoneNumber,
  formatUsername,
  truncateText,
  formatNumber,
  formatMessagePreview,
  formatTypingText,
  formatParticipantCount,
  formatSubscriberCount,
  getInitials,
  getColorFromString,
  formatMessageStatus,
  formatPercentage,
  parseMentions,
  highlightMentions,
  formatPollResults,
};