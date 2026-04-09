import { LoaderCircle, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AuthShell from '../../components/AuthShell';
import FloatingInput from '../../components/FloatingInput';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password
      };
      const { data } = await api.post('/auth/login', payload);
      login(data);
      navigate(data.user.role === 'admin' ? '/admin' : '/chat');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      pushToast({ title: 'Unable to sign in', description: message, tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to your premium messaging workspace. The frontend is configured for the deployed Render backend and waits gracefully through cold starts."
      footer={
        <p>
          New here?{' '}
          <Link to="/register" className="font-semibold text-sky-600 dark:text-sky-300">
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={submit}>
        <FloatingInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          icon={<Mail size={18} />}
        />
        <FloatingInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          icon={<LockKeyhole size={18} />}
          rightAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-300"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />

        {error ? <p className="px-1 text-sm text-rose-500 dark:text-rose-300">{error}</p> : null}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.985 }}
          disabled={submitting}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(135deg,_#0ea5e9,_#2563eb,_#6366f1)] text-sm font-semibold text-white shadow-[0_18px_44px_rgba(37,99,235,0.28)] transition disabled:opacity-70"
        >
          {submitting ? <LoaderCircle size={18} className="animate-spin" /> : <Sparkles size={18} />}
          <span>{submitting ? 'Connecting...' : 'Sign In'}</span>
        </motion.button>

        <p className="px-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          If the Render server is waking up, the app retries automatically before showing an error.
        </p>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
