/**
 * API Service for Artist Registration Form
 * Formatted to mimic standard REST API endpoint with FormData and JSON payload
 */

export const submitArtistRegistration = async (formDataState, onProgress = () => {}) => {
  // Simulate network request progress
  onProgress(15);
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  onProgress(45);
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  onProgress(75);
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  onProgress(100);
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Generate unique registration ID based on state code and timestamp
  const stateCode = (formDataState.state || "IND").substring(0, 3).toUpperCase();
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const registrationId = `ART-2026-${stateCode}-${randomDigits}`;

  const submissionTime = new Date().toISOString();

  // Create clean serialized summary for storage and receipt
  const receiptData = {
    registrationId,
    submissionTime,
    status: "SUBMITTED_FOR_VERIFICATION",
    statusTextHi: "सत्यापन हेतु प्रस्तुत (Submitted for Verification)",
    statusTextEn: "Under Review by Directorate of Culture",
    applicant: {
      fullName: formDataState.fullName,
      fatherHusbandName: formDataState.fatherHusbandName,
      dob: formDataState.dob,
      gender: formDataState.gender,
      mobile: formDataState.mobile,
      email: formDataState.email || "N/A",
      address: formDataState.address,
      district: formDataState.district,
      state: formDataState.state,
      pincode: formDataState.pincode
    },
    artDetails: {
      category: formDataState.category,
      discipline: formDataState.discipline,
      artDescription: formDataState.artDescription,
      experience: `${formDataState.experience} Years`
    },
    documents: {
      photoName: formDataState.files.photo ? formDataState.files.photo.name : "N/A",
      videoName: formDataState.files.video ? formDataState.files.video.name : "N/A",
      panName: formDataState.files.pan ? formDataState.files.pan.name : "N/A",
      aadhaarFrontName: formDataState.files.aadhaarFront ? formDataState.files.aadhaarFront.name : "N/A",
      aadhaarBackName: formDataState.files.aadhaarBack ? formDataState.files.aadhaarBack.name : "N/A",
      passbookName: formDataState.files.passbook ? formDataState.files.passbook.name : "N/A"
    },
    socialLinks: {
      youtube: formDataState.youtube || "",
      instagram: formDataState.instagram || "",
      facebook: formDataState.facebook || "",
      portfolio: formDataState.portfolio || ""
    }
  };

  // Save to localStorage for demo persistence
  try {
    const existing = JSON.parse(localStorage.getItem("artist_registrations") || "[]");
    existing.unshift(receiptData);
    localStorage.setItem("artist_registrations", JSON.stringify(existing.slice(0, 20)));
  } catch (err) {
    console.warn("LocalStorage save error:", err);
  }

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
