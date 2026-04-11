import { useState } from 'react';
import { Camera, Save, Sparkles, Lock } from 'lucide-react';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useThemeMode from '../../hooks/useThemeMode';
import api from '../../services/api';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { pushToast } = useToast();
  const [theme, setTheme] = useThemeMode();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    status: user?.status || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState(null);

  const saveProfile = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('bio', form.bio);
    payload.append('status', form.status);
    if (avatar) payload.append('avatar', avatar);

    const { data } = await api.patch('/users/me', payload);
    setUser(data.user);
    pushToast({ title: 'Profile updated', tone: 'success' });
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      pushToast({ title: 'Passwords do not match', tone: 'error' });
      return;
    }

    await api.patch('/users/change-password', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    pushToast({ title: 'Password changed', tone: 'success' });
  };

  return (
    <AppShell
      title="Profile"
      subtitle="Update your public identity, avatar and status."
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
    >
      <form onSubmit={saveProfile} className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <section className={`rounded-[30px] border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/82'}`}>
          <div className={`mb-5 rounded-[24px] border p-4 ${theme === 'dark' ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/80'}`}>
            <p className="text-xs uppercase tracking-[0.35em] opacity-60">Identity</p>
            <h3 className="mt-3 text-2xl font-semibold">Design your visible presence</h3>
            <p className="mt-2 text-sm leading-6 opacity-70">
              Update your name, public status and bio to personalize the premium messaging experience.
            </p>
          </div>

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

        <aside className={`rounded-[30px] border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/82'}`}>
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
            <label className={`mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[22px] border px-4 py-3 text-sm ${
              theme === 'dark' ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/85'
            }`}>
              <Camera size={16} />
              <span>{avatar ? avatar.name : 'Choose avatar'}</span>
              <input type="file" className="hidden" onChange={(event) => setAvatar(event.target.files?.[0] || null)} />
            </label>
            <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-[22px] bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(59,130,246,0.26)]">
              <Save size={16} />
              <span>Save profile</span>
            </button>
            <div className={`mt-5 w-full rounded-[22px] border p-4 text-left text-sm ${
              theme === 'dark' ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/80'
            }`}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] opacity-60">
                <Sparkles size={14} />
                Quick Preview
              </div>
              <p className="mt-3 font-semibold">{form.name || 'Your name'}</p>
              <p className="mt-1 opacity-70">{form.status || 'Available'}</p>
            </div>
          </div>
        </aside>
      </form>

      <form onSubmit={changePassword} className="mt-8">
        <section className={`rounded-[30px] border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/82'}`}>
          <div className={`mb-5 rounded-[24px] border p-4 ${theme === 'dark' ? 'border-white/10 bg-white/6' : 'border-white/80 bg-white/80'}`}>
            <p className="text-xs uppercase tracking-[0.35em] opacity-60">Security</p>
            <h3 className="mt-3 text-2xl font-semibold">Change Password</h3>
            <p className="mt-2 text-sm leading-6 opacity-70">
              Update your password to keep your account secure.
            </p>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span>Current Password</span>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                className={`rounded-2xl border px-4 py-3 outline-none ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white'}`}
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span>New Password</span>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                className={`rounded-2xl border px-4 py-3 outline-none ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white'}`}
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span>Confirm New Password</span>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                className={`rounded-2xl border px-4 py-3 outline-none ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white'}`}
              />
            </label>
          </div>

          <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-[22px] bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(16,185,129,0.26)]">
            <Lock size={16} />
            <span>Change password</span>
          </button>
        </section>
      </form>
    </AppShell>
  );
};

export default ProfilePage;
