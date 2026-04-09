import { useState } from 'react';
import { Bell, MoonStar, Save } from 'lucide-react';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useThemeMode from '../../hooks/useThemeMode';
import api from '../../services/api';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const { pushToast } = useToast();
  const [theme, setTheme] = useThemeMode();
  const [notificationsEnabled, setNotificationsEnabled] = useState(Boolean(user?.notificationsEnabled));

  const saveSettings = async () => {
    const { data } = await api.patch('/users/preferences', {
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
        <section className={`rounded-[30px] border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/82'}`}>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 p-3 text-white">
              <MoonStar size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="mt-1 text-sm opacity-70">Choose the visual mode for your iPhone-style glass interface.</p>
            </div>
          </div>
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

        <section className={`rounded-[30px] border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/82'}`}>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 p-3 text-white">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Notifications</h3>
              <p className="mt-1 text-sm opacity-70">Keep the app quiet or allow delivery updates from the backend.</p>
            </div>
          </div>
          <label className="mt-5 flex items-center justify-between rounded-2xl border px-4 py-4 text-sm">
            <span>Push notifications</span>
            <input type="checkbox" checked={notificationsEnabled} onChange={(event) => setNotificationsEnabled(event.target.checked)} />
          </label>
          <button type="button" onClick={saveSettings} className="mt-6 inline-flex items-center gap-2 rounded-[22px] bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(59,130,246,0.26)]">
            <Save size={16} />
            <span>Save settings</span>
          </button>
        </section>
      </div>
    </AppShell>
  );
};

export default SettingsPage;
