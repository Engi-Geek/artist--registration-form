/**
 * Persistent Storage Service using IndexedDB + LocalStorage fallback
 * Prevents QuotaExceededError and maintains persistent media files across routes and page reloads.
 */

const DB_NAME = "ArtistRegistrationDB";
const DB_VERSION = 1;
const STORE_NAME = "submissions";

// Open IndexedDB safely
const openDB = () => {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "registrationId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
};

/**
 * Save full submission including file blobs to IndexedDB
 */
export const saveSubmissionToStorage = async (record) => {
  try {
    const db = await openDB();
    if (db) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(record);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    }
  } catch (err) {
    console.warn("IndexedDB save error (falling back to LocalStorage):", err);
  }

  // Also maintain lightweight metadata in LocalStorage (without large Blobs to prevent QuotaExceededError)
  try {
    const safeRecord = {
      ...record,
      // Strip any raw File/Blob objects for clean JSON stringification
      rawFiles: undefined
    };
    const existing = JSON.parse(localStorage.getItem("artist_registrations") || "[]");
    const filtered = existing.filter((item) => item.registrationId !== record.registrationId);
    filtered.unshift(safeRecord);
    // Keep max 50 recent records in localStorage
    localStorage.setItem("artist_registrations", JSON.stringify(filtered.slice(0, 50)));
  } catch (err) {
    console.warn("LocalStorage quota or write warning:", err);
  }
};

/**
 * Get all registrations from IndexedDB and LocalStorage merged with Seed Data
 */
export const getAllStoredRegistrations = async (seedData = []) => {
  const mergedMap = new Map();

  // 1. First load from IndexedDB (has real uploaded Blobs)
  try {
    const db = await openDB();
    if (db) {
      const records = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });

      records.forEach((rec) => {
        // If raw files exist, generate active object URLs
        if (rec.rawFiles) {
          try {
            if (rec.rawFiles.photo && typeof rec.rawFiles.photo !== 'string') {
              rec.documents.photoUrl = URL.createObjectURL(rec.rawFiles.photo);
            }
            if (rec.rawFiles.video && typeof rec.rawFiles.video !== 'string') {
              rec.documents.videoUrl = URL.createObjectURL(rec.rawFiles.video);
            }
            if (rec.rawFiles.pan && typeof rec.rawFiles.pan !== 'string') {
              rec.documents.panUrl = URL.createObjectURL(rec.rawFiles.pan);
            }
            if (rec.rawFiles.aadhaarFront && typeof rec.rawFiles.aadhaarFront !== 'string') {
              rec.documents.aadhaarFrontUrl = URL.createObjectURL(rec.rawFiles.aadhaarFront);
            }
            if (rec.rawFiles.aadhaarBack && typeof rec.rawFiles.aadhaarBack !== 'string') {
              rec.documents.aadhaarBackUrl = URL.createObjectURL(rec.rawFiles.aadhaarBack);
            }
            if (rec.rawFiles.passbook && typeof rec.rawFiles.passbook !== 'string') {
              rec.documents.passbookUrl = URL.createObjectURL(rec.rawFiles.passbook);
            }
          } catch (e) {
            console.warn("Failed to recreate blob URL:", e);
          }
        }
        mergedMap.set(rec.registrationId, rec);
      });
    }
  } catch (err) {
    console.warn("Error reading from IndexedDB:", err);
  }

  // 2. Merge with LocalStorage entries
  try {
    const local = JSON.parse(localStorage.getItem("artist_registrations") || "[]");
    local.forEach((item) => {
      if (!mergedMap.has(item.registrationId)) {
        mergedMap.set(item.registrationId, item);
      }
    });
  } catch (e) {
    console.warn("Error reading LocalStorage:", e);
  }

  // 3. Merge with Seed Data
  seedData.forEach((seed) => {
    if (!mergedMap.has(seed.registrationId)) {
      mergedMap.set(seed.registrationId, seed);
    }
  });

  return Array.from(mergedMap.values());
};

/**
 * Update single record status across storage
 */
export const updateStoredRegistrationStatus = async (registrationId, newStatus) => {
  const statusHi = newStatus === 'APPROVED' ? 'स्वीकृत (Approved)' : 'अस्वीकृत (Rejected)';
  const statusEn = newStatus === 'APPROVED' ? 'Verified & Approved' : 'Application Rejected';

  // Update in IndexedDB
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(registrationId);
      req.onsuccess = () => {
        if (req.result) {
          const updated = {
            ...req.result,
            status: newStatus,
            statusTextHi: statusHi,
            statusTextEn: statusEn
          };
          store.put(updated);
        }
      };
    }
  } catch (err) {
    console.warn("Error updating status in IndexedDB:", err);
  }

  // Update in LocalStorage
  try {
    const local = JSON.parse(localStorage.getItem("artist_registrations") || "[]");
    const updatedLocal = local.map((item) => {
      if (item.registrationId === registrationId) {
        return {
          ...item,
          status: newStatus,
          statusTextHi: statusHi,
          statusTextEn: statusEn
        };
      }
      return item;
    });
    localStorage.setItem("artist_registrations", JSON.stringify(updatedLocal));
  } catch (e) {}
};
