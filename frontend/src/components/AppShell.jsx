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
    ? 'border-white/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl'
    : 'border-slate-200/50 bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 shadow-xl';
  const panelClasses = isDark
    ? 'border-white/20 bg-gradient-to-br from-slate-800/80 to-slate-900/80 text-slate-200 backdrop-blur-sm'
    : 'border-white/60 bg-gradient-to-br from-white/90 to-slate-50/90 text-slate-900 backdrop-blur-sm';
  const iconClasses = isDark ? 'hover:bg-white/20 hover:shadow-lg transition-all duration-200' : 'hover:bg-slate-200/80 hover:shadow-md transition-all duration-200';
  const navButtonClasses = `flex h-14 w-full items-center justify-center rounded-2xl border transition-all duration-200 shadow-sm ${iconClasses}`;

  const navItems = [
    { to: '/chat', label: 'Chats', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: UserCircle2 },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl" />
        <div className="absolute right-[-8rem] top-1/3 h-[32rem] w-[32rem] rounded-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-200/25 to-blue-200/25 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-4 p-3 sm:p-5 lg:p-6">
        {showSidebar ? (
          <aside
            className={`fixed inset-y-3 left-3 z-40 w-[88px] border p-3 shadow-2xl transition md:static md:translate-x-0 ${
              mobileOpen ? 'translate-x-0' : '-translate-x-[120%]'
            } ${shellClasses}`}
          >
          <div className="mb-8 flex items-center justify-center rounded-2xl border bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg">
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              ChatApp
            </span>
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
                        ? 'border-blue-400/40 bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-white shadow-lg shadow-blue-500/25'
                        : 'border-blue-300/50 bg-gradient-to-br from-blue-500/15 to-purple-600/15 text-slate-900 shadow-md shadow-blue-500/20'
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
              className={`inline-flex h-14 w-full items-center justify-center border ${panelClasses} ${iconClasses} rounded-2xl shadow-sm hover:shadow-md transition-all duration-200`}
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

        <section className={`relative z-10 min-h-[calc(100vh-1.5rem)] flex-1 ${shellClasses} rounded-3xl shadow-2xl`}>
          {showHeader ? (
            <header className={`flex items-center justify-between gap-4 border-b px-6 py-5 sm:px-8 ${isDark ? 'border-white/20 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm' : 'border-slate-200/50 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm'}`}>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl md:hidden ${iconClasses} shadow-sm`}
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">{title}</h2>
                  {subtitle ? <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{subtitle}</p> : null}
                </div>
              </div>
              <div className="flex items-center gap-3">{actions}</div>
            </header>
          ) : null}

          <div className="h-full p-6 sm:p-8">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default AppShell;
