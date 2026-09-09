import React from 'react';
import { countWords } from '../utils/validation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const WordCounterInput = ({
  value,
  onChange,
  maxWords = 10,
  error,
  placeholder = "कला का संक्षिप्त विवरण दर्ज करें..."
}) => {
  const wordsUsed = countWords(value);
  const isOverLimit = wordsUsed > maxWords;
  const isNearLimit = wordsUsed >= maxWords - 2 && wordsUsed <= maxWords;

  let badgeClass = "safe";
  if (isOverLimit) badgeClass = "limit";
  else if (isNearLimit) badgeClass = "warning";

  return (
    <div className="word-counter-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          अधिकतम सीमा: <strong>{maxWords} शब्द</strong> (Max {maxWords} Words)
        </span>
        <span className={`word-counter-badge ${badgeClass}`}>
          {isOverLimit ? (
            <AlertCircle size={13} />
          ) : wordsUsed > 0 ? (
            <CheckCircle2 size={13} />
          ) : null}
          {wordsUsed} / {maxWords} शब्द (Words)
        </span>
      </div>

      <textarea
        className={`form-textarea ${error || isOverLimit ? 'is-invalid' : ''}`}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      {isOverLimit && (
        <div className="error-message">
          <AlertCircle size={14} />
          <span>शब्द सीमा पार हो गई है! कृपया विवरण को {maxWords} शब्दों या उससे कम में लिखें। (Exceeded {maxWords} words)</span>
        </div>
      )}

      {error && !isOverLimit && (
        <div className="error-message">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
