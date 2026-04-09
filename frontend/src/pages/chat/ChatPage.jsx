import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import {
  Archive,
  ImagePlus,
  LoaderCircle,
  MessageSquareText,
  Paperclip,
  Search,
  Send,
  Smile,
  Sparkles,
  X
} from 'lucide-react';
import AppShell from '../../components/AppShell';
import MessageBubble from '../../components/MessageBubble';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { useSocket } from '../../hooks/useSocket';
import useThemeMode from '../../hooks/useThemeMode';
import { useChatStore } from '../../store/chatStore';

const chatName = (chat) => chat?.counterpart?.name || chat?.title || 'Conversation';
const chatStatus = (chat) =>
  chat?.counterpart?.isOnline ? 'Online now' : chat?.counterpart?.status || 'Offline';

const previewText = (chat) => {
  const message = chat?.lastMessageId;
  if (!message) return 'Start the conversation';
  if (message.deletedForEveryone) return 'Message deleted';
  if (message.text || message.content) return message.text || message.content;
  if (message.mediaUrl || message.attachments?.length) return `Sent a ${message.messageType || message.attachments?.[0]?.type || 'file'}`;
  return 'No content';
};

const ChatPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [theme, setTheme] = useThemeMode();
  const isDark = theme === 'dark';
  const [chatSearch, setChatSearch] = useState('');
  const [peopleSearch, setPeopleSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showConversations, setShowConversations] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const endRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const deferredChatSearch = useDeferredValue(chatSearch);
  const debouncedPeopleSearch = useDebouncedValue(peopleSearch, 260);
  const debouncedMessageSearch = useDebouncedValue(messageSearch, 300);

  const chats = useChatStore((state) => state.chats);
  const people = useChatStore((state) => state.people);
  const messages = useChatStore((state) => state.messages);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const loadingChats = useChatStore((state) => state.loadingChats);
  const loadingMessages = useChatStore((state) => state.loadingMessages);
  const messageSearchResults = useChatStore((state) => state.messageSearchResults);
  const loadChats = useChatStore((state) => state.loadChats);
  const loadPeople = useChatStore((state) => state.loadPeople);
  const openChat = useChatStore((state) => state.openChat);
  const createDirectChat = useChatStore((state) => state.createDirectChat);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const editMessage = useChatStore((state) => state.editMessage);
  const toggleStar = useChatStore((state) => state.toggleStar);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const archiveSelectedChat = useChatStore((state) => state.archiveSelectedChat);
  const searchMessages = useChatStore((state) => state.searchMessages);
  const handleIncomingMessage = useChatStore((state) => state.handleIncomingMessage);
  const handleUpdatedMessage = useChatStore((state) => state.handleUpdatedMessage);
  const handleDeletedMessage = useChatStore((state) => state.handleDeletedMessage);
  const handlePresenceUpdate = useChatStore((state) => state.handlePresenceUpdate);

  useEffect(() => {
    loadChats(deferredChatSearch).catch(() => {
      pushToast({
        title: 'Unable to load chats',
        description: 'The backend may still be waking up. Please try again.',
        tone: 'error'
      });
    });
  }, [deferredChatSearch, loadChats, pushToast]);

  useEffect(() => {
    loadPeople(debouncedPeopleSearch).catch(() => {
      pushToast({
        title: 'Unable to load users',
        description: 'Please check your connection and try again.',
        tone: 'error'
      });
    });
  }, [debouncedPeopleSearch, loadPeople, pushToast]);

  useEffect(() => {
    searchMessages(debouncedMessageSearch).catch(() => {
      pushToast({
        title: 'Message search failed',
        description: 'Search is temporarily unavailable.',
        tone: 'error'
      });
    });
  }, [debouncedMessageSearch, pushToast, searchMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedChat?._id, editTarget?._id]);

  useEffect(() => {
    console.log('messages', messages);
  }, [messages]);

  const socket = useSocket({
    'message:new': (message) => {
      handleIncomingMessage(message);
    },
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
    if (!selectedChat?._id) {
      setShowConversations(true);
    } else if (window.innerWidth < 1024) {
      setShowConversations(false);
    }
  }, [selectedChat?._id]);

  const activeMessages = useMemo(
    () =>
      messages.map((message) => ({
        ...message,
        text: message.text || message.content || 'No content'
      })),
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
        if (attachment) {
          payload.append('file', attachment);
        }
        await sendMessage(payload);
      }

      setDraft('');
      setAttachment(null);
      setShowEmoji(false);
      setEditTarget(null);
      if (fileRef.current) {
        fileRef.current.value = '';
      }
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
    const scope = mine
      ? window.prompt("Delete scope: type 'me' or 'everyone'", 'me')
      : 'me';

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

  const filteredChats = useMemo(() => {
    const query = deferredChatSearch.trim().toLowerCase();
    if (!query) return chats;
    return chats.filter((chat) => {
      const haystack = `${chatName(chat)} ${previewText(chat)}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [chats, deferredChatSearch]);

  return (
    <AppShell
      title={selectedChat ? chatName(selectedChat) : 'Messages'}
      subtitle={selectedChat ? chatStatus(selectedChat) : 'Premium chat dashboard'}
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      actions={
        selectedChat ? (
          <button
            type="button"
            onClick={async () => {
              try {
                await archiveSelectedChat();
                pushToast({ title: 'Chat archived', tone: 'success' });
              } catch (error) {
                pushToast({
                  title: 'Archive failed',
                  description: error.response?.data?.message || 'Unable to archive this chat.',
                  tone: 'error'
                });
              }
            }}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
              isDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-white/70 bg-white/80 text-slate-700'
            }`}
          >
            <Archive size={16} />
            <span>Archive</span>
          </button>
        ) : null
      }
    >
      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_280px]">
        <section
          className={`${
            showConversations ? 'block' : 'hidden lg:block'
          } rounded-[30px] border p-4 ${
            isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/75'
          }`}
        >
          <div className={`mb-4 flex items-center gap-3 rounded-[24px] border px-4 py-3 ${
            isDark ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/80'
          }`}>
            <Search size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            <input
              value={chatSearch}
              onChange={(event) => setChatSearch(event.target.value)}
              placeholder="Search chats"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] opacity-60">
              <MessageSquareText size={14} />
              Conversations
            </div>
            <div className="space-y-2">
              {loadingChats ? (
                <div className="flex items-center gap-2 rounded-2xl px-3 py-3 text-sm opacity-70">
                  <LoaderCircle size={16} className="animate-spin" />
                  <span>Loading chats...</span>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    key={chat._id}
                    type="button"
                    onClick={() => openChat(chat)}
                    className={`w-full rounded-[24px] border p-3 text-left transition ${
                      selectedChat?._id === chat._id
                        ? isDark
                          ? 'border-sky-400/30 bg-sky-500/12'
                          : 'border-sky-300/70 bg-sky-500/10'
                        : isDark
                          ? 'border-white/10 bg-white/5 hover:bg-white/10'
                          : 'border-white/80 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white">
                        {chatName(chat).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-semibold">{chatName(chat)}</p>
                          {chat.unreadCount ? (
                            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-sky-500 px-2 py-1 text-[11px] text-white">
                              {chat.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        <p className={`mt-1 truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {previewText(chat)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] opacity-60">
              <Sparkles size={14} />
              Start a new chat
            </div>
            <div className={`mb-3 flex items-center gap-3 rounded-[24px] border px-4 py-3 ${
              isDark ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/80'
            }`}>
              <Search size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
              <input
                value={peopleSearch}
                onChange={(event) => setPeopleSearch(event.target.value)}
                placeholder="Search users"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div className="space-y-2">
              {people.map((person) => (
                <button
                  key={person._id}
                  type="button"
                  onClick={() => createDirectChat(person._id)}
                  className={`w-full rounded-[22px] border p-3 text-left ${
                    isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-white/80 bg-white/75 hover:bg-white'
                  }`}
                >
                  <p className="text-sm font-semibold">{person.name}</p>
                  <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {person.isOnline ? 'Online now' : person.status || person.email}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={`flex min-h-[72vh] flex-col rounded-[30px] border ${
          isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/78'
        }`}>
          <div className={`flex items-center gap-3 border-b p-4 ${isDark ? 'border-white/10' : 'border-white/70'}`}>
            {selectedChat ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowConversations(true)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${
                    isDark ? 'bg-white/8 text-slate-200' : 'bg-slate-900/5 text-slate-600'
                  }`}
                >
                  <X size={16} />
                </button>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white">
                  {chatName(selectedChat).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">{chatName(selectedChat)}</p>
                  <p className={`truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {typingText || chatStatus(selectedChat)}
                  </p>
                </div>
              </>
            ) : (
              <div>
                <p className="text-base font-semibold">Choose a conversation</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Open a chat or start a new one from the sidebar.
                </p>
              </div>
            )}
          </div>

          <div className="minimal-scrollbar flex-1 overflow-y-auto p-4">
            {!selectedChat ? (
              <div className="flex h-full items-center justify-center">
                <div className={`max-w-md rounded-[32px] border px-8 py-10 text-center ${
                  isDark ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/80'
                }`}>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold">Modern glass messaging</h3>
                  <p className={`mt-3 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Real backend integration, media support, message actions, and visible content rendering are all wired together here.
                  </p>
                </div>
              </div>
            ) : loadingMessages ? (
              <div className="flex h-full items-center justify-center gap-2 text-sm opacity-70">
                <LoaderCircle size={18} className="animate-spin" />
                <span>Loading messages...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {activeMessages.map((message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isMine={(message.senderId?._id || message.senderId) === (user.id || user._id)}
                    isDark={isDark}
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
                  />
                ))}
                <div ref={endRef} />
              </div>
            )}
          </div>

          <div className={`border-t p-4 ${isDark ? 'border-white/10' : 'border-white/70'}`}>
            {attachment ? (
              <div className={`mb-3 rounded-[22px] border p-3 ${isDark ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/80'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{attachment.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {attachment.type || 'attachment'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachment(null);
                      if (fileRef.current) fileRef.current.value = '';
                    }}
                    className="text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null}

            {editTarget ? (
              <div className={`mb-3 rounded-[20px] border px-4 py-3 text-xs ${
                isDark ? 'border-amber-400/20 bg-amber-500/10 text-amber-100' : 'border-amber-300/70 bg-amber-50 text-amber-700'
              }`}>
                Editing message: {editTarget.text || editTarget.content || 'No content'}
              </div>
            ) : null}

            <div className={`flex items-end gap-3 rounded-[30px] border p-3 ${
              isDark ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/82'
            }`}>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={(event) => setAttachment(event.target.files?.[0] || null)}
              />

              <button
                type="button"
                onClick={() => setShowEmoji((current) => !current)}
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  isDark ? 'bg-white/8 text-slate-200' : 'bg-slate-900/5 text-slate-600'
                }`}
              >
                <Smile size={18} />
              </button>

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  isDark ? 'bg-white/8 text-slate-200' : 'bg-slate-900/5 text-slate-600'
                }`}
              >
                <ImagePlus size={18} />
              </button>

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full md:inline-flex ${
                  isDark ? 'bg-white/8 text-slate-200' : 'bg-slate-900/5 text-slate-600'
                }`}
              >
                <Paperclip size={18} />
              </button>

              <div className="min-h-[56px] flex-1 rounded-[24px]">
                <textarea
                  ref={inputRef}
                  rows="1"
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    if (selectedChat?._id) {
                      socket.emit('chat:typing', {
                        chatId: selectedChat._id,
                        senderId: user.id || user._id
                      });
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      performSend();
                    }
                  }}
                  placeholder={selectedChat ? 'Type a message' : 'Select a chat to begin'}
                  disabled={!selectedChat}
                  className="h-14 w-full resize-none rounded-[24px] border border-transparent bg-transparent px-3 py-4 text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                onClick={performSend}
                disabled={!selectedChat || sending || (!draft.trim() && !attachment)}
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow-[0_18px_40px_rgba(59,130,246,0.32)] disabled:opacity-60"
              >
                {sending ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
              </motion.button>
            </div>

            <AnimatePresence>
              {showEmoji ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-3 overflow-hidden rounded-[28px]"
                >
                  <EmojiPicker
                    onEmojiClick={(emoji) => setDraft((current) => current + emoji.emoji)}
                    width="100%"
                    previewConfig={{ showPreview: false }}
                    skinTonesDisabled
                    lazyLoadEmojis
                    theme={theme}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>

        <aside className={`hidden rounded-[30px] border p-4 xl:block ${
          isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/78'
        }`}>
          <div className="rounded-[28px] bg-gradient-to-br from-sky-500 to-indigo-500 p-[1px]">
            <div className={`rounded-[27px] p-5 ${isDark ? 'bg-[#0a1120]/92' : 'bg-white/92'}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-60">Details</p>
              {selectedChat ? (
                <div className="mt-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-2xl font-semibold text-white">
                    {chatName(selectedChat).charAt(0).toUpperCase()}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{chatName(selectedChat)}</h3>
                  <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {chatStatus(selectedChat)}
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className={`rounded-[22px] border p-4 ${isDark ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/80'}`}>
                      <p className="text-xs uppercase tracking-[0.25em] opacity-60">Unread</p>
                      <p className="mt-2 text-2xl font-semibold">{selectedChat.unreadCount || 0}</p>
                    </div>
                    <div className={`rounded-[22px] border p-4 ${isDark ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/80'}`}>
                      <p className="text-xs uppercase tracking-[0.25em] opacity-60">Last preview</p>
                      <p className="mt-2 text-sm leading-6">{previewText(selectedChat)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className={`mt-4 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Search messages on the left, pick a chat, then use the inline menu on any bubble to edit, star, or delete messages.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-60">Message Search</p>
            <div className={`mt-3 flex items-center gap-3 rounded-[24px] border px-4 py-3 ${
              isDark ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/80'
            }`}>
              <Search size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
              <input
                value={messageSearch}
                onChange={(event) => setMessageSearch(event.target.value)}
                placeholder="Search message text"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div className="mt-3 space-y-2">
              {messageSearchResults.slice(0, 6).map((result) => (
                <button
                  key={result._id}
                  type="button"
                  onClick={() => {
                    const target = chats.find((chat) => chat._id === result.chatId);
                    if (target) {
                      openChat(target);
                    }
                  }}
                  className={`w-full rounded-[22px] border p-3 text-left ${
                    isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-white/80 bg-white/80 hover:bg-white'
                  }`}
                >
                  <p className="truncate text-sm font-semibold">{result.text || result.content || 'No content'}</p>
                  <p className={`mt-1 truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {result.mediaType || result.messageType || 'text'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default ChatPage;
