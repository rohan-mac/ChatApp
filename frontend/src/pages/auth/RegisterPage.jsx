import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await client.post('/auth/register', form);
      login(data);
      navigate(data.user.role === 'admin' ? '/admin' : '/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto mt-24 max-w-md rounded-xl bg-slate-900 p-6">
      <h1 className="mb-4 text-2xl font-bold">Register</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full rounded bg-slate-800 p-2" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="w-full rounded bg-emerald-600 p-2 font-semibold">Register</button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-emerald-400">Login</Link></p>
    </div>
  );
};

export default RegisterPage;
