import admin from 'firebase-admin';
import User from '../models/User';

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

/**
 * Send push notification to user
 */
export const sendPushNotification = async (
  userId: string,
  payload: NotificationPayload
): Promise<boolean> => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.devices || user.devices.length === 0) {
      console.warn(`No devices found for user ${userId}`);
      return false;
    }

    const pushTokens = user.devices
      .filter((device: any) => device.pushToken)
      .map((device: any) => device.pushToken);

    if (pushTokens.length === 0) {
      console.warn(`No push tokens for user ${userId}`);
      return false;
    }

    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data || {},
    };

    // Send to all devices
    const responses = await admin.messaging().sendMulticast({
      ...message,
      tokens: pushTokens,
    });

    console.log(`Sent notifications to ${responses.successCount} devices`);

    if (responses.failureCount > 0) {
      const failedTokens: string[] = [];
      responses.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(pushTokens[idx]);
        }
      });

      // Remove failed tokens
      if (failedTokens.length > 0) {
        user.devices = user.devices.filter(
          (device: any) => !failedTokens.includes(device.pushToken)
        );
        await user.save();
      }
    }

    return responses.successCount > 0;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

/**
 * Send notification for new message
 */
export const notifyNewMessage = async (
  userId: string,
  senderName: string,
  messagePreview: string,
  chatId: string
): Promise<boolean> => {
  return sendPushNotification(userId, {
    title: senderName,
    body: messagePreview,
    data: {
      type: 'message',
      chatId,
      senderName,
    },
  });
};

/**
 * Send notification for incoming call
 */
export const notifyIncomingCall = async (
  userId: string,
  callerName: string,
  callType: 'voice' | 'video'
): Promise<boolean> => {
  return sendPushNotification(userId, {
    title: `${callType === 'video' ? 'Video' : 'Voice'} Call`,
    body: `${callerName} is calling...`,
    data: {
      type: 'call',
      callType,
      callerName,
    },
  });
};

/**
 * Send notification for group invite
 */
export const notifyGroupInvite = async (
  userId: string,
  groupName: string,
  inviterName: string
): Promise<boolean> => {
  return sendPushNotification(userId, {
    title: 'Group Invite',
    body: `${inviterName} invited you to ${groupName}`,
    data: {
      type: 'group_invite',
      groupName,
      inviterName,
    },
  });
};

/**
 * Send notification for story mention
 */
export const notifyStoryMention = async (
  userId: string,
  userName: string
): Promise<boolean> => {
  return sendPushNotification(userId, {
    title: 'Story Mention',
    body: `${userName} mentioned you in their story`,
    data: {
      type: 'story_mention',
      userName,
    },
  });
};

/**
 * Send batch notifications
 */
export const sendBatchNotifications = async (
  userIds: string[],
  payload: NotificationPayload
): Promise<number> => {
  let successCount = 0;

  for (const userId of userIds) {
    const sent = await sendPushNotification(userId, payload);
    if (sent) successCount++;
  }

  return successCount;
};