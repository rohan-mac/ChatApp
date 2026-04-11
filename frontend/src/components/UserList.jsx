// import { motion } from 'framer-motion';

// const getInitials = (name = '') =>
//   name
//     .split(' ')
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase())
//     .join('') || '?';

// const formatLastSeen = (value) => {
//   if (!value) return 'Away';

//   return new Date(value).toLocaleTimeString([], {
//     hour: 'numeric',
//     minute: '2-digit'
//   });
// };

// const UserList = ({ users, onSelect, selectedId, theme, palette }) => (
//   <div className="space-y-3">
//     {users.map((user, index) => {
//       const isSelected = selectedId === user._id;

//       return (
//         <motion.button
//           key={user._id}
//           type="button"
//           initial={{ opacity: 0, x: -12 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: index * 0.03, duration: 0.26 }}
//           whileHover={{ y: -2 }}
//           onClick={() => onSelect(user)}
//           className={`w-full rounded-[28px] border p-3.5 text-left transition duration-300 ${
//             isSelected ? palette.selected : palette.idle
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <div className="relative shrink-0">
//               <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${palette.accent} text-sm font-semibold text-white`}>
//                 {getInitials(user.name)}
//               </div>
//               <span
//                 className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 ${
//                   theme === 'dark' ? 'border-[#09101d]' : 'border-white'
//                 } ${user.isOnline ? 'bg-emerald-400' : 'bg-slate-400'}`}
//               />
//             </div>

//             <div className="min-w-0 flex-1">
//               <div className="flex items-center justify-between gap-3">
//                 <p className="truncate text-sm font-semibold">{user.name}</p>
//                 <span className={`shrink-0 text-[11px] ${palette.secondaryText}`}>
//                   {user.isOnline ? 'Now' : formatLastSeen(user.lastSeen)}
//                 </span>
//               </div>
//               <p className={`mt-1 truncate text-xs ${palette.secondaryText}`}>{user.email}</p>
//             </div>
//           </div>
//         </motion.button>
//       );
//     })}
//   </div>
// );

// export default UserList;




import { motion } from 'framer-motion';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

const formatLastSeen = (value) => {
  if (!value) return 'Away';

  return new Date(value).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
};

const UserList = ({ users, onSelect, selectedId, theme, palette }) => (
  <div className="space-y-2 sm:space-y-3 px-1 sm:px-0">
    {users.map((user, index) => {
      const isSelected = selectedId === user._id;

      return (
        <motion.button
          key={user._id}
          type="button"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03, duration: 0.26 }}
          whileHover={{ y: -2 }}
          onClick={() => onSelect(user)}
          className={`w-full rounded-2xl sm:rounded-[28px] border p-3 sm:p-3.5 text-left transition duration-300 ${
            isSelected ? palette.selected : palette.idle
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative shrink-0">
              <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br ${palette.accent} text-xs sm:text-sm font-semibold text-white`}>
                {getInitials(user.name)}
              </div>
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 ${
                  theme === 'dark' ? 'border-[#09101d]' : 'border-white'
                } ${user.isOnline ? 'bg-emerald-400' : 'bg-slate-400'}`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <p className="truncate text-xs sm:text-sm font-semibold">
                  {user.name}
                </p>
                <span className={`shrink-0 text-[10px] sm:text-[11px] ${palette.secondaryText}`}>
                  {user.isOnline ? 'Now' : formatLastSeen(user.lastSeen)}
                </span>
              </div>
              <p className={`mt-0.5 sm:mt-1 truncate text-[10px] sm:text-xs ${palette.secondaryText}`}>
                {user.email}
              </p>
            </div>
          </div>
        </motion.button>
      );
    })}
  </div>
);

export default UserList;