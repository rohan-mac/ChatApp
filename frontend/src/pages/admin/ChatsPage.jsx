// import { useEffect, useState } from 'react';
// import client from '../../api/client';

// const ChatsPage = () => {
//   const [chats, setChats] = useState([]);

//   const load = () => client.get('/admin/chats').then(({ data }) => setChats(data));
//   useEffect(() => {
//     load();
//   }, []);

//   const deleteMessage = async (id) => {
//     await client.delete(`/admin/message/${id}`);
//     load();
//   };

//   return (
//     <div>
//       <h2 className="mb-4 text-2xl font-bold">Chat Monitoring</h2>
//       <div className="space-y-3">
//         {chats.map((chat) => (
//           <div key={chat._id} className="rounded bg-slate-900 p-4">
//             <p className="mb-2 text-sm text-slate-400">Participants: {chat.participants.map((p) => p.name).join(', ')}</p>
//             {chat.lastMessageId ? (
//               <div className="flex items-center justify-between rounded bg-slate-800 p-2 text-sm">
//                 <span>{chat.lastMessageId.senderId?.name}: {chat.lastMessageId.text || `[${chat.lastMessageId.messageType}]`}</span>
//                 <button className="rounded bg-red-600 px-2 py-1 text-xs" onClick={() => deleteMessage(chat.lastMessageId._id)}>Delete</button>
//               </div>
//             ) : (
//               <p className="text-sm text-slate-500">No messages yet</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatsPage;





import { useEffect, useState } from 'react';
import client from '../../api/client';

const ChatsPage = () => {
  const [chats, setChats] = useState([]);

  const load = () => client.get('/admin/chats').then(({ data }) => setChats(data));

  useEffect(() => {
    load();
  }, []);

  const deleteMessage = async (id) => {
    await client.delete(`/admin/message/${id}`);
    load();
  };

  return (
    <div className="h-full w-full overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">

      {/* HEADER */}
      <div className="mb-4 md:mb-6 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          Chat Monitoring
        </h2>
        <span className="text-xs sm:text-sm text-slate-500">
          Total Chats: {chats.length}
        </span>
      </div>

      {/* CHAT LIST */}
      <div className="space-y-3 md:space-y-4">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
          >
            {/* PARTICIPANTS */}
            <p className="mb-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
              <span className="font-medium">Participants:</span>{' '}
              {chat.participants.map((p) => p.name).join(', ')}
            </p>

            {/* LAST MESSAGE */}
            {chat.lastMessageId ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-slate-200/50 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs sm:text-sm">

                {/* MESSAGE TEXT */}
                <span className="break-words">
                  <span className="font-semibold">
                    {chat.lastMessageId.senderId?.name}:
                  </span>{' '}
                  {chat.lastMessageId.text || `[${chat.lastMessageId.messageType}]`}
                </span>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteMessage(chat.lastMessageId._id)}
                  className="self-start sm:self-auto rounded-md bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-[10px] sm:text-xs transition-all"
                >
                  Delete
                </button>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-400">
                No messages yet
              </p>
            )}
          </div>
        ))}

        {/* EMPTY STATE */}
        {chats.length === 0 && (
          <div className="flex items-center justify-center py-10 text-center text-slate-400 text-sm">
            No chats available
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;