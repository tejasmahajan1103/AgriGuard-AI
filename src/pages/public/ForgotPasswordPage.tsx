import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'request' | 'confirm' | 'success'>('request');
  const [error, setError] = useState('');
  const { forgotPassword, confirmForgotPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      await forgotPassword(email.trim());
      setStep('confirm');
    } catch (err: any) {
      setError(err.message || 'Could not send reset code. Please try again.');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await confirmForgotPassword(email.trim(), code.trim(), newPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Could not reset password. Please try again.');
    }
  };

  if (step === 'success') {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 sm:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Reset Successful</h2>
        <p className="text-sm text-slate-500 mb-6">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Button onClick={() => navigate('/login')} className="w-full">
          Sign In Now
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {step === 'request' ? 'Forgot Password' : 'Reset Password'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {step === 'request'
            ? "Enter your email and we'll send you a password reset code."
            : `Enter the code sent to ${email} and your new password.`}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            autoComplete="email"
            required
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Reset Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleConfirmReset} className="space-y-4">
          <Input
            label="6-Digit Reset Code"
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="text-center font-mono text-lg tracking-widest"
            required
          />

          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
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

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
            required
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      )}

      <p className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </p>
    </div>
  );
}
