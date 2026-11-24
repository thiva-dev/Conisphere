import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, ExternalLink, Briefcase, Eye, EyeOff,
  CheckCircle2, Edit3, Upload, Save, X
} from 'lucide-react';
import { fetchAdminJobs, createAdminJob, updateAdminJob, deleteAdminJob } from '../api';

const emptyJob = {
  title: '',
  company_name: '',
  company_logo: '',
  category: 'Safety Officer',
  salary: 'Based on Experience',
  experience: '1 – 3 Years',
  nationality: 'Any Nationality',
  job_type: 'Full-time',
  vacancy: '1 Vacancy',
  location: '',
  posted_label: '',
  apply_url: '',
  nebosh_required: true,
};

// Compress uploaded company logo directly in browser (Safe for PostgreSQL, never lost on restart!)
function compressLogoToDataUrl(file, callback) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 240;
      const maxH = 110;
      const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL('image/png'));
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

export default function AdminJobManager() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Individual Job Edit State (Ovvoru job-kum Apply URL + Logo + Details edit panna!)
  const [editingJobId, setEditingJobId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadJobs = () => {
    fetchAdminJobs()
      .then((res) => setJobs(res.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await createAdminJob(form);
      setForm(emptyJob);
      setMsg('New job published live on /jobs!');
      loadJobs();
      setTimeout(() => setMsg(''), 3000);
    } catch {
      alert('Failed to add job. Please check Apply URL starts with https://');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateAdminJob(id, editForm);
      setEditingJobId(null);
      setMsg('Job details, Apply Link & Logo updated live!');
      loadJobs();
      setTimeout(() => setMsg(''), 3000);
    } catch {
      alert('Failed to update job. Make sure Apply URL starts with https://');
    }
  };

  const toggleActive = async (job) => {
    await updateAdminJob(job.id, { is_active: !job.is_active });
    loadJobs();
  };

  const handleDelete = async (id) => {
    await deleteAdminJob(id);
    loadJobs();
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* 1. POST NEW JOB FORM */}
      <div className="bg-white border border-[#e4dcf3] rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#211859] flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-[#a62675]" />
          <span>Post New HSE Job (With Individual Apply URL &amp; Company Logo)</span>
        </h2>

        <form onSubmit={handlePublish} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Job Title (e.g. Safety Officer) *" className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />
          <input required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="Company Name *" className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />
          <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location (e.g. Dubai – UAE) *" className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />
          <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="Salary (e.g. 2,500 AED)" className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />
          <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Experience (e.g. 2 – 5 Years)" className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />
          <input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} placeholder="Nationality (e.g. Indian, Any)" className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />
          <input value={form.vacancy} onChange={(e) => setForm({ ...form, vacancy: e.target.value })} placeholder="Vacancy (e.g. 2 Vacancies)" className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />
          <input value={form.posted_label} onChange={(e) => setForm({ ...form, posted_label: e.target.value })} placeholder="Posted Label (e.g. Posted Today)" className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (e.g. Safety Officer)" className="px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />

          <input type="url" value={form.apply_url} onChange={(e) => setForm({ ...form, apply_url: e.target.value })} placeholder="Third-Party Apply URL (https://...)" className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm" />

          {/* Logo URL Input OR File Picker */}
          <div className="flex items-center gap-2">
            <input
              value={form.company_logo.startsWith('data:') ? 'Uploaded Logo Ready ✅' : form.company_logo}
              onChange={(e) => setForm({ ...form, company_logo: e.target.value })}
              placeholder="Logo URL or Upload ->"
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm"
            />
            <label className="px-3 py-2.5 rounded-xl bg-[#f3effa] hover:bg-[#e5dcf5] border border-[#dcd3ef] text-[#211859] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0">
              <Upload className="w-3.5 h-3.5 text-[#a62675]" />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) compressLogoToDataUrl(file, (url) => setForm((p) => ({ ...p, company_logo: url })));
                }}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-[#211859] cursor-pointer px-2">
            <input type="checkbox" checked={form.nebosh_required} onChange={(e) => setForm({ ...form, nebosh_required: e.target.checked })} className="accent-[#a62675] w-4 h-4" />
            <span>*NEBOSH IGC certificate is a must*</span>
          </label>

          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={saving} className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold gap-2 cursor-pointer">
              <Briefcase className="w-4 h-4" />
              <span>{saving ? 'Publishing...' : 'Publish Job Live'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. EXISTING JOBS LIST (Click "Edit Link / Logo" on ANY job to set its own Apply URL & Logo!) */}
      <div className="bg-white border border-[#e4dcf3] rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#211859]">
          Published Jobs ({jobs.length}) &mdash; Click &ldquo;Edit Link / Logo&rdquo; on any job to set its Apply URL
        </h3>

        <div className="divide-y divide-[#f0ebf8]">
          {jobs.map((job) => {
            const isEditing = editingJobId === job.id;
            return (
              <div key={job.id} className="py-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company_name} className="w-16 h-10 object-contain bg-[#faf9fd] border border-[#e4dcf3] rounded-lg p-1 shrink-0" />
                    ) : (
                      <div className="w-16 h-10 rounded-lg bg-[#f3effa] text-[#211859] text-[10px] font-bold flex items-center justify-center shrink-0">
                        No Logo
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[#211859]">
                        {job.title} &mdash; <span className="text-[#a62675]">{job.company_name}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {job.location} &bull; {job.apply_url ? <span className="text-emerald-600 font-semibold">Apply Link Set ✅</span> : <span className="text-amber-600 font-semibold">No External Link Yet</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditing) {
                          setEditingJobId(null);
                        } else {
                          setEditingJobId(job.id);
                          setEditForm({
                            title: job.title,
                            company_name: job.company_name,
                            company_logo: job.company_logo || '',
                            apply_url: job.apply_url || '',
                            salary: job.salary,
                            location: job.location,
                            posted_label: job.posted_label || '',
                          });
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#f3effa] hover:bg-[#e5dcf5] text-[#211859] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#a62675]" />
                      <span>{isEditing ? 'Close' : 'Edit Link / Logo'}</span>
                    </button>

                    {job.apply_url && (
                      <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#f3effa] text-[#211859]" title="Test Link">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button type="button" onClick={() => toggleActive(job)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${job.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {job.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{job.is_active ? 'Live' : 'Hidden'}</span>
                    </button>

                    <button type="button" onClick={() => handleDelete(job.id)} className="p-2 rounded-lg text-rose-600 bg-rose-50 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* INLINE EDIT PANEL FOR THIS SPECIFIC JOB */}
                {isEditing && (
                  <div className="p-4 rounded-2xl bg-[#faf9fd] border border-[#dcd3ef] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input
                      type="url"
                      value={editForm.apply_url}
                      onChange={(e) => setEditForm({ ...editForm, apply_url: e.target.value })}
                      placeholder="Paste This Job's Third-Party Apply URL (https://...)"
                      className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-[#a62675]/50 text-xs sm:text-sm"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        value={editForm.company_logo?.startsWith('data:') ? 'Uploaded Logo ✅' : editForm.company_logo}
                        onChange={(e) => setEditForm({ ...editForm, company_logo: e.target.value })}
                        placeholder="Logo URL or Upload ->"
                        className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white border border-[#dcd3ef] text-xs"
                      />
                      <label className="px-3 py-2 rounded-xl bg-[#211859] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) compressLogoToDataUrl(file, (url) => setEditForm((p) => ({ ...p, company_logo: url })));
                          }}
                        />
                      </label>
                    </div>

                    <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Job Title" className="px-3 py-2 rounded-xl bg-white border border-[#dcd3ef] text-xs" />
                    <input value={editForm.salary} onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })} placeholder="Salary" className="px-3 py-2 rounded-xl bg-white border border-[#dcd3ef] text-xs" />
                    <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location" className="px-3 py-2 rounded-xl bg-white border border-[#dcd3ef] text-xs" />

                    <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-end gap-2">
                      <button type="button" onClick={() => setEditingJobId(null)} className="px-4 py-2 rounded-xl bg-white border border-[#dcd3ef] text-xs font-semibold text-slate-600 inline-flex items-center gap-1 cursor-pointer">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button type="button" onClick={() => handleSaveEdit(job.id)} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer">
                        <Save className="w-3.5 h-3.5" /> Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}