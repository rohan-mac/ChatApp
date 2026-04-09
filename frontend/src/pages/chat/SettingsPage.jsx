import { useState } from 'react';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useThemeMode from '../../hooks/useThemeMode';
import client from '../../api/client';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const { pushToast } = useToast();
  const [theme, setTheme] = useThemeMode();
  const [notificationsEnabled, setNotificationsEnabled] = useState(Boolean(user?.notificationsEnabled));

  const saveSettings = async () => {
    const { data } = await client.patch('/users/preferences', {
      themePreference: theme,
      notificationsEnabled
    });
    setUser(data.user);
    pushToast({ title: 'Settings saved', tone: 'success' });
  };

  return (
    <AppShell
      title="Settings"
      subtitle="Tune appearance, notifications and deployment-friendly preferences."
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`rounded-[28px] border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}>
          <h3 className="text-lg font-semibold">Appearance</h3>
          <p className="mt-2 text-sm opacity-70">Choose the theme used across the chat dashboard, profile, and settings pages.</p>
          <div className="mt-5 flex gap-3">
            {['dark', 'light'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTheme(mode)}
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  theme === mode
                    ? 'border-sky-400/40 bg-sky-500/15'
                    : theme === 'dark'
                      ? 'border-white/10 bg-white/5'
                      : 'border-white/70 bg-white'
                }`}
              >
                {mode[0].toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section className={`rounded-[28px] border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}>
          <h3 className="text-lg font-semibold">Notifications</h3>
          <label className="mt-5 flex items-center justify-between rounded-2xl border px-4 py-4 text-sm">
            <span>Push notifications</span>
            <input type="checkbox" checked={notificationsEnabled} onChange={(event) => setNotificationsEnabled(event.target.checked)} />
          </label>
          <button type="button" onClick={saveSettings} className="mt-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white">
            Save settings
          </button>
        </section>
      </div>
    </AppShell>
  );
};

export default SettingsPage;
