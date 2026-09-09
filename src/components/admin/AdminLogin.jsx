import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowLeft,
  KeyRound,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw,
  Check
} from 'lucide-react';

export const AdminLogin = ({ onLoginSuccess, onBackToForm }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'change_password'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Get active password (defaults to admin@2026 if not set)
  const getStoredPassword = () => {
    return localStorage.getItem('admin_custom_password') || 'admin@2026';
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setError('कृपया यूजरनेम और पासवर्ड दोनों दर्ज करें। (Please enter both username and password)');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const activePassword = getStoredPassword();
      if (username.trim() === 'admin' && password === activePassword) {
        onLoginSuccess();
      } else {
        setError(`अमान्य क्रेडेंशियल्स! (Invalid credentials). ${activePassword === 'admin@2026' ? 'डेमो लॉगिन के लिए "डेमो एडमिन भरें" पर क्लिक करें।' : 'कृपया नया सेट किया गया पासवर्ड दर्ज करें।'}`);
        setLoading(false);
      }
    }, 500);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const activePassword = getStoredPassword();

    if (!currentPassword.trim()) {
      setError('वर्तमान पासवर्ड दर्ज करना अनिवार्य है। (Current password is required)');
      return;
    }
    if (currentPassword !== activePassword) {
      setError('वर्तमान पासवर्ड गलत है! (Current password is incorrect)');
      return;
    }
    if (!newPassword.trim() || newPassword.length < 6) {
      setError('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए। (New password must be at least 6 characters)');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खा रहे हैं। (Passwords do not match)');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('admin_custom_password', newPassword);
      setLoading(false);
      setSuccessMsg('✅ पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।');
      setPassword(newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMode('login');
    }, 600);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    const activePassword = getStoredPassword();
    setPassword(activePassword);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto 80px auto', padding: '0 16px' }}>
      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginBottom: '20px', fontSize: '0.85rem', padding: '8px 16px' }}
        onClick={onBackToForm}
      >
        <ArrowLeft size={16} />
        <span>पंजीकरण फॉर्म पर वापस जाएं (Back to Registration Form)</span>
      </button>

      <div
        className="form-section-card"
        style={{
          boxShadow: 'var(--shadow-xl)',
          border: '1.5px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
          }}
        />

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35)'
            }}
          >
            {mode === 'login' ? <ShieldCheck size={36} /> : <KeyRound size={36} />}
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {mode === 'login' ? 'व्यवस्थापक लॉगिन (Admin Portal)' : 'पासवर्ड बदलें (Change Password)'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {mode === 'login'
              ? 'कलाकार पंजीकरण डेटा एवं प्रविष्टियों का प्रबंधन'
              : 'व्यवस्थापक खाते का नया पासवर्ड सेट करें'}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div
            className="name-match-card matched"
            style={{ marginBottom: '18px', padding: '12px 16px', fontSize: '0.84rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            className="name-match-card mismatch"
            style={{ marginBottom: '18px', padding: '12px 16px', fontSize: '0.84rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {mode === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="admin-username">
                <span>
                  <span className="label-text-hi">यूजरनेम</span>
                  <span className="label-text-en">/ Username</span>
                </span>
              </label>
              <div className="input-container">
                <span className="input-icon-left">
                  <User size={17} />
                </span>
                <input
                  id="admin-username"
                  type="text"
                  className="form-input input-with-icon-left"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="admin-password">
                  <span>
                    <span className="label-text-hi">पासवर्ड</span>
                    <span className="label-text-en">/ Password</span>
                  </span>
                </label>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => {
                    setMode('change_password');
                    setError('');
                    setSuccessMsg('');
                  }}
                >
                  पासवर्ड बदलें? (Change Password)
                </button>
              </div>
              <div className="input-container">
                <span className="input-icon-left">
                  <Lock size={17} />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input input-with-icon-left input-with-icon-right"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.35)',
                margin: '18px 0 16px 0'
              }}
              disabled={loading}
            >
              {loading ? (
                <span>सत्यापित हो रहा है...</span>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>लॉगिन करें (Admin Login)</span>
                </>
              )}
            </button>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                className="btn-demo"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleFillDemo}
              >
                <Sparkles size={16} />
                <span>डेमो क्रेडेंशियल्स भरें (Auto Fill Credentials)</span>
              </button>
            </div>
          </form>
        ) : (
          /* Change Password Form */
          <form onSubmit={handleChangePasswordSubmit}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" htmlFor="current-pass">
                <span>
                  <span className="label-text-hi">वर्तमान पासवर्ड (Current Password)</span>
                  <span className="required-star">*</span>
                </span>
              </label>
              <div className="input-container">
                <span className="input-icon-left">
                  <Lock size={17} />
                </span>
                <input
                  id="current-pass"
                  type="password"
                  className="form-input input-with-icon-left"
                  placeholder="पुराना पासवर्ड दर्ज करें"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <span className="helper-text">डिफ़ॉल्ट वर्तमान पासवर्ड: <strong>{getStoredPassword()}</strong></span>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" htmlFor="new-pass">
                <span>
                  <span className="label-text-hi">नया पासवर्ड (New Password)</span>
                  <span className="required-star">*</span>
                </span>
              </label>
              <div className="input-container">
                <span className="input-icon-left">
                  <KeyRound size={17} />
                </span>
                <input
                  id="new-pass"
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-input input-with-icon-left input-with-icon-right"
                  placeholder="नया पासवर्ड (कम से कम 6 अक्षर)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" htmlFor="confirm-pass">
                <span>
                  <span className="label-text-hi">नये पासवर्ड की पुष्टि (Confirm New Password)</span>
                  <span className="required-star">*</span>
                </span>
              </label>
              <div className="input-container">
                <span className="input-icon-left">
                  <Check size={17} />
                </span>
                <input
                  id="confirm-pass"
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-input input-with-icon-left"
                  placeholder="नया पासवर्ड पुनः दर्ज करें"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMsg('');
                }}
              >
                रद्द करें (Cancel)
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  flex: 1.5,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                  boxShadow: '0 4px 15px rgba(79, 70, 229, 0.35)'
                }}
                disabled={loading}
              >
                {loading ? 'अपडेट हो रहा है...' : 'पासवर्ड सेव करें (Save)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
