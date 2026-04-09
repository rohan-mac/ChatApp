import { useEffect, useState } from 'react';
import client from '../../api/client';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => client.get('/admin/users', { params: { search } }).then(({ data }) => setUsers(data));

  useEffect(() => {
    load();
  }, [search]);

  const action = async (fn) => {
    await fn();
    load();
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">User Management</h2>
      <input className="mb-4 w-full max-w-sm rounded bg-slate-800 p-2" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u._id} className="grid items-center gap-2 rounded bg-slate-900 p-3 md:grid-cols-[1fr_auto_auto_auto]">
            <div>
              <p className="font-semibold">{u.name} <span className="text-xs text-slate-400">({u.role})</span></p>
              <p className="text-sm text-slate-400">{u.email}</p>
            </div>
            <button className="rounded bg-amber-600 px-3 py-1 text-xs" onClick={() => action(() => client.patch(`/users/block/${u._id}`))}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
            <button className="rounded bg-indigo-600 px-3 py-1 text-xs" onClick={() => action(() => client.patch(`/users/promote/${u._id}`))}>Promote</button>
            <button className="rounded bg-red-600 px-3 py-1 text-xs" onClick={() => action(() => client.delete(`/admin/user/${u._id}`))}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
