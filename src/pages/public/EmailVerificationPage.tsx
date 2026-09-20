import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function EmailVerificationPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { verifyEmail, resendVerificationCode, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const pending = authService.getPendingEmail();
    if (pending) {
      setEmail(pending);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendStatus('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!code || code.trim().length < 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    try {
      await verifyEmail(code.trim(), email.trim());
      setVerified(true);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
    }
  };

  const handleResend = async () => {
    setError('');
    setResendStatus('');
    if (!email.trim()) {
      setError('Please enter your email address to resend the code.');
      return;
    }
    setIsResending(true);
    try {
      await resendVerificationCode(email.trim());
      setResendStatus('A new verification code has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Could not resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (verified) {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 sm:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Verified!</h2>
        <p className="text-sm text-slate-500 mb-6">
          Your email has been verified successfully. You can now sign in to your account.
        </p>
        <Button onClick={() => navigate('/login')} className="w-full">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 sm:p-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Verify Your Email</h2>
        <p className="text-sm text-slate-500 mt-1">
          {email ? (
            <>
              Enter the 6-digit verification code sent to{' '}
              <strong className="text-slate-700">{email}</strong>.
            </>
          ) : (
            'Enter your email and the 6-digit verification code below.'
          )}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {resendStatus && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          {resendStatus}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!authService.getPendingEmail() && (
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />
        )}

        <Input
          label="6-Digit Verification Code"
          type="text"
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          className="text-center text-xl font-mono tracking-widest"
          required
        />

        <Button type="submit" className="w-full" isLoading={isLoading && !isResending}>
          Verify Email
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-slate-500">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Resending...
              </>
            ) : (
              'Resend Code'
            )}
          </button>
        </p>
        <Link
          to="/login"
          className="inline-block text-sm text-slate-500 hover:text-slate-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
