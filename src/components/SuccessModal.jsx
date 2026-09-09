import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Printer, Download, PlusCircle, QrCode, ShieldCheck, User } from 'lucide-react';

export const SuccessModal = ({ submissionResult, onClose, onRegisterNew }) => {
  const { registrationId, receiptData } = submissionResult || {};

  useEffect(() => {
    // Fire festive confetti animation
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  }, []);

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(receiptData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${registrationId || 'Artist-Registration'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: 'var(--success)' }}>
              <CheckCircle size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
                पंजीकरण सफल! (Registration Successful)
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                कलाकार पंजीकरण आवेदन सफलतापूर्वक दर्ज कर लिया गया है।
              </p>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {/* Hero Registration Card */}
          <div className="registration-card-hero">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  कलाकार पंजीकरण पावती (Acknowledgement Slip)
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px' }}>
                  {receiptData?.applicant?.fullName}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {receiptData?.artDetails?.category === 'lok' ? 'लोक कला' : 'जनजातीय कला'} • {receiptData?.artDetails?.discipline}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>आवेदन संख्या / REG. ID</div>
                <div className="reg-id-box">{registrationId}</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>स्थान: </span>
                {receiptData?.applicant?.district}, {receiptData?.applicant?.state}
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>दिनांक: </span>
                {new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Detailed Summary Table */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', fontSize: '0.85rem', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div><strong>मोबाइल:</strong> +91 {receiptData?.applicant?.mobile}</div>
              <div><strong>पिता/पति का नाम:</strong> {receiptData?.applicant?.fatherHusbandName}</div>
              <div><strong>कला अनुभव:</strong> {receiptData?.artDetails?.experience}</div>
              <div><strong>पिनकोड:</strong> {receiptData?.applicant?.pincode}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>कला विवरण:</strong> "{receiptData?.artDetails?.artDescription}"
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDownloadJSON}
            >
              <Download size={16} />
              <span>JSON डाउनलोड करें</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrint}
            >
              <Printer size={16} />
              <span>रसीद प्रिंट करें (Print)</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={onRegisterNew}
            >
              <PlusCircle size={16} />
              <span>नया पंजीकरण करें (New Form)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
