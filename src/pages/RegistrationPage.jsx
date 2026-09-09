import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { StepNavigation } from '../components/StepNavigation';
import { Step1BasicDetails } from '../components/Step1BasicDetails';
import { Step2ArtDetails } from '../components/Step2ArtDetails';
import { Step3DocumentsUpload } from '../components/Step3DocumentsUpload';
import { Step4SocialLinks } from '../components/Step4SocialLinks';
import { SuccessModal } from '../components/SuccessModal';

import {
  validateMobile,
  validatePincode,
  validateExperience,
  validateEmail,
  validateDOB,
  validateArtDescription,
  validateNameMatching,
  validateUrl
} from '../utils/validation';

import { submitArtistRegistration } from '../services/apiService';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

const INITIAL_STATE = {
  fullName: '',
  fatherHusbandName: '',
  dob: '',
  gender: '',
  mobile: '',
  email: '',
  address: '',
  district: '',
  state: '',
  pincode: '',

  category: 'lok',
  discipline: 'gayan',
  artDescription: '',
  experience: '',

  aadhaarName: '',
  passbookName: '',
  files: {
    photo: null,
    video: null,
    pan: null,
    aadhaarFront: null,
    aadhaarBack: null,
    passbook: null
  },

  youtube: '',
  instagram: '',
  facebook: '',
  portfolio: '',
  declaration: false
};

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [formKey, setFormKey] = useState(1);

  // Field change handler
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // File upload handler
  const handleFileSelect = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [key]: file
      }
    }));

    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // File remove handler
  const handleFileRemove = (key) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [key]: null
      }
    }));
  };

  // 1-Click Demo Data filler
  const handleFillSampleData = (sample) => {
    const dummyBlob = new Blob(["Sample Document Content for Demo Testing"], { type: "image/png" });
    const dummyPhoto = new File([dummyBlob], "applicant_photo.png", { type: "image/png" });
    const dummyPan = new File([dummyBlob], "pan_card.png", { type: "image/png" });
    const dummyAadhaarF = new File([dummyBlob], "aadhaar_front.png", { type: "image/png" });
    const dummyAadhaarB = new File([dummyBlob], "aadhaar_back.png", { type: "image/png" });
    const dummyPassbook = new File([dummyBlob], "bank_passbook.png", { type: "image/png" });
    const dummyVideoBlob = new Blob(["Sample Video Content"], { type: "video/mp4" });
    const dummyVideo = new File([dummyVideoBlob], "performance_clip.mp4", { type: "video/mp4" });

    setFormData({
      ...sample,
      declaration: true,
      files: {
        photo: dummyPhoto,
        video: dummyVideo,
        pan: dummyPan,
        aadhaarFront: dummyAadhaarF,
        aadhaarBack: dummyAadhaarB,
        passbook: dummyPassbook
      }
    });

    setErrors({});
    setCompletedSteps([1, 2, 3]);
  };

  // Trigger Reset Modal
  const handleResetClick = () => {
    setShowResetModal(true);
  };

  // Perform Complete Form Reset
  const executeReset = () => {
    setFormData(INITIAL_STATE);
    setCurrentStep(1);
    setCompletedSteps([]);
    setErrors({});
    setSubmissionResult(null);
    setShowResetModal(false);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "पूरा नाम अनिवार्य है / Full Name is required";
    if (!formData.fatherHusbandName.trim()) newErrors.fatherHusbandName = "पिता/पति का नाम अनिवार्य है / Father/Husband Name is required";
    
    const dobErr = validateDOB(formData.dob);
    if (dobErr) newErrors.dob = dobErr;

    if (!formData.gender) newErrors.gender = "लिंग चुनें / Select Gender";

    const mobErr = validateMobile(formData.mobile);
    if (mobErr) newErrors.mobile = mobErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    if (!formData.address.trim()) newErrors.address = "स्थाई पता अनिवार्य है / Address is required";
    if (!formData.state) newErrors.state = "राज्य चुनें / Select State";
    if (!formData.district.trim()) newErrors.district = "जिला अनिवार्य है / District is required";

    const pinErr = validatePincode(formData.pincode);
    if (pinErr) newErrors.pincode = pinErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = "कला श्रेणी चुनें / Select Category";
    if (!formData.discipline) newErrors.discipline = "कला विधा चुनें / Select Discipline";

    const descErr = validateArtDescription(formData.artDescription);
    if (descErr) newErrors.artDescription = descErr;

    const expErr = validateExperience(formData.experience);
    if (expErr) newErrors.experience = expErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3 (Documents & Strict Name Match)
  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.aadhaarName.trim()) newErrors.aadhaarName = "आधार कार्ड का नाम अनिवार्य है / Aadhaar Name is required";
    if (!formData.passbookName.trim()) newErrors.passbookName = "पासबुक का नाम अनिवार्य है / Passbook Name is required";

    // Strict Name Match check
    const matchResult = validateNameMatching(formData.fullName, formData.aadhaarName, formData.passbookName);
    if (!matchResult.isValid) {
      newErrors.aadhaarName = "आवेदक का नाम, आधार नाम और पासबुक नाम एक समान (Exact Match) होने चाहिए!";
      newErrors.passbookName = "नाम मेल न खाने पर पंजीकरण अस्वीकार कर दिया जाएगा।";
    }

    // Required File Checks
    if (!formData.files.photo) newErrors.photo = "फोटो अपलोड अनिवार्य है (JPG/PNG, max 2MB)";
    if (!formData.files.video) newErrors.video = "कला प्रदर्शन वीडियो अनिवार्य है (MP4/MOV, max 50MB)";
    if (!formData.files.pan) newErrors.pan = "पैन कार्ड अपलोड अनिवार्य है (max 5MB)";
    if (!formData.files.aadhaarFront) newErrors.aadhaarFront = "आधार कार्ड (सामने का भाग) अपलोड अनिवार्य है (max 5MB)";
    if (!formData.files.aadhaarBack) newErrors.aadhaarBack = "आधार कार्ड (पीछे का भाग) अपलोड अनिवार्य है (max 5MB)";
    if (!formData.files.passbook) newErrors.passbook = "बैंक पासबुक / चेक फोटो अपलोड अनिवार्य है (max 5MB)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 4
  const validateStep4 = () => {
    const newErrors = {};
    if (formData.youtube) {
      const err = validateUrl(formData.youtube);
      if (err) newErrors.youtube = err;
    }
    if (formData.instagram) {
      const err = validateUrl(formData.instagram);
      if (err) newErrors.instagram = err;
    }
    if (formData.facebook) {
      const err = validateUrl(formData.facebook);
      if (err) newErrors.facebook = err;
    }
    if (formData.portfolio) {
      const err = validateUrl(formData.portfolio);
      if (err) newErrors.portfolio = err;
    }
    if (!formData.declaration) {
      newErrors.declaration = "कृपया आगे बढ़ने के लिए शपथ-पत्र (Declaration) स्वीकार करें।";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Next Step Action
  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();

    if (isValid) {
      setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Previous Step Action
  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step click navigation
  const handleStepClick = (stepId) => {
    if (stepId < currentStep || completedSteps.includes(stepId - 1)) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();
    const isStep3Valid = validateStep3();
    const isStep4Valid = validateStep4();

    if (!isStep1Valid || !isStep2Valid || !isStep3Valid || !isStep4Valid) {
      if (!isStep1Valid) setCurrentStep(1);
      else if (!isStep2Valid) setCurrentStep(2);
      else if (!isStep3Valid) setCurrentStep(3);
      else if (!isStep4Valid) setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitArtistRegistration(formData, (p) => setSubmitProgress(p));
      setSubmissionResult(result);
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Portal Header */}
      <Header
        onFillSampleData={handleFillSampleData}
        onResetForm={handleResetClick}
        onOpenAdmin={() => {
          navigate('/admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Stepper Progress Bar */}
      <StepNavigation
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />

      {/* Dynamic Step Content with Reset Key */}
      <form key={formKey} onSubmit={handleSubmit} noValidate>
        {currentStep === 1 && (
          <Step1BasicDetails
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <Step2ArtDetails
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <Step3DocumentsUpload
            formData={formData}
            onChange={handleFieldChange}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            errors={errors}
          />
        )}

        {currentStep === 4 && (
          <Step4SocialLinks
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        )}

        {/* Footer Actions */}
        <div className="form-actions-footer">
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrev}
            >
              <ArrowLeft size={18} />
              <span>पिछला चरण (Previous)</span>
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
            >
              <span>अगला चरण (Next Step)</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ minWidth: '220px' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>प्रस्तुत हो रहा है... ({submitProgress}%)</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>आवेदन जमा करें (Submit Registration)</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Custom Reset Confirmation Modal */}
      {showResetModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}
              >
                <AlertTriangle size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 800 }}>
                फॉर्म रीसेट करें? (Reset Form?)
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                क्या आप वाकई सभी भरे हुए विवरण और अपलोड की गई फाइलों को हटाकर नया फॉर्म शुरू करना चाहते हैं?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowResetModal(false)}
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: 'var(--danger)', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                  onClick={executeReset}
                >
                  हाँ, रीसेट करें (Yes, Reset)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {submissionResult && (
        <SuccessModal
          submissionResult={submissionResult}
          onClose={() => setSubmissionResult(null)}
          onRegisterNew={() => {
            setFormData(INITIAL_STATE);
            setCurrentStep(1);
            setCompletedSteps([]);
            setErrors({});
            setSubmissionResult(null);
            setFormKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
};
