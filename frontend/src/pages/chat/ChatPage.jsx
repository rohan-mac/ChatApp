import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Archive } from 'lucide-react';
import AppShell from '../../components/AppShell';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSocket } from '../../hooks/useSocket';
import useThemeMode from '../../hooks/useThemeMode';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useChatStore } from '../../store/chatStore';

const chatName = (chat) => chat?.counterpart?.name || chat?.title || 'Conversation';
const chatStatus = (chat) => (chat?.counterpart?.isOnline ? 'Online' : chat?.counterpart?.status || 'Offline');

const previewText = (chat) => {
  const message = chat?.lastMessageId;
  if (!message) return 'Start the conversation';
  if (message.deletedForEveryone) return 'Message deleted';
  if (message.text || message.content) return message.text || message.content;
  if (message.mediaUrl || message.attachments?.length) return 'Media message';
  return 'No content';
};

const ChatPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [theme, setTheme] = useThemeMode();
  const isDark = theme === 'dark';
  const isLargeScreen = useMediaQuery('lg');

  const [chatSearch, setChatSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showConversations, setShowConversations] = useState(true);
  const [showPeopleMode, setShowPeopleMode] = useState(false);
  const [chatFilter, setChatFilter] = useState('All');
  const [typingText, setTypingText] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [sending, setSending] = useState(false);
  const [chatThemes, setChatThemes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chat-themes') || '{}');
    } catch {
      return {};
    }
  });

  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const endRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const deferredChatSearch = useDeferredValue(chatSearch);

  const chats = useChatStore((state) => state.chats);
  const messages = useChatStore((state) => state.messages);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const loadingChats = useChatStore((state) => state.loadingChats);
  const loadingMessages = useChatStore((state) => state.loadingMessages);
  const people = useChatStore((state) => state.people);
  const loadChats = useChatStore((state) => state.loadChats);
  const loadPeople = useChatStore((state) => state.loadPeople);
  const openChat = useChatStore((state) => state.openChat);
  const createDirectChat = useChatStore((state) => state.createDirectChat);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const editMessage = useChatStore((state) => state.editMessage);
  const toggleStar = useChatStore((state) => state.toggleStar);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const archiveSelectedChat = useChatStore((state) => state.archiveSelectedChat);
  const clearChat = useChatStore((state) => state.clearChat);
  const handleIncomingMessage = useChatStore((state) => state.handleIncomingMessage);
  const handleUpdatedMessage = useChatStore((state) => state.handleUpdatedMessage);
  const handleDeletedMessage = useChatStore((state) => state.handleDeletedMessage);
  const handlePresenceUpdate = useChatStore((state) => state.handlePresenceUpdate);
  const markChatAsRead = useChatStore((state) => state.markChatAsRead);

  useEffect(() => {
    loadChats(deferredChatSearch).catch(() => {
      pushToast({
        title: 'Unable to load chats',
        description: 'The backend may still be waking up. Please try again.',
        tone: 'error'
      });
    });
    if (deferredChatSearch) {
      loadPeople(deferredChatSearch).catch(() => {});
      setShowPeopleMode(false);
    }
  }, [deferredChatSearch, loadChats, loadPeople, pushToast]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedChat?._id, editTarget?._id]);

  const socket = useSocket({
    'message:new': handleIncomingMessage,
    'message:updated': handleUpdatedMessage,
    'message:deleted': (payload) => {
      handleDeletedMessage({ ...payload, currentUserId: user.id || user._id });
    },
    'presence:update': handlePresenceUpdate,
    'chat:typing': ({ senderId, chatId }) => {
      if (selectedChat?._id === chatId && senderId !== (user.id || user._id)) {
        setTypingText('Typing...');
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = window.setTimeout(() => setTypingText(''), 1200);
      }
    }
  });

  useEffect(() => {
    if (!selectedChat?._id) return undefined;
    socket.emit('chat:join', selectedChat._id);
    return () => socket.emit('chat:leave', selectedChat._id);
  }, [selectedChat?._id, socket]);

  useEffect(() => {
    if (!selectedChat?._id || !messages.length || !socket.connected) return;
    markChatAsRead(socket, user.id || user._id);
  }, [selectedChat?._id, messages.length, socket.connected, markChatAsRead, user]);

  useEffect(() => {
    if (!selectedChat?._id) {
      setShowConversations(true);
    } else if (!isLargeScreen) {
      setShowConversations(false);
    }
  }, [selectedChat?._id, isLargeScreen]);

  const handleOpenChat = async (chat) => {
    await openChat(chat);
    if (!isLargeScreen) {
      setShowConversations(false);
    }
  };

  const unreadCount = useMemo(() => chats.filter((chat) => chat.unreadCount > 0).length, [chats]);

  const themeOptions = [
    { id: 'dark', label: 'Night' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'rose', label: 'Rose' }
  ];

  const rotateTheme = () => {
    const themeOrder = ['dark', 'ocean', 'rose'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  useEffect(() => {
    localStorage.setItem('chat-themes', JSON.stringify(chatThemes));
  }, [chatThemes]);

  const currentChatTheme = selectedChat?._id ? chatThemes[selectedChat._id] || theme : theme;

  const setChatTheme = (selectedTheme) => {
    if (!selectedChat?._id) {
      setTheme(selectedTheme);
      return;
    }

    setChatThemes((current) => ({
      ...current,
      [selectedChat._id]: selectedTheme
    }));
  };

  const filteredChats = useMemo(() => {
    const query = deferredChatSearch.trim().toLowerCase();
    let results = chats;

    if (query) {
      results = results.filter((chat) => `${chatName(chat)} ${previewText(chat)}`.toLowerCase().includes(query));
    }

    if (chatFilter === 'Unread') {
      results = results.filter((chat) => chat.unreadCount > 0);
    }

    if (chatFilter === 'Favourites') {
      results = [];
    }

    return results;
  }, [chats, deferredChatSearch, chatFilter]);

  const activeMessages = useMemo(
    () => messages.map((message) => ({ ...message, text: message.text || message.content || 'No content' })),
    [messages]
  );

  const performSend = async () => {
    if (!selectedChat?._id || (!draft.trim() && !attachment)) return;

    setSending(true);
    try {
      if (editTarget) {
        await editMessage(editTarget._id, draft);
        pushToast({ title: 'Message updated', tone: 'success' });
      } else {
        const payload = new FormData();
        payload.append('chatId', selectedChat._id);
        payload.append('text', draft);
        payload.append('clientMessageId', crypto.randomUUID());
        if (attachment) payload.append('file', attachment);
        await sendMessage(payload);
      }

      setDraft('');
      setAttachment(null);
      setShowEmoji(false);
      setEditTarget(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (error) {
      pushToast({
        title: 'Unable to send message',
        description: error.response?.data?.message || 'Please try again in a moment.',
        tone: 'error'
      });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (message) => {
    const mine = (message.senderId?._id || message.senderId) === (user.id || user._id);
    const scope = mine ? window.prompt("Delete scope: type 'me' or 'everyone'", 'me') : 'me';
    if (!scope || !['me', 'everyone'].includes(scope)) return;

    try {
      await deleteMessage(message._id, scope, user.id || user._id);
      pushToast({ title: 'Message deleted', tone: 'success' });
    } catch (error) {
      pushToast({
        title: 'Delete failed',
        description: error.response?.data?.message || 'Unable to delete this message.',
        tone: 'error'
      });
    }
  };

  const handleClearChat = async () => {
    if (!selectedChat?._id) return;

    try {
      await clearChat(selectedChat._id);
      await openChat(selectedChat);
      pushToast({ title: 'Chat cleared', tone: 'success' });
    } catch (error) {
      pushToast({
        title: 'Unable to clear chat',
        description: error.response?.data?.message || 'Please try again.',
        tone: 'error'
      });
    }
  };

  const handleNewChat = () => {
    setChatSearch('');
    setShowPeopleMode(true);
    loadPeople('').catch(() => {});
  };

  return (
    <AppShell
      showHeader={false}
      showSidebar={true}
      showMobileBottomNav={showConversations}
      theme={theme}
      themeOptions={themeOptions}
      onThemeSelect={setTheme}
      onToggleTheme={rotateTheme}
      actions={selectedChat ? (
        <button
          type="button"
          onClick={archiveSelectedChat}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-[20px] ${isDark ? 'border-white/10 bg-white/10 text-slate-200' : 'border-white/70 bg-white/75 text-slate-700'}`}
        >
          <Archive size={15} />
          Archive
        </button>
      ) : null}
    >
      <div className="grid h-full min-h-0 w-full gap-3 overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)]">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`h-full min-h-0 ${showConversations ? 'block' : 'hidden lg:block'}`}
        >
          <ChatList
            chats={filteredChats}
            loading={loadingChats}
            selectedChatId={selectedChat?._id}
            query={chatSearch}
            onQueryChange={setChatSearch}
            onOpenChat={handleOpenChat}
            getChatName={chatName}
            getPreview={previewText}
            isDark={isDark}
            theme={theme}
            people={people}
            showPeople={showPeopleMode || Boolean(chatSearch.trim())}
            onSelectUser={(user) => createDirectChat(user._id)}
            filter={chatFilter}
            onFilterChange={setChatFilter}
            unreadCount={unreadCount}
            onAddChat={handleNewChat}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`h-full min-h-0 ${showConversations ? 'hidden lg:flex' : 'flex'} flex-col`}
        >
          <ChatWindow
            isDark={isDark}
            selectedChat={selectedChat}
            typingText={typingText}
            getChatName={chatName}
            getChatStatus={chatStatus}
            loadingMessages={loadingMessages}
            activeMessages={activeMessages}
            currentUserId={user.id || user._id}
            onEdit={(target) => {
              setEditTarget(target);
              setDraft(target.text || target.content || '');
            }}
            onDelete={handleDelete}
            onToggleStar={async (target) => {
              try {
                await toggleStar(target._id);
              } catch (error) {
                pushToast({
                  title: 'Unable to update star',
                  description: error.response?.data?.message || 'Please try again.',
                  tone: 'error'
                });
              }
            }}
            onBack={() => setShowConversations(true)}
            onClearChat={handleClearChat}
            onSetTheme={setChatTheme}
            endRef={endRef}
            draft={draft}
            setDraft={setDraft}
            showEmoji={showEmoji}
            setShowEmoji={setShowEmoji}
            fileRef={fileRef}
            setAttachment={setAttachment}
            performSend={performSend}
            sending={sending}
            inputRef={inputRef}
            socket={socket}
            attachment={attachment}
            setEditTarget={setEditTarget}
            editTarget={editTarget}
            theme={currentChatTheme}
          />
        </motion.div>
      </div>
    </AppShell>
  );
};

export default ChatPage;
