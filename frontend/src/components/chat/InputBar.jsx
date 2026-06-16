import { memo, useState } from 'react';
import { Camera, Contact, FileText, Image, LoaderCircle, MapPin, Paperclip, Send, Smile, Video } from 'lucide-react';

const attachmentItems = [
  { label: 'Photo', icon: Image, accept: 'image/*' },
  { label: 'Video', icon: Video, accept: 'video/*' },
  { label: 'Document', icon: FileText, accept: '.pdf,.doc,.docx,.txt' },
  { label: 'Camera', icon: Camera, accept: 'image/*' },
  { label: 'Location', icon: MapPin },
  { label: 'Contact', icon: Contact }
];

const InputBar = ({ draft, onDraftChange, onToggleEmoji, onAttachment, onSend, disabled, sending, hasAttachment, inputRef, selectedChat, socket, userId }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const emitTyping = () => {
    if (selectedChat?._id) socket.emit('chat:typing', { chatId: selectedChat._id, senderId: userId });
  };

  return (
    <div className="relative flex min-h-[62px] items-center gap-2 bg-[var(--wa-input-shell)] px-3 py-2">
      <button type="button" onClick={onToggleEmoji} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--wa-muted)] hover:bg-[var(--wa-hover)]" aria-label="Open emoji picker"><Smile size={24} /></button>

      <div className="relative order-3 sm:order-none">
        <button type="button" onClick={() => setMenuOpen((value) => !value)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--wa-muted)] hover:bg-[var(--wa-hover)]" aria-label="Open attachment menu"><Paperclip size={23} /></button>
        {menuOpen ? (
          <div className="absolute bottom-12 right-0 z-30 grid w-48 gap-1 rounded-xl border border-[var(--wa-border)] bg-[var(--wa-card)] p-2 text-[14px] text-[var(--wa-text)] shadow-2xl animate-[menu-in_.16s_ease-out]">
            {attachmentItems.map(({ label, icon: Icon, accept }) => (
              <button key={label} type="button" onClick={() => { setMenuOpen(false); if (accept) onAttachment(); }} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[var(--wa-hover)]"><Icon size={18} />{label}</button>
            ))}
          </div>
        ) : null}
      </div>

      <textarea
        ref={inputRef}
        rows="1"
        value={draft}
        disabled={disabled}
        placeholder={selectedChat ? 'Type a message' : 'Select a chat to start'}
        onChange={(event) => { onDraftChange(event.target.value); emitTyping(); }}
        onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); onSend(); } }}
        className="max-h-32 min-h-[42px] flex-1 resize-none rounded-full border-0 bg-[var(--wa-input)] px-4 py-2.5 text-[15px] text-[var(--wa-text)] outline-none placeholder:text-[var(--wa-muted)] focus:ring-2 focus:ring-[#25D366]/40"
      />

      <button type="button" onClick={onSend} disabled={disabled || sending || (!draft.trim() && !hasAttachment)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message">
        {sending ? <LoaderCircle size={20} className="animate-spin" /> : <Send size={20} />}
      </button>
    </div>
  );
};

export default memo(InputBar);
