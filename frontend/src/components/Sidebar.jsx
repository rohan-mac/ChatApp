// import { Link, useLocation } from 'react-router-dom';
// import {
//   LogOut,
//   Menu,
//   MessageSquare,
//   MoonStar,
//   Settings,
//   SunMedium,
//   UserCircle2,
//   Plus,
//   Search,
//   MoreVertical,
//   Bell,
//   HelpCircle,
//   Shield,
//   LogIn,
//   Phone,
//   Users,
//   Calendar,
//   Video,
//   MessageCircle
// } from 'lucide-react';
// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// const Sidebar = ({
//   theme = 'dark',
//   onToggleTheme,
//   themeOptions = [],
//   onThemeSelect,
//   mobileOpen,
//   setMobileOpen,
//   user,
//   showMobileMenu,
//   setShowMobileMenu
// }) => {
//   const location = useLocation();
//   const { logout } = useAuth();
//   const [expandedMenu, setExpandedMenu] = useState(false);

//   const isDark = theme === 'dark';
//   const isOcean = theme === 'ocean';
//   const isRose = theme === 'rose';

//   const sidebarClasses = isDark
//     ? 'border-white/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'
//     : 'border-slate-200/50 bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900';

//   const panelClasses = isDark
//     ? 'border-white/20 bg-white/5 hover:bg-white/10'
//     : 'border-slate-200/30 bg-slate-100/50 hover:bg-slate-100';

//   const activeClasses = isDark
//     ? 'border-blue-400/40 bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-white shadow-lg shadow-blue-500/25'
//     : 'border-blue-300/50 bg-gradient-to-br from-blue-500/15 to-purple-600/15 text-slate-900 shadow-md shadow-blue-500/20';

//   const adminActiveClasses = isDark
//     ? 'border-red-400/40 bg-gradient-to-br from-red-500/20 to-red-600/20 text-white shadow-lg shadow-red-500/25'
//     : 'border-red-300/50 bg-gradient-to-br from-red-500/15 to-red-600/15 text-slate-900 shadow-md shadow-red-500/20';

//   // Mobile bottom nav items
//   const mobileBottomItems = [
//     { to: '/chat', label: 'Chats', icon: MessageSquare },
//     { to: '/calls', label: 'Calls', icon: Phone },
//     { to: '/contacts', label: 'Contacts', icon: Users },
//   ];

//   // Desktop nav items
//   const mainNavItems = [
//     { to: '/chat', label: 'Chats', icon: MessageSquare },
//     { to: '/calls', label: 'Calls', icon: Phone },
//     { to: '/contacts', label: 'Contacts', icon: Users },
//     { to: '/calendar', label: 'Calendar', icon: Calendar },
//     { to: '/messages', label: 'Messages', icon: MessageCircle },
//     { to: '/profile', label: 'Profile', icon: UserCircle2 },
//   ];

//   const settingsNavItems = [
//     { to: '/settings', label: 'Settings', icon: Settings },
//     { to: '/notifications', label: 'Notifications', icon: Bell },
//     { to: '/video-calls', label: 'Video Calls', icon: Video },
//   ];

//   const adminNavItems = user?.role === 'admin' ? [
//     { to: '/admin', label: 'Dashboard', icon: Shield }
//   ] : [];

//   const NavItem = ({ item, isAdmin = false }) => {
//     const Icon = item.icon;
//     const active = location.pathname.startsWith(item.to);

//     return (
//       <Link
//         key={item.to}
//         to={item.to}
//         onClick={() => setMobileOpen(false)}
//         title={item.label}
//         className={`flex items-center justify-center h-12 w-12 rounded-2xl border transition-all duration-200 shadow-sm ${
//           isAdmin
//             ? active
//               ? adminActiveClasses
//               : panelClasses
//             : active
//             ? activeClasses
//             : panelClasses
//         }`}
//       >
//         <Icon size={20} />
//       </Link>
//     );
//   };

//   const MobileNavItem = ({ item, isAdmin = false }) => {
//     const Icon = item.icon;
//     const active = location.pathname.startsWith(item.to);

//     return (
//       <Link
//         key={item.to}
//         to={item.to}
//         title={item.label}
//         className={`flex flex-col items-center justify-center h-14 sm:h-16 flex-1 rounded-xl sm:rounded-2xl border transition-all duration-200 shadow-sm ${
//           isAdmin
//             ? active
//               ? adminActiveClasses
//               : panelClasses
//             : active
//             ? activeClasses
//             : panelClasses
//         }`}
//       >
//         <Icon size={16} className="sm:w-5 sm:h-5" />
//         <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-medium text-center">{item.label}</span>
//       </Link>
//     );
//   };

