import React from 'react';
import { Share2, Globe, AlertCircle, CheckCircle2, FileCheck2, User, Palette } from 'lucide-react';
import { ART_CATEGORIES, ART_DISCIPLINES } from '../data/indianStates';
import { formatFileSize } from '../utils/fileHelpers';
import { calculateAge } from '../utils/validation';

const YoutubeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#ef4444">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877f2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const Step4SocialLinks = ({ formData, onChange, errors }) => {
  const selectedCat = ART_CATEGORIES.find((c) => c.id === formData.category);
  const selectedDisc = ART_DISCIPLINES.find((d) => d.id === formData.discipline);
  const age = calculateAge(formData.dob);

  return (
    <div className="form-section-card">
      <div className="section-header">
        <div className="section-title-group">
          <div className="section-icon-badge">
            <Share2 size={22} />
          </div>
          <div>
            <h2>सोशल मीडिया लिंक्स एवं अंतिम समीक्षा (Links & Final Review)</h2>
            <p>अपने यूट्यूब, सोशल मीडिया व पोर्टफोलियो लिंक जोड़ें और फॉर्म विवरण की पुष्टि करें।</p>
          </div>
        </div>
      </div>

      <div className="form-grid grid-2" style={{ marginBottom: '28px' }}>
        {/* YouTube */}
        <div className="form-group">
          <label className="form-label" htmlFor="youtube">
            <span>
              <span className="label-text-hi">यूट्यूब लिंक (YouTube Video/Channel)</span>
              <span className="label-text-en">/ Optional</span>
            </span>
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <YoutubeIcon />
            </span>
            <input
              id="youtube"
              type="url"
              className={`form-input input-with-icon-left ${errors.youtube ? 'is-invalid' : ''}`}
              placeholder="https://youtube.com/@channel"
              value={formData.youtube}
              onChange={(e) => onChange('youtube', e.target.value)}
            />
          </div>
          {errors.youtube && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.youtube}</span>
            </div>
          )}
        </div>

        {/* Instagram */}
        <div className="form-group">
          <label className="form-label" htmlFor="instagram">
            <span>
              <span className="label-text-hi">इंस्टाग्राम प्रोफाइल (Instagram Profile)</span>
              <span className="label-text-en">/ Optional</span>
            </span>
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <InstagramIcon />
            </span>
            <input
              id="instagram"
              type="url"
              className={`form-input input-with-icon-left ${errors.instagram ? 'is-invalid' : ''}`}
              placeholder="https://instagram.com/profile"
              value={formData.instagram}
              onChange={(e) => onChange('instagram', e.target.value)}
            />
          </div>
          {errors.instagram && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.instagram}</span>
            </div>
          )}
        </div>

        {/* Facebook */}
        <div className="form-group">
          <label className="form-label" htmlFor="facebook">
            <span>
              <span className="label-text-hi">फेसबुक पेज (Facebook Page)</span>
              <span className="label-text-en">/ Optional</span>
            </span>
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <FacebookIcon />
            </span>
            <input
              id="facebook"
              type="url"
              className={`form-input input-with-icon-left ${errors.facebook ? 'is-invalid' : ''}`}
              placeholder="https://facebook.com/page"
              value={formData.facebook}
              onChange={(e) => onChange('facebook', e.target.value)}
            />
          </div>
          {errors.facebook && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.facebook}</span>
            </div>
          )}
        </div>

        {/* Portfolio / Website */}
        <div className="form-group">
          <label className="form-label" htmlFor="portfolio">
            <span>
              <span className="label-text-hi">पोर्टफोलियो / वेबसाइट (Portfolio URL)</span>
              <span className="label-text-en">/ Optional</span>
            </span>
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <Globe size={17} color="var(--primary)" />
            </span>
            <input
              id="portfolio"
              type="url"
              className={`form-input input-with-icon-left ${errors.portfolio ? 'is-invalid' : ''}`}
              placeholder="https://artistportfolio.com"
              value={formData.portfolio}
              onChange={(e) => onChange('portfolio', e.target.value)}
            />
          </div>
          {errors.portfolio && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Application Summary Review Card */}
      <div
        style={{
          background: 'var(--bg-main)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <FileCheck2 size={22} color="var(--primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            आवेदन पूर्वावलोकन (Application Preview Summary)
          </h3>
        </div>

        <div className="form-grid grid-2" style={{ fontSize: '0.88rem' }}>
          <div style={{ background: 'white', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> व्यक्तिगत विवरण (Personal Details)
            </div>
            <div><strong>नाम:</strong> {formData.fullName || "—"}</div>
            <div><strong>पिता/पति का नाम:</strong> {formData.fatherHusbandName || "—"}</div>
            <div><strong>जन्म तिथि:</strong> {formData.dob || "—"} {age ? `(${age} वर्ष)` : ""}</div>
            <div><strong>लिंग:</strong> {formData.gender || "—"}</div>
            <div><strong>मोबाइल:</strong> +91 {formData.mobile || "—"}</div>
            <div><strong>पता:</strong> {formData.address || "—"}, {formData.district}, {formData.state} - {formData.pincode}</div>
          </div>

          <div style={{ background: 'white', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={16} /> कला एवं विधा (Art Profile)
            </div>
            <div><strong>श्रेणी:</strong> {selectedCat ? selectedCat.nameHi : "—"}</div>
            <div><strong>विधा:</strong> {selectedDisc ? selectedDisc.nameHi : "—"}</div>
            <div><strong>अनुभव:</strong> {formData.experience ? `${formData.experience} वर्ष` : "—"}</div>
            <div><strong>कला विवरण:</strong> "{formData.artDescription || "—"}"</div>
          </div>
        </div>

        <div style={{ marginTop: '14px', background: 'white', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontWeight: 700, color: 'var(--success-text)', marginBottom: '6px' }}>
            संलग्न दस्तावेज़ (Attached Documents):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem' }}>
            <span style={{ background: 'var(--bg-card-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
              📷 फोटो: {formData.files.photo ? `${formData.files.photo.name} (${formatFileSize(formData.files.photo.size)})` : "❌ अपलोड नहीं"}
            </span>
            <span style={{ background: 'var(--bg-card-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
              🎬 वीडियो: {formData.files.video ? `${formData.files.video.name} (${formatFileSize(formData.files.video.size)})` : "❌ अपलोड नहीं"}
            </span>
            <span style={{ background: 'var(--bg-card-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
              📄 पैन: {formData.files.pan ? "✅ संलग्न" : "❌"}
            </span>
            <span style={{ background: 'var(--bg-card-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
              🆔 आधार कार्ड: {formData.files.aadhaarFront && formData.files.aadhaarBack ? "✅ दोनों साइड संलग्न" : "❌"}
            </span>
            <span style={{ background: 'var(--bg-card-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
              🏦 बैंक पासबुक: {formData.files.passbook ? "✅ संलग्न" : "❌"}
            </span>
          </div>
        </div>
      </div>

      {/* Declaration Checkbox */}
      <div
        style={{
          background: 'var(--warning-light)',
          border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}
      >
        <input
          id="declaration"
          type="checkbox"
          style={{ width: '18px', height: '18px', marginTop: '3px', cursor: 'pointer' }}
          checked={formData.declaration || false}
          onChange={(e) => onChange('declaration', e.target.checked)}
        />
        <label htmlFor="declaration" style={{ fontSize: '0.85rem', color: 'var(--warning-text)', cursor: 'pointer' }}>
          <strong>शपथ-पत्र (Self Declaration):</strong> मैं प्रमाणित करता/करती हूँ कि इस फॉर्म में दी गई सभी जानकारियाँ, नाम, कला अनुभव एवं अपलोड किए गए सभी दस्तावेज पूर्णतः सत्य और प्रामाणिक हैं। यदि कोई जानकारी असत्य पाई जाती है, तो मेरा पंजीकरण निरस्त किया जा सकता है।
        </label>
      </div>
      {errors.declaration && (
        <div className="error-message" style={{ marginTop: '8px' }}>
          <AlertCircle size={14} />
          <span>{errors.declaration}</span>
        </div>
      )}
    </div>
  );
};
