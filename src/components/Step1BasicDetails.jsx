import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { INDIAN_STATES } from '../data/indianStates';
import { calculateAge } from '../utils/validation';

export const Step1BasicDetails = ({ formData, onChange, errors }) => {
  const calculatedAge = calculateAge(formData.dob);

  return (
    <div className="form-section-card">
      <div className="section-header">
        <div className="section-title-group">
          <div className="section-icon-badge">
            <User size={22} />
          </div>
          <div>
            <h2>मूल व्यक्तिगत विवरण (Basic Details)</h2>
            <p>कृपया कलाकार की सभी प्राथमिक व्यक्तिगत जानकारी सही-सही दर्ज करें।</p>
          </div>
        </div>
      </div>

      <div className="form-grid grid-2">
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">
            <span>
              <span className="label-text-hi">कलाकार का पूरा नाम</span>
              <span className="label-text-en">/ Full Name</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="input-container">
            <input
              id="fullName"
              type="text"
              className={`form-input ${errors.fullName ? 'is-invalid' : ''}`}
              placeholder="e.g. Rameshwar Lal Sharma"
              value={formData.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
            />
          </div>
          {errors.fullName && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.fullName}</span>
            </div>
          )}
        </div>

        {/* Father / Husband Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="fatherHusbandName">
            <span>
              <span className="label-text-hi">पिता / पति का नाम</span>
              <span className="label-text-en">/ Father/Husband Name</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="input-container">
            <input
              id="fatherHusbandName"
              type="text"
              className={`form-input ${errors.fatherHusbandName ? 'is-invalid' : ''}`}
              placeholder="e.g. Ramswaroop Sharma"
              value={formData.fatherHusbandName}
              onChange={(e) => onChange('fatherHusbandName', e.target.value)}
            />
          </div>
          {errors.fatherHusbandName && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.fatherHusbandName}</span>
            </div>
          )}
        </div>

        {/* Date of Birth & Age Display */}
        <div className="form-group">
          <label className="form-label" htmlFor="dob">
            <span>
              <span className="label-text-hi">जन्म तिथि</span>
              <span className="label-text-en">/ Date of Birth</span>
              <span className="required-star">*</span>
            </span>
            {calculatedAge !== null && (
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                आयु (Age): {calculatedAge} वर्ष
              </span>
            )}
          </label>
          <div className="input-container">
            <input
              id="dob"
              type="date"
              className={`form-input ${errors.dob ? 'is-invalid' : ''}`}
              value={formData.dob}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => onChange('dob', e.target.value)}
            />
          </div>
          {errors.dob && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.dob}</span>
            </div>
          )}
        </div>

        {/* Gender Selection */}
        <div className="form-group">
          <label className="form-label">
            <span>
              <span className="label-text-hi">लिंग</span>
              <span className="label-text-en">/ Gender</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="input-container">
            <select
              className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
              value={formData.gender}
              onChange={(e) => onChange('gender', e.target.value)}
            >
              <option value="">-- लिंग चुनें (Select Gender) --</option>
              <option value="Male">पुरुष (Male)</option>
              <option value="Female">महिला (Female)</option>
              <option value="Transgender">तृतीय लिंग (Transgender / Other)</option>
            </select>
          </div>
          {errors.gender && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.gender}</span>
            </div>
          )}
        </div>

        {/* Mobile Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="mobile">
            <span>
              <span className="label-text-hi">मोबाइल नंबर (10 अंक)</span>
              <span className="label-text-en">/ Mobile Number</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <Phone size={16} />
            </span>
            <input
              id="mobile"
              type="tel"
              maxLength={10}
              className={`form-input input-with-icon-left ${errors.mobile ? 'is-invalid' : ''}`}
              placeholder="10 अंकों का मोबाइल नंबर"
              value={formData.mobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                onChange('mobile', val);
              }}
            />
          </div>
          {errors.mobile && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.mobile}</span>
            </div>
          )}
        </div>

        {/* Email ID (Optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            <span>
              <span className="label-text-hi">ईमेल आईडी (ऐच्छिक)</span>
              <span className="label-text-en">/ Email ID (Optional)</span>
            </span>
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <Mail size={16} />
            </span>
            <input
              id="email"
              type="email"
              className={`form-input input-with-icon-left ${errors.email ? 'is-invalid' : ''}`}
              placeholder="artist@example.com"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
          {errors.email && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Address - Full Span */}
        <div className="form-group col-span-full">
          <label className="form-label" htmlFor="address">
            <span>
              <span className="label-text-hi">स्थाई पता (मकान नं., ग्राम/गली, पोस्ट)</span>
              <span className="label-text-en">/ Permanent Address</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="input-container">
            <span className="input-icon-left" style={{ top: '14px' }}>
              <MapPin size={16} />
            </span>
            <input
              id="address"
              type="text"
              className={`form-input input-with-icon-left ${errors.address ? 'is-invalid' : ''}`}
              placeholder="मकान संख्या, गांव/मोहल्ला, डाकघर विवरण"
              value={formData.address}
              onChange={(e) => onChange('address', e.target.value)}
            />
          </div>
          {errors.address && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.address}</span>
            </div>
          )}
        </div>

        {/* State */}
        <div className="form-group">
          <label className="form-label" htmlFor="state">
            <span>
              <span className="label-text-hi">राज्य / केंद्र शासित प्रदेश</span>
              <span className="label-text-en">/ State</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="input-container">
            <select
              id="state"
              className={`form-select ${errors.state ? 'is-invalid' : ''}`}
              value={formData.state}
              onChange={(e) => onChange('state', e.target.value)}
            >
              <option value="">-- राज्य चुनें (Select State) --</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          {errors.state && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.state}</span>
            </div>
          )}
        </div>

        {/* District */}
        <div className="form-group">
          <label className="form-label" htmlFor="district">
            <span>
              <span className="label-text-hi">जिला</span>
              <span className="label-text-en">/ District</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="input-container">
            <input
              id="district"
              type="text"
              className={`form-input ${errors.district ? 'is-invalid' : ''}`}
              placeholder="e.g. Jaipur / Ranchi / Bastar"
              value={formData.district}
              onChange={(e) => onChange('district', e.target.value)}
            />
          </div>
          {errors.district && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.district}</span>
            </div>
          )}
        </div>

        {/* Pincode */}
        <div className="form-group">
          <label className="form-label" htmlFor="pincode">
            <span>
              <span className="label-text-hi">पिनकोड (6 अंक)</span>
              <span className="label-text-en">/ Pincode (6 Digits)</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="input-container">
            <input
              id="pincode"
              type="text"
              maxLength={6}
              className={`form-input ${errors.pincode ? 'is-invalid' : ''}`}
              placeholder="e.g. 302001"
              value={formData.pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                onChange('pincode', val);
              }}
            />
          </div>
          {errors.pincode && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.pincode}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
