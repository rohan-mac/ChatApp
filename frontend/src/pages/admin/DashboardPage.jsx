import { useEffect, useState } from 'react';
import client from '../../api/client';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get('/admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const cards = [
    ['Total Users', stats.totals.totalUsers],
    ['Total Chats', stats.totals.totalChats],
    ['Total Messages', stats.totals.totalMessages],
    ['Active Users', stats.totals.activeUsers]
  ];

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Overview</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded bg-slate-900 p-4">
            <p className="text-slate-400">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded bg-slate-900 p-4">
          <h3 className="mb-2 font-semibold">Messages per day</h3>
          <ul className="text-sm text-slate-300">
            {stats.analytics.messagesPerDay.map((item) => (
              <li key={item._id}>{item._id}: {item.count}</li>
            ))}
          </ul>
        </div>
        <div className="rounded bg-slate-900 p-4">
          <h3 className="mb-2 font-semibold">Daily active users</h3>
          <ul className="text-sm text-slate-300">
            {stats.analytics.dailyActiveUsers.map((item) => (
              <li key={item._id}>{item._id}: {item.count}</li>
            ))}
          </ul>
          <p className="mt-3 text-emerald-400">User growth: {stats.analytics.userGrowthPct}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
