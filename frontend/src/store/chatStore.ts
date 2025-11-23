import { create } from 'zustand';
import { Chat, Message } from '../types';

interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  
  setChats: (chats: Chat[]) => void;
  selectChat: (chat: Chat | null) => void;
  addChat: (chat: Chat) => void;
  updateChat: (id: string, data: Partial<Chat>) => void;
  deleteChat: (id: string) => void;
  
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, data: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  prependMessages: (messages: Message[]) => void;
  
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  selectedChat: null,
  messages: [],
  isLoading: false,

  setChats: (chats) => set({ chats }),
  selectChat: (chat) => set({ selectedChat: chat }),
  addChat: (chat) => set((state) => {
    const filtered = state.chats.filter(c => c._id !== chat._id);
    return { chats: [chat, ...filtered] };
  }),
  updateChat: (id, data) =>
    set((state) => ({
      chats: state.chats.map((c) => (c._id === id ? { ...c, ...data } : c)),
      selectedChat: state.selectedChat?._id === id 
        ? { ...state.selectedChat, ...data } 
        : state.selectedChat,
    })),
  deleteChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((c) => c._id !== id),
      selectedChat: state.selectedChat?._id === id ? null : state.selectedChat,
    })),

  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  updateMessage: (id, data) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === id ? { ...m, ...data } : m
      ),
    })),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m._id !== id),
    })),
  prependMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
    })),

  setLoading: (loading) => set({ isLoading: loading }),
}));