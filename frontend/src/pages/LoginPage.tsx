import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Compass, Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (loggedInUser.role === 'SERVICE_PROVIDER') {
        navigate('/provider/dashboard');
      } else {
        navigate(redirect || '/tourist/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/80 shadow-xl p-8 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5 text-cream-100" />
            </div>
            <span className="text-xl font-bold font-serif text-forest">
              Explore<span className="text-earth-600">Local</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-serif text-stone-900">Welcome Back</h2>
          <p className="text-xs text-stone-500">Sign in to manage bookings, homestays, and regional experiences.</p>
        </div>

        {/* Demo Fast Login Shortcuts */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block text-center">
            ⚡ Quick Demo Accounts (Click to Fill)
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('tourist@explorelocal.com', 'tourist123')}
              className="py-1.5 px-2 bg-white rounded-lg border border-stone-200 text-[11px] font-bold text-stone-700 hover:border-forest hover:text-forest transition"
            >
              Tourist
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('kerala.homestay@explorelocal.com', 'provider123')}
              className="py-1.5 px-2 bg-white rounded-lg border border-stone-200 text-[11px] font-bold text-purple-700 hover:border-purple-600 transition"
            >
              Provider
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@explorelocal.com', 'admin123')}
              className="py-1.5 px-2 bg-white rounded-lg border border-stone-200 text-[11px] font-bold text-stone-900 hover:border-black transition"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">Password</label>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-forest text-white font-bold hover:bg-forest-700 transition shadow-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-forest hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};
