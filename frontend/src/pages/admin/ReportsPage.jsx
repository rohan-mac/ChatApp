// import { useEffect, useState } from 'react';
// import client from '../../api/client';

// const ReportsPage = () => {
//   const [flagged, setFlagged] = useState([]);

//   const load = () => client.get('/admin/reports/flagged').then(({ data }) => setFlagged(data));

//   useEffect(() => {
//     load();
//   }, []);

//   const remove = async (id) => {
//     await client.delete(`/admin/message/${id}`);
//     load();
//   };

//   return (
//     <div>
//       <h2 className="mb-4 text-2xl font-bold">Flagged Messages</h2>
//       <div className="space-y-2">
//         {flagged.map((m) => (
//           <div key={m._id} className="flex items-center justify-between rounded bg-slate-900 p-3">
//             <p>{m.text || 'Media-only message'} - <span className="text-xs text-slate-400">{m.senderId?.name}</span></p>
//             <button className="rounded bg-red-600 px-2 py-1 text-xs" onClick={() => remove(m._id)}>Remove</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ReportsPage;

import { useEffect, useState } from 'react';
import client from '../../api/client';

const ReportsPage = () => {
  const [flagged, setFlagged] = useState([]);

  const load = () =>
    client.get('/admin/reports/flagged').then(({ data }) => setFlagged(data));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await client.delete(`/admin/message/${id}`);
    load();
  };

  return (
    <div className="h-full w-full overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">

      {/* HEADER */}
      <div className="mb-4 md:mb-6 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          Flagged Messages
        </h2>
        <span className="text-xs sm:text-sm text-slate-500">
          Total: {flagged.length}
        </span>
      </div>

      {/* LIST */}
      <div className="space-y-2 sm:space-y-3">
        {flagged.map((m) => (
          <div
            key={m._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 shadow-sm hover:shadow-md transition-all"
          >

            {/* MESSAGE */}
            <p className="text-xs sm:text-sm break-words">
              <span className="font-medium">
                {m.text || 'Media-only message'}
              </span>
              <span className="block sm:inline sm:ml-2 text-[10px] sm:text-xs text-slate-500">
                — {m.senderId?.name || 'Unknown'}
              </span>
            </p>

            {/* ACTION */}
            <button
              onClick={() => remove(m._id)}
              className="self-start sm:self-auto rounded-md bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-[10px] sm:text-xs transition-all"
            >
              Remove
            </button>
          </div>
        ))}

        {/* EMPTY STATE */}
        {flagged.length === 0 && (
          <div className="flex items-center justify-center py-10 text-sm text-slate-400">
            No flagged messages 🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;