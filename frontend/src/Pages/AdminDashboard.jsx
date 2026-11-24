import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users, Clock, PhoneCall, CheckCircle2, Search, Download,
  RefreshCw, Trash2, LogOut, ArrowLeft, Edit3, Check, X, AlertCircle
} from 'lucide-react';
import {
  fetchAdminEnquiries,
  updateAdminEnquiry,
  deleteAdminEnquiry,
  downloadEnquiriesCSV,
} from '../api';
import './AdminDashboard.css';
import AdminJobsManager from './AdminJobManager';
import CognisphereLoader from './CognisphereLoader';

const statusOptions = [
  { value: 'new', label: 'New', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'contacted', label: 'Contacted', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'interested', label: 'Interested', badge: 'bg-purple-50 text-[#a62675] border-purple-200' },
  { value: 'enrolled', label: 'Enrolled', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'closed', label: 'Closed', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [batches, setBatches] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, interested: 0, enrolled: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enquiries');
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  // Inline Note Editing State
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Custom Delete Confirmation Popup State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const adminUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || '{}');
    } catch {
      return {};
    }
  })();

  // Route Guard: Token illana Login-ku redirect pannum
  useEffect(() => {
    if (!localStorage.getItem('admin_access_token')) {
      navigate('/lms-login', { replace: true });
    }
  }, [navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAdminEnquiries({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
      });
      setEnquiries(res.data.enquiries || []);
      setStats(res.data.stats || {});
      setBatches(res.data.batches || []);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load enquiries.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 350);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAdminEnquiry(id, { status: newStatus });
      loadData();
    } catch {
      alert('Failed to update status. Please try again.');
    }
  };

  const handleSaveNote = async (id) => {
    try {
      await updateAdminEnquiry(id, { notes: noteText });
      setEditingNoteId(null);
      loadData();
    } catch {
      alert('Failed to save note.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminEnquiry(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch {
      alert('Failed to delete enquiry.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await downloadEnquiriesCSV({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
      });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cognisphere_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('CSV download failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_user');
    navigate('/lms-login', { replace: true });
  };

  const getStatusBadge = (val) =>
    statusOptions.find((s) => s.value === val)?.badge || 'bg-slate-100 text-slate-700';

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-[#f8f7fc] text-[#211859]">

      {/* ================= TOP ADMIN EXECUTIVE HEADER ================= */}
      <header className="bg-[#211859] text-white px-4 sm:px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Back to Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-wide">
                Cognisphere Leads &amp; Enquiries Portal
              </h1>
              <p className="text-[11px] text-purple-200">
                Logged in as: <strong className="text-amber-300">{adminUser.username || 'Admin'}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#a62675] hover:bg-[#8c1d61] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ================= 1. TAB SWITCHER (Enquiries vs Manage Jobs) ================= */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-[#e4dcf3] shadow-sm w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'enquiries'
                ? 'bg-[#211859] text-white shadow-sm'
                : 'text-[#211859] hover:bg-[#f3effa]'
            }`}
          >
            Student Enquiries
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-[#a62675] text-white shadow-sm'
                : 'text-[#211859] hover:bg-[#f3effa]'
            }`}
          >
            Manage Jobs
          </button>
        </div>

        {/* ================= 2. ACTIVE TAB CONTENT ================= */}
        {activeTab === 'jobs' ? (
          <AdminJobsManager />
        ) : (
          <>
            {/* 4 KPI SUMMARY CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
              <div className="dash-kpi-card rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Total Enquiries</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#211859] mt-1">{stats.total || 0}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#f3effa] text-[#211859] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="dash-kpi-card rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">New (Pending)</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{stats.new || 0}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="dash-kpi-card rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Contacted</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">{stats.contacted || 0}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
              </div>

              <div className="dash-kpi-card rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Enrolled</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">{stats.enrolled || 0}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* TOOLBAR: SEARCH, FILTERS & EXCEL CSV EXPORT */}
            <div className="bg-white border border-[#e6e0f3] rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row flex-1 gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by Name, Email, WhatsApp, Course, City..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm focus:outline-none focus:border-[#a62675]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm font-medium cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm font-medium cursor-pointer"
                >
                  <option value="">All Sources</option>
                  <option value="home_page">Home Page Form</option>
                  <option value="offer_popup">Offer Popup Form</option>
                  <option value="upcoming_batches">Upcoming Batches</option>
                  <option value="nebosh_igc_page">NEBOSH IGC Popup</option>
                  <option value="nebosh_igc_bottom_form">NEBOSH IGC Form</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={loadData}
                  className="px-3.5 py-2.5 rounded-xl bg-[#f3effa] hover:bg-[#e6def5] text-[#211859] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Excel (.CSV)</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* DESKTOP EXCEL-STYLE TABLE */}
            <div className="hidden md:block excel-table-wrap rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="excel-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>WhatsApp</th>
                      <th>Preferred Course</th>
                      <th>Batch</th>
                      <th>City</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Staff Notes</th>
                      <th>Registered At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="py-4">
                      <CognisphereLoader size="sm" label="Syncing Enquiries..." />
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                      <tr>
                        <td colSpan="12" className="text-center py-10 text-slate-500">
                          No matching student enquiries found.
                        </td>
                      </tr>
                    ) : (
                      enquiries.map((item) => {
                        const waDigits = item.whatsapp_number.replace(/\D/g, '');
                        return (
                          <tr key={item.id}>
                            <td className="font-bold text-slate-500">#{item.id}</td>
                            <td className="font-bold whitespace-nowrap">{item.full_name}</td>
                            <td>
                              <a href={`mailto:${item.email}`} className="text-blue-700 hover:underline">
                                {item.email}
                              </a>
                            </td>
                            <td className="whitespace-nowrap">
                              <a
                                href={`https://wa.me/${waDigits}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-100"
                              >
                                {item.whatsapp_number}
                              </a>
                            </td>
                            <td className="font-medium text-[#a62675]">{item.preferred_course || '-'}</td>
                            <td>
                              <select
                                value={item.batch || ''}
                                onChange={async (e) => {
                                  await updateAdminEnquiry(item.id, { batch: e.target.value || null });
                                  loadData();
                                }}
                                className="text-xs px-2 py-1 rounded-lg border border-[#dcd3ef] bg-white cursor-pointer max-w-[175px]"
                              >
                                <option value="">-- Unassigned --</option>
                                {batches.map((b) => (
                                  <option key={b.id} value={b.id}>
                                    {b.course_name} ({b.date_range})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>{item.city || '-'}</td>
                            <td>
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3effa] text-[#211859] font-semibold">
                                {item.source}
                              </span>
                            </td>
                            <td>
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${getStatusBadge(item.status)}`}
                              >
                                {statusOptions.map((s) => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="min-w-[170px]">
                              {editingNoteId === item.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-[#a62675] rounded"
                                    placeholder="Add note..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveNote(item.id)}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingNoteId(null)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-slate-600 truncate max-w-[140px]">
                                    {item.notes || '—'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => { setEditingNoteId(item.id); setNoteText(item.notes || ''); }}
                                    className="text-[#211859]/60 hover:text-[#a62675] cursor-pointer"
                                    title="Edit Note"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="text-xs text-slate-500 whitespace-nowrap">
                              {formatDate(item.created_at)}
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                onClick={() => setDeleteTarget({ id: item.id, full_name: item.full_name })}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
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

            {/* MOBILE CARD VIEW (< 768px) */}
            <div className="md:hidden space-y-3">
              {enquiries.map((item) => (
                <div key={item.id} className="bg-white border border-[#e4dcf3] rounded-2xl p-4 shadow-sm space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400">#{item.id} • {item.source}</span>
                      <h3 className="text-base font-bold text-[#211859]">{item.full_name}</h3>
                      <p className="text-xs font-semibold text-[#a62675]">{item.preferred_course}</p>
                    </div>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getStatusBadge(item.status)}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Email: <a href={`mailto:${item.email}`} className="text-blue-700 font-medium">{item.email}</a></p>
                    <p>City: <strong>{item.city || '-'}</strong> • {formatDate(item.created_at)}</p>
                  </div>

                  <div className="pt-2 border-t border-[#f0ebf8] flex items-center justify-between gap-2">
                    <a
                      href={`https://wa.me/${item.whatsapp_number.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200"
                    >
                      WhatsApp: {item.whatsapp_number}
                    </a>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: item.id, full_name: item.full_name })}
                      className="p-2 rounded-lg text-red-500 bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* ================= CUSTOM IN-APP DELETE CONFIRMATION POPUP ================= */}
      {deleteTarget && (
        <div
          onClick={() => !deleting && setDeleteTarget(null)}
          className="fixed inset-0 z-50 bg-[#0d0826]/65 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#e4dcf3] text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3.5">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-[#211859]">Delete Enquiry?</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-[#a62675]">{deleteTarget.full_name}</strong>?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#f3effa] hover:bg-[#e5dcf5] text-[#211859] text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-600/25 transition-colors cursor-pointer disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}