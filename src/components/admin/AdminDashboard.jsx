import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Palette,
  Sparkles,
  Search,
  Filter,
  Download,
  Eye,
  LogOut,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  FileSpreadsheet,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  Film,
  Music,
  Award
} from 'lucide-react';
import { SEED_REGISTRATIONS } from '../../data/seedRegistrations';
import { INDIAN_STATES, ART_CATEGORIES, ART_DISCIPLINES } from '../../data/indianStates';
import { ArtistDetailModal } from './ArtistDetailModal';

export const AdminDashboard = ({ onLogout, onBackToForm }) => {
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [disciplineFilter, setDisciplineFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'gallery'

  // Load from localStorage + Seed data
  const loadRegistrations = () => {
    try {
      const local = JSON.parse(localStorage.getItem('artist_registrations') || '[]');
      const mergedMap = new Map();
      local.forEach((item) => mergedMap.set(item.registrationId, item));
      SEED_REGISTRATIONS.forEach((seed) => {
        if (!mergedMap.has(seed.registrationId)) {
          mergedMap.set(seed.registrationId, seed);
        }
      });
      setRegistrations(Array.from(mergedMap.values()));
    } catch (e) {
      setRegistrations(SEED_REGISTRATIONS);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  // Update Status Handler
  const handleUpdateStatus = (regId, newStatus) => {
    const updated = registrations.map((item) => {
      if (item.registrationId === regId) {
        return {
          ...item,
          status: newStatus,
          statusTextHi: newStatus === 'APPROVED' ? 'स्वीकृत (Approved)' : 'अस्वीकृत (Rejected)',
          statusTextEn: newStatus === 'APPROVED' ? 'Verified & Approved' : 'Application Rejected'
        };
      }
      return item;
    });

    setRegistrations(updated);
    try {
      localStorage.setItem('artist_registrations', JSON.stringify(updated));
    } catch (e) {}

    if (selectedEntry && selectedEntry.registrationId === regId) {
      setSelectedEntry((prev) => ({
        ...prev,
        status: newStatus
      }));
    }
  };

  // Filter logic
  const filteredList = registrations.filter((item) => {
    const nameMatch =
      item.applicant?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicant?.mobile?.includes(searchTerm) ||
      item.registrationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicant?.district?.toLowerCase().includes(searchTerm.toLowerCase());

    const catMatch = categoryFilter === 'ALL' || item.artDetails?.category === categoryFilter;
    const discMatch = disciplineFilter === 'ALL' || item.artDetails?.discipline === disciplineFilter;
    const stateMatch = stateFilter === 'ALL' || item.applicant?.state === stateFilter;
    const statusMatch = statusFilter === 'ALL' || item.status === statusFilter;

    return nameMatch && catMatch && discMatch && stateMatch && statusMatch;
  });

  // Calculate category stats
  const totalCount = registrations.length;
  const folkCount = registrations.filter((r) => r.artDetails?.category === 'lok').length;
  const tribalCount = registrations.filter((r) => r.artDetails?.category === 'janjatiya').length;
  const classicalCount = registrations.filter((r) => r.artDetails?.category === 'shastriya').length;
  const contemporaryCount = registrations.filter((r) => r.artDetails?.category === 'samakalin').length;
  const approvedCount = registrations.filter((r) => r.status === 'APPROVED').length;
  const pendingCount = registrations.filter((r) => r.status === 'UNDER_REVIEW' || !r.status).length;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Full Name',
      'Father/Husband Name',
      'Gender',
      'DOB',
      'Mobile',
      'Email',
      'Address',
      'District',
      'State',
      'Pincode',
      'Art Category',
      'Discipline',
      'Experience',
      'Art Description',
      'Status'
    ];

    const rows = filteredList.map((r) => [
      r.registrationId,
      `"${r.applicant?.fullName || ''}"`,
      `"${r.applicant?.fatherHusbandName || ''}"`,
      r.applicant?.gender || '',
      r.applicant?.dob || '',
      r.applicant?.mobile || '',
      r.applicant?.email || '',
      `"${r.applicant?.address || ''}"`,
      `"${r.applicant?.district || ''}"`,
      `"${r.applicant?.state || ''}"`,
      r.applicant?.pincode || '',
      r.artDetails?.category || '',
      r.artDetails?.discipline || '',
      `"${r.artDetails?.experience || ''}"`,
      `"${r.artDetails?.artDescription || ''}"`,
      r.status || 'UNDER_REVIEW'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Artist_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="app-container" style={{ maxWidth: '1240px' }}>
      {/* Admin Header */}
      <header
        className="portal-header"
        style={{
          borderColor: 'rgba(99, 102, 241, 0.3)',
          background: 'white',
          position: 'relative'
        }}
      >
        <div className="header-top">
          <div className="header-brand">
            <div
              className="brand-icon-wrapper"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35)'
              }}
            >
              <ShieldCheck size={30} />
            </div>
            <div className="header-title-group">
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                व्यवस्थापक डैशबोर्ड (Admin Portal)
                <span
                  className="portal-badge"
                  style={{
                    background: 'var(--secondary-light)',
                    color: 'var(--secondary)',
                    borderColor: 'rgba(99, 102, 241, 0.3)'
                  }}
                >
                  Admin v2.0
                </span>
              </h1>
              <p>कलाकार पंजीकरण प्रविष्टियों, फोटो एवं प्रदर्शन वीडियो का सत्यापन एवं प्रबंधन पोर्टल</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
              onClick={onBackToForm}
            >
              <ArrowLeft size={16} />
              <span>पंजीकरण फॉर्म (Artist Form)</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{
                fontSize: '0.85rem',
                padding: '8px 16px',
                color: 'var(--danger)',
                borderColor: 'var(--danger-border)'
              }}
              onClick={onLogout}
            >
              <LogOut size={16} />
              <span>लॉगआउट (Logout)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Analytics Metric Cards for ALL Categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        {/* Total Artists */}
        <div
          style={{
            background: 'white',
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>कुल पंजीकरण</span>
            <Users size={18} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '6px', color: 'var(--text-main)' }}>
            {totalCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Artists</span>
        </div>

        {/* Folk Artists */}
        <div
          style={{
            background: 'white',
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>लोक कला</span>
            <Palette size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '6px', color: 'var(--primary)' }}>
            {folkCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Folk Art Category</span>
        </div>

        {/* Tribal Artists */}
        <div
          style={{
            background: 'white',
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>जनजातीय कला</span>
            <Sparkles size={18} color="#0d9488" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '6px', color: '#0d9488' }}>
            {tribalCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tribal Art Category</span>
        </div>

        {/* Classical Artists */}
        <div
          style={{
            background: 'white',
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>शास्त्रीय कला</span>
            <Award size={18} color="#9333ea" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '6px', color: '#9333ea' }}>
            {classicalCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Classical Art</span>
        </div>

        {/* Contemporary / Other Artists */}
        <div
          style={{
            background: 'white',
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>समकालीन / अन्य</span>
            <Music size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '6px', color: '#0284c7' }}>
            {contemporaryCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Contemporary / Other</span>
        </div>

        {/* Approved & Pending Status */}
        <div
          style={{
            background: 'white',
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>स्वीकृत स्थिति</span>
            <CheckCircle size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '6px', color: 'var(--success)' }}>
            {approvedCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{pendingCount} लंबित (Under Review)</span>
        </div>
      </div>

      {/* Filter, Search and View Mode Toolbar */}
      <div
        className="form-section-card"
        style={{
          padding: '20px',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          {/* Search Box */}
          <div className="input-container" style={{ gridColumn: 'span 2' }}>
            <span className="input-icon-left">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-input input-with-icon-left"
              placeholder="नाम, मोबाइल, रजिस्ट्रेशन ID या जिला खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">सभी श्रेणियां (All Categories)</option>
              {ART_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameHi}
                </option>
              ))}
            </select>
          </div>

          {/* Discipline Filter */}
          <div>
            <select
              className="form-select"
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
            >
              <option value="ALL">सभी विधाएं (All Disciplines)</option>
              {ART_DISCIPLINES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameHi}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">सभी स्थितियां (All Status)</option>
              <option value="APPROVED">स्वीकृत (Approved)</option>
              <option value="UNDER_REVIEW">लंबित (Under Review)</option>
              <option value="REJECTED">अस्वीकृत (Rejected)</option>
            </select>
          </div>

          {/* CSV Export Action */}
          <div>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.85rem',
                background: 'var(--success)'
              }}
              onClick={handleExportCSV}
            >
              <FileSpreadsheet size={16} />
              <span>CSV डाउनलोड</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Switcher Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setViewMode('table')}
          >
            <TableIcon size={16} />
            <span>तालिका दृश्य (Table View)</span>
          </button>

          <button
            type="button"
            className={`btn ${viewMode === 'gallery' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setViewMode('gallery')}
          >
            <LayoutGrid size={16} />
            <span>फोटो व वीडियो गैलरी (Media Gallery)</span>
          </button>
        </div>

        <button
          type="button"
          className="btn-demo"
          onClick={loadRegistrations}
          title="रीफ्रेश करें"
        >
          <RefreshCw size={14} />
          <span>रीफ्रेश (Refresh)</span>
        </button>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        <div
          className="form-section-card"
          style={{
            padding: 0,
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              कलाकार पंजीकरण प्रविष्टियाँ (Artist Entries: {filteredList.length})
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '1.5px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>फोटो</th>
                  <th style={{ padding: '12px 16px' }}>Reg ID</th>
                  <th style={{ padding: '12px 16px' }}>कलाकार का नाम</th>
                  <th style={{ padding: '12px 16px' }}>श्रेणी व विधा</th>
                  <th style={{ padding: '12px 16px' }}>मोबाइल</th>
                  <th style={{ padding: '12px 16px' }}>राज्य / जिला</th>
                  <th style={{ padding: '12px 16px' }}>स्थिति</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>कार्य (Action)</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      कोई प्रविष्टि नहीं मिली (No entries found matching filters)
                    </td>
                  </tr>
                ) : (
                  filteredList.map((entry) => {
                    const cat = ART_CATEGORIES.find((c) => c.id === entry.artDetails?.category);
                    const disc = ART_DISCIPLINES.find((d) => d.id === entry.artDetails?.discipline);
                    const photo = entry.documents?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";

                    return (
                      <tr
                        key={entry.registrationId}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-main)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <img
                            src={photo}
                            alt={entry.applicant?.fullName}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: 'var(--radius-full)',
                              objectFit: 'cover',
                              border: '1.5px solid var(--border-color)'
                            }}
                          />
                        </td>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                          {entry.registrationId}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700 }}>{entry.applicant?.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            पिता/पति: {entry.applicant?.fatherHusbandName}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div>{cat ? cat.nameHi : entry.artDetails?.category}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {disc ? disc.nameHi : entry.artDetails?.discipline} ({entry.artDetails?.experience})
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>+91 {entry.applicant?.mobile}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div>{entry.applicant?.state}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.applicant?.district}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                              background:
                                entry.status === 'APPROVED'
                                ? 'var(--success-light)'
                                : entry.status === 'REJECTED'
                                ? 'var(--danger-light)'
                                : 'var(--warning-light)',
                              color:
                                entry.status === 'APPROVED'
                                ? 'var(--success-text)'
                                : entry.status === 'REJECTED'
                                ? 'var(--danger-text)'
                                : 'var(--warning-text)',
                              border: `1px solid ${
                                entry.status === 'APPROVED'
                                  ? 'var(--success-border)'
                                  : entry.status === 'REJECTED'
                                  ? 'var(--danger-border)'
                                  : 'var(--warning-border)'
                              }`
                            }}
                          >
                            {entry.status === 'APPROVED'
                              ? 'स्वीकृत'
                              : entry.status === 'REJECTED'
                              ? 'अस्वीकृत'
                              : 'लंबित'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => setSelectedEntry(entry)}
                          >
                            <Eye size={14} />
                            <span>विवरण व मीडिया देखें</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Media Video & Photo Gallery Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredList.map((entry) => {
            const cat = ART_CATEGORIES.find((c) => c.id === entry.artDetails?.category);
            const disc = ART_DISCIPLINES.find((d) => d.id === entry.artDetails?.discipline);
            const photo = entry.documents?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";
            const video = entry.documents?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

            return (
              <div
                key={entry.registrationId}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Embedded Video Clip Preview */}
                <div style={{ position: 'relative', background: '#000', height: '200px' }}>
                  <video
                    src={video}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    🎬 {entry.documents?.videoName || 'performance.mp4'}
                  </div>
                </div>

                {/* Artist Info Card */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <img
                      src={photo}
                      alt={entry.applicant?.fullName}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-full)',
                        objectFit: 'cover',
                        border: '2px solid var(--primary)'
                      }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{entry.applicant?.fullName}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {entry.applicant?.district}, {entry.applicant?.state}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                    <strong>श्रेणी:</strong> {cat ? cat.nameHi : entry.artDetails?.category} • <strong>विधा:</strong> {disc ? disc.nameHi : entry.artDetails?.discipline}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '14px', flex: 1 }}>
                    "{entry.artDetails?.artDescription}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                      {entry.registrationId}
                    </span>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <Eye size={14} />
                      <span>पूरा विवरण व दस्तावेज</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Inspector Modal */}
      {selectedEntry && (
        <ArtistDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};
