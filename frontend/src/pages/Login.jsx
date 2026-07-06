import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (email && password) {
        const data = await login(email, password);
        onLogin(data.token, data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F4F0] text-slate-900 flex flex-col">
      <div className="-mb-12">
        <SiteHeader 
          title="Login to the contract management area" 
        />
      </div>
      <main className="flex-grow flex items-center justify-center p-6 -mt-12">
        <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-glow border border-slate-200">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold font-display text-slate-950">Login</h2>
            <p className="mt-2 text-sm text-slate-500">
              Please enter your credentials to access the management area.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Email Address</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder="directeur@tescagroup.com"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder="••••••••"
              />
            </label>

            <button 
              type="submit" 
              className="mt-2 w-full rounded-2xl bg-[#181818] px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              login
            </button>
            
            <p className="text-xs text-center text-slate-500 mt-2">
              Don't have an account? Please contact the administrator.
            </p>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default Login;
