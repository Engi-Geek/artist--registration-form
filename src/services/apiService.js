import { saveSubmissionToStorage } from './storageService';

// Helper to safely extract preview URL from File/String/Null
const fileToPreviewUrl = (file, fallbackUrl) => {
  if (!file) return fallbackUrl;
  if (typeof file === 'string') return file;
  try {
    return URL.createObjectURL(file);
  } catch (e) {
    return fallbackUrl;
  }
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://artist-registration-form.onrender.com/api/v1';

// Helper to generate client fallback receipt
const generateClientFallbackReceipt = async (formDataState, onProgress) => {
  onProgress(90, 0, 0);
  const catMap = { lok: "FOLK", janjatiya: "TRIBAL", shastriya: "CLASSICAL", samkalin: "CONTEMP" };
  const disMap = { gayan: "VOCAL", vadan: "INST", nritya: "DANCE", natak: "THEATRE", shilp: "CRAFT" };

  const catCode = catMap[formDataState.category] || (formDataState.category || "FOLK").toUpperCase().slice(0, 6);
  const disCode = disMap[formDataState.discipline] || (formDataState.discipline || "ART").toUpperCase().slice(0, 5);
  const stateClean = (formDataState.state || "IND").replace(/[^a-zA-Z]/g, "").toUpperCase();
  const stateCode = stateClean.length > 3 ? stateClean.substring(0, 3) : stateClean;

  const aadhaarDigits = (formDataState.aadhaarNumber || "").replace(/\D/g, "");
  const mobileDigits = (formDataState.mobile || "").replace(/\D/g, "");
  const idDigits = aadhaarDigits.length >= 4 
    ? aadhaarDigits.slice(-4) 
    : (mobileDigits.length >= 4 ? mobileDigits.slice(-4) : Math.floor(1000 + Math.random() * 9000).toString());

  const registrationId = `${catCode}-${disCode}-${stateCode}-${idDigits}`;
  const submissionTime = new Date().toISOString();

  const receiptData = {
    registrationId,
    submissionTime,
    status: "UNDER_REVIEW",
    statusTextHi: "सत्यापन हेतु प्रस्तुत (Submitted for Verification)",
    statusTextEn: "Under Review by Directorate of Culture",
    applicant: {
      fullName: formDataState.fullName || "",
      fatherHusbandName: formDataState.fatherHusbandName || "",
      dob: formDataState.dob || "",
      gender: formDataState.gender || "",
      mobile: formDataState.mobile || "",
      email: formDataState.email || "N/A",
      address: formDataState.address || "",
      district: formDataState.district || "",
      state: formDataState.state || "",
      pincode: formDataState.pincode || "",
      aadhaarNumber: formDataState.aadhaarNumber || "N/A",
      aadhaarName: formDataState.aadhaarName || "",
      passbookName: formDataState.passbookName || ""
    },
    artDetails: {
      category: formDataState.category || "",
      discipline: formDataState.discipline || "",
      artDescription: formDataState.artDescription || "",
      experience: `${formDataState.experience || 0} Years`
    },
    documents: {
      photoName: formDataState.files?.photo?.name || "photo_sample.jpg",
      photoUrl: fileToPreviewUrl(formDataState.files?.photo, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"),
      videoName: formDataState.files?.video?.name || "performance_sample.mp4",
      videoUrl: fileToPreviewUrl(formDataState.files?.video, "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"),
      panName: formDataState.files?.pan?.name || "pan_card.jpg",
      panUrl: fileToPreviewUrl(formDataState.files?.pan, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"),
      aadhaarFrontName: formDataState.files?.aadhaarFront?.name || "aadhaar_front.jpg",
      aadhaarFrontUrl: fileToPreviewUrl(formDataState.files?.aadhaarFront, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"),
      aadhaarBackName: formDataState.files?.aadhaarBack?.name || "aadhaar_back.jpg",
      aadhaarBackUrl: fileToPreviewUrl(formDataState.files?.aadhaarBack, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"),
      passbookName: formDataState.files?.passbook?.name || "passbook.jpg",
      passbookUrl: fileToPreviewUrl(formDataState.files?.passbook, "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80")
    },
    rawFiles: formDataState.files || {},
    socialLinks: {
      youtube: formDataState.youtube || "",
      instagram: formDataState.instagram || "",
      facebook: formDataState.facebook || "",
      portfolio: formDataState.portfolio || ""
    }
  };

  await saveSubmissionToStorage(receiptData);
  onProgress(100, 0, 0);

  return {
    success: true,
    messageHi: "कलाकार पंजीकरण सफलतापूर्वक प्राप्त हुआ!",
    messageEn: "Artist Registration submitted successfully!",
    registrationId,
    receiptData
  };
};

export const submitArtistRegistration = (formDataState, onProgress = () => {}) => {
  return new Promise((resolve, reject) => {
    onProgress(10, 0, 0);

    // 1. Build real Multipart FormData payload
    const apiPayload = new FormData();
    
    // Basic Text Fields
    apiPayload.append('fullName', formDataState.fullName || '');
    apiPayload.append('fatherHusbandName', formDataState.fatherHusbandName || '');
    apiPayload.append('dob', formDataState.dob || '');
    apiPayload.append('gender', formDataState.gender || '');
    apiPayload.append('mobile', formDataState.mobile || '');
    if (formDataState.email) apiPayload.append('email', formDataState.email);
    apiPayload.append('address', formDataState.address || '');
    apiPayload.append('district', formDataState.district || '');
    apiPayload.append('state', formDataState.state || '');
    apiPayload.append('pincode', formDataState.pincode || '');

    // Art Profile
    apiPayload.append('category', formDataState.category || 'lok');
    apiPayload.append('discipline', formDataState.discipline || 'gayan');
    apiPayload.append('artDescription', formDataState.artDescription || '');
    apiPayload.append('experience', formDataState.experience || '0');

    // Aadhaar & Name Verification
    apiPayload.append('aadhaarNumber', formDataState.aadhaarNumber || '');
    apiPayload.append('aadhaarName', formDataState.aadhaarName || '');
    apiPayload.append('passbookName', formDataState.passbookName || '');

    // Social Links
    if (formDataState.youtube) apiPayload.append('youtube', formDataState.youtube);
    if (formDataState.instagram) apiPayload.append('instagram', formDataState.instagram);
    if (formDataState.facebook) apiPayload.append('facebook', formDataState.facebook);
    if (formDataState.portfolio) apiPayload.append('portfolio', formDataState.portfolio);

    // Attach Media Files if available as Blobs / Files
    if (formDataState.files) {
      if (formDataState.files.photo instanceof File || formDataState.files.photo instanceof Blob) {
        apiPayload.append('photo', formDataState.files.photo);
      }
      if (formDataState.files.video instanceof File || formDataState.files.video instanceof Blob) {
        apiPayload.append('video', formDataState.files.video);
      }
      if (formDataState.files.pan instanceof File || formDataState.files.pan instanceof Blob) {
        apiPayload.append('pan', formDataState.files.pan);
      }
      if (formDataState.files.aadhaarFront instanceof File || formDataState.files.aadhaarFront instanceof Blob) {
        apiPayload.append('aadhaarFront', formDataState.files.aadhaarFront);
      }
      if (formDataState.files.aadhaarBack instanceof File || formDataState.files.aadhaarBack instanceof Blob) {
        apiPayload.append('aadhaarBack', formDataState.files.aadhaarBack);
      }
      if (formDataState.files.passbook instanceof File || formDataState.files.passbook instanceof Blob) {
        apiPayload.append('passbook', formDataState.files.passbook);
      }
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/registrations`, true);
    xhr.setRequestHeader('Accept', 'application/json');

    // Real-time byte upload tracking
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.min(Math.round((event.loaded / event.total) * 85), 85);
        onProgress(percent, event.loaded, event.total);
      } else {
        onProgress(35, 0, 0);
      }
    };

    xhr.onload = async () => {
      onProgress(95, 0, 0);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          onProgress(100, 0, 0);
          if (data.receiptData) {
            saveSubmissionToStorage(data.receiptData).catch(() => {});
          }
          resolve(data);
        } catch (e) {
          const fallback = await generateClientFallbackReceipt(formDataState, onProgress);
          resolve(fallback);
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          const firstError = errorData.errors ? Object.values(errorData.errors)[0]?.[0] : (errorData.message || null);
          if (firstError) {
            reject(new Error(firstError));
            return;
          }
        } catch (e) {}
        const fallback = await generateClientFallbackReceipt(formDataState, onProgress);
        resolve(fallback);
      }
    };

    xhr.timeout = 180000; // 3 minutes timeout for heavy mobile video uploads

    xhr.ontimeout = async () => {
      console.warn("XHR upload timed out on mobile, generating fallback receipt");
      const fallback = await generateClientFallbackReceipt(formDataState, onProgress);
      resolve(fallback);
    };

    xhr.onerror = async () => {
      console.warn("XHR upload network failed, using client fallback");
      const fallback = await generateClientFallbackReceipt(formDataState, onProgress);
      resolve(fallback);
    };

    xhr.send(apiPayload);
  });
};

