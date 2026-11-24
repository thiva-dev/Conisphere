import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, ChevronDown, ChevronUp, GraduationCap, Wrench, Building2,
  Briefcase, Globe, Laptop, Award, Users, Clock, MapPin, Phone,
  Copy, Check, Image as ImageIcon, User, Mail, BookOpen, Send,
  CheckCircle2, AlertCircle, Flame, ArrowRight
} from 'lucide-react';
import { fetchPublicBatches, submitEnquiry } from '../api';
import GoogleRecaptcha from '../Components/GoogleRecaptcha';
import './NeboshIgc.css';

// Image Slots (Unga images path inga podunga — illaatti crisp slot card kaatum)
const learnersJourneyImg = '/Course/journey.webp'; 
const posterLeftImg = '/Course/Reg-1.webp';      
const posterCenterImg = '/Course/Reg-1.webp';    

// 1. Exact Exam Dates 2026 - 2027
const examDates = [
  { monthYear: 'August 2026', year: '2026', examDate: 'Wednesday 05 August 2026', resultDate: 'Thursday 15 October 2026' },
  { monthYear: 'October 2026', year: '2026', examDate: 'Wednesday 07 October 2026', resultDate: 'Friday 08 January 2027' },
  { monthYear: 'November 2026', year: '2026', examDate: 'Wednesday 04 November 2026', resultDate: 'Friday 05 February 2027' },
  { monthYear: 'January 2027', year: '2027', examDate: 'Wednesday 06 January 2027', resultDate: 'Friday 02 April 2027' },
  { monthYear: 'February 2027', year: '2027', examDate: 'Wednesday 03 February 2027', resultDate: 'Friday 30 April 2027' },
  { monthYear: 'April 2027', year: '2027', examDate: 'Wednesday 07 April 2027', resultDate: 'Friday 02 July 2027' },
  { monthYear: 'May 2027', year: '2027', examDate: 'Wednesday 05 May 2027', resultDate: 'Thursday 29 July 2027' },
  { monthYear: 'July 2027', year: '2027', examDate: 'Wednesday 07 July 2027', resultDate: 'Thursday 30 September 2027' },
  { monthYear: 'August 2027', year: '2027', examDate: 'Wednesday 04 August 2027', resultDate: 'Thursday 28 October 2027' },
  { monthYear: 'October 2027', year: '2027', examDate: 'Wednesday 06 October 2027', resultDate: 'Friday 07 January 2028' },
  { monthYear: 'November 2027', year: '2027', examDate: 'Wednesday 03 November 2027', resultDate: 'Friday 04 February 2028' },
];

// 2. Who Can Enroll?
const whoCanEnroll = [
  { label: 'Fresh Graduates', icon: GraduationCap },
  { label: 'Hands-on Learners', icon: Wrench },
  { label: 'Corporate Teams', icon: Building2 },
  { label: 'Working Professionals', icon: Briefcase },
  { label: 'International Learners', icon: Globe },
  { label: 'Remote Students', icon: Laptop },
];

// 3. NEBOSH Class Schedules
const classSchedules = [
  { mode: 'Online ', days: 'Weekdays (Mon-Fri)', time: '08:30 PM – 11:30 PM IST', duration: '1 Month', students: 20 },
  { mode: 'Online ', days: 'Weekend (Sunday)', time: '10:30 AM – 05:30 PM IST', duration: '10 Days', students: 20 },
  { mode: 'Online ', days: 'Full Day Class', time: '10:00 AM – 06:00 PM IST', duration: '10 Days', students: 20 },
];

// 4. Course Locations (14 Cities)
const courseLocations = [
  { name: 'Dubai', slug: 'dubai' },
  { name: 'Abu Dhabi', slug: 'abu-dhabi' },
  { name: 'Delhi', slug: 'delhi' },
  { name: 'Mumbai', slug: 'mumbai' },
  { name: 'Chennai', slug: 'chennai' },
  { name: 'Bangalore', slug: 'bangalore' },
  { name: 'Kochi', slug: 'kochi' },
  { name: 'Hyderabad', slug: 'hyderabad' },
  { name: 'Kolkata', slug: 'kolkata' },
  { name: 'Pune', slug: 'pune' },
  { name: 'Patna', slug: 'patna' },
  { name: 'Trichy', slug: 'trichy' },
  { name: 'Madurai', slug: 'madurai' },
  { name: 'Coimbatore', slug: 'coimbatore' },
];

