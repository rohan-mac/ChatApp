
import { memo, useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { LoaderCircle, MoreVertical, Phone, Video, X } from 'lucide-react';
import { Z_INDEX } from '../../constants/zIndex';
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
  const [emojiPickerPosition, setEmojiPickerPosition] = useState('bottom');
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const emojiContainerRef = useRef(null);

  const isOcean = theme === 'ocean';
  const isRose = theme === 'rose';
  const themeLabel =
    theme === 'light'
      ? 'Light'
      : theme === 'dark'
      ? 'Night'
      : theme === 'ocean'
      ? 'Ocean'
      : 'Rose';

  // Emoji positioning
  useEffect(() => {
    if (!showEmoji || !emojiContainerRef.current) return;
    const rect = emojiContainerRef.current.getBoundingClientRect();
    if (rect.bottom + 450 > window.innerHeight) {
      setEmojiPickerPosition('top');
    } else {
      setEmojiPickerPosition('bottom');
    }
  }, [showEmoji]);

  // Clear attachment preview when attachment is cleared
  useEffect(() => {
    if (!attachment) {
      setAttachmentPreview(null);
    }
  }, [attachment]);

  return (
    <section
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl md:rounded-3xl shadow-xl ${
        isDark
          ? 'bg-slate-950/95'
          : isOcean
          ? 'bg-cyan-50/95'
          : isRose
          ? 'bg-rose-50/95'
          : 'bg-slate-50/95'
      }`}
    >
      {/* HEADER */}
      <header className={`flex items-center justify-between gap-2 sm:gap-4 border-b px-3 sm:px-6 py-3 sm:py-5 flex-shrink-0 ${
        isDark
          ? 'bg-slate-900/90 border-white/10'
          : 'bg-white border-slate-200/60'
      }`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button onClick={onBack} className="lg:hidden">
            <X />
          </button>

          {selectedChat ? (
            <>
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500 text-white font-bold">
                {getChatName(selectedChat).charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-semibold">{getChatName(selectedChat)}</p>
                <p className="text-xs text-gray-500">
                  {typingText || getChatStatus(selectedChat)}
                </p>
              </div>
            </>
          ) : (
            <p>Select chat</p>
          )}
        </div>

        {selectedChat && (
          <div className="flex items-center gap-2">
            <Phone />
            <Video />
            <button onClick={() => setOptionsOpen(!optionsOpen)}>
              <MoreVertical />
            </button>
          </div>
        )}
      </header>

      {/* MESSAGES */}
      <div className="minimal-scrollbar flex-1 min-h-0 overflow-y-auto px-3 py-4 pb-6 sm:px-6 md:pb-24">
        {!selectedChat ? (
          <div className="h-full flex items-center justify-center">
            Select a chat
          </div>
        ) : loadingMessages ? (
          <div className="h-full flex items-center justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : (
          activeMessages.map((message) => (
            <MessageBubble
              key={message._id || message.clientMessageId}
              message={message}
              isMine={(message.senderId?._id || message.senderId) === currentUserId}
              isDark={isDark}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStar={onToggleStar}
            />
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* INPUT (ALWAYS BOTTOM) */}
      <div
        className={`flex-shrink-0 border-t px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-3 backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-slate-900/95' : 'border-slate-200/60 bg-white/95'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setAttachment(file);
              // Show preview for images and videos
              if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = (event) => setAttachmentPreview(event.target.result);
                reader.readAsDataURL(file);
              } else {
                // Non-media files (PDF, DOC, etc.) show null preview
                setAttachmentPreview(null);
              }
            }
          }}
        />

        {attachmentPreview && (
          <div className="mb-3 rounded-lg overflow-hidden relative">
            {attachment?.type.startsWith('image/') ? (
              <img src={attachmentPreview} alt="Preview" className="h-32 w-full object-cover rounded-lg shadow-md" />
            ) : attachment?.type.startsWith('video/') ? (
              <video src={attachmentPreview} className="h-32 w-full object-cover rounded-lg shadow-md" controls={false} />
            ) : null}
            <div className="flex items-center justify-between p-2 bg-black/50 text-white text-xs">
              <span>{attachment?.name}</span>
              <button
                type="button"
                onClick={() => {
                  setAttachment(null);
                  if (fileRef.current) fileRef.current.value = '';
                }}
                className="ml-2 px-2 py-1 hover:bg-red-500 rounded transition-colors"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        )}

        {attachment && !attachmentPreview && (
          <div className="mb-3 text-xs font-medium flex items-center justify-between gap-2 p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span>📎</span>
              <span>{attachment.name}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setAttachment(null);
                if (fileRef.current) fileRef.current.value = '';
              }}
              className="px-2 py-1 hover:bg-red-200 rounded transition-colors"
            >
              ✕ Remove
            </button>
          </div>
        )}

        {editTarget && (
          <button onClick={() => setEditTarget(null)} className="text-xs mb-2">
            Editing message (cancel)
          </button>
        )}

        <InputBar
          draft={draft}
          onDraftChange={setDraft}
          onToggleEmoji={() => setShowEmoji((p) => !p)}
          onAttachment={() => fileRef.current?.click()}
          onSend={performSend}
          disabled={!selectedChat}
          sending={sending}
          hasAttachment={Boolean(attachment)}
          inputRef={inputRef}
          selectedChat={selectedChat}
          socket={socket}
          userId={currentUserId}
          isDark={isDark}
          theme={theme}
        />

        {/* EMOJI */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              ref={emojiContainerRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <EmojiPicker
                onEmojiClick={(e) => setDraft((d) => d + e.emoji)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default memo(ChatWindow);
