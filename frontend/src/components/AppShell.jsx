import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, MessageSquare, Moon, Settings, SunMedium, UserCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AppShell = ({ children, title, subtitle, theme, onToggleTheme, actions }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = theme === 'dark';
  const shellClasses = isDark
    ? 'border-white/10 bg-[rgba(11,18,31,0.64)] text-white'
    : 'border-white/60 bg-white/70 text-slate-900';
  const panelClasses = isDark
    ? 'border-white/10 bg-white/5 text-slate-200'
    : 'border-white/60 bg-white/70 text-slate-700';
  const iconClasses = isDark ? 'hover:bg-white/10' : 'hover:bg-slate-900/5';

  const navItems = [
    { to: '/chat', label: 'Chats', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: UserCircle2 },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#04070d] text-white' : 'bg-[#eef4ff] text-slate-900'}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute right-[-4rem] top-1/4 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-4 p-3 sm:p-5 lg:p-6">
        <aside
          className={`fixed inset-y-3 left-3 z-40 w-[280px] rounded-[32px] border p-4 shadow-2xl backdrop-blur-2xl transition md:static md:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-[120%]'
          } ${shellClasses}`}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] opacity-60">ChatApp</p>
              <h1 className="mt-2 text-2xl font-semibold">Workspace</h1>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden ${iconClasses}`}
            >
              <X size={18} />
            </button>
          </div>

          <div className={`mb-5 rounded-[28px] border p-4 ${panelClasses}`}>
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="mt-1 truncate text-xs opacity-70">{user?.email}</p>
            <p className="mt-3 text-xs opacity-70">{user?.status || 'Available'}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                    active
                      ? isDark
                        ? 'border-sky-400/30 bg-sky-500/15 text-white'
                        : 'border-sky-300/60 bg-sky-500/10 text-slate-900'
                      : `${panelClasses} ${iconClasses}`
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2 pt-8">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${panelClasses} ${iconClasses}`}
            >
              {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
              <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${panelClasses} ${iconClasses}`}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
            aria-label="Close sidebar"
          />
        ) : null}

        <section className={`relative z-10 min-h-[calc(100vh-1.5rem)] flex-1 rounded-[32px] border shadow-2xl backdrop-blur-2xl ${shellClasses}`}>
          <header className={`flex items-center justify-between gap-4 border-b px-4 py-4 sm:px-6 ${isDark ? 'border-white/10' : 'border-white/60'}`}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden ${iconClasses}`}
              >
                <Menu size={18} />
              </button>
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                {subtitle ? <p className="text-sm opacity-70">{subtitle}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </header>

          <div className="p-4 sm:p-6">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default AppShell;
