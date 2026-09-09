import React from 'react';
import { X, CheckCircle, AlertTriangle, Printer, Download, User, Palette, FileText, Phone, Mail, MapPin, ShieldCheck, Share2 } from 'lucide-react';
import { ART_CATEGORIES, ART_DISCIPLINES } from '../../data/indianStates';

export const ArtistDetailModal = ({ entry, onClose, onUpdateStatus }) => {
  if (!entry) return null;

  const { registrationId, applicant, artDetails, documents, socialLinks, status, submissionTime } = entry;
  const catObj = ART_CATEGORIES.find((c) => c.id === artDetails?.category);
  const discObj = ART_DISCIPLINES.find((d) => d.id === artDetails?.discipline);

  const formattedDate = submissionTime
    ? new Date(submissionTime).toLocaleString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {applicant?.fullName}
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                आवेदन संख्या: <strong>{registrationId}</strong> • {formattedDate}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-remove-file"
            onClick={onClose}
            title="बंद करें (Close)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Bar */}
          <div
            style={{
              background:
                status === 'APPROVED'
                  ? 'var(--success-light)'
                  : status === 'REJECTED'
                  ? 'var(--danger-light)'
                  : 'var(--warning-light)',
              border: `1px solid ${
                status === 'APPROVED'
                  ? 'var(--success-border)'
                  : status === 'REJECTED'
                  ? 'var(--danger-border)'
                  : 'var(--warning-border)'
              }`,
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {status === 'APPROVED' ? (
                <CheckCircle size={20} color="var(--success)" />
              ) : status === 'REJECTED' ? (
                <AlertTriangle size={20} color="var(--danger)" />
              ) : (
                <ShieldCheck size={20} color="var(--warning)" />
              )}
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                वर्तमान स्थिति:{' '}
                {status === 'APPROVED'
                  ? 'स्वीकृत (Approved)'
                  : status === 'REJECTED'
                  ? 'अस्वीकृत (Rejected)'
                  : 'सत्यापन हेतु लंबित (Under Review)'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  background: 'var(--success)',
                  boxShadow: 'none'
                }}
                onClick={() => onUpdateStatus(registrationId, 'APPROVED')}
              >
                स्वीकृत करें (Approve)
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  color: 'var(--danger)',
                  borderColor: 'var(--danger-border)'
                }}
                onClick={() => onUpdateStatus(registrationId, 'REJECTED')}
              >
                अस्वीकृत करें (Reject)
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="form-grid grid-2" style={{ marginBottom: '24px' }}>
            {/* Personal Details */}
            <div
              style={{
                background: 'var(--bg-main)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.86rem'
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: 'var(--primary)',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <User size={16} /> व्यक्तिगत विवरण (Personal Details)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>पूरा नाम:</strong> {applicant?.fullName}</div>
                <div><strong>पिता/पति का नाम:</strong> {applicant?.fatherHusbandName}</div>
                <div><strong>जन्म तिथि:</strong> {applicant?.dob}</div>
                <div><strong>लिंग:</strong> {applicant?.gender}</div>
                <div><strong>मोबाइल:</strong> +91 {applicant?.mobile}</div>
                <div><strong>ईमेल:</strong> {applicant?.email || 'N/A'}</div>
                <div><strong>पता:</strong> {applicant?.address}, {applicant?.district}, {applicant?.state} - {applicant?.pincode}</div>
              </div>
            </div>

            {/* Art Details */}
            <div
              style={{
                background: 'var(--bg-main)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.86rem'
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: 'var(--primary)',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Palette size={16} /> कला एवं विधा प्रोफाइल (Art Profile)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>कला श्रेणी:</strong> {catObj ? catObj.nameHi : artDetails?.category}</div>
                <div><strong>कला विधा:</strong> {discObj ? discObj.nameHi : artDetails?.discipline}</div>
                <div><strong>कला अनुभव:</strong> {artDetails?.experience}</div>
                <div><strong>कला विवरण (10 शब्द):</strong> "{artDetails?.artDescription}"</div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div
            style={{
              background: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '24px'
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileText size={16} color="var(--primary)" /> संलग्न दस्तावेज़ एवं मीडिया (Attached Files)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '0.82rem' }}>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <strong>📷 फोटो:</strong> {documents?.photoName || 'संलग्न'}
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <strong>🎬 परफॉरमेंस वीडियो:</strong> {documents?.videoName || 'संलग्न'}
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <strong>📄 पैन कार्ड:</strong> {documents?.panName || 'संलग्न'}
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <strong>🆔 आधार (Front):</strong> {documents?.aadhaarFrontName || 'संलग्न'}
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <strong>🆔 आधार (Back):</strong> {documents?.aadhaarBackName || 'संलग्न'}
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <strong>🏦 बैंक पासबुक:</strong> {documents?.passbookName || 'संलग्न'}
              </div>
            </div>
          </div>

          {/* Social Links if present */}
          {socialLinks && (socialLinks.youtube || socialLinks.instagram || socialLinks.facebook || socialLinks.portfolio) && (
            <div
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                marginBottom: '20px',
                fontSize: '0.82rem'
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Share2 size={16} /> सोशल मीडिया व पोर्टफोलियो लिंक्स
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {socialLinks.youtube && <div><strong>YouTube:</strong> <a href={socialLinks.youtube} target="_blank" rel="noreferrer">{socialLinks.youtube}</a></div>}
                {socialLinks.instagram && <div><strong>Instagram:</strong> <a href={socialLinks.instagram} target="_blank" rel="noreferrer">{socialLinks.instagram}</a></div>}
                {socialLinks.facebook && <div><strong>Facebook:</strong> <a href={socialLinks.facebook} target="_blank" rel="noreferrer">{socialLinks.facebook}</a></div>}
                {socialLinks.portfolio && <div><strong>Portfolio:</strong> <a href={socialLinks.portfolio} target="_blank" rel="noreferrer">{socialLinks.portfolio}</a></div>}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrint}
            >
              <Printer size={16} />
              <span>आवेदन प्रिंट करें (Print)</span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              <span>बंद करें (Close)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
