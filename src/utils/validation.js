/**
 * Utility functions for Artist Registration Form Validations
 */

// Mobile Number: Exactly 10 digits, starts with 6-9
export const validateMobile = (mobile) => {
  if (!mobile) return "मोबाइल नंबर अनिवार्य है / Mobile number is required";
  const cleaned = mobile.trim();
  if (!/^\d+$/.test(cleaned)) return "केवल अंक दर्ज करें / Only digits allowed";
  if (cleaned.length !== 10) return "मोबाइल नंबर ठीक 10 अंकों का होना चाहिए / Must be exactly 10 digits";
  if (!/^[6-9]\d{9}$/.test(cleaned)) return "मान्य भारतीय मोबाइल नंबर दर्ज करें (6-9 से शुरू) / Enter valid 10-digit mobile number";
  return null;
};

// Pincode: Exactly 6 digits, starts with 1-9
export const validatePincode = (pincode) => {
  if (!pincode) return "पिनकोड अनिवार्य है / Pincode is required";
  const cleaned = pincode.trim();
  if (!/^\d+$/.test(cleaned)) return "पिनकोड में केवल अंक होने चाहिए / Pincode must contain only digits";
  if (cleaned.length !== 6) return "पिनकोड ठीक 6 अंकों का होना चाहिए / Pincode must be exactly 6 digits";
  if (!/^[1-9]\d{5}$/.test(cleaned)) return "मान्य 6 अंकों का पिनकोड दर्ज करें / Invalid pincode format";
  return null;
};

// Aadhaar Number: Exactly 12 digits (handles formatted spaces like 1234 5678 9012 or raw 12 digits)
export const validateAadhaarNumber = (aadhaar) => {
  if (!aadhaar) return "आधार कार्ड संख्या अनिवार्य है / Aadhaar Number is required";
  const cleaned = aadhaar.toString().replace(/\s+/g, "").trim();
  if (!/^\d+$/.test(cleaned)) return "आधार में केवल 12 अंक होने चाहिए / Only digits allowed";
  if (cleaned.length !== 12) return "आधार कार्ड ठीक 12 अंकों का होना चाहिए / Must be exactly 12 digits";
  return null;
};

// Experience: Numeric (0-70 years)
export const validateExperience = (exp) => {
  if (exp === "" || exp === null || exp === undefined) {
    return "अनुभव (वर्ष) अनिवार्य है / Experience is required";
  }
  const num = Number(exp);
  if (isNaN(num)) return "अनुभव केवल संख्यात्मक होना चाहिए / Experience must be a number";
  if (num < 0 || num > 75) return "कृपया मान्य अनुभव (0 से 75 वर्ष) दर्ज करें / Must be between 0 and 75 years";
  return null;
};

// Email: Optional, but RFC-valid format if filled
export const validateEmail = (email) => {
  if (!email || email.trim() === "") return null;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email.trim())) {
    return "अमान्य ईमेल प्रारूप / Invalid email format (e.g., artist@example.com)";
  }
  return null;
};

// Word counter for Art Description (Max 10 words)
export const countWords = (text) => {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
};

export const validateArtDescription = (text) => {
  if (!text || text.trim() === "") {
    return "कला विवरण अनिवार्य है / Art description is required";
  }
  const count = countWords(text);
  if (count > 10) {
    return `अधिकतम 10 शब्द ही अनुमत हैं (वर्तमान: ${count} शब्द) / Maximum 10 words allowed (Current: ${count})`;
  }
  return null;
};

// Date of Birth: Must be at least 5 years old and not in future
export const validateDOB = (dob) => {
  if (!dob) return "जन्म तिथि अनिवार्य है / Date of Birth is required";
  const birthDate = new Date(dob);
  const today = new Date();
  if (isNaN(birthDate.getTime())) return "अमान्य जन्म तिथि / Invalid Date of Birth";
  if (birthDate > today) return "जन्म तिथि भविष्य की नहीं हो सकती / DOB cannot be in the future";
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 5) return "आयु कम से कम 5 वर्ष होनी चाहिए / Age must be at least 5 years";
  if (age > 110) return "कृपया मान्य जन्म तिथि दर्ज करें / Please enter a valid Date of Birth";
  return null;
};

export const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  if (isNaN(birthDate.getTime())) return null;
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

// Exact Name Match Validator (Applicant Full Name, Aadhaar Name, Bank Passbook Name)
// Rule: Applicant name, आधार नाम और पासबुक नाम exact match होने चाहिएँ, वरना form reject हो जाएगा।
export const normalizeName = (name) => {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // Normalize multiple whitespaces
    .replace(/[.,]/g, ""); // Ignore subtle dot punctuation differences e.g. "Dr." vs "Dr"
};

export const validateNameMatching = (applicantName, aadhaarName, passbookName) => {
  const normApplicant = normalizeName(applicantName);
  const normAadhaar = normalizeName(aadhaarName);
  const normPassbook = normalizeName(passbookName);

  if (!normApplicant || !normAadhaar || !normPassbook) {
    return {
      isValid: false,
      isPending: true,
      mismatches: [],
      messageHi: "कृपया तीनों नामों (आवेदक नाम, आधार नाम, पासबुक नाम) को भरें।",
      messageEn: "Please fill all three names (Applicant, Aadhaar, Passbook) to verify match."
    };
  }

  const mismatches = [];
  if (normApplicant !== normAadhaar) {
    mismatches.push("Aadhaar Name does not match Applicant Name (आधार कार्ड का नाम और आवेदक का नाम मेल नहीं खा रहा)");
  }
  if (normApplicant !== normPassbook) {
    mismatches.push("Passbook Name does not match Applicant Name (पासबुक का नाम और आवेदक का नाम मेल नहीं खा रहा)");
  }
  if (normAadhaar !== normPassbook) {
    mismatches.push("Aadhaar Name and Passbook Name do not match (आधार और पासबुक के नाम आपस में मेल नहीं खा रहे)");
  }

  if (mismatches.length > 0) {
    return {
      isValid: false,
      isPending: false,
      mismatches,
      messageHi: "⚠️ अस्वीकृति चेतावनी: आवेदक का नाम, आधार कार्ड का नाम और पासबुक का नाम 100% मेल खाना अनिवार्य है!",
      messageEn: "⚠️ Rejection Warning: Applicant Name, Aadhaar Name, and Bank Passbook Name must match exactly!"
    };
  }

  return {
    isValid: true,
    isPending: false,
    mismatches: [],
    messageHi: "✅ नाम सत्यापन सफल: तीनों नाम शत-प्रतिशत मेल खाते हैं।",
    messageEn: "✅ Name Verification Successful: All three names match perfectly."
  };
};

// Validate URL if provided
export const validateUrl = (url) => {
  if (!url || url.trim() === "") return null;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "URL http:// या https:// से शुरू होना चाहिए / URL must start with http:// or https://";
    }
    return null;
  } catch (e) {
    return "अमान्य लिंक प्रारूप / Invalid URL format (e.g., https://youtube.com/...)";
  }
};
