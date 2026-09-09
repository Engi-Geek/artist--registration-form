import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { validateNameMatching } from '../utils/validation';

export const NameMatchBadge = ({ applicantName, aadhaarName, passbookName }) => {
  const result = validateNameMatching(applicantName, aadhaarName, passbookName);

  if (result.isPending) {
    return (
      <div className="name-match-card pending">
        <div className="match-header">
          <Info size={18} />
          <span>सख्त नियम: तीनों नाम शत-प्रतिशत एक समान होने चाहिए (Strict Exact Match Rule)</span>
        </div>
        <p style={{ fontSize: '0.82rem', marginTop: '4px', opacity: 0.9 }}>
          आवेदक का नाम (मूल विवरण), आधार कार्ड पर अंकित नाम, और बैंक पासबुक में खाताधारक का नाम पूरी तरह मेल खाना चाहिए।
        </p>
      </div>
    );
  }

  if (result.isValid) {
    return (
      <div className="name-match-card matched">
        <div className="match-header">
          <CheckCircle2 size={20} />
          <span>{result.messageHi}</span>
        </div>
        <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
          {result.messageEn}
        </div>
        <div className="match-compare-grid">
          <div className="match-pill">
            <strong>1. आवेदक नाम (Applicant):</strong> {applicantName}
          </div>
          <div className="match-pill">
            <strong>2. आधार कार्ड नाम (Aadhaar):</strong> {aadhaarName}
          </div>
          <div className="match-pill">
            <strong>3. पासबुक नाम (Passbook):</strong> {passbookName}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="name-match-card mismatch">
      <div className="match-header">
        <AlertTriangle size={20} />
        <span>{result.messageHi}</span>
      </div>
      <div style={{ fontSize: '0.82rem', marginTop: '2px', fontWeight: 600 }}>
        {result.messageEn}
      </div>

      <div className="match-details-list">
        {result.mismatches.map((err, idx) => (
          <div key={idx}>• {err}</div>
        ))}
      </div>

      <div className="match-compare-grid">
        <div className="match-pill" style={{ borderColor: 'var(--danger-border)' }}>
          <strong>1. आवेदक नाम:</strong> {applicantName || "(रिक्त / Empty)"}
        </div>
        <div className="match-pill" style={{ borderColor: 'var(--danger-border)' }}>
          <strong>2. आधार कार्ड नाम:</strong> {aadhaarName || "(रिक्त / Empty)"}
        </div>
        <div className="match-pill" style={{ borderColor: 'var(--danger-border)' }}>
          <strong>3. पासबुक नाम:</strong> {passbookName || "(रिक्त / Empty)"}
        </div>
      </div>
    </div>
  );
};
