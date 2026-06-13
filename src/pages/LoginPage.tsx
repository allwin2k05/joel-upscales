import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Film, ArrowRight, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true); // Default to Sign Up page first
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Holds email or username in Sign In mode
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, signUp, isLoggedIn } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && !isSuccess) {
      navigate('/');
    }
  }, [isLoggedIn, navigate, isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // Sign Up Validations
      if (!email.trim() || !password.trim() || !name.trim()) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 5) {
        setError('Password must be at least 5 characters');
        return;
      }

      setIsLoading(true);
      try {
        const res = await signUp(email, password, name);
        if (res.success) {
          setIsSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 1800);
        } else {
          setError(res.error || 'Failed to create an account.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred during sign up.');
      } finally {
        setIsLoading(false);
      }

    } else {
      // Sign In Validations
      if (!username.trim() || !password.trim()) {
        setError('Please fill in all fields');
        return;
      }

      setIsLoading(true);
      try {
        const res = await signIn(username, password);
        if (res.success) {
          setIsSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setError(res.error || 'Invalid credentials. Access Denied.');
        }
      } catch (err: any) {
        setError(err.message || 'Authentication error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleMode = () => {
    setError('');
    setIsSignUp(!isSignUp);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent text-white px-4 py-16">
      {/* Dynamic Animated Mesh Gradient Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/20 blur-[120px] animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse duration-[10000ms]" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Brand logo header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-red-600 to-purple-600 p-[2px] shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
              <Film className="h-8 w-8 text-red-500 animate-pulse" />
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Joel Upscales
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {isSignUp ? 'Create your premium account to get started' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {/* Shiny Glassmorphic Form Card */}
        <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden group">
          {/* Card Hover Glow Border */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-red-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {isSuccess ? (
            <div className="flex flex-col items-center py-10 text-center animate-fade-in">
              <div className="h-20 w-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-bounce mb-6">
                <ShieldCheck className="h-10 w-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? 'Account Created' : 'Access Granted'}
              </h2>
              <p className="text-green-400 font-medium text-sm animate-pulse mb-6">
                {isSignUp ? 'Setting up your catalog space. Redirecting...' : 'Welcome back. Redirecting to catalog...'}
              </p>
              <div className="w-12 h-1 border-t-2 border-green-500 rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert Box */}
              {error && (
                <div className="flex items-center space-x-2 bg-red-950/40 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm animate-shake">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {isSignUp ? (
                /* ================= SIGN UP FLOW ================= */
                <>
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Full Name
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg blur opacity-10 group-focus-within/input:opacity-30 transition-opacity duration-300" />
                      <div className="relative flex items-center bg-black/60 border border-white/10 focus-within:border-red-500/60 rounded-lg transition-colors duration-300">
                        <User className="h-5 w-5 text-gray-400 ml-3 shrink-0" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-transparent border-0 text-white placeholder-gray-500 py-3 px-3 focus:outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg blur opacity-10 group-focus-within/input:opacity-30 transition-opacity duration-300" />
                      <div className="relative flex items-center bg-black/60 border border-white/10 focus-within:border-red-500/60 rounded-lg transition-colors duration-300">
                        <Mail className="h-5 w-5 text-gray-400 ml-3 shrink-0" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-transparent border-0 text-white placeholder-gray-500 py-3 px-3 focus:outline-none text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* ================= SIGN IN FLOW ================= */
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email or Username
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg blur opacity-10 group-focus-within/input:opacity-30 transition-opacity duration-300" />
                    <div className="relative flex items-center bg-black/60 border border-white/10 focus-within:border-red-500/60 rounded-lg transition-colors duration-300">
                      <User className="h-5 w-5 text-gray-400 ml-3 shrink-0" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Email or admin username (joel/allwin)"
                        className="w-full bg-transparent border-0 text-white placeholder-gray-500 py-3 px-3 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password Input (Shared) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg blur opacity-10 group-focus-within/input:opacity-30 transition-opacity duration-300" />
                  <div className="relative flex items-center bg-black/60 border border-white/10 focus-within:border-red-500/60 rounded-lg transition-colors duration-300">
                    <Lock className="h-5 w-5 text-gray-400 ml-3 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-0 text-white placeholder-gray-500 py-3 px-3 focus:outline-none text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white px-3 focus:outline-none shrink-0"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Password (Sign Up Only) */}
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Confirm Password
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg blur opacity-10 group-focus-within/input:opacity-30 transition-opacity duration-300" />
                    <div className="relative flex items-center bg-black/60 border border-white/10 focus-within:border-red-500/60 rounded-lg transition-colors duration-300">
                      <Lock className="h-5 w-5 text-gray-400 ml-3 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-0 text-white placeholder-gray-500 py-3 px-3 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Credentials / Shortcuts metadata display */}
              {!isSignUp && (
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>Demo Admin credentials: joel/12345 or allwin/12345</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden group/btn bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-lg py-3.5 px-4 font-semibold text-sm shadow-[0_4px_20px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_30px_rgba(239,68,68,0.4)] disabled:opacity-50 transition-all duration-300 mt-2"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                
                <span className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {isSignUp ? 'Creating Space...' : 'Verifying clearance...'}
                    </>
                  ) : (
                    <>
                      {isSignUp ? 'Start Streaming Class' : 'Enter Authorized Deck'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              {/* Switch View Trigger */}
              <div className="pt-4 border-t border-white/5 text-center">
                <span className="text-xs text-gray-400">
                  {isSignUp ? 'Already have an account?' : 'New to Joel Upscales?'}
                  {' '}
                  <button
                    type="button"
                    onClick={handleToggleMode}
                    className="text-red-500 hover:text-red-400 transition-colors font-medium hover:underline focus:outline-none"
                  >
                    {isSignUp ? 'Sign In Now' : 'Sign Up Now'}
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
