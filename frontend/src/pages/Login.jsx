import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  const handleFillDemo = () => {
    setEmail('demo@taskflow.pro');
    setPassword('welcome2024');
    setErrorMsg('');
  };

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary selection:text-white transition-colors duration-200">
      <main className="min-h-screen flex flex-col md:flex-row">
        
        {/* Left Panel: Brand & Immersive Content */}
        <section className="hidden md:flex md:w-1/2 lg:w-3/5 kinetic-gradient p-10 flex-col relative overflow-hidden text-on-primary">
          {/* Branding */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-10 h-10 bg-on-primary flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                insights
              </span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TaskFlow Pro</span>
          </div>

          {/* Hero Section */}
          <div className="relative z-10 mt-auto mb-auto max-w-xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
              The Ultimate Project Management Solution
            </h1>
            <p className="text-body-lg text-white/70 mb-8 max-w-lg">
              Stay organized, meet deadlines, and collaborate seamlessly—all in one high-performance executive dashboard.
            </p>
            
            {/* Glassmorphism Product Preview */}
            <div className="glass-panel rounded-xl p-4 shadow-2xl relative drift max-w-[480px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error opacity-50"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary-container opacity-50"></div>
                  <div className="w-3 h-3 rounded-full bg-on-surface-variant opacity-50"></div>
                </div>
                <div className="h-1.5 w-32 bg-on-primary/10 rounded-full"></div>
              </div>
              <div className="w-full rounded-lg border border-on-primary/10 bg-on-primary/5 p-6 flex items-center justify-center">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkxKTrXvrtEApeSnQypLUiGnRzbQqqlQsWQPCiIvPomDxRHybYf7d0n2MMgE-Nep1AyYb5r-ESpaxKqa4GrG10_T1-5u1HcqI5ilM-Ll9mBc1OhAd3Xn7EKdtYvUsX_YPJcNyc65ERNsMHpmZ6sGLA8dsU8SkFoJdX7V0nYHzPTf5Mm_Hy3Eco9Hd30N7tMrx9yJzsu70O4TYpUQuXdEM9cA34yBl8m6P_L7SoBsX1KjY8Ayc2LIh68ium79Bg1CcQfTPmByfEDFxv" 
                  alt="Team Collaboration Illustration" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="relative z-10 mt-auto grid grid-cols-3 gap-6 border-t border-on-primary/10 pt-6">
            <div className="flex flex-col gap-1">
              <span className="material-symbols-outlined text-white/50 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                group
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white">Real-time collaboration</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="material-symbols-outlined text-white/50 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                analytics
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white">Executive analytics</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="material-symbols-outlined text-white/50 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white">Seamless workflows</span>
            </div>
          </div>
        </section>

        {/* Right Panel: Auth Flow */}
        <section className="flex-1 bg-surface-container-lowest flex flex-col items-center justify-center p-6 min-h-screen">
          <div className="w-full max-w-[420px]">
            {/* Header */}
            <header className="mb-8 text-center md:text-left">
              <div className="md:hidden flex justify-center mb-6">
                <span className="text-2xl font-bold text-primary tracking-tight">TaskFlow Pro</span>
              </div>
              <h2 className="text-3xl font-bold text-on-surface mb-1">Welcome Back!</h2>
              <p className="text-body-sm text-on-surface-variant">
                Don't have an account? <span className="text-secondary font-medium hover:underline cursor-pointer">Create account</span>
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
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block" htmlFor="email">
                  Email Address
                </label>
                <input 
                  className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-body-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all outline-none" 
                  id="email" 
                  placeholder="Enter your email address" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block" htmlFor="password">
                    Password
                  </label>
                  <a className="text-xs text-secondary hover:underline" href="#">
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <input 
                    className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-body-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all outline-none pr-10" 
                    id="password" 
                    placeholder="Enter your password" 
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
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-semibold hover:bg-on-surface-variant active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center" 
                type="submit"
                disabled={loading || authLoading}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Log in'
                )}
              </button>
            </form>

            {/* Demo Credentials Card */}
            <div 
              onClick={handleFillDemo}
              className="mt-10 border border-secondary/20 bg-secondary/5 rounded-xl p-4 cursor-pointer hover:bg-secondary/10 transition-all duration-200"
              title="Click to autofill credentials"
            >
              <div className="flex items-center gap-2 mb-1.5 text-secondary">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  info
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">Demo Environment</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-3">
                Use the following credentials (click this card to autofill) to explore the platform immediately.
              </p>
              <div className="space-y-1">
                <div className="flex justify-between items-center py-1 border-b border-secondary/10">
                  <span className="text-xs text-on-surface-variant">Email</span>
                  <span className="text-xs font-semibold select-all text-on-surface">demo@taskflow.pro</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-on-surface-variant">Password</span>
                  <span className="text-xs font-semibold select-all text-on-surface">welcome2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <footer className="mt-auto pt-10 w-full max-w-[420px] flex flex-col md:flex-row justify-between items-center gap-2 opacity-60">
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
