import React from 'react';
import { FileText, ShieldAlert, AlertCircle, UserCheck } from 'lucide-react';
import { FileUploadCard } from './FileUploadCard';
import { NameMatchBadge } from './NameMatchBadge';

export const Step3DocumentsUpload = ({
  formData,
  onChange,
  onFileSelect,
  onFileRemove,
  errors
}) => {
  return (
    <div className="form-section-card">
      <div className="section-header">
        <div className="section-title-group">
          <div className="section-icon-badge">
            <FileText size={22} />
          </div>
          <div>
            <h2>दस्तावेज़ एवं मीडिया अपलोड (Documents & Media Uploads)</h2>
            <p>कृपया सभी आवश्यक दस्तावेज, फोटो, और कला प्रदर्शन वीडियो अपलोड करें।</p>
          </div>
        </div>
      </div>

      {/* Name Exact Match Cross-Verification Section */}
      <div
        style={{
          background: 'var(--bg-card-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '28px',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <UserCheck size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            सख्त नाम सत्यापन (Strict Name Verification Check)
          </h3>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          महत्वपूर्ण सूचना: आवेदक का नाम, आधार कार्ड का नाम और बैंक पासबुक का नाम <strong>शत-प्रतिशत एक समान</strong> होना अनिवार्य है, अन्यथा पंजीकरण स्वतः निरस्त हो जाएगा।
        </p>

        <div className="form-grid grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="aadhaarName">
              <span>
                <span className="label-text-hi">आधार कार्ड पर अंकित नाम</span>
                <span className="label-text-en">/ Name as per Aadhaar</span>
                <span className="required-star">*</span>
              </span>
            </label>
            <input
              id="aadhaarName"
              type="text"
              className={`form-input ${errors.aadhaarName ? 'is-invalid' : ''}`}
              placeholder="e.g. Rameshwar Lal Sharma"
              value={formData.aadhaarName}
              onChange={(e) => onChange('aadhaarName', e.target.value)}
            />
            {errors.aadhaarName && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.aadhaarName}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="passbookName">
              <span>
                <span className="label-text-hi">बैंक पासबुक में खाताधारक का नाम</span>
                <span className="label-text-en">/ Name as per Passbook</span>
                <span className="required-star">*</span>
              </span>
            </label>
            <input
              id="passbookName"
              type="text"
              className={`form-input ${errors.passbookName ? 'is-invalid' : ''}`}
              placeholder="e.g. Rameshwar Lal Sharma"
              value={formData.passbookName}
              onChange={(e) => onChange('passbookName', e.target.value)}
            />
            {errors.passbookName && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.passbookName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Name Matching Validation Feedback */}
        <NameMatchBadge
          applicantName={formData.fullName}
          aadhaarName={formData.aadhaarName}
          passbookName={formData.passbookName}
        />
      </div>

      {/* Media & Document Uploaders Grid */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
        फ़ाइल एवं दस्तावेज़ अपलोड (Required File Uploads)
      </h3>

      <div className="form-grid grid-2">
        {/* Photo Upload (max 2MB) */}
        <FileUploadCard
          ruleKey="photo"
          file={formData.files.photo}
          onFileSelect={(f) => onFileSelect('photo', f)}
          onFileRemove={() => onFileRemove('photo')}
          error={errors.photo}
        />

        {/* Performance Video Upload (max 50MB) */}
        <FileUploadCard
          ruleKey="video"
          file={formData.files.video}
          isVideo={true}
          onFileSelect={(f) => onFileSelect('video', f)}
          onFileRemove={() => onFileRemove('video')}
          error={errors.video}
        />

        {/* PAN Card (max 5MB) */}
        <FileUploadCard
          ruleKey="pan"
          file={formData.files.pan}
          onFileSelect={(f) => onFileSelect('pan', f)}
          onFileRemove={() => onFileRemove('pan')}
          error={errors.pan}
        />

        {/* Bank Passbook / Cheque (max 5MB) */}
        <FileUploadCard
          ruleKey="passbook"
          file={formData.files.passbook}
          onFileSelect={(f) => onFileSelect('passbook', f)}
          onFileRemove={() => onFileRemove('passbook')}
          error={errors.passbook}
        />

        {/* Aadhaar Front Side (max 5MB) */}
        <FileUploadCard
          ruleKey="aadhaarFront"
          file={formData.files.aadhaarFront}
          onFileSelect={(f) => onFileSelect('aadhaarFront', f)}
          onFileRemove={() => onFileRemove('aadhaarFront')}
          error={errors.aadhaarFront}
        />

        {/* Aadhaar Back Side (max 5MB) */}
        <FileUploadCard
          ruleKey="aadhaarBack"
          file={formData.files.aadhaarBack}
          onFileSelect={(f) => onFileSelect('aadhaarBack', f)}
          onFileRemove={() => onFileRemove('aadhaarBack')}
          error={errors.aadhaarBack}
        />
      </div>
    </div>
  );
};
