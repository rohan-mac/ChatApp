// import { memo } from 'react';
// import { LoaderCircle, Paperclip, Send, Smile } from 'lucide-react';

// const InputBar = ({
//   isDark,
//   theme,
//   draft,
//   onDraftChange,
//   onToggleEmoji,
//   onAttachment,
//   onSend,
//   disabled,
//   sending,
//   hasAttachment,
//   inputRef,
//   selectedChat,
//   socket,
//   userId
// }) => {
//   const isOcean = theme === 'ocean';
//   const isRose = theme === 'rose';
//   const sendGradient = isOcean
//     ? 'from-cyan-500 to-sky-500'
//     : isRose
//       ? 'from-fuchsia-500 to-rose-500'
//       : 'from-[#25D366] to-emerald-400';

//   return (
//     <div className={`rounded-2xl border border-slate-200/60 bg-white/95 px-3 sm:px-4 py-3 shadow-lg backdrop-blur-sm dark:border-white/20 dark:bg-slate-950/90`}>
//       <div className="flex items-end gap-2 sm:gap-3">
//         <button
//           type="button"
//           onClick={onToggleEmoji}
//           className={`inline-flex flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 ${isDark ? 'border-white/20 bg-slate-800/70 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'}`}
//           aria-label="Toggle emoji picker"
//         >
//           <Smile size={18} className="sm:w-5 sm:h-5" />
//         </button>
//         <button
//           type="button"
//           onClick={onAttachment}
//           className={`inline-flex flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 ${isDark ? 'border-white/20 bg-slate-800/70 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'}`}
//           aria-label="Attach file"
//         >
//           <Paperclip size={18} className="sm:w-5 sm:h-5" />
//         </button>

//         <textarea
//           ref={inputRef}
//           rows="1"
//           value={draft}
//           disabled={disabled}
//           placeholder={selectedChat ? 'Type a message...' : 'Select a chat to start'}
//           onChange={(event) => {
//             onDraftChange(event.target.value);
//             if (selectedChat?._id) {
//               socket.emit('chat:typing', {
//                 chatId: selectedChat._id,
//                 senderId: userId
//               });
//             }
//           }}
//           onKeyDown={(event) => {
//             if (event.key === 'Enter' && !event.shiftKey) {
//               event.preventDefault();
//               onSend();
//             }
//           }}
//           className={`h-10 sm:h-12 min-h-[2.5rem] sm:min-h-[3rem] flex-1 resize-none rounded-xl border px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none transition-all duration-200 focus:ring-2 ${
//             isDark
//               ? 'border-white/20 bg-slate-800/70 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-500/20'
//               : isOcean
//                 ? 'border-cyan-200/60 bg-cyan-50/80 text-cyan-900 placeholder:text-cyan-500 focus:border-cyan-400/60 focus:ring-cyan-500/30'
//                 : isRose
//                   ? 'border-fuchsia-200/60 bg-fuchsia-50/80 text-fuchsia-900 placeholder:text-fuchsia-500 focus:border-fuchsia-400/60 focus:ring-fuchsia-500/30'
//                   : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-400/40 focus:ring-blue-500/20 shadow-sm'
//           }`}
//         />

//         <button
//           type="button"
//           onClick={onSend}
//           disabled={disabled || sending || (!draft.trim() && !hasAttachment)}
//           className={`inline-flex flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${sendGradient} text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
//           aria-label="Send message"
//         >
//           {sending ? <LoaderCircle size={20} className="animate-spin" /> : <Send size={20} />}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default memo(InputBar);



import { memo } from 'react';
import { LoaderCircle, Paperclip, Send, Smile } from 'lucide-react';

const InputBar = ({
  isDark,
  theme,
  draft,
  onDraftChange,
  onToggleEmoji,
  onAttachment,
  onSend,
  disabled,
  sending,
  hasAttachment,
  inputRef,
  selectedChat,
  socket,
  userId
}) => {
  const isOcean = theme === 'ocean';
  const isRose = theme === 'rose';
  const sendGradient = isOcean
    ? 'from-cyan-500 to-sky-500'
    : isRose
      ? 'from-fuchsia-500 to-rose-500'
      : 'from-[#25D366] to-emerald-400';

  return (
    <div className={`w-full rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white/95 px-2 sm:px-4 py-2.5 sm:py-3 shadow-lg backdrop-blur-sm dark:border-white/20 dark:bg-slate-950/90`}>
      <div className="flex items-end gap-1.5 sm:gap-3">
        
        {/* Emoji Button */}
        <button
          type="button"
          onClick={onToggleEmoji}
          className={`inline-flex flex-shrink-0 h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-200 active:scale-95 sm:hover:scale-105 ${
            isDark
              ? 'border-white/20 bg-slate-800/70 text-slate-200 hover:bg-slate-700'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
          }`}
          aria-label="Toggle emoji picker"
        >
          <Smile size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Attachment Button */}
        <button
          type="button"
          onClick={onAttachment}
          className={`inline-flex flex-shrink-0 h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-200 active:scale-95 sm:hover:scale-105 ${
            isDark
              ? 'border-white/20 bg-slate-800/70 text-slate-200 hover:bg-slate-700'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
          }`}
          aria-label="Attach file"
        >
          <Paperclip size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Textarea */}
        <textarea
          ref={inputRef}
          rows="1"
          value={draft}
          disabled={disabled}
          placeholder={selectedChat ? 'Type a message...' : 'Select a chat to start'}
          onChange={(event) => {
            onDraftChange(event.target.value);
            if (selectedChat?._id) {
              socket.emit('chat:typing', {
                chatId: selectedChat._id,
                senderId: userId
              });
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          className={`h-9 sm:h-12 min-h-[2.25rem] sm:min-h-[3rem] max-h-28 sm:max-h-36 flex-1 resize-none overflow-y-auto rounded-lg sm:rounded-xl border px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition-all duration-200 focus:ring-2 ${
            isDark
              ? 'border-white/20 bg-slate-800/70 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-500/20'
              : isOcean
                ? 'border-cyan-200/60 bg-cyan-50/80 text-cyan-900 placeholder:text-cyan-500 focus:border-cyan-400/60 focus:ring-cyan-500/30'
                : isRose
                  ? 'border-fuchsia-200/60 bg-fuchsia-50/80 text-fuchsia-900 placeholder:text-fuchsia-500 focus:border-fuchsia-400/60 focus:ring-fuchsia-500/30'
                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-400/40 focus:ring-blue-500/20 shadow-sm'
          }`}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || sending || (!draft.trim() && !hasAttachment)}
          className={`inline-flex flex-shrink-0 h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br ${sendGradient} text-white shadow-lg transition-all duration-200 active:scale-95 sm:hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
          aria-label="Send message"
        >
          {sending ? (
            <LoaderCircle size={18} className="animate-spin sm:w-5 sm:h-5" />
          ) : (
            <Send size={18} className="sm:w-5 sm:h-5" />
          )}
        </button>

      </div>
    </div>
  );
};

export default memo(InputBar);