// 5. Regional Contact Numbers (Exact Numbers From Screenshot)
const regionTabs = ['All', 'South India', 'North & East', 'West'];
const regionalContacts = [
  { city: 'Chennai', region: 'South India', phone: '+91 73057 33883' },
  { city: 'Mumbai', region: 'West', phone: '+91 96670 78893' },
  { city: 'Delhi', region: 'North & East', phone: '+91 96670 78893' },
  { city: 'Kolkata', region: 'North & East', phone: '+91 96670 78893' },
  { city: 'Bangalore', region: 'South India', phone: '+91 73057 33883' },
  { city: 'Hyderabad', region: 'South India', phone: '+91 73057 33883' },
  { city: 'Kochi', region: 'South India', phone: '+91 90431 33993' },
  { city: 'Pune', region: 'West', phone: '+91 90431 33663' },
  { city: 'Patna', region: 'North & East', phone: '+91 96670 78893' },
  { city: 'Coimbatore', region: 'South India', phone: '+91 90431 33993' },
  { city: 'Madurai', region: 'South India', phone: '+91 90431 33663' },
  { city: 'Trichy', region: 'South India', phone: '+91 90431 33663' },
];

const courseOptions = [
  'NEBOSH IGC (International General Certificate)',
  'NEBOSH HSW (Health & Safety at Work)',
  'IOSH Managing Safely',
  'OSHA 30-Hour Construction / General',
  'BCSP (ASP / CSP)',
  'Highfield International Level 3',
  'ISO 45001 Lead Auditor',
];

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

