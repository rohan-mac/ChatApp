import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { EllipsisVertical, FileText, Pencil, Star, StarOff, Trash2 } from 'lucide-react';
import { formatClockTime } from '../utils/time';
import MessageStatus from './chat/MessageStatus';

const formatMessageTime = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};


/**
 * Render attachment based on type
 */
const renderAttachment = (attachment) => {
  if (!attachment) return null;
  const { url, type, name } = attachment;
  if (type === 'image') return <img src={url} alt={name || 'image'} loading="lazy" className="mb-1 max-h-80 w-full rounded-md object-cover" />;
  if (type === 'video') return <video src={url} controls className="mb-1 max-h-80 w-full rounded-md object-cover" />;
  if (type === 'document') return <a href={url} target="_blank" rel="noopener noreferrer" className="mb-1 flex items-center gap-2 rounded-md bg-black/5 p-2 text-[13px] hover:bg-black/10"><FileText size={16} /><span className="truncate">{name || 'Document'}</span></a>;
  return null;
};

const MessageBubble = ({ message, isMine, isDark, currentUserId, onEdit, onDelete, onToggleStar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const text = message.deletedForEveryone ? 'This message was deleted' : (message.text || message.content || '');
  const isStarred = message.starredBy?.some((entry) => (entry._id || entry) === currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      className={`group flex px-2 py-[2px] ${isMine ? 'justify-end' : 'justify-start'}`}
      onContextMenu={(event) => { event.preventDefault(); setMenuOpen((value) => !value); }}
    >
      <div className={`relative max-w-[88%] rounded-lg px-2.5 py-1.5 text-[14px] leading-5 shadow-sm sm:max-w-[70%] ${isMine ? 'bg-[var(--wa-bubble-sent)] text-[var(--wa-bubble-text)]' : 'bg-[var(--wa-bubble-received)] text-[var(--wa-text)]'} ${message.deletedForEveryone ? 'italic text-[var(--wa-muted)]' : ''}`}>
        <button type="button" onClick={() => setMenuOpen((value) => !value)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" aria-label="Message options"><EllipsisVertical size={14} /></button>

        {message.attachments?.length ? <div className="mb-1 space-y-1">{message.attachments.map((attachment, index) => <div key={`${attachment.url || attachment.name}-${index}`}>{renderAttachment(attachment)}</div>)}</div> : null}
        {text ? <p className="whitespace-pre-wrap break-words pr-10">{text}</p> : null}

        <div className={`mt-0.5 flex items-center justify-end gap-1 text-[11px] leading-none ${isMine ? 'text-[var(--wa-time-sent)]' : 'text-[var(--wa-muted)]'}`}>
          <span>{formatClockTime(message.createdAt)}</span>
          {message.isEdited ? <span>edited</span> : null}
          {isMine ? <MessageStatus message={message} currentUserId={currentUserId} /> : null}
        </div>

        {menuOpen ? (
          <div className={`absolute ${isMine ? 'right-0' : 'left-0'} top-full z-30 mt-1 w-44 rounded-md border border-[var(--wa-border)] bg-[var(--wa-card)] py-1 text-[14px] not-italic text-[var(--wa-text)] shadow-xl`}>
            <button type="button" onClick={() => { onToggleStar(message); setMenuOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 hover:bg-[var(--wa-hover)]">{isStarred ? <StarOff size={15} /> : <Star size={15} />}{isStarred ? 'Remove star' : 'Star message'}</button>
            {isMine && !message.deletedForEveryone ? <button type="button" onClick={() => { onEdit(message); setMenuOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 hover:bg-[var(--wa-hover)]"><Pencil size={15} />Edit message</button> : null}
            <button type="button" onClick={() => { onDelete(message); setMenuOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-500/10"><Trash2 size={15} />Delete message</button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default memo(MessageBubble);
