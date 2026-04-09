import { create } from 'zustand';
import api from '../services/api';

const unpackData = (payload) => payload?.data || payload;

const normalizeMessage = (message = {}) => ({
  ...message,
  text: message.text || message.content || ''
});

const upsertById = (list, item) => {
  const index = list.findIndex((entry) => entry._id === item._id || (entry.clientMessageId && entry.clientMessageId === item.clientMessageId));
  if (index === -1) {
    return [...list, item];
  }

  const next = [...list];
  next[index] = { ...next[index], ...item };
  return next;
};

export const useChatStore = create((set, get) => ({
  chats: [],
  messages: [],
  selectedChat: null,
  loadingChats: false,
  loadingMessages: false,
  people: [],
  messageSearchResults: [],

  loadChats: async (search = '') => {
    set({ loadingChats: true });
    try {
      const { data } = await api.get('/chats', {
        params: { archived: false, search: search || undefined }
      });
      set({ chats: unpackData(data) || [] });
    } finally {
      set({ loadingChats: false });
    }
  },

  loadPeople: async (search = '') => {
    const { data } = await api.get('/users', {
      params: { search: search || undefined, limit: 8 }
    });
    set({ people: unpackData(data) || [] });
  },

  openChat: async (chat) => {
    set({ selectedChat: chat, loadingMessages: true, messages: [] });
    try {
      const { data } = await api.get(`/messages/${chat._id}`);
      set({ messages: (unpackData(data) || []).map(normalizeMessage), loadingMessages: false });
    } catch (error) {
      set({ loadingMessages: false });
      throw error;
    }
  },

  createDirectChat: async (receiverId) => {
    const { data } = await api.post('/chats', { receiverId });
    await get().loadChats();
    const chat = unpackData(data);
    await get().openChat(chat);
    return chat;
  },

  sendMessage: async (payload) => {
    const { data } = await api.post('/messages', payload);
    const message = normalizeMessage(unpackData(data));
    set((state) => ({ messages: upsertById(state.messages, message) }));
    await get().loadChats();
    return message;
  },

  editMessage: async (messageId, text) => {
    const { data } = await api.patch(`/messages/${messageId}`, { text });
    const message = normalizeMessage(unpackData(data));
    set((state) => ({
      messages: state.messages.map((entry) => (entry._id === message._id ? message : entry))
    }));
    return message;
  },

  toggleStar: async (messageId) => {
    const { data } = await api.post(`/messages/${messageId}/star`);
    const message = normalizeMessage(unpackData(data));
    set((state) => ({
      messages: state.messages.map((entry) => (entry._id === message._id ? message : entry))
    }));
    return message;
  },

  deleteMessage: async (messageId, scope, currentUserId) => {
    await api.delete(`/messages/${messageId}`, { data: { scope } });
    set((state) => ({
      messages:
        scope === 'me'
          ? state.messages.filter((entry) => entry._id !== messageId)
          : state.messages.map((entry) =>
              entry._id === messageId
                ? {
                    ...entry,
                    text: '',
                    mediaUrl: '',
                    attachments: [],
                    deletedForEveryone: true,
                    isDeleted: true
                  }
                : entry
            )
    }));
    await get().loadChats();
  },

  archiveSelectedChat: async () => {
    const selectedChat = get().selectedChat;
    if (!selectedChat?._id) return;
    await api.post(`/chats/${selectedChat._id}/archive`);
    set({ selectedChat: null, messages: [] });
    await get().loadChats();
  },

  searchMessages: async (query) => {
    if (!query.trim()) {
      set({ messageSearchResults: [] });
      return;
    }

    const { data } = await api.get('/messages/search', {
      params: { q: query }
    });
    set({ messageSearchResults: unpackData(data) || [] });
  },

  handleIncomingMessage: (message) => {
    const incoming = normalizeMessage(message);
    set((state) => {
      const isOpen = state.selectedChat?._id === incoming.chatId;
      return {
        messages: isOpen ? upsertById(state.messages, incoming) : state.messages
      };
    });
    get().loadChats();
  },

  handleUpdatedMessage: (message) => {
    set((state) => ({
      messages: state.messages.map((entry) => (entry._id === message._id ? { ...entry, ...message } : entry))
    }));
  },

  handleDeletedMessage: ({ messageId, scope, userId, currentUserId }) => {
    set((state) => ({
      messages:
        scope === 'me' && userId === currentUserId
          ? state.messages.filter((entry) => entry._id !== messageId)
          : state.messages.map((entry) =>
              entry._id === messageId
                ? {
                    ...entry,
                    text: '',
                    mediaUrl: '',
                    attachments: [],
                    deletedForEveryone: true,
                    isDeleted: true
                  }
                : entry
            )
    }));
    get().loadChats();
  },

  handlePresenceUpdate: ({ userId, isOnline, lastSeen }) => {
    set((state) => ({
      chats: state.chats.map((chat) => ({
        ...chat,
        counterpart:
          chat.counterpart?._id === userId
            ? { ...chat.counterpart, isOnline, lastSeen }
            : chat.counterpart
      })),
      people: state.people.map((person) => (person._id === userId ? { ...person, isOnline, lastSeen } : person))
    }));
  }
}));
