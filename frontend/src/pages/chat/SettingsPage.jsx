import { useState } from 'react';
import { Bell, MoonStar, Save, Shield } from 'lucide-react';
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
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(Boolean(user?.readReceiptsEnabled));

  const themeOptions = [
    { name: 'light', label: 'Light', emoji: '☀️', color: 'sky' },
    { name: 'dark', label: 'Night', emoji: '🌙', color: 'slate' },
    { name: 'ocean', label: 'Ocean', emoji: '🌊', color: 'cyan' },
    { name: 'rose', label: 'Rose', emoji: '🌹', color: 'rose' },
    { name: 'whatsapp-green', label: 'WhatsApp', emoji: '💚', color: 'whatsapp-green' },
    { name: 'business-blue', label: 'Business', emoji: '💼', color: 'blue' },
    { name: 'vibrant-purple', label: 'Purple', emoji: '💜', color: 'purple' },
    { name: 'sunset-orange', label: 'Sunset', emoji: '🌅', color: 'orange' },
    { name: 'cool-teal', label: 'Teal', emoji: '🟢', color: 'teal' }
  ];

  const panelClass = theme === 'dark'
    ? 'border-white/10 bg-white/5'
    : 'border-white/70 bg-white/85';
  const optionClass = theme === 'dark'
    ? 'border-white/10 bg-white/5'
    : 'border-slate-200 bg-white';

  const saveSettings = async () => {
    try {
      const { data } = await api.patch('/users/preferences', {
        themePreference: theme,
        notificationsEnabled,
        readReceiptsEnabled
      });
      setUser(data.user);
      pushToast({ title: 'Settings saved', tone: 'success' });
    } catch (error) {
      pushToast({
        title: 'Failed to save settings',
        description: error.response?.data?.message || error.message,
        tone: 'error'
      });
    }
  };

  return (
    <AppShell
      title="Settings"
      subtitle="Manage your app preferences"
      theme={theme}
      themeOptions={themeOptions}
      onThemeSelect={setTheme}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      showMobileBottomNav={false}
    >
      <div className="minimal-scrollbar flex-1 overflow-y-auto px-3 py-3 sm:px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <section className={`rounded-3xl border p-4 sm:p-6 ${panelClass}`}>
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 p-3 text-white">
                <MoonStar size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">Appearance</h3>
                <p className="mt-1 text-sm opacity-70">Choose your theme</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {themeOptions.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setTheme(t.name)}
                  className={`group relative rounded-2xl border p-4 transition-all hover:scale-[1.02] ${
                    theme === t.name
                      ? `border-[var(--accent)]/50 bg-[var(--accent)]/10 ring-2 ring-[var(--accent)]/30`
                      : optionClass + ' hover:border-[var(--accent)]/30'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className={`text-lg ${theme === t.name ? 'text-[var(--accent)]' : 'text-slate-500 group-hover:text-[var(--accent)]'}`}>
                      {t.emoji}
                    </span>
                    <span className="text-xs font-medium text-center capitalize">{t.label}</span>
                    <div 
                      className={`h-3 w-3 rounded-full mt-1 shadow-sm ${
                        theme === t.name 
                          ? 'scale-125 shadow-[var(--accent)]' 
                          : `bg-${t.color}-400 shadow-md group-hover:scale-110`
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className={`rounded-3xl border p-4 sm:p-6 ${panelClass}`}>
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 p-3 text-white">
                <Bell size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="mt-1 text-sm opacity-70">Turn alerts on or off</p>
              </div>
            </div>

            <label className={`mt-5 flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-sm ${optionClass}`}>
              <span>Push notifications</span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(event) => setNotificationsEnabled(event.target.checked)}
              />
            </label>
          </section>

          <section className={`rounded-3xl border p-4 sm:p-6 md:col-span-2 ${panelClass}`}>
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 p-3 text-white">
                <Shield size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">Privacy</h3>
                <p className="mt-1 text-sm opacity-70">Control read receipts</p>
              </div>
            </div>

            <label className={`mt-5 flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-sm ${optionClass}`}>
              <span>Read receipts</span>
              <input
                type="checkbox"
                checked={readReceiptsEnabled}
                onChange={(event) => setReadReceiptsEnabled(event.target.checked)}
              />
            </label>
          </section>
        </div>

        <div className="mt-4 flex justify-stretch sm:justify-center">
          <button
            type="button"
            onClick={saveSettings}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white sm:w-auto"
          >
            <Save size={16} />
            <span>Save settings</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
};

export default SettingsPage;
