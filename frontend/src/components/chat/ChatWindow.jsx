import { memo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { LoaderCircle, MoreVertical, Phone, Video, X } from 'lucide-react';
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
  theme,
  onClearChat,
  onSetTheme
}) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  return (
    <section className="flex h-full flex-col bg-[#e5e5e5] shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-none">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 shadow-sm rounded-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 lg:hidden"
          >
            <X size={18} />
          </button>
          {selectedChat ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0084ff] text-lg font-semibold text-white shadow-sm">
                {getChatName(selectedChat).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">{getChatName(selectedChat)}</p>
                <p className="truncate text-sm text-slate-500">{typingText || getChatStatus(selectedChat)}</p>
              </div>
            </>
          ) : (
            <p className="text-base font-medium text-slate-900">Select a conversation</p>
          )}
        </div>

        {selectedChat ? (
          <div className="relative flex items-center gap-2">
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Phone size={18} />
            </button>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Video size={18} />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOptionsOpen((current) => !current);
                  setThemeMenuOpen(false);
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <MoreVertical size={18} />
              </button>
              {optionsOpen ? (
                <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden border border-slate-200 bg-white shadow-lg rounded-none">
                  <button
                    type="button"
                    onClick={() => {
                      setOptionsOpen(false);
                      onClearChat?.();
                    }}
                    className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span>Clear chat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMenuOpen((current) => !current)}
                    className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span>Set theme</span>
                    <span className="text-slate-400">›</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOptionsOpen(false);
                      onBack?.();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Close chat
                  </button>
                </div>
              ) : null}
              {themeMenuOpen ? (
                <div className="absolute right-full top-0 z-20 mr-2 mt-2 w-48 overflow-hidden border border-slate-200 bg-white shadow-lg rounded-none">
                  {['light', 'dark', 'ocean', 'rose'].map((themeId) => (
                    <button
                      key={themeId}
                      type="button"
                      onClick={() => {
                        onSetTheme?.(themeId);
                        setThemeMenuOpen(false);
                        setOptionsOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      {themeId === 'light' ? 'Light' : themeId === 'dark' ? 'Dark' : themeId === 'ocean' ? 'Ocean' : 'Rose'}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>

      <div className="minimal-scrollbar flex-1 overflow-y-auto bg-[#f0f2f5] px-4 py-4">
      {!selectedChat ? (
        <div className="flex h-full items-center justify-center text-sm opacity-70">Choose a chat to start messaging.</div>
      ) : loadingMessages ? (
        <div className="flex h-full items-center justify-center gap-2 text-sm opacity-70">
          <LoaderCircle size={18} className="animate-spin" />
          Loading messages...
        </div>
      ) : (
        <div className="space-y-3 py-2">
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

    <div className={`border-t px-3 pb-3 pt-4 ${isDark ? 'border-white/10 bg-slate-950/90' : 'border-slate-200/80 bg-white/95'}`}>
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
        theme={theme}
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
};

export default memo(ChatWindow);
