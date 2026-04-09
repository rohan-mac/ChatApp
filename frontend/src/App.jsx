import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './router/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ChatPage = lazy(() => import('./pages/chat/ChatPage'));
const ProfilePage = lazy(() => import('./pages/chat/ProfilePage'));
const UserSettingsPage = lazy(() => import('./pages/chat/SettingsPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const ChatsPage = lazy(() => import('./pages/admin/ChatsPage'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<div className="p-10">Loading...</div>}>
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
