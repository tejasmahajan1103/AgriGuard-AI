import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password.';
      setError(msg);
      if (msg.toLowerCase().includes('not been verified') || msg.toLowerCase().includes('verification code')) {
        authService.setPendingEmail(email);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
        <p className="text-sm text-slate-500 mt-1">Sign in to your AgriGuard AI account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <p>{error}</p>
          {(error.toLowerCase().includes('not been verified') || error.toLowerCase().includes('verification code')) && (
            <Link
              to="/verify-email"
              className="mt-1.5 inline-block text-xs font-semibold text-emerald-700 underline hover:text-emerald-800"
            >
              Enter verification code →
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold">
          Sign up
        </Link>
      </p>
    </div>
  );
}
