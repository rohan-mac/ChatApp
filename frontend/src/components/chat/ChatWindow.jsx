// import { memo, useState, useRef, useEffect } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import EmojiPicker from 'emoji-picker-react';
// import { LoaderCircle, MoreVertical, Phone, Video, X } from 'lucide-react';
// import { Z_INDEX } from '../../constants/zIndex';
// import MessageBubble from '../MessageBubble';
// import InputBar from './InputBar';

// const ChatWindow = ({
//   isDark,
//   selectedChat,
//   typingText,
//   getChatName,
//   getChatStatus,
//   loadingMessages,
//   activeMessages,
//   currentUserId,
//   onEdit,
//   onDelete,
//   onToggleStar,
//   onBack,
//   endRef,
//   draft,
//   setDraft,
//   showEmoji,
//   setShowEmoji,
//   fileRef,
//   setAttachment,
//   performSend,
//   sending,
//   inputRef,
//   socket,
//   attachment,
//   setEditTarget,
//   editTarget,
//   theme,
//   onClearChat,
//   onSetTheme
// }) => {
//   const [optionsOpen, setOptionsOpen] = useState(false);
//   const [themeMenuOpen, setThemeMenuOpen] = useState(false);
//   const [emojiPickerPosition, setEmojiPickerPosition] = useState('bottom');
//   const emojiContainerRef = useRef(null);
//   const isOcean = theme === 'ocean';
//   const isRose = theme === 'rose';
//   const themeLabel = theme === 'light' ? 'Light' : theme === 'dark' ? 'Night' : theme === 'ocean' ? 'Ocean' : 'Rose';

//   // Handle emoji picker viewport positioning
//   useEffect(() => {
//     if (!showEmoji || !emojiContainerRef.current) return;
//     const rect = emojiContainerRef.current.getBoundingClientRect();
//     if (rect.bottom + 450 > window.innerHeight) {
//       setEmojiPickerPosition('top');
//     } else {
//       setEmojiPickerPosition('bottom');
//     }
//   }, [showEmoji]);

//   return (
//     <section className={`flex h-full flex-col rounded-2xl md:rounded-3xl shadow-xl ${isDark ? 'bg-slate-950/95' : isOcean ? 'bg-cyan-50/95' : isRose ? 'bg-rose-50/95' : 'bg-slate-50/95'}`}>
//       {/* HEADER - Fixed */}
//       <header className={`flex items-center justify-between gap-2 sm:gap-4 border-b border-slate-200/60 px-3 sm:px-6 py-3 sm:py-5 shadow-sm rounded-t-2xl md:rounded-t-3xl flex-shrink-0 ${isDark ? 'bg-gradient-to-r from-slate-900/90 to-slate-950/90' : isOcean ? 'bg-gradient-to-r from-cyan-100 to-sky-100' : isRose ? 'bg-gradient-to-r from-fuchsia-100 to-rose-100' : 'bg-gradient-to-r from-white via-slate-50 to-white'}`}>
//         <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
//           <button
//             type="button"
//             onClick={onBack}
//             className="inline-flex flex-shrink-0 h-9 sm:h-11 w-9 sm:w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 lg:hidden hover:bg-slate-200 transition-all duration-200 shadow-sm"
//             aria-label="Back to chat list"
//           >
//             <X size={18} className="sm:w-5 sm:h-5" />
//           </button>
//           {selectedChat ? (
//             <>
//               <div className="flex flex-shrink-0 h-10 sm:h-14 w-10 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-sm sm:text-lg font-bold text-white shadow-lg">
//                 {getChatName(selectedChat).charAt(0).toUpperCase()}
//               </div>
//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-sm sm:text-lg font-bold text-slate-900">{getChatName(selectedChat)}</p>
//                 <p className="truncate text-xs sm:text-sm text-slate-600 font-medium">{typingText || getChatStatus(selectedChat)}</p>
//               </div>
//             </>
//           ) : (
//             <p className="text-sm sm:text-lg font-semibold text-slate-900">Select a chat</p>
//           )}
//         </div>

