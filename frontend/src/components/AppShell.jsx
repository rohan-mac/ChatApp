import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, MessageSquare, Moon, Settings, SunMedium, UserCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AppShell = ({ children, title, subtitle, theme, onToggleTheme, actions, showHeader = true, themeOptions = [], onThemeSelect, showSidebar = true }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = theme === 'dark';
  const shellClasses = isDark
    ? 'border-white/10 bg-slate-950/95 text-white'
    : 'border-slate-200/70 bg-slate-100 text-slate-900';
  const panelClasses = isDark
    ? 'border-white/10 bg-slate-900/95 text-slate-200'
    : 'border-white/80 bg-white text-slate-900';
  const iconClasses = isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200';
  const navButtonClasses = `flex h-14 w-full items-center justify-center rounded-3xl border transition ${iconClasses}`;

  const navItems = [
    { to: '/chat', label: 'Chats', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: UserCircle2 },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-slate-200/50 blur-3xl" />
        <div className="absolute right-[-4rem] top-1/4 h-96 w-96 rounded-full bg-slate-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-4 p-3 sm:p-5 lg:p-6">
        {showSidebar ? (
          <aside
            className={`fixed inset-y-3 left-3 z-40 w-[88px] border p-3 shadow-2xl transition md:static md:translate-x-0 ${
              mobileOpen ? 'translate-x-0' : '-translate-x-[120%]'
            } ${shellClasses}`}
          >
          <div className="mb-6 flex items-center justify-center rounded-[28px] border px-3 py-4 text-center text-xs uppercase tracking-[0.35em] opacity-70">
            ChatApp
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
                  title={item.label}
                  className={`${navButtonClasses} ${
                    active
                      ? isDark
                        ? 'border-sky-400/30 bg-sky-500/15 text-white'
                        : 'border-sky-300/60 bg-sky-500/10 text-slate-900'
                      : panelClasses
                  }`}
                >
                  <Icon size={20} />
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-6">
            <button
              type="button"
              title="Logout"
              onClick={logout}
              className={`inline-flex h-14 w-full items-center justify-center border ${panelClasses} ${iconClasses}`}
            >
              <LogOut size={18} />
            </button>
          </div>
        </aside>
        ) : null}

        {showSidebar && mobileOpen ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
            aria-label="Close sidebar"
          />
        ) : null}

        <section className={`relative z-10 min-h-[calc(100vh-1.5rem)] flex-1 ${shellClasses}`}>
          {showHeader ? (
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
          ) : null}

          <div className="h-full p-4 sm:p-6">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default AppShell;
