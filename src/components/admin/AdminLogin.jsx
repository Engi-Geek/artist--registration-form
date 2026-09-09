import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, KeyRound, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminLogin = ({ onLoginSuccess, onBackToForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('कृपया यूजरनेम और पासवर्ड दोनों दर्ज करें। (Please enter both username and password)');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Demo credentials check
      if (username.trim() === 'admin' && password === 'admin@2026') {
        onLoginSuccess();
      } else {
        setError('अमान्य क्रेडेंशियल्स! (Invalid credentials). डेमो लॉगिन के लिए "डेमो एडमिन भरें" पर क्लिक करें।');
        setLoading(false);
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin@2026');
    setError('');
  };

  return (
    <div style={{ maxWidth: '460px', margin: '40px auto 80px auto', padding: '0 16px' }}>
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

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
            <ShieldCheck size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            व्यवस्थापक लॉगिन (Admin Portal)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            कलाकार पंजीकरण डेटा एवं प्रविष्टियों का प्रबंधन
          </p>
        </div>

        {error && (
          <div
            className="name-match-card mismatch"
            style={{ marginBottom: '20px', padding: '12px 16px', fontSize: '0.84rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
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

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label" htmlFor="admin-password">
              <span>
                <span className="label-text-hi">पासवर्ड</span>
                <span className="label-text-en">/ Password</span>
              </span>
            </label>
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
              marginBottom: '16px'
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
        </form>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            className="btn-demo"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleFillDemo}
          >
            <Sparkles size={16} />
            <span>डेमो क्रेडेंशियल्स भरें (admin / admin@2026)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