//   return (
//     <>
//       {/* DESKTOP SIDEBAR */}
//       <aside
//         className={`hidden md:flex md:flex-col md:gap-3 md:border md:p-3 md:shadow-2xl md:transition-all md:duration-300 md:rounded-3xl md:w-20 md:h-fit md:flex-shrink-0 ${sidebarClasses}`}
//       >
//         {/* Logo */}
//         <div className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-3 text-center shadow-lg">
//           <span className="text-lg font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
//             C
//           </span>
//         </div>

//         {/* Main Navigation */}
//         <nav className="flex flex-col gap-2">
//           {mainNavItems.map((item) => (
//             <NavItem key={item.to} item={item} />
//           ))}
//         </nav>

//         {/* Divider */}
//         <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-slate-300/30'}`} />

//         {/* Settings & Admin */}
//         <nav className="flex flex-col gap-2">
//           {settingsNavItems.map((item) => (
//             <NavItem key={item.to} item={item} />
//           ))}
//           {adminNavItems.map((item) => (
//             <NavItem key={item.to} item={item} isAdmin />
//           ))}
//         </nav>

//         {/* Bottom Actions */}
//         <div className="mt-auto flex flex-col gap-2 pt-4">
//           {/* Theme Selector */}
//           <div className="relative">
//             <button
//               type="button"
//               onClick={() => setExpandedMenu(!expandedMenu)}
//               title="Theme"
//               className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 shadow-sm ${
//                 expandedMenu ? activeClasses : panelClasses
//               }`}
//             >
//               {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
//             </button>

//             {/* Theme Menu */}
//             {expandedMenu && (
//               <div
//                 className={`absolute bottom-16 left-0 flex w-12 flex-col gap-2 rounded-2xl border p-2 shadow-xl ${
//                   isDark
//                     ? 'border-white/20 bg-gradient-to-br from-slate-900 to-slate-950'
//                     : 'border-slate-200/50 bg-white'
//                 }`}
//               >
//                 {[
//                   { name: 'dark', label: '🌙' },
//                   { name: 'ocean', label: '🌊' },
//                   { name: 'rose', label: '🌹' }
//                 ].map((t) => (
//                   <button
//                     key={t.name}
//                     onClick={() => {
//                       onThemeSelect?.(t.name);
//                       setExpandedMenu(false);
//                     }}
//                     title={t.name}
//                     className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 text-lg ${
//                       theme === t.name
//                         ? isDark
//                           ? 'border-yellow-400/50 bg-yellow-500/20'
//                           : 'border-yellow-300/50 bg-yellow-100'
//                         : panelClasses
//                     }`}
//                   >
//                     {t.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Logout */}
//           <button
//             type="button"
//             title="Logout"
//             onClick={logout}
//             className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 shadow-sm ${panelClasses}`}
//           >
//             <LogOut size={18} />
//           </button>
//         </div>
//       </aside>

//       {/* MOBILE BOTTOM NAVIGATION */}
//       <nav
//         className={`fixed bottom-0 left-0 right-0 md:hidden z-50 flex gap-2 p-2 sm:p-3 pb-[calc(0.5rem_+_env(safe-area-inset-bottom))] sm:pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] border-t rounded-t-3xl ${
//           isDark
//             ? 'border-white/20 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950'
//             : 'border-slate-200/50 bg-gradient-to-t from-slate-50 via-white to-slate-100'
//         }`}
//       >
//         {mobileBottomItems.map((item) => (
//           <MobileNavItem key={item.to} item={item} />
//         ))}
//       </nav>
//     </>
//   );
// };

// export default Sidebar;



