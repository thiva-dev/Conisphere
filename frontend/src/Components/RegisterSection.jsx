import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User, Mail, Phone, BookOpen, MapPin, Send, CheckCircle2,
  X, Image as ImageIcon, AlertCircle, Sparkles, Calendar
} from 'lucide-react';
import { fetchUpcomingBatches, submitEnquiry } from '../api';
import GoogleRecaptcha from './GoogleRecaptcha';
import './RegisterSection.css';

const sectionContactImg = '/Pictures/contactus.webp';
// const offerBannerImg = '/images/offer-banner.jpg';

const courseOptions = [
'NEBOSH IGC ',
  'NEBOSH IDIP (International Diploma)',
  'IOSH Managing Safely',
  'Certified Safety Professional',
  'Associate Safety Professional',
  'Highfield International Level 4 Award in Health and Safety in the Workplace',
  'Highfield Level 4 Award in HACCP for Management for Catering',
  'Highfield Level 4 Award in Food Safety Management for Manufacturing',
  'Highfield Level 3 Award in HACCP for Catering',
  'Highfield Level 3 Award in HACCP for Food Manufacturing',
  'Highfield Level 3 International Award in Delivering Training – IADT',
  'Highfield Level 3 International Award in First Aid at Work and Use of an AED',
  'Highfield Level 2 Award in Risk Assessment',
  'Highfield Level 2 International Award in Fire Safety',
  'Highfield Level 2 International Award in the Control of Substances Hazardous to Health (COSHH)',
  'ISO 9001 2015 QMS Lead Auditor Training',
  'ISO 14001 2015 EMS Lead Auditor Training',
  'ISO 45001 2018 OHSMS Lead Auditor Training',
  'Petro chemical process safety & engineering',
  'Diploma in Fire Safety',
  'Diploma in Construction Safety',
  'Diploma in Oil & Gas Safety',
  'Diploma in Industrial Safety',
  'Advanced Diploma in Industrial Safety (ADIS)',
  'Advanced Diploma in Occupational Safety, Health and Environmental Management',
];

const emptyForm = {
  full_name: '',
  email: '',
  whatsapp_number: '',
  preferred_course: '',
  batch: '',
  city: '',
};

function extractApiError(error) {
  const data = error?.response?.data;
  if (!data) return 'Network error! Please check if the backend server is running.';
  if (typeof data === 'string') return data;
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return data.non_field_errors[0];
  }
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  const firstVal = data[firstKey];
  return Array.isArray(firstVal) ? firstVal[0] : String(firstVal);
}

// Helper: Selected course NEBOSH-aa irundha adhodaiya batches mattum filter pannum
function getMatchingBatches(selectedCourse, allBatches) {
  if (!selectedCourse || !selectedCourse.toLowerCase().includes('nebosh')) return [];
  const lower = selectedCourse.toLowerCase();
  if (lower.includes('igc')) return allBatches.filter((b) => b.course_name === 'NEBOSH IGC');
  if (lower.includes('hsw')) return allBatches.filter((b) => b.course_name === 'NEBOSH HSW');
  return allBatches; // Other NEBOSH courses (IDIP etc.) show available NEBOSH batches
}