//         {selectedChat ? (
//           <div className="relative flex items-center gap-1 sm:gap-3 flex-shrink-0">
//             <button type="button" className="inline-flex flex-shrink-0 h-9 sm:h-12 w-9 sm:w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200 shadow-sm hover:shadow-md" aria-label="Voice call">
//               <Phone size={18} className="sm:w-5 sm:h-5" />
//             </button>
//             <button type="button" className="inline-flex flex-shrink-0 h-9 sm:h-12 w-9 sm:w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200 shadow-sm hover:shadow-md" aria-label="Video call">
//               <Video size={18} className="sm:w-5 sm:h-5" />
//             </button>
//             <div className="relative">
//               <button
//                 type="button"
//                 title={`Theme: ${themeLabel}`}
//                 onClick={() => {
//                   setOptionsOpen((current) => !current);
//                   setThemeMenuOpen(false);
//                 }}
//                 className="inline-flex flex-shrink-0 h-9 sm:h-12 w-9 sm:w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200 shadow-sm hover:shadow-md"
//                 aria-label="Chat options"
//                 aria-expanded={optionsOpen}
//               >
//                 <MoreVertical size={18} className="sm:w-5 sm:h-5" />
//               </button>
//               {optionsOpen && (
//                 <div className={`absolute right-0 top-full z-[${Z_INDEX.dropdown}] mt-2 w-40 sm:w-48 overflow-hidden border border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl`}>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setOptionsOpen(false);
//                       onClearChat?.();
//                     }}
//                     className="flex w-full items-center justify-between gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-100/80 transition-colors duration-150 rounded-t-2xl"
//                   >
//                     <span>Clear chat</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setThemeMenuOpen((current) => !current)}
//                     className="flex w-full items-center justify-between gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-100/80 transition-colors duration-150"
//                   >
//                     <span>Set theme</span>
//                     <span className="text-slate-400">›</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setOptionsOpen(false);
//                       onBack?.();
//                     }}
//                     className="flex w-full items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-100/80 transition-colors duration-150 rounded-b-2xl"
//                   >
//                     Close chat
//                   </button>
//                 </div>
//               )}
//               {themeMenuOpen && (
//                 <div className={`absolute right-full top-0 z-[${Z_INDEX.dropdown}] mr-2 sm:mr-3 mt-2 w-44 sm:w-52 overflow-hidden border border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl`}>
//                   {['light', 'dark', 'ocean', 'rose'].map((themeId) => (
//                     <button
//                       key={themeId}
//                       type="button"
//                       onClick={() => {
//                         onSetTheme?.(themeId);
//                         setThemeMenuOpen(false);
//                         setOptionsOpen(false);
//                       }}
//                       className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-100/80 transition-colors duration-150 first:rounded-t-2xl last:rounded-b-2xl"
//                     >
//                       {themeId === 'light' ? 'Light' : themeId === 'dark' ? 'Dark' : themeId === 'ocean' ? 'Ocean' : 'Rose'}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : null}
//       </header>

//       {/* MESSAGES AREA - Scrollable, flex-1 */}
//       <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 via-white to-slate-100/50 px-3 sm:px-6 py-4 sm:py-6 relative">
//         {!selectedChat ? (
//           <div className="flex h-full items-center justify-center">
//             <div className="text-center">
//               <div className="mx-auto mb-4 flex h-16 sm:h-20 w-16 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100" />
//               <p className="text-base sm:text-lg font-semibold text-slate-700">Choose a chat to start</p>
//               <p className="text-xs sm:text-sm text-slate-500 mt-1">Select a conversation from the sidebar</p>
//             </div>
//           </div>
//         ) : loadingMessages ? (
//           <div className="flex h-full items-center justify-center gap-3">
//             <LoaderCircle size={20} className="animate-spin text-blue-600" />
//             <p className="text-sm sm:text-base font-medium text-slate-600">Loading messages...</p>
//           </div>
//         ) : (
//           <div className="space-y-3 py-2">
//             {activeMessages.map((message) => (
//               <MessageBubble
//                 key={message._id || message.clientMessageId}
//                 message={message}
//                 isMine={(message.senderId?._id || message.senderId) === currentUserId}
//                 isDark={isDark}
//                 currentUserId={currentUserId}
//                 onEdit={onEdit}
//                 onDelete={onDelete}
//                 onToggleStar={onToggleStar}
//               />
//             ))}
//             <div ref={endRef} />
//           </div>
//         )}
//       </div>

