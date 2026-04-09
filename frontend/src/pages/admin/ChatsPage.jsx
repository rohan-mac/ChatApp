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
            {chat.lastMessageId ? (
              <div className="flex items-center justify-between rounded bg-slate-800 p-2 text-sm">
                <span>{chat.lastMessageId.senderId?.name}: {chat.lastMessageId.text || `[${chat.lastMessageId.messageType}]`}</span>
                <button className="rounded bg-red-600 px-2 py-1 text-xs" onClick={() => deleteMessage(chat.lastMessageId._id)}>Delete</button>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No messages yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsPage;
