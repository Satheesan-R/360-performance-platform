'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Brand from '@/components/Brand';
import FormField from '@/components/FormField';
import { apiRequest } from '@/lib/api';
import styles from './activate.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ActivateFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [step, setStep] = useState('checking');
  const [details, setDetails] = useState(null);
  const [otp, setOtp] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('The activation link is missing its token.');
      setStep('invalid');
      return;
    }
    apiRequest(`/auth/activation/${token}`)
      .then(({ data }) => {
        setDetails(data);
        setStep('ready');
      })
      .catch((requestError) => {
        setError(requestError.message);
        setStep('invalid');
      });
  }, [token]);

  async function sendOtp() {
    setLoading(true);
    setError('');
    try {
      await apiRequest(`/auth/activation/${token}/send-otp`, { method: 'POST' });
      setMessage(`We sent a 6-digit code to ${details.email}.`);
      setStep('otp');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await apiRequest(`/auth/activation/${token}/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({ otp }),
      });
      setSetupToken(data.setupToken);
      setStep('password');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function setPassword(event) {
    event.preventDefault();
    setError('');
    if (passwords.password !== passwords.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await apiRequest(`/auth/activation/${token}/set-password`, {
        method: 'POST',
        body: JSON.stringify({ setupToken, password: passwords.password }),
      });
      setStep('complete');
      setTimeout(() => router.push('/auth/login'), 1800);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  const stepNumber = step === 'ready' || step === 'otp' ? 1 : step === 'password' ? 2 : step === 'complete' ? 3 : 0;

  return (
    <main className={`${styles.blueActivation} activation-page`}>
      <Brand />
      <section className="activation-card">
        <div className="steps">
          {['Verify', 'Password', 'Complete'].map((label, index) => (
            <div className={stepNumber >= index + 1 ? 'step active' : 'step'} key={label}>
              <span>{stepNumber > index + 1 ? 'âœ“' : index + 1}</span><small>{label}</small>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {step === 'checking' && <div className="center-state"><span className="spinner" /><h2>Checking your invitation</h2></div>}
        {step === 'invalid' && <div className="center-state"><div className="state-icon danger">!</div><h2>Activation unavailable</h2><p>Ask your HR team to create a new invitation.</p></div>}
        {step === 'ready' && (
          <div className="center-state">
            <div className="state-icon">âœ¦</div>
            <span className="eyebrow">Welcome{details?.firstName ? `, ${details.firstName}` : ''}</span>
            <h2>Letâ€™s verify itâ€™s you</h2>
            <p>Weâ€™ll email a one-time verification code to {details?.email}.</p>
            <button className="button button-primary" onClick={sendOtp} disabled={loading}>{loading ? 'Sendingâ€¦' : 'Send verification code'}</button>
          </div>
        )}
        {step === 'otp' && (
          <form onSubmit={verifyOtp}>
            <span className="eyebrow">Email verification</span>
            <h2>Enter your 6-digit code</h2>
            <p>The code expires in 10 minutes.</p>
            <FormField label="Verification code" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="000000" className="otp-input" required />
            <button className="button button-primary button-block" disabled={loading || otp.length !== 6}>{loading ? 'Verifyingâ€¦' : 'Verify code'}</button>
            <button type="button" className="text-button" onClick={sendOtp} disabled={loading}>Send a new code</button>
          </form>
        )}
        {step === 'password' && (
          <form onSubmit={setPassword}>
            <span className="eyebrow">Secure your account</span>
            <h2>Create your password</h2>
            <p>Use at least 8 characters with uppercase, lowercase, and a number.</p>
            <label className="field">
              <span>New password</span>
              <div className="field-control">
                <input type={showPassword ? 'text' : 'password'} value={passwords.password} onChange={(event) => setPasswords({ ...passwords, password: event.target.value })} autoComplete="new-password" required />
                <button type="button" className="field-icon-button" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? 'Hide new password' : 'Show new password'} aria-pressed={showPassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <label className="field">
              <span>Confirm password</span>
              <div className="field-control">
                <input type={showConfirmation ? 'text' : 'password'} value={passwords.confirm} onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })} autoComplete="new-password" required />
                <button type="button" className="field-icon-button" onClick={() => setShowConfirmation(current => !current)} aria-label={showConfirmation ? 'Hide password confirmation' : 'Show password confirmation'} aria-pressed={showConfirmation}>
                  {showConfirmation ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <button className="button button-primary button-block" disabled={loading}>{loading ? 'Activatingâ€¦' : 'Activate account'}</button>
          </form>
        )}
        {step === 'complete' && (
          <div className="center-state"><div className="state-icon success">âœ“</div><span className="eyebrow">All done</span><h2>Your account is active</h2><p>Taking you to sign inâ€¦</p></div>
        )}
      </section>
    </main>
  );
}

export default function ActivatePage() {
  return <Suspense fallback={<div className="page-loader"><span className="spinner" />Loading invitationâ€¦</div>}><ActivateFlow /></Suspense>;
}