export default function NeboshIgc2() {
  // Exam Dates Filters
  const [yearFilter, setYearFilter] = useState('All');
  const [showAllDates, setShowAllDates] = useState(false);

  // Live Batches (PostgreSQL Synced!)
  const [igcBatches, setIgcBatches] = useState([]);

  // Regional Contacts State
  const [regionTab, setRegionTab] = useState('All');
  const [copiedCity, setCopiedCity] = useState(null);

  // Bottom Register Form State
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    whatsapp_number: '',
    preferred_course: 'NEBOSH IGC (International General Certificate)',
    batch: '',
    city: '',
  });
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaReset, setCaptchaReset] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const registerSectionRef = useRef(null);

  const loadBatches = () => {
    fetchPublicBatches()
      .then((res) => {
        const filtered = (res.data || []).filter((b) => b.course_name === 'NEBOSH IGC');
        setIgcBatches(filtered);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadBatches();
  }, []);

  // Filtered Exam Dates
  const filteredExamDates =
    yearFilter === 'All' ? examDates : examDates.filter((d) => d.year === yearFilter);
  const visibleExamDates = showAllDates ? filteredExamDates : filteredExamDates.slice(0, 5);

  // Filtered Regional Contacts
  const visibleContacts =
    regionTab === 'All'
      ? regionalContacts
      : regionalContacts.filter((c) => c.region === regionTab);

  const handleCopyPhone = (city, phone) => {
    navigator.clipboard.writeText(phone);
    setCopiedCity(city);
    setTimeout(() => setCopiedCity(null), 1500);
  };

  // Batch row-la "Enroll" click panna bottom form-ku scroll panni pre-select pannum
  const handleSelectBatchAndScroll = (batchId) => {
    setForm((prev) => ({
      ...prev,
      preferred_course: 'NEBOSH IGC (International General Certificate)',
      batch: String(batchId),
    }));
    registerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
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
        batch: form.batch ? Number(form.batch) : null,
        source: 'nebosh_igc_bottom_form',
        recaptcha_token: captchaToken,
      });

      setSubmitSuccess(res.data?.message || 'Registration successful!');
      setForm({
        full_name: '',
        email: '',
        whatsapp_number: '',
        preferred_course: 'NEBOSH IGC (International General Certificate)',
        batch: '',
        city: '',
      });
      setCaptchaReset((prev) => prev + 1);
      loadBatches(); // Live Enquired count refresh
    } catch (err) {
      setSubmitError(extractApiError(err));
      setCaptchaReset((prev) => prev + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* =====================================================================
          SECTION 1: NEBOSH IGC EXAM DATES 2026 - 2027
         ===================================================================== */}
      <section className="w-full bg-[#f8f7fc] py-14 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-5xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-7">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#e2daf3] text-[11px] font-bold uppercase tracking-[0.16em] text-[#a62675]">
              <Calendar className="w-3.5 h-3.5" />
              Official Exam Calendar
            </span>
            <h2 className="mt-2.5 text-2xl sm:text-3xl font-bold text-[#211859]">
              NEBOSH IGC Exam Dates 2026 &ndash; 2027
            </h2>
          </div>

          {/* Year Filter Tabs */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            {['All', '2026', '2027'].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => { setYearFilter(yr); setShowAllDates(false); }}
                className={`igc-filter-pill px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold cursor-pointer ${
                  yearFilter === yr ? 'is-active' : ''
                }`}
              >
                {yr === 'All' ? 'All (2026–2027)' : yr}
              </button>
            ))}
          </div>

          {/* Desktop Crisp Table */}
          <div className="hidden sm:block igc-table-wrap rounded-2xl overflow-hidden">
            <table className="igc-table">
              <thead>
                <tr>
                  <th>Month/Year</th>
                  <th>Exam Date</th>
                  <th>Result Date</th>
                </tr>
              </thead>
              <tbody>
                {visibleExamDates.map((row) => (
                  <tr key={row.monthYear}>
                    <td className="font-bold text-[#a62675]">{row.monthYear}</td>
                    <td className="font-medium">{row.examDate}</td>
                    <td className="font-medium text-slate-600">{row.resultDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="sm:hidden space-y-3">
            {visibleExamDates.map((row) => (
              <div key={row.monthYear} className="igc-exec-card rounded-2xl p-4 space-y-1.5">
                <p className="text-sm font-bold text-[#a62675]">{row.monthYear}</p>
                <p className="text-xs text-[#211859]"><strong>Exam Date:</strong> {row.examDate}</p>
                <p className="text-xs text-slate-600"><strong>Result Date:</strong> {row.resultDate}</p>
              </div>
            ))}
          </div>

          {filteredExamDates.length > 5 && (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setShowAllDates((prev) => !prev)}
                className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold gap-1.5 cursor-pointer"
              >
                <span>{showAllDates ? 'Show Fewer Dates' : `View All ${filteredExamDates.length} Exam Dates`}</span>
                {showAllDates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* =====================================================================
          SECTION 2: WHO CAN ENROLL? & RECOGNITION & QUALIFICATION
         ===================================================================== */}
      <section className="w-full bg-white py-14 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Who Can Enroll? */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#211859] text-center mb-8">
              Who Can Enroll?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {whoCanEnroll.map((item) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.label}
                    className="igc-enroll-pill rounded-2xl px-5 py-4 flex items-center gap-3.5"
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#f3effa] text-[#a62675] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </span>
                    <span className="text-sm sm:text-[15px] font-bold text-[#211859]">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recognition & Qualification */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#211859] text-center mb-8">
              Recognition &amp; Qualification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Recognition */}
              <div className="igc-exec-card rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#f3effa] border border-[#e2daf3] text-[#a62675] flex items-center justify-center mb-4">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#211859] mb-3">Recognition</h3>
                <p className="text-xs sm:text-sm 'text-[#0f0f0f' leading-relaxed">
                  NEBOSH International General Certificate in Occupational Health and Safety will
                  continue to be accredited and credit rated by the Scottish Qualifications
                  Authority (SQA) Accreditation. This is listed in the Scottish Credit and
                  Qualifications Framework (SCQF) at SCQF Level 6 with 11 SCQF credit points. SCQF
                  Level 6 is comparable to RQF/CQFW Level 3 in England, Wales and Northern Ireland.
                </p>
              </div>

              {/* Card 2: Qualification Entitlements */}
              <div className="igc-exec-card rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#f3effa] border border-[#e2daf3] text-[#211859] flex items-center justify-center mb-4">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#211859] mb-3">
                  Qualification holders are also entitled to
                </h3>
                <ul className="text-xs sm:text-sm 'text-[#0f0f0f' leading-relaxed space-y-2.5 text-left">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#a62675] shrink-0 mt-0.5" />
                    <span>
                      Associate Membership (AIIRSM) of the International Institute of Risk and Safety
                      Management (IIRSM).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#a62675] shrink-0 mt-0.5" />
                    <span >
                      Affiliate Membership (AIOSH) of the Institution of Occupational Safety and
                      Health (IOSH).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#a62675] shrink-0 mt-0.5" />
                    <span className='text-[#0f0f0f'>
                      The qualification also meets the academic requirements for Technical Membership
                      (Tech IOSH) of IOSH with appropriate experience. (Assessments must be taken in
                      the UK to be eligible for IOSH membership).
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================================
          SECTION 3: NEBOSH CLASS SCHEDULES & UPCOMING NEBOSH COURSE BATCHES
         ===================================================================== */}
      <section className="w-full bg-[#f8f7fc] py-14 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* NEBOSH Class Schedules */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#211859] text-center mb-8">
              NEBOSH Class Schedules
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {classSchedules.map((sch) => (
                <div key={sch.days} className="igc-exec-card rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#211859] text-white text-[11px] font-bold">
                      {sch.mode}
                    </span>
                    <span className="text-xs font-bold text-[#a62675]">
                      Max {sch.students} Students
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#211859]">{sch.days}</h3>

                  <div className="pt-2 border-t border-[#f0ebf8] space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#a62675] shrink-0" />
                      <span className="font-semibold text-[#211859]">{sch.time}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#211859]/60 shrink-0" />
                      <span>Total Duration: <strong>{sch.duration}</strong></span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Upcoming NEBOSH Course Batches (Synced with PostgreSQL!) */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#211859]">
                Upcoming NEBOSH Course Batches
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Live seat availability — click Enroll to reserve your batch below
              </p>
            </div>

            {igcBatches.length > 0 && (
              <>
                {/* Desktop Crisp Table */}
                <div className="hidden md:block igc-table-wrap rounded-2xl overflow-hidden">
                  <table className="igc-table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Mode</th>
                        <th>Day</th>
                        <th>Date</th>
                        <th>Seats Left</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {igcBatches.map((b) => {
                        const isLow = b.seats_left > 0 && b.seats_left < 5;
                        return (
                          <tr key={b.id}>
                            <td className="font-bold">{b.course_name}</td>
                            <td>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {b.mode}
                              </span>
                            </td>
                            <td className="font-semibold">{b.schedule_days}</td>
                            <td className="font-medium text-[#a62675]">{b.date_range}</td>
                            <td>
                              <span className={`inline-flex items-center gap-1 font-extrabold text-xs px-2.5 py-1 rounded-full ${
                                isLow ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-[#f3effa] text-[#211859]'
                              }`}>
                                {isLow && <Flame className="w-3.5 h-3.5" />}
                                {b.seats_left} / {b.total_seats}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                disabled={b.seats_left === 0}
                                onClick={() => handleSelectBatchAndScroll(b.id)}
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#211859] hover:bg-[#a62675] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <span>{b.seats_left === 0 ? 'Full' : 'Enroll'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {igcBatches.map((b) => (
                    <div key={b.id} className="igc-exec-card rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#211859]">{b.course_name}</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          {b.mode}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#a62675]">{b.date_range}</p>
                      <p className="text-xs text-slate-600">{b.schedule_days}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#f0ebf8]">
                        <span className="text-xs font-bold text-[#211859]">
                          Seats Left: {b.seats_left} / {b.total_seats}
                        </span>
                        <button
                          type="button"
                          disabled={b.seats_left === 0}
                          onClick={() => handleSelectBatchAndScroll(b.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#211859] text-white text-xs font-semibold"
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* =====================================================================
          SECTION 4: COURSE LOCATIONS (14 CITIES) & REGIONAL CONTACT NUMBERS
         ===================================================================== */}
      <section className="w-full bg-white py-14 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* 14 Course Locations */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#211859] text-center mb-8">
              We&rsquo;re also offering the NEBOSH Certificate Course in these Locations:
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {courseLocations.map((loc) => (
                <Link
                  key={loc.slug}
                  to={`/locations/${loc.slug}`}
                  className="igc-enroll-pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#211859] hover:text-[#a62675]"
                >
                  <MapPin className="w-4 h-4 text-[#a62675]" />
                  <span>{loc.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Regional Contact Numbers */}
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#211859]">
                Regional Contact Numbers
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                Get in touch with our offices across different locations
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
              {regionTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRegionTab(tab)}
                  className={`igc-filter-pill px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold cursor-pointer ${
                    regionTab === tab ? 'is-active' : ''
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {visibleContacts.map((item) => {
                const isCopied = copiedCity === item.city;
                return (
                  <div key={item.city} className="igc-exec-card rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#211859]">
                        <MapPin className="w-4 h-4 text-[#a62675]" />
                        {item.city}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f8f7fc] text-slate-500 border border-[#ebe5f7]">
                        {item.region}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-[#211859]/85">{item.phone}</p>

                    <div className="mt-3 pt-2.5 border-t border-[#f0ebf8] flex items-center gap-2">
                      <a
                        href={`tel:${item.phone.replace(/\s+/g, '')}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#211859] hover:bg-[#a62675] text-white text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(item.city, item.phone)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-[#f8f7fc] text-[#211859] border-[#e2daf3]'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================================
          SECTION 5: NEBOSH IGC COURSE REGISTRATION AND PROCESS OVERVIEW
         ===================================================================== */}
      <section className="w-full bg-[#f8f7fc] py-14 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-2xl sm:text-3xl font-bold text-[#211859] text-center mb-10">
            NEBOSH IGC Course Registration and Process Overview
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-2xl sm:text-[28px] font-bold text-[#211859] leading-snug">
                NEBOSH IGC Training &ndash; Learner&rsquo;s Journey at Cognisphere
              </h3>
              <p className="text-sm sm:text-base text-[#0f0f0f] leading-relaxed">
                At Cognisphere Management and Consultancy, learners are supported at every stage of
                their NEBOSH IGC journey&mdash;from initial inquiry to certification and beyond.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="igc-exec-card rounded-3xl p-3 bg-white overflow-hidden">
                {learnersJourneyImg ? (
                  <img
                    src={learnersJourneyImg}
                    alt="NEBOSH IGC Learner's Journey at Cognisphere"
                    className="w-full h-auto object-contain rounded-2xl block"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-[#dcd3ef] bg-[#faf9fd] flex flex-col items-center justify-center text-center p-6">
                    <ImageIcon className="w-11 h-11 text-[#a62675]/75 mb-2" />
                    <p className="text-sm font-bold text-[#211859]">
                      NEBOSH IGC Learner&rsquo;s Journey Infographic Slot
                    </p>
                    <span className="text-xs text-slate-400 mt-1">
                      Add path in <code className="text-[#a62675]">learnersJourneyImg</code>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================================
          SECTION 6: REGISTER NEBOSH IGC COURSE & EXAM (2 POSTERS + API FORM)
         ===================================================================== */}
      <section ref={registerSectionRef} id="nebosh-register" className="w-full bg-white py-14 sm:py-18 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-2xl sm:text-3xl font-bold text-[#211859] text-center mb-10">
            Register NEBOSH IGC Course &amp; Exam
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">

            {/* Left Poster Slot 1 (NEBOSH Course 6-Steps) */}
            <div className="lg:col-span-4 igc-exec-card rounded-3xl overflow-hidden flex items-center justify-center min-h-[340px]">
              
                <img src={posterLeftImg} alt="NEBOSH Course Process" className="w-full h-full object-cover" />
            </div>

            {/* Center Poster Slot 2 (Exam & Certification) */}
            <div className="lg:col-span-4 igc-exec-card rounded-3xl overflow-hidden flex items-center justify-center min-h-[340px]">
                <img src={posterCenterImg} alt="NEBOSH Course Exam and Certification" className="w-full h-full object-cover" />
              
            </div>

            {/* Right: Real API + reCAPTCHA Registration Form */}
            <div className="md:col-span-2 lg:col-span-4 igc-exec-card rounded-3xl p-5 sm:p-6 flex flex-col justify-center">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-[#211859]">Registration Successful!</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">{submitSuccess}</p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess('')}
                    className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden mt-6 px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
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
                      placeholder="Enter Your WhatsApp Number"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-sm focus:outline-none focus:border-[#a62675]"
                    />
                  </div>

                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      required
                      value={form.preferred_course}
                      onChange={(e) => setForm({ ...form, preferred_course: e.target.value, batch: '' })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-sm cursor-pointer focus:outline-none focus:border-[#a62675]"
                    >
                      <option value="">Select Your Preferred Course</option>
                      {courseOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {form.preferred_course.toLowerCase().includes('nebosh') && igcBatches.length > 0 && (
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        required
                        value={form.batch}
                        onChange={(e) => setForm({ ...form, batch: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8f7fc] border border-[#a62675]/50 text-sm cursor-pointer focus:outline-none focus:border-[#a62675]"
                      >
                        <option value="">Select Upcoming NEBOSH Batch *</option>
                        {igcBatches.map((b) => (
                          <option key={b.id} value={b.id} disabled={b.seats_left === 0}>
                            {b.schedule_days} ({b.date_range}) — {b.seats_left}/{b.total_seats} Seats
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
                    className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden w-full py-3 rounded-xl text-sm font-semibold gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Register Now'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}