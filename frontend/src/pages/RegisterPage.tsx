import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Compass, Lock, Mail, User, Phone, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'TOURIST';

  const { register } = useAuth();
  const [role, setRole] = useState<'TOURIST' | 'SERVICE_PROVIDER'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const newUser = await register({
        name,
        email,
        password,
        role,
        phone,
        bio,
      });

      if (newUser.role === 'SERVICE_PROVIDER') {
        navigate('/provider/dashboard');
      } else {
        navigate('/tourist/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
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
          <h2 className="text-2xl font-bold font-serif text-stone-900">Create Account</h2>
          <p className="text-xs text-stone-500">Join our community of mindful travelers, hosts, and guides.</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('TOURIST')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              role === 'TOURIST'
                ? 'bg-white text-forest shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            I am a Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole('SERVICE_PROVIDER')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              role === 'SERVICE_PROVIDER'
                ? 'bg-white text-forest shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            I am a Host / Guide
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Patel"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password (min 6 characters)</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
              />
            </div>
          </div>

          {role === 'SERVICE_PROVIDER' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">About Your Hosting Experience</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell travelers about your heritage home, guiding background, or local artisan guild..."
                className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
              />
            </div>
          )}

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
                Registering...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-forest hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
