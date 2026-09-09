/**
 * File validation and preview helpers for Artist Registration Form
 */

export const FILE_RULES = {
  photo: {
    labelHi: "आवेदक की फोटो (Applicant Photo)",
    labelEn: "Applicant Photo",
    maxSizeMB: 2,
    maxSizeBytes: 2 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
    allowedExtensions: [".jpg", ".jpeg", ".png"],
    hintHi: "JPG / PNG प्रारूप, अधिकतम आकार 2MB",
    hintEn: "JPG / PNG format, maximum size 2MB"
  },
  video: {
    labelHi: "कला प्रदर्शन वीडियो (Performance Video)",
    labelEn: "Performance Video",
    maxSizeMB: 50,
    maxSizeBytes: 50 * 1024 * 1024,
    allowedTypes: ["video/mp4", "video/quicktime"],
    allowedExtensions: [".mp4", ".mov"],
    hintHi: "MP4 / MOV प्रारूप, अधिकतम आकार 50MB",
    hintEn: "MP4 / MOV format, maximum size 50MB"
  },
  pan: {
    labelHi: "पैन कार्ड (PAN Card)",
    labelEn: "PAN Card",
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".pdf"],
    hintHi: "JPG / PNG / PDF, अधिकतम आकार 5MB",
    hintEn: "JPG / PNG / PDF, maximum size 5MB"
  },
  aadhaarFront: {
    labelHi: "आधार कार्ड - सामने का भाग (Aadhaar Front Side)",
    labelEn: "Aadhaar Card Front Side",
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".pdf"],
    hintHi: "JPG / PNG / PDF, अधिकतम आकार 5MB",
    hintEn: "JPG / PNG / PDF, maximum size 5MB"
  },
  aadhaarBack: {
    labelHi: "आधार कार्ड - पीछे का भाग (Aadhaar Back Side)",
    labelEn: "Aadhaar Card Back Side",
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".pdf"],
    hintHi: "JPG / PNG / PDF, अधिकतम आकार 5MB",
    hintEn: "JPG / PNG / PDF, maximum size 5MB"
  },
  passbook: {
    labelHi: "बैंक पासबुक / चेक फोटो (Bank Passbook / Cheque)",
    labelEn: "Bank Passbook / Cheque",
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".pdf"],
    hintHi: "JPG / PNG / PDF, अधिकतम आकार 5MB",
    hintEn: "JPG / PNG / PDF, maximum size 5MB"
  }
};

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const validateFile = (file, ruleKey) => {
  const rule = FILE_RULES[ruleKey];
  if (!rule) return null;

  if (!file) {
    return "फ़ाइल अपलोड करना अनिवार्य है / File upload is required";
  }

  // Size validation
  if (file.size > rule.maxSizeBytes) {
    return `फ़ाइल का आकार अधिकतम सीमा (${rule.maxSizeMB}MB) से अधिक है। आपका आकार: ${formatFileSize(file.size)} / File exceeds max size (${rule.maxSizeMB}MB)`;
  }

  // Type validation
  const fileExt = "." + file.name.split(".").pop().toLowerCase();
  const isTypeValid =
    rule.allowedTypes.includes(file.type) ||
    rule.allowedExtensions.includes(fileExt);

  if (!isTypeValid) {
    return `अमान्य फ़ाइल प्रकार! केवल ${rule.allowedExtensions.join(", ")} अनुमत हैं। / Invalid file format. Only ${rule.allowedExtensions.join(", ")} allowed.`;
  }

  return null;
};

export const createPreviewUrl = (file) => {
  if (!file) return null;
  if (typeof file === 'string') return file;
  try {
    return URL.createObjectURL(file);
  } catch (e) {
    console.warn("Could not create object URL:", e);
    return null;
  }
};

