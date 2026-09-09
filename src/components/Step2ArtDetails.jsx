import React from 'react';
import { Palette, Clock, Award, AlertCircle } from 'lucide-react';
import { ART_CATEGORIES, ART_DISCIPLINES } from '../data/indianStates';
import { WordCounterInput } from './WordCounterInput';

export const Step2ArtDetails = ({ formData, onChange, errors }) => {
  return (
    <div className="form-section-card">
      <div className="section-header">
        <div className="section-title-group">
          <div className="section-icon-badge">
            <Palette size={22} />
          </div>
          <div>
            <h2>कला एवं विधा विवरण (Art & Discipline Details)</h2>
            <p>अपनी कला श्रेणी, विधा, अनुभव और 10 शब्दों का संक्षिप्त कला परिचय दर्ज करें।</p>
          </div>
        </div>
      </div>

      <div className="form-grid">
        {/* Category (लोक / जनजातीय) */}
        <div className="form-group col-span-full">
          <label className="form-label">
            <span>
              <span className="label-text-hi">कला श्रेणी (Art Category)</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="radio-card-grid">
            {ART_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`radio-card ${formData.category === cat.id ? 'selected' : ''}`}
                onClick={() => onChange('category', cat.id)}
              >
                <div className="radio-circle">
                  {formData.category === cat.id && <div className="radio-circle-dot" />}
                </div>
                <div className="radio-content">
                  <span className="radio-title">{cat.nameHi}</span>
                  <span className="radio-subtitle">{cat.description}</span>
                </div>
              </div>
            ))}
          </div>
          {errors.category && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.category}</span>
            </div>
          )}
        </div>

        {/* Discipline / Vidya (गायन/वादन/नृत्य/नाटक) */}
        <div className="form-group col-span-full">
          <label className="form-label">
            <span>
              <span className="label-text-hi">कला विधा (Art Discipline / Genre)</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="radio-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {ART_DISCIPLINES.map((disc) => (
              <div
                key={disc.id}
                className={`radio-card ${formData.discipline === disc.id ? 'selected' : ''}`}
                onClick={() => onChange('discipline', disc.id)}
              >
                <div className="radio-circle">
                  {formData.discipline === disc.id && <div className="radio-circle-dot" />}
                </div>
                <div className="radio-content">
                  <span className="radio-title">{disc.nameHi}</span>
                  <span className="radio-subtitle">{disc.examples}</span>
                </div>
              </div>
            ))}
          </div>
          {errors.discipline && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.discipline}</span>
            </div>
          )}
        </div>

        {/* Art Description with Word Counter (Max 10 Words) */}
        <div className="form-group col-span-full">
          <label className="form-label">
            <span>
              <span className="label-text-hi">कला विवरण (Art Description - Max 10 Words)</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <WordCounterInput
            value={formData.artDescription}
            onChange={(val) => onChange('artDescription', val)}
            maxWords={10}
            error={errors.artDescription}
            placeholder="अपनी कला का 10 शब्दों में संक्षिप्त परिचय लिखें (e.g. पारंपरिक राजस्थानी मांड एवं मांगणियार लोक गायन के सिद्धहस्त कलाकार)"
          />
        </div>

        {/* Experience in Years (Numeric only) */}
        <div className="form-group" style={{ maxWidth: '360px' }}>
          <label className="form-label" htmlFor="experience">
            <span>
              <span className="label-text-hi">कला अनुभव (वर्षों में)</span>
              <span className="label-text-en">/ Experience (Years)</span>
              <span className="required-star">*</span>
            </span>
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <Clock size={16} />
            </span>
            <input
              id="experience"
              type="text"
              className={`form-input input-with-icon-left ${errors.experience ? 'is-invalid' : ''}`}
              placeholder="e.g. 15"
              value={formData.experience}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                onChange('experience', val);
              }}
            />
          </div>
          {errors.experience && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.experience}</span>
            </div>
          )}
          <span className="helper-text">केवल संख्यात्मक मान (0 से 75 वर्ष तक) दर्ज करें</span>
        </div>
      </div>
    </div>
  );
};
