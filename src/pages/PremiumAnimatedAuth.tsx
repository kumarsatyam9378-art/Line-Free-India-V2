import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { triggerHaptic } from '../utils/haptics';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export interface PremiumAnimatedAuthProps {
  mode: 'customer' | 'business';
}

const inp: React.CSSProperties = {
  width: '100%',
  padding: '13px 14px',
  background: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  borderRadius: 12,
  fontSize: 16,
  color: 'var(--color-text)',
  outline: 'none',
  fontFamily: 'inherit',
};

export default function PremiumAnimatedAuth({ mode }: PremiumAnimatedAuthProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, setRole } = useApp();
  const nav = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bizName, setBizName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  const isCustomer = mode === 'customer';
  const title = isSignUp
    ? (isCustomer ? 'Create account' : 'Register business')
    : 'Welcome back';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setError('');
    try {
      const cred = await signInWithEmail(email, password);
      setRole(mode);
      await new Promise(r => setTimeout(r, 100));
      triggerHaptic('success');
      if (isCustomer) {
        nav('/customer/home', { replace: true });
      } else {
        const u = cred?.user || auth.currentUser;
        if (u) {
          const snap = await getDoc(doc(db, 'barbers', u.uid));
          nav(snap.exists() ? '/barber/home' : '/barber/setup', { replace: true });
        } else {
          nav('/barber/setup', { replace: true });
        }
      }
    } catch (err: any) {
      triggerHaptic('error');
      setError(['auth/wrong-password','auth/user-not-found'].includes(err.code)
        ? 'Invalid email or password.' : err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!isCustomer && !bizName.trim()) { setError('Please enter your business name.'); return; }
    setLoading(true); setError('');
    try {
      const result = await signUpWithEmail(email, password);
      if (result?.user && !isCustomer) await result.user.updateProfile({ displayName: bizName });
      setRole(mode);
      await new Promise(r => setTimeout(r, 100));
      triggerHaptic('success');
      nav(isCustomer ? '/customer/setup' : '/barber/setup', { replace: true });
    } catch (err: any) {
      triggerHaptic('error');
      setError(err.code === 'auth/email-already-in-use'
        ? 'Email already in use. Try signing in.' : err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    if (loading) return;
    setLoading(true); setError('');
    try {
      const cred = await signInWithGoogle();
      setRole(mode);
      await new Promise(r => setTimeout(r, 500));
      triggerHaptic('success');
      const u = cred?.user || auth.currentUser;
      if (u) {
        const col = isCustomer ? 'customers' : 'barbers';
        const snap = await getDoc(doc(db, col, u.uid));
        const fallback = isCustomer ? '/customer/setup' : '/barber/setup';
        const home    = isCustomer ? '/customer/home'  : '/barber/home';
        nav(snap.exists() ? home : fallback, { replace: true });
      } else {
        nav(isCustomer ? '/customer/setup' : '/barber/setup', { replace: true });
      }
    } catch (err: any) {
      triggerHaptic('error');
      setError(err.code === 'auth/popup-closed-by-user'
        ? 'Sign-in cancelled.' : err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || resetSent) return;
    if (!forgotEmail.trim()) { setError('Enter your email.'); return; }
    setLoading(true); setError('');
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setResetSent(true);
      triggerHaptic('success');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--color-card)',
        borderBottom: '1px solid var(--color-separator)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          onClick={() => { if (showForgot) { setShowForgot(false); setResetSent(false); } else nav(-1); }}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', color: 'var(--color-primary)', fontSize: 15, fontWeight: 500 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
          {isCustomer ? '👤 Customer' : '🏪 Business'}
        </span>
        <div style={{ width: 56 }} />
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* Logo */}
          <div style={{
            width: 56, height: 56, background: 'var(--color-primary)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24, boxShadow: '0 4px 16px rgba(0,122,255,0.25)',
          }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -2 }}>L</span>
          </div>

          {showForgot ? (
            <>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, letterSpacing: -0.5 }}>Reset Password</h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-dim)', marginBottom: 28 }}>
                Enter your email and we'll send a reset link.
              </p>
              {resetSent ? (
                <div style={{
                  padding: '16px', background: 'rgba(52,199,89,0.1)',
                  borderRadius: 12, border: '1px solid rgba(52,199,89,0.3)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-success)', marginBottom: 6 }}>
                    ✓ Email sent!
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>
                    Check {forgotEmail} for the reset link.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {error && <p style={{ fontSize: 13, color: 'var(--color-danger)', marginBottom: 4 }}>{error}</p>}
                  <input style={inp} type="email" placeholder="Email" value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)} required disabled={loading} />
                  <button type="submit" disabled={loading} style={{
                    padding: '14px', background: 'var(--color-primary)', color: '#fff',
                    borderRadius: 14, fontSize: 16, fontWeight: 600, opacity: loading ? 0.6 : 1,
                  }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, letterSpacing: -0.5 }}>
                {title}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-dim)', marginBottom: 28 }}>
                {isSignUp ? 'Join Line Free India today.' : 'Sign in to your account.'}
              </p>

              {error && (
                <div style={{
                  padding: '10px 14px', background: 'rgba(255,59,48,0.1)',
                  border: '1px solid rgba(255,59,48,0.3)', borderRadius: 10,
                  marginBottom: 16, fontSize: 13, color: 'var(--color-danger)',
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={isSignUp ? handleSignUp : handleSignIn}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {isSignUp && !isCustomer && (
                  <input style={inp} type="text" placeholder="Business name" value={bizName}
                    onChange={e => setBizName(e.target.value)} required disabled={loading} />
                )}
                <input style={inp} type="email" placeholder="Email" value={email}
                  onChange={e => setEmail(e.target.value)} required disabled={loading} />
                <input style={inp} type="password" placeholder="Password" value={password}
                  onChange={e => setPassword(e.target.value)} required disabled={loading} />

                {!isSignUp && (
                  <button type="button" onClick={() => { setShowForgot(true); setError(''); }}
                    style={{ background: 'none', color: 'var(--color-primary)', fontSize: 14, fontWeight: 500, textAlign: 'right', padding: 0 }}>
                    Forgot password?
                  </button>
                )}

                <button type="submit" disabled={loading} style={{
                  padding: '14px', background: 'var(--color-primary)', color: '#fff',
                  borderRadius: 14, fontSize: 16, fontWeight: 600,
                  opacity: loading ? 0.6 : 1, marginTop: 4,
                }}>
                  {loading ? (isSignUp ? 'Creating...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
                </button>
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--color-separator)' }} />
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'var(--color-separator)' }} />
              </div>

              {/* Google */}
              <button onClick={handleGoogle} disabled={loading} style={{
                width: '100%', padding: '13px',
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 14, fontSize: 15, fontWeight: 500,
                color: 'var(--color-text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Toggle */}
              <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-dim)', marginTop: 24 }}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                  style={{ background: 'none', color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
