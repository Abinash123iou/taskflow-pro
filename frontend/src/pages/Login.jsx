import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import collaborationIcon from '../assets/collaboration.png';
import analyticsIcon from '../assets/analytics.png';
import workflowIcon from '../assets/workflow.png';

const Login = () => {
  const { login, register, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (!username || !email || !password) {
        setErrorMsg('Please fill in all fields');
        return;
      }
      if (username.trim().length < 3) {
        setErrorMsg('Username must be at least 3 characters');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters');
        return;
      }
      setErrorMsg('');
      setLoading(true);
      const regResult = await register(username.trim(), email, password);
      if (regResult.success) {
        const logResult = await login(email, password);
        setLoading(false);
        if (logResult.success) {
          navigate('/dashboard');
        } else {
          setErrorMsg('Account created successfully! Please log in.');
          setIsRegistering(false);
        }
      } else {
        setLoading(false);
        setErrorMsg(regResult.message);
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Please fill in all fields');
        return;
      }
      setErrorMsg('');
      setLoading(true);
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMsg(result.message);
      }
    }
  };

  const handleFillDemo = () => {
    setIsRegistering(false);
    setEmail('demo@taskflow.pro');
    setPassword('welcome2024');
    setErrorMsg('');
  };

  const handleCreateAccount = () => {
    setIsRegistering(true);
    setErrorMsg('');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setErrorMsg('Password recovery is disabled in this demo environment.');
  };

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary selection:text-white transition-colors duration-200">
      <main className="min-h-screen flex flex-col md:flex-row">

        {/* Left Panel: Brand & Immersive Content */}
        <section className="hidden md:flex md:w-1/2 lg:w-3/5 bg-[#020617] p-6 lg:p-8 flex-col justify-between relative overflow-hidden text-on-primary">
          {/* Branding */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src={logo}
                alt="TaskFlow Pro Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TaskFlow Pro</span>
          </div>

          {/* Hero Section */}
          <div className="relative z-10 my-6 max-w-2xl">
            <h1 className="text-4xl lg:text-[44px] font-bold mb-4 leading-tight text-white">
              The Ultimate Project Management Solution
            </h1>
            <p className="text-sm text-white/70 mb-8 max-w-lg">
              Stay organized, meet deadlines, and collaborate seamlessly—all in one high-performance executive dashboard.
            </p>

            {/* Dark Mockup Browser Preview */}
            <div className="bg-[#0f172a] border border-white/10 rounded-xl p-3 shadow-2xl relative max-w-[600px] w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                </div>
              </div>
              <div className="w-full rounded bg-white p-4 flex items-center justify-center">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkxKTrXvrtEApeSnQypLUiGnRzbQqqlQsWQPCiIvPomDxRHybYf7d0n2MMgE-Nep1AyYb5r-ESpaxKqa4GrG10_T1-5u1HcqI5ilM-Ll9mBc1OhAd3Xn7EKdtYvUsX_YPJcNyc65ERNsMHpmZ6sGLA8dsU8SkFoJdX7V0nYHzPTf5Mm_Hy3Eco9Hd30N7tMrx9yJzsu70O4TYpUQuXdEM9cA34yBl8m6P_L7SoBsX1KjY8Ayc2LIh68ium79Bg1CcQfTPmByfEDFxv"
                  alt="Team Collaboration Illustration"
                  className="w-full max-h-[250px] lg:max-h-[300px] object-contain"
                />
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="relative z-10 flex justify-between items-center border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <img
                src={collaborationIcon}
                alt="Real-time collaboration"
                className="w-7 h-7 object-contain"
              />
              <span className="text-xs font-semibold tracking-wide text-white/80">Real-time collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={analyticsIcon}
                alt="Executive analytics"
                className="w-7 h-7 object-contain"
              />
              <span className="text-xs font-semibold tracking-wide text-white/80">Executive analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={workflowIcon}
                alt="Seamless workflows"
                className="w-7 h-7 object-contain"
              />
              <span className="text-xs font-semibold tracking-wide text-white/80">Seamless workflows</span>
            </div>
          </div>
        </section>

        {/* Right Panel: Auth Flow */}
        <section className="flex-1 bg-surface-container-lowest flex flex-col items-center justify-between p-10 min-h-screen">
          <div className="my-auto w-full max-w-[420px]">
            {/* Header */}
            <header className="mb-8 text-center md:text-left">
              <div className="md:hidden flex justify-center items-center gap-2 mb-6">
                <img
                  src={logo}
                  alt="TaskFlow Pro Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-2xl font-bold text-primary tracking-tight">TaskFlow Pro</span>
              </div>
              <h2 className="text-3xl font-bold text-on-surface mb-1">
                {isRegistering ? 'Create Account' : 'Welcome Back!'}
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                {isRegistering ? (
                  <>
                    Already have an account?{' '}
                    <span
                      onClick={() => { setIsRegistering(false); setErrorMsg(''); }}
                      className="text-secondary font-medium hover:underline cursor-pointer"
                    >
                      Log in
                    </span>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <span
                      onClick={handleCreateAccount}
                      className="text-secondary font-medium hover:underline cursor-pointer"
                    >
                      Create account
                    </span>
                  </>
                )}
              </p>
            </header>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-3 bg-error-container text-on-error-container rounded-lg text-xs font-semibold border border-error/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs text-on-surface-variant block" htmlFor="username">
                    Username:
                  </label>
                  <input
                    className="w-full bg-white dark:bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all outline-none"
                    id="username"
                    placeholder="Enter your username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-on-surface-variant block" htmlFor="email">
                  Email Address:
                </label>
                <input
                  className="w-full bg-white dark:bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all outline-none"
                  id="email"
                  placeholder="Enter your email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-on-surface-variant block" htmlFor="password">
                    Password:
                  </label>
                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-secondary hover:underline cursor-pointer bg-transparent border-none p-0 outline-none"
                    >
                      Forgot your password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    className="w-full bg-white dark:bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all outline-none pr-10"
                    id="password"
                    placeholder={isRegistering ? 'Create a password (min 6 characters)' : 'Enter your password'}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#0B0F19] dark:bg-[#1D4ED8] dark:hover:bg-[#2563EB] dark:active:bg-[#1E40AF] dark:border dark:border-[#60A5FA]/20 text-white disabled:opacity-50 py-3 rounded-lg font-bold active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
                type="submit"
                disabled={loading || authLoading}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  isRegistering ? 'Create account' : 'Log in'
                )}
              </button>
            </form>

            {/* Demo Credentials Card */}
            {!isRegistering && (
              <div
                onClick={handleFillDemo}
                className="mt-10 border border-[#dee0fc] dark:border-outline-variant bg-[#f4f5ff] dark:bg-surface rounded-xl p-4 cursor-pointer hover:bg-[#eaeaff] dark:hover:bg-surface-variant transition-all duration-200"
                title="Click to autofill credentials"
              >
                <div className="flex items-center gap-2 mb-1.5 text-secondary">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    info
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">Demo Environment</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-3">
                  Use the following credentials to explore the platform immediately without registration.
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center py-1 border-b border-[#eaeaff] dark:border-outline-variant">
                    <span className="text-xs text-on-surface-variant">Email</span>
                    <span className="text-xs font-semibold select-all text-on-surface">demo@taskflow.pro</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-on-surface-variant">Password</span>
                    <span className="text-xs font-semibold select-all text-on-surface">welcome2024</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Links */}
          <footer className="mt-10 w-full max-w-[420px] flex flex-col md:flex-row justify-between items-center gap-2 opacity-60">
            <span className="text-xs text-on-surface-variant">© 2026 TaskFlow Pro.</span>
            <div className="flex gap-4">
              <a className="text-xs text-on-surface-variant hover:text-primary" href="#">Privacy Policy</a>
              <a className="text-xs text-on-surface-variant hover:text-primary" href="#">Terms of Service</a>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default Login;
