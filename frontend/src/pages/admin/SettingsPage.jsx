const SettingsPage = () => (
  <div>
    <h2 className="mb-4 text-2xl font-bold">Admin Settings</h2>
    <div className="rounded bg-slate-900 p-4 text-sm text-slate-300">
      <p>System configuration placeholders:</p>
      <ul className="ml-5 mt-2 list-disc">
        <li>Message retention policy</li>
        <li>Media upload restrictions</li>
        <li>Moderation thresholds</li>
      </ul>
    </div>
  </div>
);

export default SettingsPage;
