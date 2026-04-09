import { useState } from 'react';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useThemeMode from '../../hooks/useThemeMode';
import client from '../../api/client';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { pushToast } = useToast();
  const [theme, setTheme] = useThemeMode();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    status: user?.status || ''
  });
  const [avatar, setAvatar] = useState(null);

  const saveProfile = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('bio', form.bio);
    payload.append('status', form.status);
    if (avatar) payload.append('avatar', avatar);

    const { data } = await client.patch('/users/me', payload);
    setUser(data.user);
    pushToast({ title: 'Profile updated', tone: 'success' });
  };

  return (
    <AppShell
      title="Profile"
      subtitle="Update your public identity, avatar and status."
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
    >
      <form onSubmit={saveProfile} className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className={`rounded-[28px] border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span>Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className={`rounded-2xl border px-4 py-3 outline-none ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white'}`}
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span>Status</span>
              <input
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                className={`rounded-2xl border px-4 py-3 outline-none ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white'}`}
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span>Bio</span>
              <textarea
                rows="5"
                value={form.bio}
                onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                className={`rounded-2xl border px-4 py-3 outline-none ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white'}`}
              />
            </label>
          </div>
        </section>

        <aside className={`rounded-[28px] border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/80'}`}>
          <div className="flex flex-col items-center text-center">
            {user?.profilePic ? (
              <img src={user.profilePic} alt={user.name} className="h-28 w-28 rounded-full object-cover" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-3xl font-semibold text-white">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <p className="mt-4 text-lg font-semibold">{user?.name}</p>
            <p className="text-sm opacity-70">{user?.email}</p>
            <input type="file" className="mt-4 text-sm" onChange={(event) => setAvatar(event.target.files?.[0] || null)} />
            <button type="submit" className="mt-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white">
              Save profile
            </button>
          </div>
        </aside>
      </form>
    </AppShell>
  );
};

export default ProfilePage;
