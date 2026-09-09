import React from 'react';
import { User, Palette, FileText, Share2, Check } from 'lucide-react';

export const STEPS = [
  { id: 1, titleHi: "मूल विवरण", titleEn: "Basic Details", icon: User },
  { id: 2, titleHi: "कला विवरण", titleEn: "Art Details", icon: Palette },
  { id: 3, titleHi: "दस्तावेज़", titleEn: "Documents", icon: FileText },
  { id: 4, titleHi: "लिंक्स व समीक्षा", titleEn: "Links & Review", icon: Share2 }
];

export const StepNavigation = ({ currentStep, onStepClick, completedSteps }) => {
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="stepper-card">
      <div className="stepper-track">
        {STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => onStepClick(step.id)}
            >
              <div className="step-number">
                {isCompleted ? <Check size={18} strokeWidth={2.8} /> : <Icon size={18} />}
              </div>
              <div className="step-text">
                <span className="step-title-hi">{step.titleHi}</span>
                <span className="step-title-en">{step.titleEn}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="progress-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
};
