import { useState } from 'react';
import { Camera, Lock, Save } from 'lucide-react';
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
  const [avatarPreview, setAvatarPreview] = useState(null);

  const panelClass = theme === 'dark'
    ? 'border-white/10 bg-white/5'
    : 'border-white/70 bg-white/85';
  const fieldClass = theme === 'dark'
    ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-400'
    : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-500';

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    setAvatar(file);

    if (!file) {
      setAvatarPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!form.name || form.name.trim().length < 2) {
      pushToast({ title: 'Name must be at least 2 characters', tone: 'error' });
      return;
    }

    try {
      const payload = new FormData();
      payload.append('name', form.name.trim());
      payload.append('bio', form.bio.trim());
      payload.append('status', form.status.trim());
      if (avatar) payload.append('avatar', avatar);

      const { data } = await api.patch('/users/me', payload);
      setUser(data.user);
      setAvatar(null);
      setAvatarPreview(null);
      pushToast({ title: 'Profile updated', tone: 'success' });
    } catch (error) {
      pushToast({
        title: 'Failed to update profile',
        description: error.response?.data?.message || error.message,
        tone: 'error'
      });
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      pushToast({ title: 'Passwords do not match', tone: 'error' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      pushToast({ title: 'Password must be at least 6 characters', tone: 'error' });
      return;
    }

    try {
      await api.patch('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      pushToast({ title: 'Password changed', tone: 'success' });
    } catch (error) {
      pushToast({
        title: 'Failed to change password',
        description: error.response?.data?.message || error.message,
        tone: 'error'
      });
    }
  };

  return (
    <AppShell
      title="Profile"
      subtitle="Edit your details"
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      showMobileBottomNav={false}
    >
      <div className="minimal-scrollbar flex-1 overflow-y-auto px-3 py-3 sm:px-4 md:px-6">
        <form onSubmit={saveProfile} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className={`rounded-3xl border p-4 sm:p-6 ${panelClass}`}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold sm:text-xl">Profile details</h3>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className={`rounded-2xl border px-4 py-3 outline-none ${fieldClass}`}
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span>Status</span>
                <input
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                  className={`rounded-2xl border px-4 py-3 outline-none ${fieldClass}`}
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span>Bio</span>
                <textarea
                  rows="4"
                  value={form.bio}
                  onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                  className={`rounded-2xl border px-4 py-3 outline-none ${fieldClass}`}
                />
              </label>
            </div>
          </section>

          <aside className={`rounded-3xl border p-4 sm:p-6 ${panelClass}`}>
            <div className="flex flex-col items-center text-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28" />
              ) : user?.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-3xl font-semibold text-white sm:h-28 sm:w-28">
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}

              <p className="mt-4 text-base font-semibold sm:text-lg">{user?.name}</p>
              <p className="text-sm opacity-70 break-all">{user?.email}</p>

              <label className={`mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm transition-colors ${panelClass}`}>
                <Camera size={16} />
                <span>{avatar ? avatar.name : 'Change avatar'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>

              <button
                type="submit"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white"
              >
                <Save size={16} />
                <span>Save profile</span>
              </button>
            </div>
          </aside>
        </form>

        <form onSubmit={changePassword} className="mt-4">
          <section className={`rounded-3xl border p-4 sm:p-6 ${panelClass}`}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold sm:text-xl">Password</h3>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Current password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                  className={`rounded-2xl border px-4 py-3 outline-none ${fieldClass}`}
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span>New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                  className={`rounded-2xl border px-4 py-3 outline-none ${fieldClass}`}
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span>Confirm password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  className={`rounded-2xl border px-4 py-3 outline-none ${fieldClass}`}
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-semibold text-white"
            >
              <Lock size={16} />
              <span>Change password</span>
            </button>
          </section>
        </form>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
