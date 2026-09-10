import React from 'react';
import { UploadCloud, CheckCircle2, ShieldCheck, Database, FileText, Sparkles, Loader2 } from 'lucide-react';

export const UploadProgressModal = ({ progress = 0, loadedBytes = 0, totalBytes = 0 }) => {
  // Format bytes helper
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Determine upload stages
  const getStageInfo = () => {
    if (progress < 40) {
      return {
        titleHi: 'दस्तावेज एवं वीडियो अपलोड हो रहे हैं...',
        titleEn: 'Uploading Documents & Video to Cloud...',
        icon: <UploadCloud size={28} className="animate-bounce" color="var(--primary)" />,
        step: 1
      };
    } else if (progress < 75) {
      return {
        titleHi: 'सर्वर द्वारा सत्यापन एवं मीडिया एन्कोडिंग...',
        titleEn: 'Verifying Documents & Encoding Media...',
        icon: <ShieldCheck size={28} className="animate-pulse" color="#0284c7" />,
        step: 2
      };
    } else if (progress < 95) {
      return {
        titleHi: 'डेटाबेस में सुरक्षित रूप से सहेजा जा रहा है...',
        titleEn: 'Saving Artist Profile to Database...',
        icon: <Database size={28} className="animate-pulse" color="#0d9488" />,
        step: 3
      };
    } else {
      return {
        titleHi: 'पंजीकरण रसीद एवं ID तैयार हो रही है...',
        titleEn: 'Generating Registration ID & Receipt Slip...',
        icon: <Sparkles size={28} className="animate-spin" color="#9333ea" />,
        step: 4
      };
    }
  };

  const stage = getStageInfo();

  return (
    <div
      className="modal-backdrop"
      style={{
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: '520px',
          width: '92%',
          background: 'white',
          borderRadius: '24px',
          padding: '36px 28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Top Glow Ribbon */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #4f46e5, #ec4899, #f97316, #4f46e5)',
            backgroundSize: '200% 100%',
            animation: 'gradientMove 2s linear infinite'
          }}
        />

        {/* Center Animated Icon Container */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(244, 63, 94, 0.1) 100%)',
            border: '2px solid rgba(79, 70, 229, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.15)'
          }}
        >
          {stage.icon}
        </div>

        {/* Dynamic Heading */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginBottom: '6px',
            lineHeight: 1.3
          }}
        >
          {stage.titleHi}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '26px'
          }}
        >
          {stage.titleEn}
        </p>

        {/* Main Progress Bar Container */}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.88rem',
              fontWeight: 700,
              marginBottom: '8px'
            }}
          >
            <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Loader2 size={16} className="animate-spin" />
              <span>अपलोड प्रगति (Upload Progress)</span>
            </span>
            <span style={{ fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 800 }}>
              {progress}%
            </span>
          </div>

          <div
            style={{
              height: '14px',
              background: '#e2e8f0',
              borderRadius: '999px',
              overflow: 'hidden',
              padding: '2px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.max(progress, 5)}%`,
                background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #f97316 100%)',
                borderRadius: '999px',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 10px rgba(79, 70, 229, 0.4)'
              }}
            />
          </div>
        </div>

        {/* Transferred Bytes Indicator (if available) */}
        {totalBytes > 0 && (
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              fontFamily: 'monospace',
              fontWeight: 600
            }}
          >
            {formatBytes(loadedBytes)} / {formatBytes(totalBytes)} प्रेषित
          </div>
        )}

        {/* 4-Step Visual Trackers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            margin: '22px 0 18px 0',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              background: progress >= 20 ? 'rgba(79, 70, 229, 0.1)' : '#f8fafc',
              border: `1px solid ${progress >= 20 ? 'rgba(79, 70, 229, 0.3)' : '#e2e8f0'}`,
              fontSize: '0.7rem',
              fontWeight: 600,
              color: progress >= 20 ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            1. मीडिया
          </div>
          <div
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              background: progress >= 50 ? 'rgba(2, 132, 199, 0.1)' : '#f8fafc',
              border: `1px solid ${progress >= 50 ? 'rgba(2, 132, 199, 0.3)' : '#e2e8f0'}`,
              fontSize: '0.7rem',
              fontWeight: 600,
              color: progress >= 50 ? '#0284c7' : 'var(--text-muted)'
            }}
          >
            2. सत्यापन
          </div>
          <div
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              background: progress >= 75 ? 'rgba(13, 148, 136, 0.1)' : '#f8fafc',
              border: `1px solid ${progress >= 75 ? 'rgba(13, 148, 136, 0.3)' : '#e2e8f0'}`,
              fontSize: '0.7rem',
              fontWeight: 600,
              color: progress >= 75 ? '#0d9488' : 'var(--text-muted)'
            }}
          >
            3. डेटाबेस
          </div>
          <div
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              background: progress >= 95 ? 'rgba(147, 51, 234, 0.1)' : '#f8fafc',
              border: `1px solid ${progress >= 95 ? 'rgba(147, 51, 234, 0.3)' : '#e2e8f0'}`,
              fontSize: '0.7rem',
              fontWeight: 600,
              color: progress >= 95 ? '#9333ea' : 'var(--text-muted)'
            }}
          >
            4. पावती
          </div>
        </div>

        {/* User Advisory Note */}
        <div
          style={{
            background: 'var(--bg-card-subtle)',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>⚠️ कृपया पृष्ठ को रीफ्रेश या बंद न करें। (Do not refresh or close)</span>
        </div>
      </div>
    </div>
  );
};
