// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { MoreVertical, Settings, Bell, Video, LogOut, SunMedium, MoonStar } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { Z_INDEX } from '../constants/zIndex';
// import Sidebar from './Sidebar';

// const AppShell = ({ children, title, subtitle, theme, onToggleTheme, actions, showHeader = true, themeOptions = [], onThemeSelect, showSidebar = true }) => {
//   const { user, logout } = useAuth();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [expandTheme, setExpandTheme] = useState(false);

//   const isDark = theme === 'dark';
//   const shellClasses = isDark
//     ? 'border-white/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl'
//     : 'border-slate-200/50 bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 shadow-xl';
//   const panelClasses = isDark
//     ? 'border-white/20 bg-gradient-to-br from-slate-800/80 to-slate-900/80 text-slate-200 backdrop-blur-sm'
//     : 'border-white/60 bg-gradient-to-br from-white/90 to-slate-50/90 text-slate-900 backdrop-blur-sm';

//   const mobileMenuItems = [
//     { to: '/settings', label: 'Settings', icon: Settings },
//     { to: '/notifications', label: 'Notifications', icon: Bell },
//     { to: '/video-calls', label: 'Video Calls', icon: Video },
//   ];

//   return (
//     <div className={`min-h-screen w-full ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'}`}>
//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl" />
//         <div className="absolute right-[-8rem] top-1/3 h-[32rem] w-[32rem] rounded-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-3xl" />
//         <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-200/25 to-blue-200/25 blur-3xl" />
//       </div>

//       <div className="relative w-full flex flex-col md:flex-row min-h-screen gap-3 md:gap-4 p-2 sm:p-3 md:p-5 lg:p-6">
//         {showSidebar && (
//           <Sidebar
//             theme={theme}
//             onToggleTheme={onToggleTheme}
//             themeOptions={themeOptions}
//             onThemeSelect={onThemeSelect}
//             mobileOpen={mobileOpen}
//             setMobileOpen={setMobileOpen}
//             user={user}
//             showMobileMenu={showMobileMenu}
//             setShowMobileMenu={setShowMobileMenu}
//           />
//         )}

//         <div className={`relative z-10 flex flex-col flex-1 rounded-none shadow-none min-h-fit md:min-h-[calc(100vh-4rem)] ${shellClasses} ${showSidebar ? 'mb-24 md:mb-0' : ''}`}>
//           {showHeader ? (
//             <header className={`flex items-center justify-between gap-2 sm:gap-4 border-b px-4 sm:px-6 py-4 sm:py-5 ${isDark ? 'border-white/20 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm' : 'border-slate-200/50 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm'}`}>
//               <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
//                 <div className="min-w-0 flex-1">
//                   <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300 truncate">{title}</h2>
//                   {subtitle ? <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium truncate">{subtitle}</p> : null}
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">{actions}
                
//                 {/* Mobile Three-Dot Menu */}
//                 <div className="md:hidden relative">
//                   <button
//                     type="button"
//                     onClick={() => setShowMobileMenu(!showMobileMenu)}
//                     className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border transition-all duration-200 ${
//                       isDark ? 'border-white/20 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
//                     }`}
//                     title="More options"
//                   >
//                     <MoreVertical size={18} />
//                   </button>

//                   {/* Mobile Menu Dropdown */}
//                   {showMobileMenu && (
//                     <div
//                       className={`absolute right-0 top-12 z-50 flex flex-col gap-1 rounded-lg border p-2 shadow-xl min-w-[160px] ${
//                         isDark
//                           ? 'border-white/20 bg-gradient-to-br from-slate-800 to-slate-900'
//                           : 'border-slate-200 bg-white'
//                       }`}
//                     >
//                       {mobileMenuItems.map((item) => {
//                         const Icon = item.icon;
//                         return (
//                           <Link
//                             key={item.to}
//                             to={item.to}
//                             onClick={() => setShowMobileMenu(false)}
//                             className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                               isDark
//                                 ? 'hover:bg-white/10 text-slate-200'
//                                 : 'hover:bg-slate-100 text-slate-700'
//                             }`}
//                           >
//                             <Icon size={16} />
//                             {item.label}
//                           </Link>
//                         );
//                       })}

//                       {/* Theme Selector in Mobile Menu */}
//                       <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'} my-1`} />
                      
//                       <div className="relative">
//                         <button
//                           type="button"
//                           onClick={() => setExpandTheme(!expandTheme)}
//                           className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                             isDark
//                               ? 'hover:bg-white/10 text-slate-200'
//                               : 'hover:bg-slate-100 text-slate-700'
//                           }`}
//                         >
//                           {isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
//                           Theme
//                         </button>

