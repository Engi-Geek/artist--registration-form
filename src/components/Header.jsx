import React, { useState, useRef, useEffect } from 'react';
import { Palette, Sparkles, RefreshCw, UserCheck, ShieldCheck, ChevronDown } from 'lucide-react';
import { DUMMY_PROFILES } from '../data/dummyArtists';

// Control flag: Set to false before deploying to production to remove the demo presets & reset helper
const SHOW_DEMO_CONTROLS = true;

export const Header = ({ onFillSampleData, onResetForm, onOpenAdmin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="portal-header">
      <div className="header-top">
        <div className="header-brand">
          <div className="brand-icon-wrapper">
            <Palette size={28} strokeWidth={2.2} />
          </div>
          <div className="header-title-group">
            <h1>
              कलाकार पंजीकरण पोर्टल
              <span className="portal-badge">
                <ShieldCheck size={13} /> आधिकारिक पोर्टल / Portal 2026
              </span>
            </h1>
          </div>
        </div>

        <div className="header-actions">
          {/* Dev / Testing Controls (Can be toggled via SHOW_DEMO_CONTROLS) */}
          {SHOW_DEMO_CONTROLS && (
            <div className="header-tools-group">
              {/* Fill Demo Data Dropdown */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  type="button"
                  className="btn-header-small demo-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  title="परीक्षण हेतु डमी डेटा स्वतः भरें"
                >
                  <Sparkles size={14} />
                  <span>डेमो डेटा (Demo)</span>
                  <ChevronDown
                    size={12}
                    style={{
                      transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'white',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: '0 15px 35px -5px rgba(15, 23, 42, 0.2), 0 5px 15px rgba(0, 0, 0, 0.08)',
                      padding: '10px',
                      width: '300px',
                      zIndex: 9999,
                      animation: 'fadeIn 0.2s ease-out'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)',
                        padding: '4px 8px',
                        fontWeight: 600
                      }}
                    >
                      परीक्षण हेतु प्रोफाइल चुनें (Select Preset):
                    </div>
                    {DUMMY_PROFILES.map((profile, idx) => (
                      <button
                        key={idx}
                        type="button"
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          background: 'none',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          color: 'var(--text-main)',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-light)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                        onClick={() => {
                          onFillSampleData(profile.data);
                          setDropdownOpen(false);
                        }}
                      >
                        <UserCheck size={14} color="var(--primary)" />
                        <div>
                          <div>{profile.label}</div>
                          <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            {profile.data.category === 'lok' ? 'लोक कला' : 'जनजातीय कला'} • {profile.data.state}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Form Button */}
              <button
                type="button"
                className="btn-header-small"
                onClick={onResetForm}
                title="फॉर्म रीसेट करें"
              >
                <RefreshCw size={13} />
                <span>रीसेट (Reset)</span>
              </button>
            </div>
          )}

          {/* Admin Portal Button */}
          <button
            type="button"
            className="btn-header-small admin-btn"
            onClick={onOpenAdmin}
            title="Admin Login Portal"
          >
            <ShieldCheck size={14} />
            <span>Admin Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};
