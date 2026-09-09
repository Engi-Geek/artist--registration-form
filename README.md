# 🎭 कलाकार पंजीकरण पोर्टल (Artist Registration Portal)

A modern, responsive, and bilingual web application built with **React + Vite** and Vanilla CSS design system for registering folk and tribal artists with live validations, name verification matching, document upload previews, and a separate administrative dashboard.

![Artist Registration Portal](https://raw.githubusercontent.com/Engi-Geek/artist-registration-form/main/preview.png)

---

## 🌟 Key Features

### 1. 📋 Multi-Step Artist Registration Flow
- **Step 1: Basic Information (मूल व्यक्तिगत विवरण)**: Full Name, Father/Husband Name, Date of Birth with live age calculation, Gender, 10-digit mobile number, Email (optional with validation), Address, Indian State dropdown, District, and 6-digit Pincode.
- **Step 2: Art & Discipline Details (कला एवं विधा विवरण)**: Art category (Folk / Tribal / Classical / Contemporary), discipline (Vocal, Instrumental, Dance, Theatre, Crafts), **Art Description with live 10-word counter box**, and Experience in numeric years.
- **Step 3: Document & Media Uploads (दस्तावेज़ एवं मीडिया अपलोड)**:
  - 📷 Applicant Photo (JPG/PNG, max 2MB) with live preview
  - 🎬 Performance Video (MP4/MOV, max 50MB) with in-browser player
  - 📄 PAN Card (JPG/PNG/PDF, max 5MB)
  - 🆔 Aadhaar Card Front & Back (JPG/PNG/PDF, max 5MB each)
  - 🏦 Bank Passbook / Cheque (JPG/PNG/PDF, max 5MB)
- **Step 4: Social Links & Final Review (सोशल मीडिया व पूर्वावलोकन)**: YouTube, Instagram, Facebook, and Portfolio links + full structured application summary card + Self-declaration checkbox.
- **Step 5: Registration Success Modal & Acknowledgement Slip**: Instant unique Registration ID (e.g., `ART-2026-RAJ-84920`), celebration confetti, QR code placeholder, and print/download receipt options.

---

### 2. 🛡️ Strict 3-Way Name Matching Rule
- Real-time cross-verification comparing **Applicant Name**, **Aadhaar Card Name**, and **Bank Passbook Account Holder Name**.
- If any name mismatches, the system displays a clear rejection warning and blocks submission.

---

### 3. 🔐 Separate Admin Portal & Dashboard
- **Admin Authentication**: Access via the Header **"व्यवस्थापक लॉगिन (Admin)"** button.
  - *Demo Username*: `admin`
  - *Demo Password*: `admin@2026`
- **Dashboard Analytics**: Metrics for Total Registrations, Folk Artists, Tribal Artists, and Approved/Pending counts.
- **Search & Multi-Filter**: Filter by Name, Mobile, Reg ID, Art Category, Discipline, and State.
- **Application Detail Inspector Modal**: Inspect the full application, view attached documents, and update status (`Approved` / `Rejected`).
- **Export to CSV / Excel**: Download all entries in `.csv` format with one click.
- **Real-time Sync**: All submitted registrations appear instantly in the Admin list.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Engi-Geek/artist--registration-form.git

# Navigate into project directory
cd artist-registration-form

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be available at `http://localhost:5173/`.

### Build for Production
```bash
npm run build
```
Production output files will be created in the `dist/` directory, ready for deployment.

---

## 🌐 One-Click Deployment Guide

### Deploy on Vercel
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import `artist-registration-form` repository.
4. Framework Preset: **Vite**.
5. Click **Deploy**.

### Deploy on Netlify
1. Go to [Netlify](https://www.netlify.com/) and click **"Add new site" -> "Import an existing project"**.
2. Select your GitHub repository.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Click **Deploy Site**.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite (SPA)
- **Styling**: Vanilla CSS Design Tokens (Responsive, Glassmorphism, Google Fonts)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti
- **State Management**: React Hooks + LocalStorage Persistence & Simulated REST API

---

## 📄 License
MIT License. Created for Folk & Tribal Artist Registration Database.