//       {/* INPUT AREA - Sticky at bottom on mobile */}
//       <div className={`border-t border-slate-200/60 px-3 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-5 flex-shrink-0 mt-auto sticky bottom-0 left-0 right-0 z-20 shadow-2xl ${isDark ? 'border-white/20 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-xl' : 'bg-gradient-to-r from-white/98 via-slate-50/95 to-white/98 backdrop-blur-xl shadow-slate-200/50'}`}>
//         <input
//           ref={fileRef}
//           type="file"
//           className="hidden"
//           accept="image/*,video/*"
//           onChange={(event) => setAttachment(event.target.files?.[0] || null)}
//         />

//         {attachment ? (
//           <div className={`mb-2 rounded-xl border px-3 py-2 text-xs ${isDark ? 'border-white/10 bg-white/10' : 'border-white/70 bg-white/80'}`}>
//             {attachment.name}
//           </div>
//         ) : null}

//         {editTarget ? (
//           <button
//             type="button"
//             onClick={() => setEditTarget(null)}
//             className={`mb-2 rounded-xl border px-3 py-2 text-left text-xs ${isDark ? 'border-amber-400/20 bg-amber-500/12 text-amber-100' : 'border-amber-300/60 bg-amber-50 text-amber-700'}`}
//           >
//             Editing message — tap to cancel
//           </button>
//         ) : null}

//         <InputBar
//           isDark={isDark}
//           theme={theme}
//           draft={draft}
//           onDraftChange={setDraft}
//           onToggleEmoji={() => setShowEmoji((current) => !current)}
//           onAttachment={() => fileRef.current?.click()}
//           onSend={performSend}
//           disabled={!selectedChat}
//           sending={sending}
//           hasAttachment={Boolean(attachment)}
//           inputRef={inputRef}
//           selectedChat={selectedChat}
//           socket={socket}
//           userId={currentUserId}
//         />

//         {/* EMOJI PICKER - Smart positioning */}
//         <AnimatePresence>
//           {showEmoji && (
//             <motion.div
//               ref={emojiContainerRef}
//               initial={{ opacity: 0, y: emojiPickerPosition === 'top' ? 8 : -8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: emojiPickerPosition === 'top' ? 8 : -8 }}
//               className={`mt-2 overflow-hidden rounded-2xl ${emojiPickerPosition === 'top' ? 'order-first' : ''}`}
//             >
//               <EmojiPicker
//                 onEmojiClick={(emoji) => setDraft((current) => current + emoji.emoji)}
//                 width="100%"
//                 previewConfig={{ showPreview: false }}
//                 skinTonesDisabled
//                 lazyLoadEmojis
//                 theme={theme}
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </section>
//   );
// };

// export default memo(ChatWindow);



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

  return (
    <section
      className={`flex h-[100dvh] flex-col rounded-2xl md:rounded-3xl shadow-xl ${
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
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 pb-24">
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
      <div className="flex-shrink-0 border-t px-3 sm:px-6 py-3 bg-white/95 backdrop-blur-xl">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => setAttachment(e.target.files?.[0] || null)}
        />

        {attachment && (
          <div className="text-xs mb-2">{attachment.name}</div>
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
          inputRef={inputRef}
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