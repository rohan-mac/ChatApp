// import { LoaderCircle, LockKeyhole, Mail, Sparkles } from 'lucide-react';
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import api from '../../services/api';
// import AuthShell from '../../components/AuthShell';
// import FloatingInput from '../../components/FloatingInput';
// import { useAuth } from '../../context/AuthContext';
// import { useToast } from '../../context/ToastContext';

// const LoginPage = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const { login } = useAuth();
//   const { pushToast } = useToast();
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSubmitting(true);
//     try {
//       const payload = {
//         email: form.email.trim().toLowerCase(),
//         password: form.password
//       };
//       const { data } = await api.post('/auth/login', payload);
//       login(data);
//       navigate(data.user.role === 'admin' ? '/admin' : '/chat');
//     } catch (err) {
//       const message = err.response?.data?.message || 'Login failed';
//       setError(message);
//       pushToast({ title: 'Unable to sign in', description: message, tone: 'error' });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <AuthShell
//       title="Welcome Back"
//       subtitle="Sign in to your premium messaging workspace. The frontend is configured for the deployed Render backend and waits gracefully through cold starts."
//       footer={
//         <p>
//           New here?{' '}
//           <Link to="/register" className="font-semibold text-sky-600 dark:text-sky-300">
//             Create an account
//           </Link>
//         </p>
//       }
//     >
//       <form className="space-y-4" onSubmit={submit}>
//         <FloatingInput
//           label="Email"
//           type="email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           icon={<Mail size={18} />}
//         />
//         <FloatingInput
//           label="Password"
//           type={showPassword ? 'text' : 'password'}
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           icon={<LockKeyhole size={18} />}
//           rightAdornment={
//             <button
//               type="button"
//               onClick={() => setShowPassword((current) => !current)}
//               className="text-xs font-semibold text-slate-500 dark:text-slate-300"
//             >
//               {showPassword ? 'Hide' : 'Show'}
//             </button>
//           }
//         />

//         {error ? <p className="px-1 text-sm text-rose-500 dark:text-rose-300">{error}</p> : null}

//         <motion.button
//           type="submit"
//           whileHover={{ scale: 1.01 }}
//           whileTap={{ scale: 0.985 }}
//           disabled={submitting}
//           className="flex h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(135deg,_#0ea5e9,_#2563eb,_#6366f1)] text-sm font-semibold text-white shadow-[0_18px_44px_rgba(37,99,235,0.28)] transition disabled:opacity-70"
//         >
//           {submitting ? <LoaderCircle size={18} className="animate-spin" /> : <Sparkles size={18} />}
//           <span>{submitting ? 'Connecting...' : 'Sign In'}</span>
//         </motion.button>

//         <p className="px-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
//           If the Render server is waking up, the app retries automatically before showing an error.
//         </p>
//       </form>
//     </AuthShell>
//   );
// };

// export default LoginPage;


import { LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
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
      pushToast({ title: 'Login failed', description: message, tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back 👋"
      subtitle="Login to continue chatting"
      footer={
        <p className="text-sm">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      }
    >
      <form
        onSubmit={submit}
        className="space-y-4 sm:space-y-5"
      >
        {/* EMAIL */}
        <FloatingInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          icon={<Mail size={18} />}
        />

        {/* PASSWORD */}
        <FloatingInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          icon={<LockKeyhole size={18} />}
          rightAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-white transition"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />

        {/* ERROR */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-400/30 px-3 py-2 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          disabled={submitting}
          className="w-full h-12 sm:h-14 rounded-2xl font-semibold text-white 
          bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
          shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : null}
          {submitting ? 'Signing in...' : 'Sign In'}
        </motion.button>

        {/* SMALL TEXT */}
        <p className="text-xs text-center text-slate-500">
          Secure login • Fast access
        </p>
      </form>
    </AuthShell>
  );
};

export default LoginPage;