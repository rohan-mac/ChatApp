import { useEffect, useState } from 'react';
import client from '../../api/client';

const ReportsPage = () => {
  const [flagged, setFlagged] = useState([]);

  const load = () => client.get('/admin/reports/flagged').then(({ data }) => setFlagged(data));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await client.delete(`/admin/message/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Flagged Messages</h2>
      <div className="space-y-2">
        {flagged.map((m) => (
          <div key={m._id} className="flex items-center justify-between rounded bg-slate-900 p-3">
            <p>{m.message || 'Media-only message'} — <span className="text-xs text-slate-400">{m.senderId?.name}</span></p>
            <button className="rounded bg-red-600 px-2 py-1 text-xs" onClick={() => remove(m._id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