import { Link, useLocation } from 'react-router-dom';
import {
  LogOut,
  MessageSquare,
  MoonStar,
  Settings,
  SunMedium,
  UserCircle2,
  Bell,
  Shield,
  Phone,
  Users,
  Calendar,
  Video,
  MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({
  theme = 'dark',
  onToggleTheme,
  themeOptions = [],
  onThemeSelect,
  mobileOpen,
  setMobileOpen,
  user,
  showMobileBottomNav = true,
}) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState(false);

  const isDark = theme === 'dark';

  const sidebarClasses = isDark
    ? 'border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white backdrop-blur-xl'
    : 'border-slate-200/50 bg-white/80 text-slate-900 backdrop-blur-xl';

  const panelClasses = isDark
    ? 'border-white/10 bg-white/5 hover:bg-white/10'
    : 'border-slate-200 bg-slate-100 hover:bg-slate-200';

  const activeClasses = isDark
    ? 'border-blue-400/40 bg-blue-500/20 shadow-lg'
    : 'border-blue-300 bg-blue-100 shadow';

  const adminActiveClasses = isDark
    ? 'border-red-400/40 bg-red-500/20 shadow-lg'
    : 'border-red-300 bg-red-100 shadow';

  const mobileBottomItems = [
    { to: '/chat', label: 'Chats', icon: MessageSquare },
    { to: '/calls', label: 'Calls', icon: Phone },
    { to: '/contacts', label: 'Contacts', icon: Users },
  ];

  const mainNavItems = [
    { to: '/chat', label: 'Chats', icon: MessageSquare },
    { to: '/calls', label: 'Calls', icon: Phone },
    { to: '/contacts', label: 'Contacts', icon: Users },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/messages', label: 'Messages', icon: MessageCircle },
    { to: '/profile', label: 'Profile', icon: UserCircle2 },
  ];

  const settingsNavItems = [
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/video-calls', label: 'Video Calls', icon: Video },
  ];

  const adminNavItems = user?.role === 'admin'
    ? [{ to: '/admin', label: 'Dashboard', icon: Shield }]
    : [];

  const NavItem = ({ item, isAdmin = false }) => {
    const Icon = item.icon;
    const active = location.pathname.startsWith(item.to);

    return (
      <Link
        to={item.to}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center justify-center h-11 w-11 rounded-xl border transition-all duration-200 ${
          isAdmin
            ? active
              ? adminActiveClasses
              : panelClasses
            : active
            ? activeClasses
            : panelClasses
        }`}
      >
        <Icon size={18} />
      </Link>
    );
  };

  const MobileNavItem = ({ item, isAdmin = false }) => {
    const Icon = item.icon;
    const active = location.pathname.startsWith(item.to);

    return (
      <Link
        to={item.to}
        className={`flex flex-col items-center justify-center flex-1 h-14 rounded-xl border transition-all ${
          isAdmin
            ? active
              ? adminActiveClasses
              : panelClasses
            : active
            ? activeClasses
            : panelClasses
        }`}
      >
        <Icon size={18} />
        <span className="text-[10px] mt-1">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col gap-3 border p-3 rounded-3xl w-[72px] lg:w-[80px] flex-shrink-0 shadow-xl ${sidebarClasses}`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 h-12 w-full">
          <span className="text-white font-bold text-lg">C</span>
        </div>

        {/* MAIN NAV */}
        <nav className="flex flex-col gap-2">
          {mainNavItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* DIVIDER */}
        <div className="h-px bg-white/10" />

        {/* SETTINGS */}
        <nav className="flex flex-col gap-2">
          {settingsNavItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
          {adminNavItems.map((item) => (
            <NavItem key={item.to} item={item} isAdmin />
          ))}
        </nav>

        {/* BOTTOM */}
        <div className="mt-auto flex flex-col gap-2 pt-3">

          {/* THEME */}
          <div className="relative">
            <button
              onClick={() => setExpandedMenu(!expandedMenu)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                expandedMenu ? activeClasses : panelClasses
              }`}
            >
              {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
            </button>

            {expandedMenu && (
              <div className="absolute bottom-14 left-0 flex flex-col gap-2 p-2 rounded-xl border bg-slate-900 shadow-xl">
                {['dark', 'ocean', 'rose'].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      onThemeSelect?.(t);
                      setExpandedMenu(false);
                    }}
                    className={`h-9 w-9 rounded-lg ${
                      theme === t ? 'bg-yellow-400/20' : panelClasses
                    }`}
                  >
                    {t === 'dark' ? '🌙' : t === 'ocean' ? '🌊' : '🌹'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${panelClasses}`}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      {showMobileBottomNav && (
        <nav
          className={`fixed bottom-0 left-0 right-0 z-50 flex gap-2 border-t p-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden ${
            isDark
              ? 'border-white/10 bg-slate-900/95'
              : 'border-slate-200 bg-white/95'
          }`}
        >
          {mobileBottomItems.map((item) => (
            <MobileNavItem key={item.to} item={item} />
          ))}
        </nav>
      )}
    </>
  );
};

export default Sidebar;