//                         {/* Theme Submenu */}
//                         {expandTheme && (
//                           <div
//                             className={`absolute right-full top-0 z-50 flex flex-col gap-1 rounded-lg border p-2 mr-1 shadow-xl min-w-[120px] ${
//                               isDark
//                                 ? 'border-white/20 bg-gradient-to-br from-slate-800 to-slate-900'
//                                 : 'border-slate-200 bg-white'
//                             }`}
//                           >
//                             {[
//                               { name: 'dark', label: 'Dark 🌙' },
//                               { name: 'ocean', label: 'Ocean 🌊' },
//                               { name: 'rose', label: 'Rose 🌹' }
//                             ].map((t) => (
//                               <button
//                                 key={t.name}
//                                 onClick={() => {
//                                   onThemeSelect?.(t.name);
//                                   setExpandTheme(false);
//                                 }}
//                                 className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
//                                   theme === t.name
//                                     ? isDark
//                                       ? 'bg-yellow-500/20 border border-yellow-400/50'
//                                       : 'bg-yellow-100 border border-yellow-300'
//                                     : isDark
//                                     ? 'hover:bg-white/5'
//                                     : 'hover:bg-slate-100'
//                                 }`}
//                               >
//                                 {t.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>

//                       {/* Logout */}
//                       <button
//                         type="button"
//                         onClick={logout}
//                         className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                           isDark
//                             ? 'hover:bg-red-500/10 text-red-400'
//                             : 'hover:bg-red-50 text-red-600'
//                         }`}
//                       >
//                         <LogOut size={16} />
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </header>
//           ) : null}

//           <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppShell;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Settings, Bell, LogOut, SunMedium, MoonStar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Z_INDEX } from '../constants/zIndex';
import Sidebar from './Sidebar';

const AppShell = ({
  children,
  title,
  subtitle,
  theme,
  onToggleTheme,
  actions,
  showHeader = true,
  themeOptions = [],
  onThemeSelect,
  showSidebar = true,
  showMobileBottomNav = true
}) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandTheme, setExpandTheme] = useState(false);

  const isDark = theme === 'dark';

  const shellClasses = 'border-[var(--wa-border)] bg-[var(--wa-chat-bg)] text-[var(--wa-text)] shadow-none';

  const mobileMenuItems = [
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
      <div className="h-[100dvh] w-full overflow-x-hidden overflow-y-hidden bg-[var(--wa-chat-bg)] text-[var(--wa-text)]">

      {/* MAIN LAYOUT */}
      <div className="relative flex h-full w-full flex-col md:flex-row gap-0 p-0 overflow-x-hidden">


        {/* SIDEBAR */}
        {showSidebar && (
          <Sidebar
            theme={theme}
            onToggleTheme={onToggleTheme}
            themeOptions={themeOptions}
            onThemeSelect={onThemeSelect}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            user={user}
            showMobileBottomNav={showMobileBottomNav}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />
        )}

        {/* MAIN PANEL */}
        <div
          className={`relative z-10 flex flex-col flex-1 rounded-none shadow-none overflow-hidden ${shellClasses} ${
            showSidebar && showMobileBottomNav ? 'mb-20 md:mb-0' : ''
          }`}
        >

          {/* HEADER */}
          {showHeader && (
            <header
              className={`flex items-center justify-between gap-2 sm:gap-4 border-b px-3 sm:px-6 py-3 sm:py-5 flex-shrink-0 ${
                isDark
                  ? 'border-white/20 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl'
                  : 'border-slate-200/50 bg-white/80 backdrop-blur-xl'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-2xl font-bold truncate">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {actions}

                {/* MOBILE MENU */}
                <div className="md:hidden relative">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                      isDark
                        ? 'border-white/20 bg-white/5'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {showMobileMenu && (
                    <div
                      className={`absolute top-12 z-50 flex flex-col gap-1 rounded-xl border p-2 shadow-xl min-w-[170px] max-w-[calc(100vw-32px)] ${
                        // Align dropdown right edge to the icon but prevent overflow
                        'right-4',
                        isDark
                          ? 'border-white/20 bg-slate-900'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {mobileMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setShowMobileMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-white/10"
                          >
                            <Icon size={16} />
                            {item.label}
                          </Link>
                        );
                      })}

                      <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />

                      {/* THEME */}
                      <button
                        onClick={() => setExpandTheme(!expandTheme)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-white/10"
                      >
                        {isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
                        Theme
                      </button>

                      {expandTheme && (
                        <div className="ml-2 flex flex-col gap-1">
{themeOptions.map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                onThemeSelect?.(t);
                                setExpandTheme(false);
                              }}
                              className={`px-3 py-1 rounded text-sm text-left ${
                                theme === t
                                  ? 'bg-[var(--accent)]/10'
                                  : 'hover:bg-slate-100 dark:hover:bg-white/10'
                              }`}
                            >
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>
          )}

          {/* ✅ FIXED CONTENT AREA (IMPORTANT) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppShell;
