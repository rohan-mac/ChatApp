// const SettingsPage = () => (
//   <div>
//     <h2 className="mb-4 text-2xl font-bold">Admin Settings</h2>
//     <div className="rounded bg-slate-900 p-4 text-sm text-slate-300">
//       <p>System configuration placeholders:</p>
//       <ul className="ml-5 mt-2 list-disc">
//         <li>Message retention policy</li>
//         <li>Media upload restrictions</li>
//         <li>Moderation thresholds</li>
//       </ul>
//     </div>
//   </div>
// );

// export default SettingsPage;


const SettingsPage = () => (
  <div className="h-full w-full overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">

    {/* HEADER */}
    <div className="mb-4 md:mb-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
        Admin Settings
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Manage system-level configurations
      </p>
    </div>

    {/* SETTINGS CARD */}
    <div className="rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 shadow-sm">

      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
        System configuration placeholders:
      </p>

      <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <li className="flex items-start gap-2">
          <span>•</span>
          <span>Message retention policy</span>
        </li>
        <li className="flex items-start gap-2">
          <span>•</span>
          <span>Media upload restrictions</span>
        </li>
        <li className="flex items-start gap-2">
          <span>•</span>
          <span>Moderation thresholds</span>
        </li>
      </ul>

    </div>
  </div>
);

export default SettingsPage;