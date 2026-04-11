// import { useEffect, useState } from 'react';
// import client from '../../api/client';

// const UsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState('');

//   const load = () => client.get('/admin/users', { params: { search } }).then(({ data }) => setUsers(data));

//   useEffect(() => {
//     load();
//   }, [search]);

//   const action = async (fn) => {
//     await fn();
//     load();
//   };

//   return (
//     <div>
//       <h2 className="mb-4 text-2xl font-bold">User Management</h2>
//       <input className="mb-4 w-full max-w-sm rounded bg-slate-800 p-2" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
//       <div className="space-y-2">
//         {users.map((u) => (
//           <div key={u._id} className="grid items-center gap-2 rounded bg-slate-900 p-3 md:grid-cols-[1fr_auto_auto_auto]">
//             <div>
//               <p className="font-semibold">{u.name} <span className="text-xs text-slate-400">({u.role})</span></p>
//               <p className="text-sm text-slate-400">{u.email}</p>
//             </div>
//             <button className="rounded bg-amber-600 px-3 py-1 text-xs" onClick={() => action(() => client.patch(`/users/moderation/block/${u._id}`))}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
//             <button className="rounded bg-indigo-600 px-3 py-1 text-xs" onClick={() => action(() => client.patch(`/users/promote/${u._id}`))}>Promote</button>
//             <button className="rounded bg-red-600 px-3 py-1 text-xs" onClick={() => action(() => client.delete(`/admin/user/${u._id}`))}>Delete</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UsersPage;



import { useEffect, useState } from 'react';
import client from '../../api/client';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const load = () =>
    client
      .get('/admin/users', { params: { search } })
      .then(({ data }) => setUsers(data));

  useEffect(() => {
    load();
  }, [search]);

  const action = async (fn) => {
    await fn();
    load();
  };

  return (
    <div className="h-full w-full overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">

      {/* HEADER */}
      <div className="mb-4 md:mb-6 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          User Management
        </h2>
        <span className="text-xs sm:text-sm text-slate-500">
          Total: {users.length}
        </span>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          className="w-full sm:max-w-sm rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* USER LIST */}
      <div className="space-y-2 sm:space-y-3">
        {users.map((u) => (
          <div
            key={u._id}
            className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto_auto] gap-2 rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 shadow-sm hover:shadow-md transition-all"
          >

            {/* USER INFO */}
            <div className="min-w-0">
              <p className="font-semibold text-sm sm:text-base truncate">
                {u.name}{' '}
                <span className="text-[10px] sm:text-xs text-slate-400">
                  ({u.role})
                </span>
              </p>
              <p className="text-xs sm:text-sm text-slate-500 truncate">
                {u.email}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap md:flex-nowrap gap-2">

              <button
                onClick={() =>
                  action(() =>
                    client.patch(`/users/moderation/block/${u._id}`)
                  )
                }
                className="rounded-md bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 text-[10px] sm:text-xs transition-all"
              >
                {u.isBlocked ? 'Unblock' : 'Block'}
              </button>

              <button
                onClick={() =>
                  action(() =>
                    client.patch(`/users/promote/${u._id}`)
                  )
                }
                className="rounded-md bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 text-[10px] sm:text-xs transition-all"
              >
                Promote
              </button>

              <button
                onClick={() =>
                  action(() =>
                    client.delete(`/admin/user/${u._id}`)
                  )
                }
                className="rounded-md bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-[10px] sm:text-xs transition-all"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

        {/* EMPTY STATE */}
        {users.length === 0 && (
          <div className="flex items-center justify-center py-10 text-sm text-slate-400">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;