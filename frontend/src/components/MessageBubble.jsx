// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { EllipsisVertical, Pencil, Star, StarOff, Trash2 } from 'lucide-react';

// const formatTime = (value) =>
//   value
//     ? new Date(value).toLocaleTimeString([], {
//         hour: 'numeric',
//         minute: '2-digit'
//       })
//     : '';

// const MessageBubble = ({
//   message,
//   isMine,
//   isDark,
//   currentUserId,
//   onEdit,
//   onDelete,
//   onToggleStar
// }) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const text = message.text || message.content || 'No content';
//   const isStarred = message.starredBy?.some((entry) => (entry._id || entry) === currentUserId);

//   const bubbleClasses = isMine
//     ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
//     : 'bg-white text-slate-900 shadow-md shadow-slate-200/50 border border-slate-200/60';

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 12, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.3, ease: 'easeOut' }}
//       className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}
//       onContextMenu={(event) => {
//         event.preventDefault();
//         setMenuOpen((current) => !current);
//       }}
//     >
//       <div className={`relative max-w-[88%] sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:shadow-lg ${bubbleClasses}`}>
//         <button
//           type="button"
//           onClick={() => setMenuOpen((current) => !current)}
//           className={`absolute right-2 sm:right-3 top-2 sm:top-3 inline-flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 ${isMine ? 'bg-white/20 text-white hover:bg-white/30' : isDark ? 'bg-slate-700/80 text-slate-200 hover:bg-slate-600' : 'bg-slate-900/10 text-slate-600 hover:bg-slate-900/20'}`}
//           aria-label="Message options"
//         >
//           <EllipsisVertical size={14} className="sm:w-4 sm:h-4" />
//         </button>

//         <p className="whitespace-pre-wrap break-words pr-6 sm:pr-8 text-xs sm:text-sm leading-5 sm:leading-6">{text}</p>

//         <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMine ? 'text-white/75' : isDark ? 'text-slate-300/80' : 'text-slate-500'}`}>
//           <span>{formatTime(message.createdAt)}</span>
//           {message.isEdited ? <span>• edited</span> : null}
//         </div>

//         {menuOpen ? (
//           <div className={`absolute ${isMine ? 'left-0' : 'right-0'} top-full z-20 mt-3 min-w-48 rounded-2xl border p-2 shadow-xl backdrop-blur-sm ${isDark ? 'border-white/20 bg-slate-800/95 text-slate-100' : 'border-slate-200/60 bg-white/95 text-slate-700'}`}>
//             <button
//               type="button"
//               onClick={() => {
//                 onToggleStar(message);
//                 setMenuOpen(false);
//               }}
//               className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/10 transition-colors duration-150"
//             >
//               {isStarred ? <StarOff size={16} /> : <Star size={16} />}
//               <span>{isStarred ? 'Remove star' : 'Star message'}</span>
//             </button>

//             {isMine && !message.deletedForEveryone ? (
//               <button
//                 type="button"
//                 onClick={() => {
//                   onEdit(message);
//                   setMenuOpen(false);
//                 }}
//                 className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/10 transition-colors duration-150"
//               >
//                 <Pencil size={16} />
//                 <span>Edit message</span>
//               </button>
//             ) : null}

//             <button
//               type="button"
//               onClick={() => {
//                 onDelete(message);
//                 setMenuOpen(false);
//               }}
//               className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-500/10 transition-colors duration-150"
//             >
//               <Trash2 size={16} />
//               <span>Delete message</span>
//             </button>
//           </div>
//         ) : null}
//       </div>
//     </motion.div>
//   );
// };

// export default MessageBubble;



import { useState } from 'react';
import { motion } from 'framer-motion';
import { EllipsisVertical, Pencil, Star, StarOff, Trash2, FileText, Video } from 'lucide-react';

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    })
    : '';

/**
 * Render attachment based on type
 */
const renderAttachment = (attachment) => {
  if (!attachment) return null;

  const { url, type, name } = attachment;

  if (type === 'image') {
    return (
      <img
        src={url}
        alt={name || 'image'}
        className="w-full rounded-lg max-w-sm object-cover mb-2"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  if (type === 'video') {
    return (
      <video
        src={url}
        controls
        className="w-full rounded-lg max-w-sm object-cover mb-2"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  if (type === 'document') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <FileText size={16} />
        <span className="text-xs truncate">{name || 'Document'}</span>
      </a>
    );
  }

  return null;
};

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

  const isStarred = message.starredBy?.some(
    (entry) => (entry._id || entry) === currentUserId
  );

  const bubbleClasses = isMine
    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
    : 'bg-white text-slate-900 shadow-sm border border-slate-200/60';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`group flex ${isMine ? 'justify-end' : 'justify-start'} px-1 sm:px-0`}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenuOpen((p) => !p);
      }}
    >
      <div
        className={`mb-1 sm:mb-2
        relative 
        max-w-[90%] xs:max-w-[85%] sm:max-w-[75%] md:max-w-[65%]
        rounded-2xl 
        px-3 sm:px-4 md:px-5
        py-2 sm:py-2.5
        transition-all duration-200 
        hover:shadow-md
        ${bubbleClasses}
        `}
      >
        {/* OPTIONS BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen((p) => !p)}
          className={`
          absolute right-1.5 sm:right-2 top-1.5 sm:top-2
          inline-flex h-6 w-6 sm:h-7 sm:w-7
          items-center justify-center rounded-full 
          opacity-0 group-hover:opacity-100 transition-all
          ${isMine
              ? 'bg-white/20 text-white'
              : isDark
                ? 'bg-slate-700/70 text-slate-200'
                : 'bg-slate-900/10 text-slate-600'}
          `}
        >
          <EllipsisVertical size={12} />
        </button>

        {/* ATTACHMENTS */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2">
            {message.attachments.map((attachment, idx) => (
              <div key={idx}>
                {renderAttachment(attachment)}
              </div>
            ))}
          </div>
        )}

        {/* MESSAGE TEXT */}
        {text && text !== 'No content' && (
          <p className="whitespace-pre-wrap break-words pr-5 sm:pr-6 text-sm sm:text-base leading-snug">
            {text}
          </p>
        )}

        {/* TIME */}
        <div
          className={`mt-0.5 flex items-center justify-end gap-1 text-[9px] ${isMine
              ? 'text-white/70'
              : isDark
                ? 'text-slate-300/70'
                : 'text-slate-500'
            }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {message.isEdited && <span>• edited</span>}
        </div>

        {/* MENU */}
        {menuOpen && (
          <div
            className={`
            absolute ${isMine ? 'left-[-85px]' : 'right-0'} top-full
            mt-2 z-20 min-w-44 rounded-xl border p-1.5 shadow-lg
            ${isDark
                ? 'border-white/20 bg-slate-800/95 text-slate-100'
                : 'border-slate-200/60 bg-white/95 text-slate-700'}
            `}
          >
            <button
              onClick={() => {
                onToggleStar(message);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs hover:bg-white/10"
            >
              {isStarred ? <StarOff size={14} /> : <Star size={14} />}
              {isStarred ? 'Remove star' : 'Star message'}
            </button>

            {isMine && !message.deletedForEveryone && (
              <button
                onClick={() => {
                  onEdit(message);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs hover:bg-white/10"
              >
                <Pencil size={14} />
                Edit message
              </button>
            )}

            <button
              onClick={() => {
                onDelete(message);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-rose-500 hover:bg-rose-500/10"
            >
              <Trash2 size={14} />
              Delete message
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;