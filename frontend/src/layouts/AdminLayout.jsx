import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr] bg-slate-950 text-slate-100">
      <aside className="border-r border-slate-800 p-4">
        <h1 className="mb-6 text-xl font-bold">Admin Panel</h1>
        <nav className="space-y-2 text-sm">
          <Link className="block rounded bg-slate-900 p-2" to="/admin">Dashboard</Link>
          <Link className="block rounded bg-slate-900 p-2" to="/admin/users">Users</Link>
          <Link className="block rounded bg-slate-900 p-2" to="/admin/chats">Chats</Link>
          <Link className="block rounded bg-slate-900 p-2" to="/admin/reports">Reports</Link>
          <Link className="block rounded bg-slate-900 p-2" to="/admin/settings">Settings</Link>
        </nav>
        <button onClick={logout} className="mt-8 text-sm text-red-400">Logout</button>
      </aside>
      <section className="p-6">
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;
