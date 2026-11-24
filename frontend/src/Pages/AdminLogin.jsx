import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { adminLogin } from '../api';
import './AdminLogin.css';

const companyLogoImg = '/Pictures/Logo-0.png';  
const loginBgImg = '/Pictures/loginbanner.jpg';     // <-- e.g. '/images/login-bg.jpg'

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Already login irundha direct-aa Dashboard-ku pogum
  useEffect(() => {
    if (localStorage.getItem('admin_access_token')) {
      navigate('/admin-dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminLogin({ username: identifier.trim(), password });
      localStorage.setItem('admin_access_token', res.data.access);
      localStorage.setItem('admin_user', JSON.stringify(res.data.user));
      navigate('/admin-dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page-shell w-full min-h-[84vh] py-12 px-4 flex items-center justify-center">

      {/* Background Image Slot (Image path kudutha udane full screen-la load aagum) */}
      {loginBgImg && (
        <img
          src={loginBgImg}
          alt="Cognisphere HSE Consultancy Background"
          className="login-bg-img"
        />
      )}
      <div className="login-bg-overlay" aria-hidden="true" />

      {/* Centered Clean Login Card */}
      <div className="login-glass-card rounded-3xl max-w-[430px] w-full p-7 sm:p-10">

        {/* Centered Prominent Company Logo */}
        <div className="flex justify-center mb-5">
            <img
              src={companyLogoImg}
              alt="Cognisphere Logo"
              className="h-16 sm:h-20 w-auto max-w-[240px] object-contain"
            />
        </div>

        {/* Minimal Heading + Single Note */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#211859] tracking-tight">
            Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enter your email and password to login
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email / Username : info@cognispheremc.com */}
          <div className="relative">
            <Mail className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email Address or Username"
              className="login-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
            />
          </div>

          {/* Password  : user123@ */}
          <div className="relative">
            <Lock className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="login-input w-full pl-10 pr-11 py-3 rounded-xl text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#211859] cursor-pointer"
              aria-label="Toggle Password"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="brand-glow-btn w-full py-3.5 rounded-xl text-sm font-semibold gap-2 cursor-pointer disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Logging in...' : 'Login'}</span>
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#a62675] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

      </div>
    </section>
  );
}