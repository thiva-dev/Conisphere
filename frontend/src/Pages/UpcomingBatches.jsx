import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Clock, Users, RotateCcw, Sparkles, CheckCircle2,
  X, Send, AlertCircle, User, Mail, Phone, MapPin, ArrowRight, Flame
} from 'lucide-react';
import { fetchPublicBatches, submitEnquiry } from '../api';
import GoogleRecaptcha from '../Components/GoogleRecaptcha';
import './UpcomingBatches.css';
import CognisphereLoader from './CognisphereLoader';

const WHATSAPP_NUMBER = '919043133663';

function extractApiError(error) {
  const data = error?.response?.data;
  if (!data) return 'Network error! Please check your connection.';
  if (typeof data === 'string') return data;
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return data.non_field_errors[0];
  }
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  const firstVal = data[firstKey];
  return Array.isArray(firstVal) ? firstVal[0] : String(firstVal);
}

export default function UpcomingBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Filters (Branch & Mode Dropdowns Removed!)
  const [courseFilter, setCourseFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Popup Enroll Modal State (Opens right on this page!)
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', whatsapp_number: '', city: '' });
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaReset, setCaptchaReset] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const loadBatches = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetchPublicBatches();
      setBatches(res.data || []);
    } catch {
      setLoadError('Unable to load batch schedule right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  // Modal open irukum podhu background scroll lock
  useEffect(() => {
    document.body.style.overflow = selectedBatch ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedBatch]);

  const courseList = useMemo(
    () => [...new Set(batches.map((b) => b.course_name))],
    [batches]
  );

  const visibleBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchCourse = !courseFilter || b.course_name === courseFilter;
      const matchType = !typeFilter || b.batch_type === typeFilter;
      return matchCourse && matchType;
    });
  }, [batches, courseFilter, typeFilter]);

  const handleReset = () => {
    setCourseFilter('');
    setTypeFilter('');
  };

  const openEnrollModal = (batch) => {
    setSelectedBatch(batch);
    setSubmitError('');
    setSubmitSuccess('');
    setCaptchaToken('');
    setCaptchaReset((prev) => prev + 1);
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!captchaToken) {
      setSubmitError('Please complete the "I\'m not a robot" verification.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitEnquiry({
        ...form,
        preferred_course: selectedBatch.course_name,
        batch: selectedBatch.id,
        source: 'upcoming_batches',
        recaptcha_token: captchaToken,
      });

      setSubmitSuccess(res.data?.message || 'Seat enquiry submitted successfully!');
      setForm({ full_name: '', email: '', whatsapp_number: '', city: '' });
      setCaptchaReset((prev) => prev + 1);
      loadBatches(); // Live-aa Enquired Persons count +1 update pannum!
    } catch (err) {
      setSubmitError(extractApiError(err));
      setCaptchaReset((prev) => prev + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="batches-page-bg w-full py-12 sm:py-16 px-4 sm:px-6 min-h-[82vh]">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADING ================= */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 border border-[#e2daf3] shadow-sm text-[11px] font-bold uppercase tracking-[0.16em] text-[#a62675] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            NEBOSH Gold Learning Partner Schedule
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#211859] tracking-tight">
            Upcoming Batches
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Stay up-to-date with our upcoming live interactive online classes. Choose your preferred
            weekday or weekend batch below and reserve your seat today.
          </p>
        </div>

        {/* ================= GLASS FILTER BAR + LIVE ONLINE WAVE PILL ================= */}
        <div className="batches-filter-bar rounded-2xl p-4 sm:px-6 sm:py-4 mb-9 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs sm:text-sm font-bold text-[#211859] uppercase tracking-wider mr-1">
              Filter:
            </span>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-[#dcd3ef] text-xs sm:text-sm font-medium text-[#211859] focus:outline-none focus:border-[#a62675] cursor-pointer"
            >
              <option value="">All Courses</option>
              {courseList.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-[#dcd3ef] text-xs sm:text-sm font-medium text-[#211859] focus:outline-none focus:border-[#a62675] cursor-pointer"
            >
              <option value="">All Batch Types</option>
              <option value="Weekdays">Weekdays (Mon–Fri)</option>
              <option value="Weekend">Weekend (Sunday)</option>
            </select>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#f3effa] border border-[#dcd3ef] text-xs sm:text-sm font-semibold text-[#211859] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#a62675]" />
              <span>Reset</span>
            </button>
          </div>

          <div className="online-wave-pill inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold tracking-wide self-start lg:self-auto">
            <span className="live-wave-dot shrink-0" aria-hidden="true" />
            <span>Online Mode Only</span>
          </div>

        </div>

        {/* ================= BATCH CARDS GRID ================= */}
        {loadError && (
          <div className="max-w-lg mx-auto mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loadError}</span>
            </span>
            <button
              type="button"
              onClick={loadBatches}
              className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <CognisphereLoader label="Loading Live Online Batches..." />
        ) : !loadError && visibleBatches.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-3xl border border-[#e4dcf3] shadow-sm">
            <p className="text-base font-bold text-[#211859]">No batches match your selected filter.</p>
            <button
              type="button"
              onClick={handleReset}
              className="brand-glow-btn mt-4 px-6 py-2 rounded-full text-xs font-semibold cursor-pointer"
            >
              Show All Batches
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleBatches.map((batch) => {
              const isWeekend = batch.batch_type === 'Weekend';
              const isLowSeats = !batch.is_flexible && batch.seats_left > 0 && batch.seats_left < 5;
              const isFull = !batch.is_flexible && batch.seats_left === 0;

              // Left -> Right Forward Progress (Starts 0% at 20/20, moves right as Enrolled increases)
              const filledSeats = Math.max(0, batch.total_seats - batch.seats_left);
              const progressPct = Math.min(100, Math.round((filledSeats / batch.total_seats) * 100));

              const waMsg = `Hi Cognisphere MC, I would like to enquire about the ${batch.course_name} (${batch.schedule_days}) Online Batch (${batch.date_range}).`;
              const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

              return (
                <article
                  key={batch.id}
                  className="batch-glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isWeekend
                            ? 'bg-[#f3effa] text-[#a62675] border border-[#e1cce8]'
                            : 'bg-[#211859] text-white'
                        }`}
                      >
                        {batch.batch_type}
                      </span>

                      <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{batch.mode}</span>
                      </span>
                    </div>

                    {/* Course Title */}
                    <h2 className="text-xl font-bold text-[#211859] tracking-tight">
                      {batch.course_name}
                    </h2>

                    {/* Inner Glass Schedule Card (Timing unwanted portion removed) */}
                    <div className="batch-inner-box rounded-2xl p-4 mt-4 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#a62675] uppercase tracking-wide">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{batch.date_range}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-[#211859]">
                        <Clock className="w-4 h-4 text-[#211859]/60 shrink-0" />
                        <span>{batch.schedule_days}</span>
                      </div>
                    </div>

                    {/* Live Seats Left + Enquired Persons Count */}
                    <div className="mt-4 space-y-2">
                      {batch.is_flexible ? (
                        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                          <span className="text-xs font-bold text-emerald-700">Batch Availability</span>
                          <span className="text-xs font-extrabold text-emerald-700">Easy to Book</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                            <span className="text-slate-600">Seats Availability</span>

                            {isFull ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                                Batch Full
                              </span>
                            ) : isLowSeats ? (
                              <span className="seat-blink-urgent inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-300 font-extrabold">
                                <Flame className="w-3.5 h-3.5 text-red-500" />
                                <span>Seats Left: {batch.seats_left} / {batch.total_seats}</span>
                              </span>
                            ) : (
                              <span className="text-[#211859] font-extrabold">
                                Seats Left: <span className="text-[#a62675]">{batch.seats_left}</span> / {batch.total_seats}
                              </span>
                            )}
                          </div>

                          {/* Left -> Right Forward-Moving Seat Fill Bar */}
                          <div className="w-full h-2 bg-[#ebe5f7] rounded-full overflow-hidden">
                            <div
                              style={{ width: `${progressPct}%` }}
                              className={`h-full rounded-full transition-all duration-700 ease-out ${
                                isLowSeats || isFull
                                  ? 'bg-gradient-to-r from-orange-500 to-red-600'
                                  : 'bg-gradient-to-r from-[#211859] to-[#a62675]'
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/80 border border-[#eae4f6] text-xs">
                        <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                          <Users className="w-3.5 h-3.5 text-[#a62675]" />
                          <span>Enquired Persons</span>
                        </span>
                        <span className="font-bold text-[#211859]">
                          {batch.enquired_count} {batch.enquired_count === 1 ? 'Person' : 'Persons'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA: Opens Popup Register Form Right Here + Smooth Shaking WhatsApp */}
                  <div className="mt-5 pt-4 border-t border-[#e7e1f4] flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isFull}
                      onClick={() => openEnrollModal(batch)}
                      className="brand-glow-btn flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>{isFull ? 'Batch Full' : 'Enroll Now'}</span>
                    </button>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Chat on WhatsApp about ${batch.course_name}`}
                      aria-label={`WhatsApp enquiry for ${batch.course_name}`}
                      className="batch-wa-btn w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    >
                      <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" aria-hidden="true">
                        <path d="M16.01 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.1 29l6.78-1.78a12.75 12.75 0 0 0 6.13 1.56h.01c7.06 0 12.79-5.73 12.79-12.8 0-3.42-1.33-6.64-3.75-9.05A12.72 12.72 0 0 0 16.01 3.2zm7.46 18.17c-.31.88-1.82 1.68-2.52 1.78-.65.1-1.47.14-2.37-.15-.55-.18-1.26-.41-2.16-.8-3.8-1.64-6.28-5.48-6.47-5.73-.19-.26-1.55-2.06-1.55-3.93 0-1.87.98-2.79 1.33-3.17.35-.38.76-.48 1.01-.48.25 0 .51 0 .73.01.24.01.55-.09.86.66.31.76 1.07 2.62 1.17 2.81.09.19.16.41.03.67-.13.26-.19.42-.38.64-.19.22-.4.5-.57.67-.19.19-.39.4-.17.78.22.38.98 1.62 2.11 2.62 1.45 1.29 2.67 1.69 3.05 1.88.38.19.6.16.82-.1.22-.25.95-1.11 1.2-1.49.26-.38.51-.32.86-.19.35.13 2.24 1.06 2.62 1.25.38.19.64.28.73.44.1.16.1.91-.21 1.79z" />
                      </svg>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* ================= POPUP REGISTER FORM MODAL (Opens on Same Page!) ================= */}
      {selectedBatch && (
        <div
          onClick={() => setSelectedBatch(null)}
          className="fixed inset-0 z-50 bg-[#0d0826]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#dfd6f2] relative max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setSelectedBatch(null)}
              aria-label="Close Enroll Modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f8f7fc] hover:bg-[#a62675] text-[#211859] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-[#211859]">Seat Enquiry Received!</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">{submitSuccess}</p>
                <button
                  type="button"
                  onClick={() => setSelectedBatch(null)}
                  className="brand-glow-btn mt-6 px-7 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-3.5">
                <div className="pr-8">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f3effa] text-[#a62675] text-[10.5px] font-bold uppercase tracking-wider">
                    {selectedBatch.batch_type} • Live Online
                  </span>
                  <h3 className="text-xl font-bold text-[#211859] mt-1">
                    Enroll: {selectedBatch.course_name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedBatch.schedule_days} • <strong>{selectedBatch.date_range}</strong>
                  </p>
                </div>

                {submitError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="relative">
                  <User className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Enter Your Full Name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-sm focus:outline-none focus:border-[#a62675]"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-sm focus:outline-none focus:border-[#a62675]"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={form.whatsapp_number}
                    onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                    placeholder="WhatsApp Number (+91 ...)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-sm focus:outline-none focus:border-[#a62675]"
                  />
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Enter Your City"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-sm focus:outline-none focus:border-[#a62675]"
                  />
                </div>

                <GoogleRecaptcha onTokenChange={setCaptchaToken} resetTrigger={captchaReset} />

                <button
                  type="submit"
                  disabled={submitting}
                  className="brand-glow-btn w-full py-3 rounded-xl text-sm font-semibold gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{submitting ? 'Submitting...' : 'Confirm Seat Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}