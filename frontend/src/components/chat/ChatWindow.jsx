import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { ChevronLeft, LoaderCircle, MoreVertical, Phone, Video, X } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import MessageBubble from '../MessageBubble';
import InputBar from './InputBar';

const ChatWindow = ({ isDark, selectedChat, typingText, getChatName, getChatStatus, loadingMessages, activeMessages, currentUserId, onEdit, onDelete, onToggleStar, onBack, endRef, draft, setDraft, showEmoji, setShowEmoji, fileRef, setAttachment, performSend, sending, inputRef, socket, attachment, setEditTarget, editTarget, theme, onClearChat, onSetTheme, onViewportRead }) => { 
  const viewedRef = useRef(new Set());
  const observerRef = useRef(null);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const emojiRef = useRef(null);
  const { startCall } = useCall();

  useEffect(() => {
    const handleClick = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) setShowEmoji(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [setShowEmoji]);

  useEffect(() => {
    if (!attachment) setAttachmentPreview(null);
  }, [attachment]);

  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? draft.length;
    const end = input?.selectionEnd ?? draft.length;
    const next = `${draft.slice(0, start)}${emoji}${draft.slice(end)}`;
    setDraft(next);
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--wa-chat-bg)] text-[var(--wa-text)]">
      <header className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center justify-between gap-3 border-b border-[var(--wa-border)] bg-[var(--wa-header)] px-3 shadow-sm">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-10 w-10 place-items-center rounded-full text-[var(--wa-muted)] hover:bg-[var(--wa-hover)] lg:hidden" aria-label="Back to chat list"><ChevronLeft size={24} /></button>
          {selectedChat ? (
            <>
              <span className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-[#128C7E] to-[#25D366] text-white">
                {selectedChat.counterpart?.profilePic ? <img src={selectedChat.counterpart.profilePic} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center font-semibold">{getChatName(selectedChat)[0]?.toUpperCase() || '?'}</span>}
              </span>
              <span className="min-w-0">
                <p className="truncate text-[16px] font-semibold">{getChatName(selectedChat)}</p>
                <p className="truncate text-[12px] text-[var(--wa-muted)]">{typingText ? <span>{getChatName(selectedChat)} is typing<span className="typing-dots">...</span></span> : getChatStatus(selectedChat)}</p>
              </span>
            </>
          ) : <p className="font-semibold">Select chat</p>}
        </div>

        {selectedChat ? (
          <div className="flex items-center gap-1 text-[var(--wa-muted)]">
            <button type="button" onClick={() => selectedChat.counterpart?._id && startCall(selectedChat.counterpart._id, 'video', selectedChat._id)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--wa-hover)]" aria-label="Start video call"><Video size={21} /></button>
            <button type="button" onClick={() => selectedChat.counterpart?._id && startCall(selectedChat.counterpart._id, 'audio', selectedChat._id)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--wa-hover)]" aria-label="Start voice call"><Phone size={20} /></button>
            <div className="relative">
              <button type="button" onClick={() => setOptionsOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--wa-hover)]" aria-label="Open conversation menu"><MoreVertical size={21} /></button>
              {optionsOpen ? <div className="absolute right-0 top-11 z-30 w-44 rounded-md border border-[var(--wa-border)] bg-[var(--wa-card)] py-2 text-[14px] text-[var(--wa-text)] shadow-xl"><button onClick={() => onSetTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full px-4 py-2 text-left hover:bg-[var(--wa-hover)]">Toggle dark mode</button><button onClick={onClearChat} className="w-full px-4 py-2 text-left hover:bg-[var(--wa-hover)]">Clear chat</button></div> : null}
            </div>
          </div>
        ) : null}
      </header>

      <div className="wa-wallpaper minimal-scrollbar flex-1 overflow-y-auto px-2 py-4 sm:px-8">
        {!selectedChat ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-[var(--wa-muted)]"><div className="mb-5 grid h-28 w-28 place-items-center rounded-full bg-[var(--wa-search)] text-5xl">💬</div><h2 className="text-[20px] font-light text-[var(--wa-text)]">Select a chat to start messaging</h2></div>
        ) : loadingMessages ? (
          <div className="grid h-full place-items-center"><LoaderCircle className="animate-spin text-[#25D366]" /></div>
        ) : activeMessages.length ? activeMessages.map((message) => <MessageBubble key={message._id || message.clientMessageId} message={message} isMine={(message.senderId?._id || message.senderId) === currentUserId} isDark={isDark} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} onToggleStar={onToggleStar} />) : <p className="mt-10 text-center text-[13px] text-[var(--wa-muted)]">No messages yet. Say hello.</p>}
        <div ref={endRef} />
      </div>

      <div className="relative shrink-0">
        <input ref={fileRef} type="file" accept="image/*,video/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; setAttachment(file); if (file.type.startsWith('image/') || file.type.startsWith('video/')) { const reader = new FileReader(); reader.onload = (readerEvent) => setAttachmentPreview(readerEvent.target.result); reader.readAsDataURL(file); } }} />
        {(attachment || editTarget) ? <div className="flex items-center justify-between gap-3 border-t border-[var(--wa-border)] bg-[var(--wa-input-shell)] px-4 py-2 text-[13px] text-[var(--wa-muted)]"><span className="truncate">{editTarget ? 'Editing message' : `Attached: ${attachment.name}`}</span><button type="button" onClick={() => { setAttachment(null); setEditTarget(null); if (fileRef.current) fileRef.current.value = ''; }} className="grid h-7 w-7 place-items-center rounded-full hover:bg-[var(--wa-hover)]"><X size={16} /></button></div> : null}
        {attachmentPreview ? <div className="border-t border-[var(--wa-border)] bg-[var(--wa-input-shell)] p-3">{attachment?.type.startsWith('image/') ? <img src={attachmentPreview} alt="Attachment preview" className="h-28 rounded-lg object-cover" /> : <video src={attachmentPreview} className="h-28 rounded-lg object-cover" />}</div> : null}
        <InputBar draft={draft} onDraftChange={setDraft} onToggleEmoji={() => setShowEmoji((value) => !value)} onAttachment={() => fileRef.current?.click()} onSend={performSend} disabled={!selectedChat} sending={sending} hasAttachment={Boolean(attachment)} inputRef={inputRef} selectedChat={selectedChat} socket={socket} userId={currentUserId} />
        <AnimatePresence>{showEmoji ? <motion.div ref={emojiRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="absolute bottom-[70px] left-2 z-40 max-w-[calc(100vw-1rem)]"><EmojiPicker theme={theme === 'dark' ? 'dark' : 'light'} onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)} lazyLoadEmojis /></motion.div> : null}</AnimatePresence>
      </div>
    </section>
  );
};

export default memo(ChatWindow);
