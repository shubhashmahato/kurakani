import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';

interface MessageBubbleProps {
  message: any;
  previousMessage?: any;
  onLongPress?: () => void;
  onReact?: (emoji: string) => void;
  onReply?: () => void;
}

export default function MessageBubble({
  message,
  previousMessage,
  onLongPress,
  onReact,
  onReply,
}: MessageBubbleProps) {
  const { user } = useAuthStore();
  const [showReactions, setShowReactions] = useState(false);
  
  const isSent = message.sender._id === user?.id;
  const showAvatar = !previousMessage || previousMessage.sender._id !== message.sender._id;
  
  const bubbleStyle = user?.theme?.bubbleStyle || 'whatsapp';

  const getBubbleStyles = () => {
    const baseStyles = 'max-w-[80%] p-3 ';
    
    switch (bubbleStyle) {
      case 'ios':
        return baseStyles + (isSent 
          ? 'bg-blue-500 rounded-3xl rounded-tr-md'
          : 'bg-gray-200 dark:bg-gray-700 rounded-3xl rounded-tl-md');
      case 'android':
        return baseStyles + (isSent 
          ? 'bg-primary rounded-lg rounded-br-none'
          : 'bg-surface-light dark:bg-surface-dark rounded-lg rounded-bl-none');
      case 'telegram':
        return baseStyles + (isSent 
          ? 'bg-primary rounded-2xl rounded-br-md'
          : 'bg-white dark:bg-surface-dark rounded-2xl rounded-bl-md');
      case 'square':
        return baseStyles + (isSent 
          ? 'bg-primary rounded-md'
          : 'bg-surface-light dark:bg-surface-dark rounded-md');
      case 'rounded':
        return baseStyles + (isSent 
          ? 'bg-primary rounded-full'
          : 'bg-surface-light dark:bg-surface-dark rounded-full');
      default: // whatsapp
        return baseStyles + (isSent 
          ? 'bg-chat-sent dark:bg-chat-sentDark rounded-lg rounded-tr-sm'
          : 'bg-chat-received dark:bg-chat-receivedDark rounded-lg rounded-tl-sm');
    }
  };

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text className={`text-base ${isSent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            {message.content}
          </Text>
        );
      
      case 'image':
        return (
          <Image
            source={{ uri: message.mediaUrl }}
            className="w-64 h-64 rounded-lg"
            resizeMode="cover"
          />
        );
      
      case 'video':
        return (
          <View className="w-64 h-64 rounded-lg bg-black items-center justify-center">
            <Image
              source={{ uri: message.thumbnailUrl }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
            <View className="absolute">
              <Text className="text-white text-4xl">▶</Text>
            </View>
          </View>
        );
      
      case 'voice':
        return (
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-primary items-center justify-center">
              <Text className="text-white">▶</Text>
            </TouchableOpacity>
            <View className="flex-1 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <Text className={`text-xs ${isSent ? 'text-white' : 'text-gray-600'}`}>
              {message.duration}s
            </Text>
          </View>
        );
      
      case 'document':
        return (
          <View className="flex-row items-center space-x-3">
            <View className="w-12 h-12 rounded-lg bg-primary items-center justify-center">
              <Text className="text-white text-xl">📄</Text>
            </View>
            <View className="flex-1">
              <Text className={`font-semibold ${isSent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {message.fileName}
              </Text>
              <Text className={`text-xs ${isSent ? 'text-gray-200' : 'text-gray-500'}`}>
                {(message.fileSize / 1024).toFixed(2)} KB
              </Text>
            </View>
          </View>
        );
      
      case 'location':
        return (
          <View>
            <View className="w-64 h-48 rounded-lg bg-gray-300 dark:bg-gray-700 items-center justify-center">
              <Text className="text-4xl">📍</Text>
            </View>
            <Text className={`mt-2 text-sm ${isSent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {message.location?.address || 'Location'}
            </Text>
          </View>
        );
      
      default:
        return (
          <Text className={`text-base ${isSent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Unsupported message type
          </Text>
        );
    }
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    return (
      <View className="flex-row flex-wrap mt-1">
        {message.reactions.map((reaction: any, index: number) => (
          <View
            key={index}
            className="bg-white dark:bg-gray-800 rounded-full px-2 py-0.5 mr-1 mb-1 border border-gray-200 dark:border-gray-700"
          >
            <Text className="text-xs">{reaction.emoji}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className={`mb-2 ${isSent ? 'items-end' : 'items-start'}`}>
      {/* Reply-to message */}
      {message.replyTo && (
        <View className={`mb-1 ${isSent ? 'mr-2' : 'ml-2'}`}>
          <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 max-w-[70%]">
            <Text className="text-xs text-gray-500 font-semibold">
              {message.replyTo.sender.displayName}
            </Text>
            <Text className="text-xs text-gray-600 dark:text-gray-400" numberOfLines={1}>
              {message.replyTo.content || 'Media'}
            </Text>
          </View>
        </View>
      )}

      <View className={`flex-row ${isSent ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        {!isSent && showAvatar && (
          <Image
            source={{ uri: message.sender.profilePicture || 'https://via.placeholder.com/40' }}
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
        
        {!isSent && !showAvatar && <View className="w-8 mr-2" />}

        {/* Message Bubble */}
        <Pressable
          onLongPress={onLongPress}
          delayLongPress={500}
          className={getBubbleStyles()}
        >
          {/* Sender name (group chats) */}
          {!isSent && message.chatType === 'group' && (
            <Text className="text-xs font-semibold text-primary mb-1">
              {message.sender.displayName}
            </Text>
          )}

          {/* Content */}
          {renderContent()}

          {/* Time & Status */}
          <View className={`flex-row items-center justify-end mt-1 space-x-1`}>
            <Text className={`text-xs ${isSent ? 'text-gray-200' : 'text-gray-500'}`}>
              {format(new Date(message.createdAt), 'HH:mm')}
            </Text>
            
            {isSent && (
              <View>
                {message.status === 'sending' && (
                  <Text className="text-gray-400">○</Text>
                )}
                {message.status === 'sent' && (
                  <Text className="text-gray-400">✓</Text>
                )}
                {message.status === 'delivered' && (
                  <Text className="text-gray-400">✓✓</Text>
                )}
                {message.status === 'read' && (
                  <Text className="text-blue-500">✓✓</Text>
                )}
              </View>
            )}
          </View>

          {/* Reactions */}
          {renderReactions()}
        </Pressable>
      </View>
    </View>
  );
}