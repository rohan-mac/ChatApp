import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './router/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ChatPage = lazy(() => import('./pages/chat/ChatPage'));
const ProfilePage = lazy(() => import('./pages/chat/ProfilePage'));
const UserSettingsPage = lazy(() => import('./pages/chat/SettingsPage'));
const CalendarPage = lazy(() => import('./pages/chat/CalendarPage'));
const CallsPage = lazy(() => import('./pages/chat/CallsPage'));
const ContactsPage = lazy(() => import('./pages/chat/ContactsPage'));
const NotificationsPage = lazy(() => import('./pages/chat/NotificationsPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const ChatsPage = lazy(() => import('./pages/admin/ChatsPage'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

const App = () => (
  <BrowserRouter>
    <Suspense
      fallback={(
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(123,191,255,0.2),_transparent_24%),linear-gradient(170deg,_#050914_0%,_#0a1220_58%,_#050914_100%)]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 px-8 py-6 text-white shadow-2xl backdrop-blur-2xl">
            Loading interface...
          </div>
        </div>
      )}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={(
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/profile"
          element={(
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/settings"
          element={(
            <ProtectedRoute>
              <UserSettingsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/calendar"
          element={(
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/calls"
          element={(
            <ProtectedRoute>
              <CallsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/contacts"
          element={(
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/notifications"
          element={(
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin"
          element={(
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="chats" element={<ChatsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
