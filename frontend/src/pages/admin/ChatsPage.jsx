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
    <div>
      <h2 className="mb-4 text-2xl font-bold">Chat Monitoring</h2>
      <div className="space-y-3">
        {chats.map((chat) => (
          <div key={chat._id} className="rounded bg-slate-900 p-4">
            <p className="mb-2 text-sm text-slate-400">Participants: {chat.participants.map((p) => p.name).join(', ')}</p>
            <div className="space-y-2">
              {chat.messages.map((m) => (
                <div key={m._id} className="flex items-center justify-between rounded bg-slate-800 p-2 text-sm">
                  <span>{m.senderId?.name}: {m.message || `[${m.mediaType}]`}</span>
                  <button className="rounded bg-red-600 px-2 py-1 text-xs" onClick={() => deleteMessage(m._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsPage;
