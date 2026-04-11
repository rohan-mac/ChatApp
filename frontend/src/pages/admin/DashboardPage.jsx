// import { useEffect, useState } from 'react';
// import client from '../../api/client';

// const DashboardPage = () => {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     client.get('/admin/dashboard').then(({ data }) => setStats(data));
//   }, []);

//   if (!stats) return <p>Loading dashboard...</p>;

//   const cards = [
//     ['Total Users', stats.totals.totalUsers],
//     ['Total Chats', stats.totals.totalChats],
//     ['Total Messages', stats.totals.totalMessages],
//     ['Active Users', stats.totals.activeUsers]
//   ];

//   return (
//     <div>
//       <h2 className="mb-4 text-2xl font-bold">Overview</h2>
//       <div className="grid gap-4 md:grid-cols-4">
//         {cards.map(([label, value]) => (
//           <div key={label} className="rounded bg-slate-900 p-4">
//             <p className="text-slate-400">{label}</p>
//             <p className="text-2xl font-bold">{value}</p>
//           </div>
//         ))}
//       </div>
//       <div className="mt-6 grid gap-6 md:grid-cols-2">
//         <div className="rounded bg-slate-900 p-4">
//           <h3 className="mb-2 font-semibold">Messages per day</h3>
//           <ul className="text-sm text-slate-300">
//             {stats.analytics.messagesPerDay.map((item) => (
//               <li key={item._id}>{item._id}: {item.count}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="rounded bg-slate-900 p-4">
//           <h3 className="mb-2 font-semibold">Reports per day</h3>
//           <ul className="text-sm text-slate-300">
//             {stats.analytics.reportsPerDay.map((item) => (
//               <li key={item._id}>{item._id}: {item.count}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;



import { useEffect, useState } from 'react';
import client from '../../api/client';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get('/admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    ['Total Users', stats.totals.totalUsers],
    ['Total Chats', stats.totals.totalChats],
    ['Total Messages', stats.totals.totalMessages],
    ['Active Users', stats.totals.activeUsers]
  ];

  return (
    <div className="h-full w-full overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">

      {/* HEADER */}
      <div className="mb-4 md:mb-6 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          Overview
        </h2>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {cards.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
          >
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ANALYTICS */}
      <div className="mt-5 md:mt-6 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">

        {/* MESSAGES PER DAY */}
        <div className="rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 shadow-sm">
          <h3 className="mb-3 text-sm sm:text-base font-semibold">
            Messages per day
          </h3>
          <ul className="space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {stats.analytics.messagesPerDay.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item._id}</span>
                <span className="font-medium">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* REPORTS PER DAY */}
        <div className="rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 shadow-sm">
          <h3 className="mb-3 text-sm sm:text-base font-semibold">
            Reports per day
          </h3>
          <ul className="space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {stats.analytics.reportsPerDay.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item._id}</span>
                <span className="font-medium">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;