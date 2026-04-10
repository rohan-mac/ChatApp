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
  const isOcean = theme === 'ocean';
  const isRose = theme === 'rose';
  const themeLabel = theme === 'light' ? 'Light' : theme === 'dark' ? 'Night' : theme === 'ocean' ? 'Ocean' : 'Rose';

  return (
    <section className={`flex h-full flex-col rounded-3xl shadow-xl ${isDark ? 'bg-slate-950/95' : isOcean ? 'bg-cyan-50/95' : isRose ? 'bg-rose-50/95' : 'bg-slate-50/95'}`}>
      <header className={`flex items-center justify-between gap-4 border-b border-slate-200/60 px-6 py-5 shadow-sm rounded-t-3xl ${isDark ? 'bg-gradient-to-r from-slate-900/90 to-slate-950/90' : isOcean ? 'bg-gradient-to-r from-cyan-100 to-sky-100' : isRose ? 'bg-gradient-to-r from-fuchsia-100 to-rose-100' : 'bg-gradient-to-r from-white via-slate-50 to-white'}`}>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 lg:hidden hover:bg-slate-200 transition-all duration-200 shadow-sm"
          >
            <X size={20} />
          </button>
          {selectedChat ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                {getChatName(selectedChat).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-slate-900">{getChatName(selectedChat)}</p>
                <p className="truncate text-sm text-slate-600 font-medium">{typingText || getChatStatus(selectedChat)}</p>
              </div>
            </>
          ) : (
            <p className="text-lg font-semibold text-slate-900">Select a conversation</p>
          )}
        </div>

        {selectedChat ? (
          <div className="relative flex items-center gap-3">
            <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200 shadow-sm hover:shadow-md">
              <Phone size={20} />
            </button>
            <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200 shadow-sm hover:shadow-md">
              <Video size={20} />
            </button>
            <div className="relative">
              <button
                type="button"
                title={`Theme: ${themeLabel}`}
                onClick={() => {
                  setOptionsOpen((current) => !current);
                  setThemeMenuOpen(false);
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <MoreVertical size={20} />
              </button>
              {optionsOpen ? (
                <div className="absolute right-0 top-full z-20 mt-3 w-48 overflow-hidden border border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setOptionsOpen(false);
                      onClearChat?.();
                    }}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100/80 transition-colors duration-150 rounded-t-2xl"
                  >
                    <span>Clear chat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMenuOpen((current) => !current)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100/80 transition-colors duration-150"
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
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100/80 transition-colors duration-150 rounded-b-2xl"
                  >
                    Close chat
                  </button>
                </div>
              ) : null}
              {themeMenuOpen ? (
                <div className="absolute right-full top-0 z-20 mr-3 mt-2 w-52 overflow-hidden border border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl">
                  {['light', 'dark', 'ocean', 'rose'].map((themeId) => (
                    <button
                      key={themeId}
                      type="button"
                      onClick={() => {
                        onSetTheme?.(themeId);
                        setThemeMenuOpen(false);
                        setOptionsOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100/80 transition-colors duration-150 first:rounded-t-2xl last:rounded-b-2xl"
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

      <div className="minimal-scrollbar flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 via-white to-slate-100/50 px-6 py-6">
      {!selectedChat ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
              {/* <MessageSquare size={32} className="text-blue-600" /> */}
            </div>
            <p className="text-lg font-semibold text-slate-700">Choose a chat to start messaging</p>
            <p className="text-sm text-slate-500 mt-1">Select a conversation from the sidebar</p>
          </div>
        </div>
      ) : loadingMessages ? (
        <div className="flex h-full items-center justify-center gap-3">
          <LoaderCircle size={20} className="animate-spin text-blue-600" />
          <p className="text-base font-medium text-slate-600">Loading messages...</p>
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

    <div className={`border-t border-slate-200/60 px-6 pb-6 pt-5 ${isDark ? 'border-white/20 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm' : 'bg-gradient-to-r from-white/90 via-slate-50/90 to-white/90 backdrop-blur-sm'}`}>
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
