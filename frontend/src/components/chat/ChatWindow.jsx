import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { LoaderCircle, MoreVertical, Search, X } from 'lucide-react';
import MessageBubble from '../MessageBubble';
import InputBar from './InputBar';

const ChatWindow = ({
  isDark,
  selectedChat,
  typingText,
  getChatName,
  getChatStatus,
  loadingMessages,
  activeMessages,
  currentUserId,
  onEdit,
  onDelete,
  onToggleStar,
  onBack,
  endRef,
  draft,
  setDraft,
  showEmoji,
  setShowEmoji,
  fileRef,
  setAttachment,
  performSend,
  sending,
  inputRef,
  socket,
  attachment,
  setEditTarget,
  editTarget,
  theme
}) => (
  <section className={`flex min-h-[78vh] flex-col rounded-[28px] border shadow-[0_20px_48px_rgba(0,0,0,0.2)] backdrop-blur-[20px] ${isDark ? 'border-white/10 bg-[rgba(8,15,25,0.58)]' : 'border-white/70 bg-[rgba(255,255,255,0.63)]'}`}>
    <header className={`flex items-center gap-3 border-b px-3 py-3 md:px-4 ${isDark ? 'border-white/10' : 'border-white/70'}`}>
      <button
        type="button"
        onClick={onBack}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${isDark ? 'bg-white/10 text-white' : 'bg-slate-900/5 text-slate-700'}`}
      >
        <X size={16} />
      </button>

      {selectedChat ? (
        <>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-[#25D366] text-sm font-semibold text-white shadow-lg">
            {getChatName(selectedChat).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold md:text-base">{getChatName(selectedChat)}</p>
            <p className={`truncate text-xs ${isDark ? 'text-slate-300/80' : 'text-slate-600'}`}>
              {typingText || getChatStatus(selectedChat)}
            </p>
          </div>
          <button type="button" className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-900/5 text-slate-600'}`}>
            <Search size={16} />
          </button>
          <button type="button" className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-900/5 text-slate-600'}`}>
            <MoreVertical size={16} />
          </button>
        </>
      ) : (
        <p className="text-sm font-medium">Select a conversation</p>
      )}
    </header>

    <div className="minimal-scrollbar flex-1 overflow-y-auto px-3 py-4 sm:px-4">
      {!selectedChat ? (
        <div className="flex h-full items-center justify-center text-sm opacity-70">Choose a chat to start messaging.</div>
      ) : loadingMessages ? (
        <div className="flex h-full items-center justify-center gap-2 text-sm opacity-70">
          <LoaderCircle size={18} className="animate-spin" />
          Loading messages...
        </div>
      ) : (
        <div className="space-y-2">
          {activeMessages.map((message) => (
            <MessageBubble
              key={message._id || message.clientMessageId}
              message={message}
              isMine={(message.senderId?._id || message.senderId) === currentUserId}
              isDark={isDark}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStar={onToggleStar}
            />
          ))}
          <div ref={endRef} />
        </div>
      )}
    </div>

    <div className={`border-t p-3 ${isDark ? 'border-white/10' : 'border-white/70'}`}>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={(event) => setAttachment(event.target.files?.[0] || null)}
      />

      {attachment ? (
        <div className={`mb-2 rounded-xl border px-3 py-2 text-xs ${isDark ? 'border-white/10 bg-white/10' : 'border-white/70 bg-white/80'}`}>
          {attachment.name}
        </div>
      ) : null}

      {editTarget ? (
        <button
          type="button"
          onClick={() => setEditTarget(null)}
          className={`mb-2 rounded-xl border px-3 py-2 text-left text-xs ${isDark ? 'border-amber-400/20 bg-amber-500/12 text-amber-100' : 'border-amber-300/60 bg-amber-50 text-amber-700'}`}
        >
          Editing message — tap to cancel
        </button>
      ) : null}

      <InputBar
        isDark={isDark}
        draft={draft}
        onDraftChange={setDraft}
        onToggleEmoji={() => setShowEmoji((current) => !current)}
        onAttachment={() => fileRef.current?.click()}
        onSend={performSend}
        disabled={!selectedChat}
        sending={sending}
        hasAttachment={Boolean(attachment)}
        inputRef={inputRef}
        selectedChat={selectedChat}
        socket={socket}
        userId={currentUserId}
      />

      <AnimatePresence>
        {showEmoji ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-2 overflow-hidden rounded-2xl"
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
);

export default memo(ChatWindow);
