import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(123,191,255,0.2),_transparent_24%),linear-gradient(170deg,_#050914_0%,_#0a1220_58%,_#050914_100%)]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 px-8 py-6 text-center text-white shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-sky-400" />
          <p className="text-sm font-medium">Warming up your workspace...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/chat" replace />;

  return children;
};

export default ProtectedRoute;
