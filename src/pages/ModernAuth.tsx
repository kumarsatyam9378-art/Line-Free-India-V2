import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

interface ModernAuthProps {
  mode: 'customer' | 'business';
}

export default function ModernAuth({ mode }: ModernAuthProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user, setRole } = useApp();
  const nav = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (user) {
      const destination = mode === 'business' ? '/barber/home' : '/customer/home';
      nav(destination, { replace: true });
    }
  }, [user, mode, nav]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      setRole(mode);
      const destination = mode === 'business' ? '/barber/setup' : '/customer/setup';
      nav(destination, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    if (isSignUp && !username) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        const result = await signUpWithEmail(email, password);
        if (result?.user) {
          await result.user.updateProfile({ displayName: username });
        }
      } else {
        await signInWithEmail(email, password);
      }
      setRole(mode);
      const destination = mode === 'business' ? '/barber/setup' : '/customer/setup';
      nav(destination, { replace: true });
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please sign in.');
      } else if (err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else {
        setError(err?.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchPanel = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setError('');
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: '#000000' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-10%', '10%', '-10%'],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            top: '-10%',
            left: '-10%',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{
            x: ['20%', '-20%', '20%'],
            y: ['10%', '-10%', '10%'],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            bottom: '-10%',
            right: '-10%',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto px-6"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 0 40px rgba(16,185,129,0.2)',
          }}
        >
          <Sparkles className="w-10 h-10 text-emerald-400" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black mb-2" style={{ 
            background: 'linear-gradient(135deg, #FFFFFF, #10B981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            {mode === 'business' ? 'Business Portal' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            {mode === 'business' ? 'Manage your beauty business' : 'Skip every queue, instantly'}
          </p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-2xl text-center text-sm font-semibold"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#EF4444',
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Sliding Form Panels */}
          <div className="relative overflow-hidden">
            <motion.div
              animate={{ x: isSignUp ? '-100%' : '0%' }}
              transition={{ duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] }}
              className="flex w-[200%]"
            >
              {/* Sign In Panel */}
              <div className="w-1/2 flex-shrink-0">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {/* Email Input */}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="email"
                      placeholder=" "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all peer"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    />
                    <label
                      className="absolute left-12 top-1/2 -translate-y-1/2 text-sm text-zinc-500 transition-all duration-200 pointer-events-none
                        peer-focus:top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-black peer-focus:px-2
                        peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-400 peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-2"
                    >
                      Email Address
                    </label>
                  </div>

                  {/* Password Input */}
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="password"
                      placeholder=" "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all peer"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    />
                    <label
                      className="absolute left-12 top-1/2 -translate-y-1/2 text-sm text-zinc-500 transition-all duration-200 pointer-events-none
                        peer-focus:top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-black peer-focus:px-2
                        peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-400 peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-2"
                    >
                      Password
                    </label>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || isTransitioning}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: '#FFFFFF',
                      boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
                    }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Sign Up Panel */}
              <div className="w-1/2 flex-shrink-0">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {/* Username Input */}
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="text"
                      placeholder=" "
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all peer"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    />
                    <label
                      className="absolute left-12 top-1/2 -translate-y-1/2 text-sm text-zinc-500 transition-all duration-200 pointer-events-none
                        peer-focus:top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-black peer-focus:px-2
                        peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-400 peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-2"
                    >
                      Username
                    </label>
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="email"
                      placeholder=" "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all peer"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    />
                    <label
                      className="absolute left-12 top-1/2 -translate-y-1/2 text-sm text-zinc-500 transition-all duration-200 pointer-events-none
                        peer-focus:top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-black peer-focus:px-2
                        peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-400 peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-2"
                    >
                      Email Address
                    </label>
                  </div>

                  {/* Password Input */}
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="password"
                      placeholder=" "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all peer"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    />
                    <label
                      className="absolute left-12 top-1/2 -translate-y-1/2 text-sm text-zinc-500 transition-all duration-200 pointer-events-none
                        peer-focus:top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-black peer-focus:px-2
                        peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-400 peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-2"
                    >
                      Password
                    </label>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || isTransitioning}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: '#FFFFFF',
                      boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
                    }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
          </div>

          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#FFFFFF',
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-emerald-400 rounded-full animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </>
            )}
          </motion.button>

          {/* Switch Panel Button */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={switchPanel}
              disabled={isTransitioning}
              className="text-sm font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-xs text-zinc-600 font-medium"
        >
          Protected by Line Free Security
        </motion.p>
      </motion.div>
    </div>
  );
}
