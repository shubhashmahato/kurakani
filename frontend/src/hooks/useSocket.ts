import { useEffect } from 'react';
import socketService from '../services/socket';
import { useChatStore } from '../store/chatStore';
import { useCallStore } from '../store/callStore';
import { useAuthStore } from '../store/authStore';

export const useSocket = () => {
  const { user } = useAuthStore();
  const { addMessage, updateMessage, deleteMessage } = useChatStore();
  const { setIncomingCall } = useCallStore();

  useEffect(() => {
    if (!user?.id) return;

    // Connect to socket
    socketService.connect(user.id);

    // Message events
    socketService.on('message:new', (data) => {
      addMessage(data.message);
    });

    socketService.on('message:edit', (data) => {
      updateMessage(data.messageId, {
        content: data.content,
        isEdited: true,
      });
    });

    socketService.on('message:delete', (data) => {
      deleteMessage(data.messageId);
    });

    // Call events
    socketService.on('call:incoming', (data) => {
      setIncomingCall(data);
    });

    return () => {
      socketService.disconnect();
    };
  }, [user?.id]);

  return {
    isConnected: socketService.isConnected(),
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
  };
};