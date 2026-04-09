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
    ? 'border border-[#25D366]/35 bg-[rgba(37,211,102,0.2)] text-white shadow-[0_16px_38px_rgba(37,211,102,0.25)]'
    : isDark
      ? 'border border-white/10 bg-[rgba(255,255,255,0.08)] text-white shadow-[0_16px_38px_rgba(0,0,0,0.2)]'
      : 'border border-white/70 bg-[rgba(255,255,255,0.72)] text-slate-900 shadow-[0_16px_38px_rgba(148,163,184,0.2)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}
      onContextMenu={(event) => {
        event.preventDefault();
        setMenuOpen((current) => !current);
      }}
    >
      <div className={`relative max-w-[86%] rounded-[20px] px-4 py-2.5 backdrop-blur-[20px] sm:max-w-[70%] ${bubbleClasses}`}>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className={`absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 ${isMine ? 'bg-white/15 text-white' : isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-900/5 text-slate-600'}`}
        >
          <EllipsisVertical size={13} />
        </button>

        <p className="whitespace-pre-wrap break-words pr-8 text-sm leading-6">{text}</p>

        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMine ? 'text-white/75' : isDark ? 'text-slate-300/80' : 'text-slate-500'}`}>
          <span>{formatTime(message.createdAt)}</span>
          {message.isEdited ? <span>• edited</span> : null}
        </div>

        {menuOpen ? (
          <div className={`absolute ${isMine ? 'left-0' : 'right-0'} top-full z-20 mt-2 min-w-44 rounded-2xl border p-2 shadow-2xl backdrop-blur-[20px] ${isDark ? 'border-white/10 bg-[#09101d]/92 text-slate-100' : 'border-white/75 bg-white/95 text-slate-700'}`}>
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
