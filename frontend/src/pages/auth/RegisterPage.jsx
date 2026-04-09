import { LoaderCircle, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AuthShell from '../../components/AuthShell';
import FloatingInput from '../../components/FloatingInput';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      };
      const { data } = await api.post('/auth/register', payload);
      login(data);
      navigate(data.user.role === 'admin' ? '/admin' : '/chat');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      pushToast({ title: 'Unable to create account', description: message, tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Build your identity once, then move through the app with a polished, real-time iPhone-style experience."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-600 dark:text-sky-300">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={submit}>
        <FloatingInput
          label="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          icon={<UserRound size={18} />}
        />
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
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(135deg,_#22c55e,_#0ea5e9,_#2563eb)] text-sm font-semibold text-white shadow-[0_18px_44px_rgba(14,165,233,0.28)] transition disabled:opacity-70"
        >
          {submitting ? <LoaderCircle size={18} className="animate-spin" /> : <Sparkles size={18} />}
          <span>{submitting ? 'Creating account...' : 'Get Started'}</span>
        </motion.button>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
