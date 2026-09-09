import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck, X, AlertCircle, Film, Image as ImageIcon, FileText } from 'lucide-react';
import { FILE_RULES, formatFileSize, validateFile, createPreviewUrl } from '../utils/fileHelpers';

export const FileUploadCard = ({
  ruleKey,
  file,
  onFileSelect,
  onFileRemove,
  error,
  isVideo = false
}) => {
  const rule = FILE_RULES[ruleKey] || {};
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile) => {
    const err = validateFile(selectedFile, ruleKey);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError(null);
    onFileSelect(selectedFile);
  };

  const activeError = error || localError;
  const isImage = file && (file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name));
  const previewUrl = file ? createPreviewUrl(file) : null;

  return (
    <div className="form-group">
      <label className="form-label">
        <span>
          <span className="label-text-hi">{rule.labelHi}</span>
          <span className="required-star">*</span>
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          अधिकतम: {rule.maxSizeMB}MB
        </span>
      </label>

      {!file ? (
        <div
          className={`upload-card-wrapper ${dragActive ? 'has-file' : ''} ${activeError ? 'has-error' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={rule.allowedExtensions ? rule.allowedExtensions.join(',') : '*'}
            style={{ display: 'none' }}
            onChange={handleChange}
          />

          <div className="upload-icon-circle">
            {isVideo ? <Film size={24} /> : <UploadCloud size={24} />}
          </div>

          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            फ़ाइल चुनें या यहाँ ड्रैग करें (Click to Browse or Drag File)
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {rule.hintHi}
          </div>
        </div>
      ) : (
        <div className="file-preview-box">
          {isVideo ? (
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film size={20} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{file.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatFileSize(file.size)} • {file.type || 'Video'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-file"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    onFileRemove();
                  }}
                  title="फ़ाइल हटाएं (Remove)"
                >
                  <X size={16} />
                </button>
              </div>

              {previewUrl && (
                <video
                  src={previewUrl}
                  controls
                  className="video-player-preview"
                />
              )}
            </div>
          ) : (
            <>
              {isImage && previewUrl ? (
                <img src={previewUrl} alt="Preview" className="file-thumbnail" />
              ) : (
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}
                >
                  <FileText size={24} />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {file.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formatFileSize(file.size)} • <span style={{ color: 'var(--success)' }}>अपलोड तैयार</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-remove-file"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  onFileRemove();
                }}
                title="फ़ाइल हटाएं (Remove)"
              >
                <X size={16} />
              </button>
            </>
          )}
        </div>
      )}

      {activeError && (
        <div className="error-message">
          <AlertCircle size={14} />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
};
