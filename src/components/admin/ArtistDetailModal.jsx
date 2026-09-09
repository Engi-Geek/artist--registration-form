import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  AlertTriangle,
  Printer,
  Download,
  User,
  Palette,
  FileText,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Share2,
  Film,
  Image as ImageIcon,
  CreditCard,
  Building2,
  ExternalLink,
  ZoomIn
} from 'lucide-react';
import { ART_CATEGORIES, ART_DISCIPLINES } from '../../data/indianStates';

export const ArtistDetailModal = ({ entry, onClose, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'media' | 'documents'
  const [selectedZoomImage, setSelectedZoomImage] = useState(null);

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

  // Fallback visual representations if no image URL
  const photoSrc = documents?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";
  const videoSrc = documents?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  const panSrc = documents?.panUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80";
  const aadhaarFSrc = documents?.aadhaarFrontUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80";
  const aadhaarBSrc = documents?.aadhaarBackUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80";
  const passbookSrc = documents?.passbookUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80";

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '940px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={photoSrc}
              alt={applicant?.fullName}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                objectFit: 'cover',
                border: '2px solid var(--primary)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {applicant?.fullName}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                आवेदन संख्या: <strong style={{ color: 'var(--primary)' }}>{registrationId}</strong> • {formattedDate}
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
                सत्यापन स्थिति:{' '}
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
                  fontSize: '0.82rem',
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
                  fontSize: '0.82rem',
                  color: 'var(--danger)',
                  borderColor: 'var(--danger-border)'
                }}
                onClick={() => onUpdateStatus(registrationId, 'REJECTED')}
              >
                अस्वीकृत करें (Reject)
              </button>
            </div>
          </div>

          {/* Video & Performance Highlight Player */}
          <div
            style={{
              background: '#0f172a',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              marginBottom: '26px',
              color: 'white',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={20} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                  कला प्रदर्शन वीडियो (Artist Performance Video)
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                {documents?.videoName || 'performance_clip.mp4'}
              </span>
            </div>

            <video
              src={videoSrc}
              controls
              style={{
                width: '100%',
                maxHeight: '340px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'black'
              }}
            />
          </div>

          {/* Uploaded Photos & Documents Gallery */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '1.05rem',
                marginBottom: '14px',
                color: 'var(--text-main)'
              }}
            >
              <ImageIcon size={18} color="var(--primary)" />
              <span>अपलोड की गई फोटो व दस्तावेज (Uploaded Photos & Documents)</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px'
              }}
            >
              {/* Photo Card */}
              <div
                style={{
                  background: 'white',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  📷 आवेदक फोटो (Photo)
                </div>
                <img
                  src={photoSrc}
                  alt="Applicant Photo"
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedZoomImage({ title: 'आवेदक फोटो (Applicant Photo)', src: photoSrc })}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {documents?.photoName || 'photo.png'}
                </div>
              </div>

              {/* PAN Card */}
              <div
                style={{
                  background: 'white',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  📄 पैन कार्ड (PAN Card)
                </div>
                <img
                  src={panSrc}
                  alt="PAN Card"
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedZoomImage({ title: 'पैन कार्ड (PAN Card)', src: panSrc })}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {documents?.panName || 'pan_card.png'}
                </div>
              </div>

              {/* Aadhaar Front */}
              <div
                style={{
                  background: 'white',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  🆔 आधार सामने (Aadhaar Front)
                </div>
                <img
                  src={aadhaarFSrc}
                  alt="Aadhaar Front"
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedZoomImage({ title: 'आधार कार्ड - सामने का भाग (Aadhaar Front)', src: aadhaarFSrc })}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {documents?.aadhaarFrontName || 'aadhaar_front.png'}
                </div>
              </div>

              {/* Aadhaar Back */}
              <div
                style={{
                  background: 'white',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  🆔 आधार पीछे (Aadhaar Back)
                </div>
                <img
                  src={aadhaarBSrc}
                  alt="Aadhaar Back"
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedZoomImage({ title: 'आधार कार्ड - पीछे का भाग (Aadhaar Back)', src: aadhaarBSrc })}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {documents?.aadhaarBackName || 'aadhaar_back.png'}
                </div>
              </div>

              {/* Passbook / Cheque */}
              <div
                style={{
                  background: 'white',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  🏦 बैंक पासबुक (Passbook)
                </div>
                <img
                  src={passbookSrc}
                  alt="Passbook / Cheque"
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedZoomImage({ title: 'बैंक पासबुक / चेक फोटो (Bank Passbook)', src: passbookSrc })}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {documents?.passbookName || 'bank_passbook.png'}
                </div>
              </div>
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
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

      {/* Image Zoom Modal */}
      {selectedZoomImage && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 11000 }}
          onClick={() => setSelectedZoomImage(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              maxWidth: '650px',
              width: '90%',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedZoomImage.title}</h4>
              <button
                type="button"
                className="btn-remove-file"
                onClick={() => setSelectedZoomImage(null)}
              >
                <X size={16} />
              </button>
            </div>
            <img
              src={selectedZoomImage.src}
              alt="Zoomed preview"
              style={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
