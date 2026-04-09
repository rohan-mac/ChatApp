import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Archive,
  MessageSquareText,
  Paperclip,
  Search,
  Send,
  Smile,
  Sparkles,
  Users
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import client from '../../api/client';
import MessageBubble from '../../components/MessageBubble';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { useSocket } from '../../hooks/useSocket';
import useThemeMode from '../../hooks/useThemeMode';

const upsertMessage = (list, incoming) => {
  const index = list.findIndex(
    (entry) =>
      entry._id === incoming._id ||
      (entry.clientMessageId && incoming.clientMessageId && entry.clientMessageId === incoming.clientMessageId)
  );

  if (index === -1) {
    return [...list, incoming];
  }

  const next = [...list];
  next[index] = { ...next[index], ...incoming };
  return next;
};

const formatPreview = (chat) => {
  const preview = chat.lastMessageId;
  if (!preview) return 'No messages yet';
  if (preview.deletedForEveryone) return 'Message deleted';
  if (preview.text) return preview.text;
  if (preview.mediaUrl || preview.attachments?.length) return `Sent a ${preview.messageType || preview.attachments?.[0]?.type || 'file'}`;
  return 'New activity';
};

const ChatPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [theme, setTheme] = useThemeMode();
  const isDark = theme === 'dark';
  const [chats, setChats] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const [peopleSearch, setPeopleSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [messageResults, setMessageResults] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const endRef = useRef(null);
  const currentChatRef = useRef(null);
  const deferredChatSearch = useDeferredValue(chatSearch);
  const debouncedPeopleSearch = useDebouncedValue(peopleSearch, 250);
  const debouncedMessageSearch = useDebouncedValue(messageSearch, 250);

  const hydrateChats = useCallback(async () => {
    const { data } = await client.get('/chats', {
      params: { archived: false, search: deferredChatSearch || undefined }
    });
    setChats(data.data || []);
  }, [deferredChatSearch]);

  const hydratePeople = useCallback(async () => {
    const { data } = await client.get('/users', {
      params: { search: debouncedPeopleSearch || undefined, limit: 8 }
    });
    setPeople(data.data || []);
  }, [debouncedPeopleSearch]);

  const loadMessages = useCallback(async (chat) => {
    if (!chat?._id) return;
    setLoadingMessages(true);

    try {
      const { data } = await client.get(`/messages/${chat._id}`);
      setMessages(data.data || []);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const selectChat = useCallback(
    async (chat) => {
      currentChatRef.current = chat;
      setSelectedChat(chat);
      setTypingText('');
      setShowEmoji(false);
      setEditTarget(null);
      await loadMessages(chat);
    },
    [loadMessages]
  );

  useEffect(() => {
    hydrateChats();
  }, [hydrateChats]);

  useEffect(() => {
    hydratePeople();
  }, [hydratePeople]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  useEffect(() => {
    if (!debouncedMessageSearch.trim()) {
      setMessageResults([]);
      return;
    }

    const searchMessages = async () => {
      const { data } = await client.get('/messages/search', {
        params: { q: debouncedMessageSearch }
      });
      setMessageResults(data.data || []);
    };

    searchMessages();
  }, [debouncedMessageSearch]);

  useEffect(() => {
    console.log('messages', messages);
  }, [messages]);

  const handleIncomingMessage = useCallback(
    (message) => {
      setMessages((current) =>
        currentChatRef.current?._id === message.chatId ? upsertMessage(current, message) : current
      );
      hydrateChats();
    },
    [hydrateChats]
  );

  const handleUpdatedMessage = useCallback((message) => {
    setMessages((current) => current.map((entry) => (entry._id === message._id ? { ...entry, ...message } : entry)));
  }, []);

  const handleDeletedMessage = useCallback(({ messageId, scope, userId }) => {
    setMessages((current) =>
      current
        .map((entry) =>
          entry._id === messageId && scope === 'everyone'
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
        .filter((entry) => !(entry._id === messageId && scope === 'me' && userId === (user.id || user._id)))
    );
    hydrateChats();
  }, [hydrateChats, user.id, user._id]);

  const handlePresenceUpdate = useCallback(({ userId, isOnline, lastSeen }) => {
    setChats((current) =>
      current.map((chat) => {
        const counterpart = chat.counterpart?._id === userId
          ? { ...chat.counterpart, isOnline, lastSeen }
          : chat.counterpart;
        return { ...chat, counterpart };
      })
    );
    setPeople((current) => current.map((person) => (person._id === userId ? { ...person, isOnline, lastSeen } : person)));
  }, []);

  const socket = useSocket({
    'message:new': handleIncomingMessage,
    'message:updated': handleUpdatedMessage,
    'message:deleted': handleDeletedMessage,
    'presence:update': handlePresenceUpdate,
    'chat:typing': ({ senderId, chatId }) => {
      if (currentChatRef.current?._id === chatId && senderId !== (user.id || user._id)) {
        setTypingText('Typing...');
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = window.setTimeout(() => setTypingText(''), 1200);
      }
    }
  });

  useEffect(() => {
    if (!selectedChat?._id) return undefined;

    socket.emit('chat:join', selectedChat._id);
    return () => {
      socket.emit('chat:leave', selectedChat._id);
    };
  }, [selectedChat?._id, socket]);

  useEffect(() => {
    if (!selectedChat?._id) return;
    messages
      .filter((message) => (message.senderId?._id || message.senderId) !== (user.id || user._id))
      .forEach((message) => {
        socket.emit('message:seen', { messageId: message._id, chatId: selectedChat._id });
      });
  }, [messages, selectedChat?._id, socket, user.id, user._id]);

  const filteredChats = useMemo(() => {
    if (!deferredChatSearch.trim()) return chats;
    const needle = deferredChatSearch.toLowerCase();
    return chats.filter((chat) => {
      const name = (chat.counterpart?.name || chat.title || '').toLowerCase();
      const preview = formatPreview(chat).toLowerCase();
      return name.includes(needle) || preview.includes(needle);
    });
  }, [chats, deferredChatSearch]);

  const sendMessage = useCallback(async () => {
    if (!selectedChat?._id || (!draft.trim() && !attachment)) return;

    const payload = new FormData();
    payload.append('chatId', selectedChat._id);
    payload.append('text', draft);
    payload.append('clientMessageId', crypto.randomUUID());
    if (attachment) {
      payload.append('file', attachment);
    }

    try {
      if (editTarget) {
        const { data } = await client.patch(`/messages/${editTarget._id}`, { text: draft });
        setMessages((current) => current.map((entry) => (entry._id === data._id ? data : entry)));
        pushToast({ title: 'Message updated', tone: 'success' });
      } else {
        const { data } = await client.post('/messages', payload);
        setMessages((current) => upsertMessage(current, data));
      }

      setDraft('');
      setAttachment(null);
      setEditTarget(null);
      setShowEmoji(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      hydrateChats();
    } catch (error) {
      pushToast({
        title: 'Unable to send message',
        description: error.response?.data?.message || 'Please try again.',
        tone: 'error'
      });
    }
  }, [attachment, draft, editTarget, hydrateChats, pushToast, selectedChat?._id]);

  const createDirectChat = useCallback(async (person) => {
    const { data } = await client.post('/chats', { receiverId: person._id });
    await hydrateChats();
    await selectChat(data);
  }, [hydrateChats, selectChat]);

  const archiveCurrentChat = useCallback(async () => {
    if (!selectedChat?._id) return;
    await client.post(`/chats/${selectedChat._id}/archive`);
    setSelectedChat(null);
    setMessages([]);
    hydrateChats();
    pushToast({ title: 'Chat archived', tone: 'success' });
  }, [hydrateChats, pushToast, selectedChat?._id]);

  const handleDelete = useCallback(async (message) => {
    const scope = message.senderId?._id === (user.id || user._id)
      ? window.prompt("Type 'everyone' to delete for everyone or 'me' to delete only for yourself", 'me')
      : 'me';

    if (!scope || !['me', 'everyone'].includes(scope)) return;

    await client.delete(`/messages/${message._id}`, { data: { scope } });
    if (scope === 'me') {
      setMessages((current) => current.filter((entry) => entry._id !== message._id));
    }
    pushToast({ title: 'Message deleted', tone: 'success' });
  }, [pushToast, user.id, user._id]);

  const handleToggleStar = useCallback(async (message) => {
    const { data } = await client.post(`/messages/${message._id}/star`);
    setMessages((current) => current.map((entry) => (entry._id === data._id ? data : entry)));
  }, []);

  const activeTitle = selectedChat?.counterpart?.name || selectedChat?.title || 'Chat Dashboard';
  const activeSubtitle = selectedChat?.counterpart
    ? selectedChat.counterpart.isOnline
      ? 'Online now'
      : selectedChat.counterpart.status || 'Offline'
    : 'Real-time messaging, media, search, archive and starred actions.';

  return (
    <AppShell
      title={activeTitle}
      subtitle={activeSubtitle}
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      actions={
        selectedChat ? (
          <button
            type="button"
            onClick={archiveCurrentChat}
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
      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <section className={`rounded-[28px] border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/70'}`}>
          <div className={`mb-4 flex items-center gap-3 rounded-[22px] border px-4 py-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}>
            <Search size={16} className="opacity-60" />
            <input
              value={chatSearch}
              onChange={(event) => setChatSearch(event.target.value)}
              placeholder="Search chats"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] opacity-60">
              <MessageSquareText size={14} />
              Recent chats
            </div>
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <button
                  key={chat._id}
                  type="button"
                  onClick={() => selectChat(chat)}
                  className={`w-full rounded-[24px] border p-3 text-left transition ${
                    selectedChat?._id === chat._id
                      ? isDark
                        ? 'border-sky-400/30 bg-sky-500/15'
                        : 'border-sky-300/70 bg-sky-500/10'
                      : isDark
                        ? 'border-white/10 bg-white/5 hover:bg-white/10'
                        : 'border-white/70 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{chat.counterpart?.name || chat.title || 'Conversation'}</p>
                      <p className={`mt-1 truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatPreview(chat)}</p>
                    </div>
                    {chat.unreadCount ? (
                      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-sky-500 px-2 py-1 text-[11px] text-white">
                        {chat.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] opacity-60">
              <Users size={14} />
              Find people
            </div>
            <div className={`mb-3 flex items-center gap-3 rounded-[22px] border px-4 py-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}>
              <Search size={16} className="opacity-60" />
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
                  onClick={() => createDirectChat(person)}
                  className={`w-full rounded-[22px] border p-3 text-left ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-white/70 bg-white/70 hover:bg-white'}`}
                >
                  <p className="text-sm font-semibold">{person.name}</p>
                  <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{person.status || person.email}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={`flex min-h-[72vh] flex-col rounded-[28px] border ${isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/70'}`}>
          <div className={`border-b p-4 ${isDark ? 'border-white/10' : 'border-white/60'}`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-semibold">{activeTitle}</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activeSubtitle}</p>
              </div>

              <div className={`flex items-center gap-3 rounded-[20px] border px-4 py-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}>
                <Search size={16} className="opacity-60" />
                <input
                  value={messageSearch}
                  onChange={(event) => setMessageSearch(event.target.value)}
                  placeholder="Search messages"
                  className="w-full min-w-[180px] bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {messageResults.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {messageResults.slice(0, 5).map((result) => (
                  <button
                    key={result._id}
                    type="button"
                    onClick={async () => {
                      const targetChat = chats.find((chat) => chat._id === result.chatId) || null;
                      if (targetChat) {
                        await selectChat(targetChat);
                      }
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs ${isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}
                  >
                    {result.text || 'Attachment'}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="minimal-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
            {!selectedChat ? (
              <div className="flex h-full items-center justify-center">
                <div className={`max-w-md rounded-[30px] border px-8 py-10 text-center ${isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold">Production-ready chat workspace</h3>
                  <p className={`mt-3 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Conversations, search, media, typing indicators, archive and profile settings are all wired together now.
                  </p>
                </div>
              </div>
            ) : loadingMessages ? (
              <div className="flex h-full items-center justify-center text-sm opacity-70">Loading messages...</div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isMine={(message.senderId?._id || message.senderId) === (user.id || user._id)}
                    isDark={isDark}
                    currentUserId={user.id || user._id}
                    onEdit={(target) => {
                      setEditTarget(target);
                      setDraft(target.text || '');
                    }}
                    onDelete={handleDelete}
                    onToggleStar={handleToggleStar}
                  />
                ))}
                {typingText ? <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{typingText}</p> : null}
                <div ref={endRef} />
              </>
            )}
          </div>

          <div className={`border-t p-4 ${isDark ? 'border-white/10' : 'border-white/60'}`}>
            {attachment ? (
              <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${isDark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-white/70 bg-white/80 text-slate-600'}`}>
                <Paperclip size={14} />
                <span>{attachment.name}</span>
              </div>
            ) : null}

            {editTarget ? (
              <div className={`mb-3 flex items-center justify-between rounded-2xl border px-4 py-3 text-xs ${isDark ? 'border-amber-400/20 bg-amber-500/10 text-amber-100' : 'border-amber-300/70 bg-amber-50 text-amber-700'}`}>
                <span>Editing message</span>
                <button type="button" onClick={() => { setEditTarget(null); setDraft(''); }}>
                  Cancel
                </button>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 lg:flex-row">
              <div className={`flex flex-1 items-center gap-2 rounded-[26px] border px-3 py-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}>
                <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => setAttachment(event.target.files?.[0] || null)} />
                <button type="button" onClick={() => setShowEmoji((current) => !current)} className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
                  <Smile size={18} />
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
                  <Paperclip size={18} />
                </button>
                <input
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
                      sendMessage();
                    }
                  }}
                  placeholder={selectedChat ? 'Type a message' : 'Pick a conversation'}
                  className="w-full bg-transparent text-sm outline-none"
                  disabled={!selectedChat}
                />
              </div>

              <button
                type="button"
                onClick={sendMessage}
                disabled={!selectedChat || (!draft.trim() && !attachment)}
                className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[24px] bg-gradient-to-r from-sky-500 to-indigo-500 px-6 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Send size={16} />
                <span>{editTarget ? 'Save' : 'Send'}</span>
              </button>
            </div>

            {showEmoji ? (
              <div className="mt-3 overflow-hidden rounded-[28px]">
                <EmojiPicker
                  onEmojiClick={(emoji) => setDraft((current) => current + emoji.emoji)}
                  width="100%"
                  previewConfig={{ showPreview: false }}
                  skinTonesDisabled
                  lazyLoadEmojis
                  theme={theme}
                />
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default ChatPage;
