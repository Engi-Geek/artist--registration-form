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

export const submitArtistRegistration = async (formDataState, onProgress = () => {}) => {
  // Simulate network request progress
  onProgress(15);
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  onProgress(45);
  await new Promise((resolve) => setTimeout(resolve, 250));
  
  onProgress(75);
  await new Promise((resolve) => setTimeout(resolve, 250));
  
  onProgress(100);
  await new Promise((resolve) => setTimeout(resolve, 150));

  // Generate unique registration ID based on state code and timestamp
  const stateCode = (formDataState.state || "IND").substring(0, 3).toUpperCase();
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const registrationId = `ART-2026-${stateCode}-${randomDigits}`;
  const submissionTime = new Date().toISOString();

  // Create clean serialized summary for storage and receipt
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
      pincode: formDataState.pincode || ""
    },
    artDetails: {
      category: formDataState.category || "",
      discipline: formDataState.discipline || "",
      artDescription: formDataState.artDescription || "",
      experience: `${formDataState.experience || 0} Years`
    },
    documents: {
      photoName: formDataState.files?.photo?.name || (typeof formDataState.files?.photo === 'string' ? "photo_sample.jpg" : "N/A"),
      photoUrl: fileToPreviewUrl(formDataState.files?.photo, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"),
      videoName: formDataState.files?.video?.name || (typeof formDataState.files?.video === 'string' ? "performance_sample.mp4" : "N/A"),
      videoUrl: fileToPreviewUrl(formDataState.files?.video, "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"),
      panName: formDataState.files?.pan?.name || (typeof formDataState.files?.pan === 'string' ? "pan_card.jpg" : "N/A"),
      panUrl: fileToPreviewUrl(formDataState.files?.pan, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"),
      aadhaarFrontName: formDataState.files?.aadhaarFront?.name || (typeof formDataState.files?.aadhaarFront === 'string' ? "aadhaar_front.jpg" : "N/A"),
      aadhaarFrontUrl: fileToPreviewUrl(formDataState.files?.aadhaarFront, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"),
      aadhaarBackName: formDataState.files?.aadhaarBack?.name || (typeof formDataState.files?.aadhaarBack === 'string' ? "aadhaar_back.jpg" : "N/A"),
      aadhaarBackUrl: fileToPreviewUrl(formDataState.files?.aadhaarBack, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"),
      passbookName: formDataState.files?.passbook?.name || (typeof formDataState.files?.passbook === 'string' ? "passbook.jpg" : "N/A"),
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

  // Asynchronously save to storage without blocking or crashing
  await saveSubmissionToStorage(receiptData);

  return {
    success: true,
    messageHi: "कलाकार पंजीकरण सफलतापूर्वक प्राप्त हुआ!",
    messageEn: "Artist Registration submitted successfully!",
    registrationId,
    receiptData
  };
};

/**
 * Prepares a standard browser FormData object that can be passed directly to fetch/axios
 */
export const buildApiFormData = (formDataState) => {
  const data = new FormData();
  // Basic fields
  Object.keys(formDataState).forEach((key) => {
    if (key !== "files") {
      data.append(key, formDataState[key]);
    }
  });

  // Attach files if present
  if (formDataState.files) {
    Object.keys(formDataState.files).forEach((fileKey) => {
      const file = formDataState.files[fileKey];
      if (file) {
        data.append(fileKey, file);
      }
    });
  }

  return data;
};