export default function RegisterSection() {
  const location = useLocation();
  const [batches, setBatches] = useState([]);

  // Page Form States
  const [pageForm, setPageForm] = useState(emptyForm);
  const [pageToken, setPageToken] = useState('');
  const [pageReset, setPageReset] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [pageSuccess, setPageSuccess] = useState('');

  // Popup Form States
  const [popupForm, setPopupForm] = useState(emptyForm);
  const [popupToken, setPopupToken] = useState('');
  const [popupReset, setPopupReset] = useState(0);
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupError, setPopupError] = useState('');
  const [popupSuccess, setPopupSuccess] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const nameRef = useRef(null);

  // 1. Live Batches Load Pannum (NEBOSH select pannum podhu dropdown kaata)
  useEffect(() => {
    fetchUpcomingBatches()
      .then((res) => setBatches(res.data || []))
      .catch(() => {});
  }, []);

  // 2. Upcoming Batches-la irundhu "ENROLL NOW" click panni vandha pre-fill + scroll pannum!
  useEffect(() => {
    const navState = location.state;
    if (navState?.scrollToRegister) {
      setShowPopup(false);
      const matchedCourse =
        courseOptions.find((c) =>
          c.toLowerCase().startsWith((navState.preselectCourse || '').toLowerCase())
        ) || navState.preselectCourse || '';

      setPageForm((prev) => ({
        ...prev,
        preferred_course: matchedCourse,
        batch: navState.preselectBatchId ? String(navState.preselectBatchId) : '',
      }));

      setTimeout(() => {
        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
        nameRef.current?.focus();
      }, 150);

      // Refresh panna thirumba scroll aagama state clear pannum
      window.history.replaceState({}, document.title);
      return;
    }

    // Normal website load-la 1.2s kazhichu Offer Popup varum
    const timer = setTimeout(() => setShowPopup(true), 1200);
    return () => clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    document.body.style.overflow = showPopup ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showPopup]);

  const handleCourseChange = (isPopup, value) => {
    const updater = isPopup ? setPopupForm : setPageForm;
    updater((prev) => ({
      ...prev,
      preferred_course: value,
      batch: '', // Course maarumbodhu old batch selection clear pannum
    }));
  };

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    const isPopup = type === 'offer_popup';

    const currentForm = isPopup ? popupForm : pageForm;
    const currentToken = isPopup ? popupToken : pageToken;
    const setError = isPopup ? setPopupError : setPageError;
    const setSuccess = isPopup ? setPopupSuccess : setPageSuccess;
    const setLoading = isPopup ? setPopupLoading : setPageLoading;
    const resetForm = isPopup ? setPopupForm : setPageForm;
    const bumpReset = isPopup ? setPopupReset : setPageReset;

    setError('');
    if (!currentToken) {
      setError('Please complete the "I\'m not a robot" verification.');
      return;
    }

    setLoading(true);
    try {
      const response = await submitEnquiry({
        ...currentForm,
        batch: currentForm.batch ? Number(currentForm.batch) : null,
        source: type,
        recaptcha_token: currentToken,
      });

      setSuccess(response.data?.message || 'Registration successful!');
      resetForm(emptyForm);
      bumpReset((prev) => prev + 1);
    } catch (err) {
      setError(extractApiError(err));
      bumpReset((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const pageMatchingBatches = getMatchingBatches(pageForm.preferred_course, batches);
  const popupMatchingBatches = getMatchingBatches(popupForm.preferred_course, batches);

  return (
    <>
      {/* =====================================================================
          PART 1: ON-PAGE REGISTER NOW SECTION
         ===================================================================== */}
      <section id="register" className="w-full bg-white py-14 sm:py-18 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-9 sm:mb-12">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#a62675]">
              START YOUR SAFETY CAREER
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#211859]">
              Register Now
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Get free syllabus, batch timings &amp; career guidance for India, Dubai/GCC &amp; Global Online classes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

            {/* LEFT: Top-Aligned Full-Fit Contact Photo Card */}
            <div className="lg:col-span-7 reg-left-card rounded-3xl h-full min-h-[260px] sm:min-h-[360px]">
                <img src={sectionContactImg} alt="Contact Cognisphere" className="reg-left-img" />

            </div>

            {/* RIGHT: Compact Height-Matched API Form */}
            <div className="lg:col-span-5 reg-form-card rounded-3xl p-5 sm:p-7 flex flex-col justify-center">
              {pageSuccess ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-bold text-[#211859]">Registration Successful!</h3>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">{pageSuccess}</p>
                  <button
                    type="button"
                    onClick={() => setPageSuccess('')}
                    className="brand-glow-btn mt-6 px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => handleFormSubmit(e, 'home_page')} className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-[#211859]">Request Free Counselling</h3>
                  </div>

                  {pageError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{pageError}</span>
                    </div>
                  )}

                  <div className="relative">
                    <User className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      ref={nameRef}
                      type="text"
                      required
                      value={pageForm.full_name}
                      onChange={(e) => setPageForm({ ...pageForm, full_name: e.target.value })}
                      placeholder="Enter Your Full Name"
                      className="reg-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={pageForm.email}
                      onChange={(e) => setPageForm({ ...pageForm, email: e.target.value })}
                      placeholder="Email Address"
                      className="reg-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={pageForm.whatsapp_number}
                      onChange={(e) => setPageForm({ ...pageForm, whatsapp_number: e.target.value })}
                      placeholder="WhatsApp Number (e.g. +91 9043133663)"
                      className="reg-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      required
                      value={pageForm.preferred_course}
                      onChange={(e) => handleCourseChange(false, e.target.value)}
                      className="reg-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm cursor-pointer"
                    >
                      <option value="">Select Your Preferred Course</option>
                      {courseOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* AUTO-APPEARS ONLY WHEN NEBOSH COURSE IS SELECTED */}
                  {pageMatchingBatches.length > 0 && (
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        required
                        value={pageForm.batch}
                        onChange={(e) => setPageForm({ ...pageForm, batch: e.target.value })}
                        className="reg-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm cursor-pointer border-[#a62675]/50 bg-[#f8f7fc]"
                      >
                        <option value="">Select Upcoming NEBOSH Batch *</option>
                        {pageMatchingBatches.map((b) => (
                          <option key={b.id} value={b.id} disabled={!b.is_flexible && b.seats_left === 0}>
                           {b.course_name} • {b.schedule_days} ({b.date_range}) — {b.is_flexible ? 'Easy to Book' : `${b.seats_left}/${b.total_seats} Seats`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={pageForm.city}
                      onChange={(e) => setPageForm({ ...pageForm, city: e.target.value })}
                      placeholder="Enter Your City"
                      className="reg-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <GoogleRecaptcha onTokenChange={setPageToken} resetTrigger={pageReset} />

                  <button
                    type="submit"
                    disabled={pageLoading}
                    className="brand-glow-btn w-full py-3 rounded-xl text-sm font-semibold gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>{pageLoading ? 'Submitting...' : 'Register Now'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          PART 2: AUTO-OPEN POPUP MODAL (Dynamic NEBOSH Batch Dropdown Included!)
         ===================================================================== */}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="popup-backdrop fixed inset-0 z-50 bg-[#0d0826]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="popup-modal-shell bg-white rounded-2xl max-w-[560px] w-full max-h-[92vh] overflow-y-auto md:overflow-visible flex flex-col md:flex-row relative"
          >
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              aria-label="Close Popup"
              className="absolute top-3 right-3 md:-top-3.5 md:-right-3.5 z-30 w-9 h-9 rounded-full bg-white text-[#211859] hover:bg-[#a62675] hover:text-white shadow-xl border border-[#e4dcf3] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="flex-1 p-6 sm:p-8 bg-white rounded-2xl flex flex-col justify-center">
              {popupSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-[#211859]">Thank You for Registering!</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">{popupSuccess}</p>
                  <button
                    type="button"
                    onClick={() => { setPopupSuccess(''); setShowPopup(false); }}
                    className="brand-glow-btn mt-6 px-7 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Back to Website
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => handleFormSubmit(e, 'offer_popup')} className="space-y-3.5">
                  <div className="pr-8">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#a62675]">
                      <Sparkles className="w-3.5 h-3.5" /> NEBOSH Gold Partner Admissions
                    </span>
                    <h3 className="text-xl font-bold text-[#211859] mt-0.5">
                      Claim Your Live Online Seat
                    </h3>
                  </div>

                  {popupError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{popupError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#211859] mb-1">
                        <span className="text-[#a62675]">*</span> FULL NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={popupForm.full_name}
                        onChange={(e) => setPopupForm({ ...popupForm, full_name: e.target.value })}
                        placeholder="Enter Your Full Name"
                        className="reg-input w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#211859] mb-1">
                        <span className="text-[#a62675]">*</span> EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        value={popupForm.email}
                        onChange={(e) => setPopupForm({ ...popupForm, email: e.target.value })}
                        placeholder="you@email.com"
                        className="reg-input w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#211859] mb-1">
                        <span className="text-[#a62675]">*</span> WHATSAPP NUMBER
                      </label>
                      <input
                        type="tel"
                        required
                        value={popupForm.whatsapp_number}
                        onChange={(e) => setPopupForm({ ...popupForm, whatsapp_number: e.target.value })}
                        placeholder="+91 9043133663"
                        className="reg-input w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#211859] mb-1">
                        <span className="text-[#a62675]">*</span> YOUR CITY
                      </label>
                      <input
                        type="text"
                        required
                        value={popupForm.city}
                        onChange={(e) => setPopupForm({ ...popupForm, city: e.target.value })}
                        placeholder="Chennai, Dubai, Kochi..."
                        className="reg-input w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#211859] mb-1">
                      <span className="text-[#a62675]">*</span> PREFERRED COURSE
                    </label>
                    <select
                      required
                      value={popupForm.preferred_course}
                      onChange={(e) => handleCourseChange(true, e.target.value)}
                      className="reg-input w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm cursor-pointer"
                    >
                      <option value="">Select Your Preferred Course</option>
                      {courseOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* AUTO-APPEARS ONLY WHEN NEBOSH COURSE IS SELECTED IN POPUP */}
                  {popupMatchingBatches.length > 0 && (
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#211859] mb-1">
                        <span className="text-[#a62675]">*</span> SELECT UPCOMING BATCH
                      </label>
                      <select
                        required
                        value={popupForm.batch}
                        onChange={(e) => setPopupForm({ ...popupForm, batch: e.target.value })}
                        className="reg-input w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm cursor-pointer border-[#a62675]/50 bg-[#f8f7fc]"
                      >
                        <option value="">Choose Batch Date *</option>
                        {popupMatchingBatches.map((b) => (
                          <option key={b.id} value={b.id} disabled={!b.is_flexible && b.seats_left === 0}>
                            {b.course_name} • {b.days_label} ({b.date_range}) — {b.is_flexible ? b.flexible_label : `${b.seats_left}/${b.total_seats} Seats`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <GoogleRecaptcha onTokenChange={setPopupToken} resetTrigger={popupReset} />

                  <button
                    type="submit"
                    disabled={popupLoading}
                    className="brand-glow-btn w-full sm:w-auto px-8 py-3 rounded-lg text-xs sm:text-sm font-bold tracking-wide gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>{popupLoading ? 'SUBMITTING...' : 'REGISTER NOW'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}