import { useState } from 'react';
import { motion } from 'framer-motion';
import { EllipsisVertical, Pencil, Star, StarOff, Trash2 } from 'lucide-react';

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
      })
    : '';

const MessageBubble = ({
  message,
  isMine,
  isDark,
  currentUserId,
  onEdit,
  onDelete,
  onToggleStar
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const text = message.text || message.content || 'No content';
  const isStarred = message.starredBy?.some((entry) => (entry._id || entry) === currentUserId);

  const bubbleClasses = isMine
    ? 'border border-white/12 bg-[linear-gradient(135deg,_rgba(0,122,255,1),_rgba(102,154,255,0.88))] text-white shadow-[0_18px_40px_rgba(0,122,255,0.24)]'
    : isDark
      ? 'border border-white/10 bg-[rgba(255,255,255,0.07)] text-white shadow-[0_18px_40px_rgba(0,0,0,0.2)]'
      : 'border border-white/80 bg-white/75 text-slate-900 shadow-[0_18px_40px_rgba(148,163,184,0.15)]';
  const metaClasses = isMine ? 'text-white/75' : isDark ? 'text-slate-400' : 'text-slate-500';
  const menuClasses = isDark
    ? 'border-white/10 bg-[#09101d]/95 text-slate-200'
    : 'border-white/75 bg-white/95 text-slate-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}
      onContextMenu={(event) => {
        event.preventDefault();
        setMenuOpen((current) => !current);
      }}
    >
      <div className={`relative max-w-[88%] rounded-[30px] px-4 py-3 sm:max-w-[72%] ${bubbleClasses}`}>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className={`absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 ${
            isMine ? 'bg-white/10 text-white' : isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-900/5 text-slate-600'
          }`}
        >
          <EllipsisVertical size={14} />
        </button>

        {message.mediaUrl ? (
          <div className="mb-3 overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/10">
            {message.mediaType === 'image' ? (
              <img src={message.mediaUrl} alt="attachment" className="max-h-80 w-full object-cover" />
            ) : message.mediaType === 'video' ? (
              <video src={message.mediaUrl} controls className="max-h-80 w-full object-cover" />
            ) : (
              <a href={message.mediaUrl} target="_blank" rel="noreferrer" className="block px-4 py-3 text-sm underline underline-offset-4">
                Open attachment
              </a>
            )}
          </div>
        ) : null}

        <p className="whitespace-pre-wrap break-words pr-8 text-sm leading-6 sm:text-[15px]">{text}</p>

        {message.deletedForEveryone ? (
          <p className={`mt-2 text-xs italic ${metaClasses}`}>Message deleted for everyone</p>
        ) : null}

        <div className={`mt-3 flex items-center gap-2 text-[11px] ${metaClasses}`}>
          <span>{formatTime(message.createdAt)}</span>
          <span className="capitalize">{message.status || 'sent'}</span>
          {message.isEdited ? <span>Edited</span> : null}
          {isStarred ? <span>Starred</span> : null}
        </div>

        {menuOpen ? (
          <div className={`absolute ${isMine ? 'left-0' : 'right-0'} top-full z-20 mt-2 min-w-44 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl ${menuClasses}`}>
            <button
              type="button"
              onClick={() => {
                onToggleStar(message);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10"
            >
              {isStarred ? <StarOff size={15} /> : <Star size={15} />}
              <span>{isStarred ? 'Remove star' : 'Star message'}</span>
            </button>

            {isMine && !message.deletedForEveryone ? (
              <button
                type="button"
                onClick={() => {
                  onEdit(message);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10"
              >
                <Pencil size={15} />
                <span>Edit message</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                onDelete(message);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10"
            >
              <Trash2 size={15} />
              <span>Delete message</span>
            </button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
