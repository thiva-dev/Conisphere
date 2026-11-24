import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  ArrowLeft, Clock, Laptop, Award, Star, Send, X,
  CheckCircle2, AlertCircle, User, Mail, Phone, MapPin, Calendar,
  Image as ImageIcon, FileText, Download, ShieldCheck,
  BookOpen, ClipboardCheck, Layers, ZoomIn, Check,
  UserCheck, Trophy, TrendingUp, Globe, Wrench, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { fetchPublicBatches, submitEnquiry } from '../api';
import GoogleRecaptcha from '../Components/GoogleRecaptcha';
import './NeboshIgc.css';


//  NEBOSH IGC Hero Banner 
 const neboshHeroImg = '/Course/Niboshigc-banner.webp'; 

const WHATSAPP_NUMBER = '919043133663';
const WHATSAPP_MSG = 'Hi Ms. Jaya Bharathi, I would like to know more about the NEBOSH IGC Certificate Course.';

const neboshStripImg = ''; // <-- Optional full banner 

const questionPapers = [
  { month: 'May 2026', tag: 'NEBOSH IGC • OBE Paper', pdfUrl: '' },
  { month: 'June 2026', tag: 'NEBOSH IGC • OBE Paper', pdfUrl: '' },
  { month: 'July 2026', tag: 'NEBOSH IGC • OBE Paper', pdfUrl: '' },
  { month: 'August 2026', tag: 'NEBOSH IGC • OBE Paper', pdfUrl: '' },
];
const syllabusUnits = [
  {
    shortTitle: 'Unit GIC 1',
    fullTitle: 'Unit GIC 1 – Management of Health & Safety',
    topics: [
      'Why we should Manage Workplace Health and Safety',
      'How Health and Safety Management Systems Work and what they look like',
      'Managing Risk – Understanding People and Processes',
      'Health and Safety Monitoring and Measuring',
    ],
    assessment: 'It will continue as a 24-hour scenario-based assessment.',
    submission: '',
  },
  {
    shortTitle: 'Unit GIC 2',
    fullTitle: 'Unit GIC 2 – Risk Assessment',
    topics: [
      'Physical and Psychological Health',
      'Musculoskeletal Health',
      'Chemical and Biological Agents',
      'General Workplace Issues',
      'Work Equipment',
      'Fire',
      'Electricity',
    ],
    assessment: 'It will continue as a practical risk assessment with changes to:',
    submission:
      'The assessment will be submitted by the learner in the same way as Unit One, via the online NEBOSH Assessment Platform. The deadline to submit this unit will be 10 working days after the GIC1 assessment.',
  },
];


// Sample Certificate Image Slot (e.g. '/images/nebosh-sample-cert.jpg')
const neboshSampleCertImg = '/Course/nebosh-certificate.webp';

const onlineTrainingFeatures = [
  'Live virtual classes with expert tutors',
  'Recorded sessions for revision',
  'Digital study materials and mock exams',
  'One-to-one academic support',
  'Learn from anywhere, anytime',
];

const whyChooseItems = [
  {
    icon: UserCheck,
    title: 'Expert Tutors',
    highlight: '15+ Years Experience',
    desc: 'Learn from Chartered Health & Safety Professionals with 15+ years of industry experience.',
  },
  {
    icon: Trophy,
    title: 'Proven Success',
    highlight: 'High Pass Rates',
    desc: 'Consistently high pass rates with comprehensive exam preparation support.',
  },
  {
    icon: Laptop,
    title: 'Flexible Learning',
    highlight: '100% Live Online',
    desc: 'Study from anywhere with interactive live online classes and flexible batch schedules.',
  },
  {
    icon: TrendingUp,
    title: 'Career Advancement',
    highlight: '90% Salary Growth',
    desc: '90% of our graduates report promotion or salary increase within 12 months.',
  },
  {
    icon: Globe,
    title: 'Global Recognition',
    highlight: '180+ Countries',
    desc: 'NEBOSH qualifications are respected by employers in over 180 countries.',
  },
  {
    icon: Wrench,
    title: 'Practical Skills',
    highlight: 'Real Case Studies',
    desc: 'Real-world case studies and practical workplace risk assessment practice.',
  },
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

export default function NeboshIgc() {
  const navigate = useNavigate();

  // For Enquiry Modal States
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [igcBatches, setIgcBatches] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    whatsapp_number: '',
    batch: '',
    city: '',
  });
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaReset, setCaptchaReset] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [requestedPaper, setRequestedPaper] = useState('');

  const handlePaperClick = (paper) => {
    if (paper.pdfUrl) {
      window.open(paper.pdfUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setRequestedPaper(paper.month);
    setSubmitError('');
    setSubmitSuccess('');
    setShowEnquiry(true);
  };

  const [syllabusSwiper, setSyllabusSwiper] = useState(null);
  const [activeUnit, setActiveUnit] = useState(0);
  const [certPreview, setCertPreview] = useState(false);
  const [showAllReasons, setShowAllReasons] = useState(false);

  const visibleReasons = showAllReasons ? whyChooseItems : whyChooseItems.slice(0, 3);

  const handleUnitTabClick = (index) => {
    setActiveUnit(index);
    syllabusSwiper?.slideTo(index);
  };

  // Load live NEBOSH IGC batches for the Enquiry popup
  useEffect(() => {
    fetchPublicBatches()
      .then((res) => {
        const filtered = (res.data || []).filter((b) => b.course_name === 'NEBOSH IGC');
        setIgcBatches(filtered);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = showEnquiry ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showEnquiry]);

  const handleEnquirySubmit = async (e) => {
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
        preferred_course: 'NEBOSH IGC (International General Certificate)',
        batch: form.batch ? Number(form.batch) : null,
        source: 'nebosh_igc_page',
        recaptcha_token: captchaToken,
      });

      setSubmitSuccess(res.data?.message || 'Enquiry submitted successfully!');
      setForm({ full_name: '', email: '', whatsapp_number: '', batch: '', city: '' });
      setCaptchaReset((prev) => prev + 1);
    } catch (err) {
      setSubmitError(extractApiError(err));
      setCaptchaReset((prev) => prev + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

  return (
    <div className="w-full bg-[#f8f7fc]">

      {/* =====================================================================
          PART 1: SPLIT HERO SECTION (Indigo-Magenta Luxury Theme)
         ===================================================================== */}
      <section className="nebosh-hero-bg w-full text-white pt-8 pb-20 sm:pt-10 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Top Back Navigation (Reference Layout) */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-purple-200 hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* LEFT: Exact Content & 2 Action Buttons */}
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-300">
                NEBOSH INTERNATIONAL GENERAL CERTIFICATE
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.15] tracking-tight text-white">
                Pass and Get NEBOSH IGC Certificate
              </h1>

              <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed max-w-xl">
                Join 50,000+ professionals who enhanced their careers through our expert-led NEBOSH
                IGC Certificate Course via online and classroom training.
              </p>

              {/* Buttons: Chat with Ms.Jaya Bharathi + For Enquiry */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nebosh-wa-cta inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide"
                >
                  <svg viewBox="0 0 32 32" className="w-4 h-4 sm:w-5 sm:h-5 fill-white shrink-0" aria-hidden="true">
                    <path d="M16.01 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.1 29l6.78-1.78a12.75 12.75 0 0 0 6.13 1.56h.01c7.06 0 12.79-5.73 12.79-12.8 0-3.42-1.33-6.64-3.75-9.05A12.72 12.72 0 0 0 16.01 3.2zm7.46 18.17c-.31.88-1.82 1.68-2.52 1.78-.65.1-1.47.14-2.37-.15-.55-.18-1.26-.41-2.16-.8-3.8-1.64-6.28-5.48-6.47-5.73-.19-.26-1.55-2.06-1.55-3.93 0-1.87.98-2.79 1.33-3.17.35-.38.76-.48 1.01-.48.25 0 .51 0 .73.01.24.01.55-.09.86.66.31.76 1.07 2.62 1.17 2.81.09.19.16.41.03.67-.13.26-.19.42-.38.64-.19.22-.4.5-.57.67-.19.19-.39.4-.17.78.22.38.98 1.62 2.11 2.62 1.45 1.29 2.67 1.69 3.05 1.88.38.19.6.16.82-.1.22-.25.95-1.11 1.2-1.49.26-.38.51-.32.86-.19.35.13 2.24 1.06 2.62 1.25.38.19.64.28.73.44.1.16.1.91-.21 1.79z" />
                  </svg>
                  <span>Chat with Ms.Jaya Bharathi</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitError('');
                    setSubmitSuccess('');
                    setShowEnquiry(true);
                  }}
                  className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide cursor-pointer"
                >
                  <span>For Enquiry</span>
                </button>
              </div>
            </div>

           {/* RIGHT: Compact Width + Full-View Image + Crisp Outside Border Line */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="nebosh-banner-frame rounded-3xl p-2 sm:p-2.5 w-full max-w-[490px]">
                  <img
                    src={neboshHeroImg}
                    alt="Cognisphere NEBOSH Gold Learning Partner IGC Training"
                    className="w-full h-auto object-contain rounded-2xl block bg-white"
                  />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PART 2: OVERLAPPING FLOATING 4-STAT BAR (Reference Style Upgraded!)
         ===================================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-14 relative z-10 pb-14">
        <div className="nebosh-floating-stats rounded-2xl sm:rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:gap-px lg:divide-x divide-[#ebe5f7] overflow-hidden">

          {/* Stat 1: Duration */}
          <div className="nebosh-stat-tile p-5 sm:p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#f3effa] text-[#211859] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#a62675]" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded bg-[#a62675] text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                Duration
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-[#211859] leading-tight">
                1 Month
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">11 Units</p>
            </div>
          </div>

          {/* Stat 2: Training Mode */}
          <div className="nebosh-stat-tile p-5 sm:p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#f3effa] text-[#211859] flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5 text-[#211859]" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded bg-[#211859] text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                Training Mode
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-[#211859] leading-tight">
                Virtual / Offline
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Flexible Learning</p>
            </div>
          </div>

          {/* Stat 3: First-Time Pass Rate */}
          <div className="nebosh-stat-tile p-5 sm:p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#211859] leading-tight">
                89%
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                First-Time Pass Rate
              </p>
            </div>
          </div>

          {/* Stat 4: Average Student Rating */}
          <div className="nebosh-stat-tile p-5 sm:p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#E0B04A] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-[#E0B04A]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xl sm:text-2xl font-extrabold text-[#211859] leading-tight">
                  4.6/5
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#E0B04A] text-[#E0B04A]" />
                  ))}
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Average Student Rating
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* NEXT NEBOSH IGC SECTIONS WILL GO HERE */}
        {/* =====================================================================
          PART 3: NEBOSH GOLD PARTNER STRIP + 2026 QUESTION PAPERS
         ===================================================================== */}
      <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* 1. Proud NEBOSH Gold Learning Partner Ribbon */}
          {neboshStripImg ? (
            <div className="rounded-2xl overflow-hidden border border-[#e4dcf3] shadow-lg">
              <img
                src={neboshStripImg}
                alt="We're Proud to be a NEBOSH Gold Learning Partner"
                className="w-full h-auto object-contain block"
              />
            </div>
          ) : (
            <div className="gold-partner-strip rounded-2xl sm:rounded-3xl px-6 py-6 sm:px-10 sm:py-7 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#E0B04A]">
                  <ShieldCheck className="w-4 h-4" /> Official Accreditation
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  We&apos;re Proud to be a{' '}
                  <span className="text-[#E0B04A]">NEBOSH Gold Learning Partner</span>
                </h2>
                <p className="text-xs sm:text-sm text-purple-200">
                  Cognisphere Management and Consultancy • Internationally Recognized Excellence
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="px-5 py-2.5 rounded-xl bg-white text-[#211859] font-extrabold text-xs sm:text-sm shadow-md border-b-4 border-[#E0B04A]">
                  NEBOSH GOLD • 1844
                </div>
              </div>
            </div>
          )}

          {/* 2. Download NEBOSH IGC Exam Question Papers 2026 */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f3effa] border border-[#e2daf3] text-[11px] font-bold uppercase tracking-[0.16em] text-[#a62675]">
                <FileText className="w-3.5 h-3.5" />
                2026 OBE Exam Archive • PDF
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#211859]">
                Download NEBOSH IGC Exam Question Papers 2026
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Practice with recent Open Book Examination (OBE) papers to boost your first-time pass confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
              {questionPapers.map((paper) => (
                <div
                  key={paper.month}
                  className="paper-download-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="paper-pdf-icon w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#211859] truncate">
                        {paper.month}
                      </h3>
                      <p className="text-xs font-medium text-slate-500">{paper.tag}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePaperClick(paper)}
                    className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* NEXT NEBOSH IGC SECTIONS WILL GO HERE */}

      {/* =====================================================================
          PART 4: NEBOSH IGC CERTIFICATE SYLLABUS (TABBED SWIPE + MARK & RESULT)
         ===================================================================== */}
      <section className="w-full bg-[#f8f7fc] py-14 sm:py-18 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-5xl mx-auto">

          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#e2daf3] text-[11px] font-bold uppercase tracking-[0.16em] text-[#a62675]">
              <BookOpen className="w-3.5 h-3.5" />
              Course Curriculum
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#211859]">
              NEBOSH IGC Certificate Syllabus
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Tap or swipe between Unit GIC 1 and Unit GIC 2 to explore every module and assessment format.
            </p>
          </div>

          {/* 1. REFERENCE-STYLE TABBED + SWIPEABLE SYLLABUS CARD */}
          <div className="syllabus-shell-card rounded-3xl overflow-hidden">

            {/* Top Both Headings Tab Bar + Sliding Bottom Line */}
            <div className="relative border-b border-[#ece7f6] bg-white">
              <div className="grid grid-cols-2">
                {syllabusUnits.map((unit, idx) => (
                  <button
                    key={unit.shortTitle}
                    type="button"
                    onClick={() => handleUnitTabClick(idx)}
                    className={`syllabus-tab-btn py-4 px-3 sm:px-6 text-center cursor-pointer ${
                      activeUnit === idx ? 'is-active' : ''
                    }`}
                  >
                    <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#a62675] mb-0.5">
                      {unit.shortTitle}
                    </span>
                    <span className="block text-xs sm:text-sm lg:text-[15px] font-bold leading-snug">
                      {idx === 0 ? 'Management of Health & Safety' : 'Risk Assessment'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sliding Animated Bottom Line */}
              <div
                className="syllabus-sliding-line w-1/2"
                style={{ transform: `translateX(${activeUnit * 100}%)` }}
              />
            </div>

            {/* Swipeable Slides Body (autoHeight smoothly adapts to 4 vs 7 items!) */}
            <Swiper
              autoHeight={true}
              speed={450}
              onSwiper={setSyllabusSwiper}
              onSlideChange={(swiper) => setActiveUnit(swiper.activeIndex)}
              className="w-full"
            >
              {syllabusUnits.map((unit) => (
                <SwiperSlide key={unit.shortTitle}>
                  <div className="p-5 sm:p-8 space-y-6">

                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f0ebf8]">
                      <h3 className="text-base sm:text-xl font-bold text-[#211859]">
                        {unit.fullTitle}
                      </h3>
                    </div>

                    {/* 2-Column Interactive Topic Pills (Clean Reference Style!) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {unit.topics.map((topic, tIdx) => (
                        <div
                          key={topic}
                          className="syllabus-topic-item rounded-xl p-3.5 flex items-start gap-3"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#211859] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {tIdx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-[#211859] leading-snug">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Assessment & Submission Callout Box */}
                    <div className="syllabus-assess-box rounded-2xl p-4 sm:p-5 space-y-2 text-xs sm:text-sm text-[#211859]">
                      <div className="flex items-start gap-2.5">
                        <ClipboardCheck className="w-4 h-4 text-[#a62675] shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          <strong className="text-[#211859]">Assessment:</strong> {unit.assessment}
                        </p>
                      </div>

                      {unit.submission && (
                        <div className="flex items-start gap-2.5 pt-1 border-t border-[#e8e2f4]">
                          <Layers className="w-4 h-4 text-[#211859] shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            <strong className="text-[#211859]">Submission:</strong> {unit.submission}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 2. MARK & RESULT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-8">

            {/* Mark Card */}
            <div className="mark-result-card rounded-3xl p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-xl font-bold text-[#211859]">Mark</h3>
                <span className="px-3 py-1 rounded-full bg-[#211859] text-amber-300 text-[11px] font-bold">
                  60% Pass Mark (GIC 2)
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-[#0f0f0f]">
                It will transition from &lsquo;met/not met&rsquo; to a points-based marking system,
                with a mark breakdown document automatically issued to the learner. The pass mark
                for GIC 2 will be 60%.
              </p>
            </div>

            {/* Result Card */}
            <div className="mark-result-card rounded-3xl p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-xl font-bold text-[#211859]">Result</h3>
                <span className="px-3 py-1 rounded-full bg-[#f3effa] border border-[#e1d7f3] text-[#a62675] text-[11px] font-bold">
                  60 Working Days • Same Day
                </span>
              </div>
              <p className="text-black sm:text-sm text-[#0f0f0f] leading-relaxed">
                Both units&rsquo; results will be issued on the same day, 60 working days from the
                24-hour scenario-based assessment (GIC1). This means that learners will receive the
                outcome of their whole qualification at the same time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* NEXT NEBOSH IGC SECTIONS WILL GO HERE */}

    {/* =====================================================================
          PART 5: SAMPLE CERTIFICATE + ONLINE TRAINING MODE + WHY CHOOSE NEBOSH
         ===================================================================== */}
      <section className="w-full bg-white py-14 sm:py-18 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">

{/* ---------- 1. NEBOSH IGC SAMPLE CERTIFICATE (Minimal Luxury Showcase) ---------- */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#211859] mb-8">
              NEBOSH IGC <span className="text-[#a62675]">Sample Certificate</span>
            </h2>

            <div className="relative p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#f8f7fc] to-white border border-[#e6e0f3] shadow-sm">
              <button
                type="button"
                onClick={() => neboshSampleCertImg && setCertPreview(true)}
                className={`sample-cert-card group relative w-[270px] sm:w-[350px] aspect-[3/4] rounded-2xl overflow-hidden p-2.5 flex items-center justify-center ${
                  neboshSampleCertImg ? 'cursor-zoom-in' : 'cursor-default'
                }`}
              >
                {neboshSampleCertImg ? (
                  <>
                    <img
                      src={neboshSampleCertImg}
                      alt="NEBOSH IGC Sample Certificate"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-[#211859]/90 text-white text-[11px] font-semibold inline-flex items-center gap-1.5 shadow-md group-hover:bg-[#a62675] transition-colors">
                      <ZoomIn className="w-3.5 h-3.5" /> Zoom
                    </span>
                  </>
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-[#dcd3ef] rounded-xl bg-white flex flex-col items-center justify-center text-center p-6">
                    <Award className="w-12 h-12 text-[#E0B04A] mb-3" />
                    <p className="text-sm font-bold text-[#211859]">NEBOSH IGC Sample Certificate</p>
                    <span className="mt-2.5 text-[11px] px-3 py-1 rounded-full bg-[#f3effa] text-[#a62675] font-semibold">
                      Certificate Image Slot
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* ---------- 2. OUR NEBOSH TRAINING MODE (100% ONLINE SHOWCASE) ---------- */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a62675]">
                100% LIVE VIRTUAL LEARNING
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-[#211859]">
                Our NEBOSH Training Modes
              </h2>
            </div>

            <div className="online-mode-showcase max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">

              {/* Left: Online Mode Overview + CTA */}
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online Mode Only
                </span>

                <h3 className="text-2xl sm:text-[28px] font-bold text-[#211859] leading-tight">
                  Online NEBOSH Course
                </h3>

                <p className="text-sm sm:text-[15px] text-[#0f0f0f] leading-relaxed">
                  Flexible, interactive, and designed for working professionals across India, Dubai,
                  GCC &amp; worldwide.
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestedPaper('');
                      setSubmitError('');
                      setSubmitSuccess('');
                      setShowEnquiry(true);
                    }}
                    className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold gap-2 cursor-pointer"
                  >
                    <Laptop className="w-4 h-4" />
                    <span>Join Online Batch</span>
                  </button>
                </div>
              </div>

              {/* Right: 5 Crisp Feature Pills */}
              <div className="lg:col-span-6 space-y-2.5">
                {onlineTrainingFeatures.map((feat) => (
                  <div
                    key={feat}
                    className="online-feature-pill rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-[#211859] text-amber-300 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#211859]">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ---------- 3. WHY CHOOSE OUR NEBOSH TRAINING (3x2 GRID + VIEW MORE) ---------- */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a62675]">
                COGNISPHERE ADVANTAGE
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-[#211859]">
                Why Choose Our NEBOSH Training
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {visibleReasons.map((item) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.title}
                    className="why-nebosh-card rounded-2xl p-6 flex flex-col items-center text-center h-full"
                  >
                    <div className="why-icon-halo w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                      <IconComp className="w-7 h-7" />
                    </div>

                    <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f3effa] text-[#a62675] mb-2">
                      {item.highlight}
                    </span>

                    <h3 className="text-lg font-bold text-[#211859]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-[13.5px] text-[#0f0f0f] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Clean View More / Show Less Toggle Button */}
            <div className="text-center mt-8">
              <button
                type="button"
                onClick={() => setShowAllReasons((prev) => !prev)}
                className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden px-7 py-3 rounded-full text-xs sm:text-sm font-semibold gap-2 cursor-pointer"
              >
                <span>{showAllReasons ? 'Show Less' : 'View More Benefits (6)'}</span>
                {showAllReasons ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* NEXT NEBOSH IGC SECTIONS WILL GO HERE */}

      {/* ================= SAMPLE CERTIFICATE ZOOM MODAL ================= */}
      {certPreview && neboshSampleCertImg && (
        <div
          onClick={() => setCertPreview(false)}
          className="fixed inset-0 z-50 bg-[#0d0826]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-4 relative shadow-2xl border border-[#e3dbf3]"
          >
            <button
              type="button"
              onClick={() => setCertPreview(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-[#f8f7fc] hover:bg-[#a62675] text-[#211859] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={neboshSampleCertImg}
              alt="NEBOSH IGC Sample Certificate Zoom"
              className="w-full max-h-[82vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
      {/* =====================================================================
          "FOR ENQUIRY" POPUP MODAL (API + Live NEBOSH IGC Batches + reCAPTCHA)
         ===================================================================== */}
      {showEnquiry && (
        <div
          onClick={() => setShowEnquiry(false)}
          className="fixed inset-0 z-50 bg-[#0d0826]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#dfd6f2] relative max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setShowEnquiry(false)}
              aria-label="Close Enquiry Modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f8f7fc] hover:bg-[#a62675] text-[#211859] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-[#211859]">Enquiry Submitted!</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">{submitSuccess}</p>
                <button
                  type="button"
                  onClick={() => setShowEnquiry(false)}
                  className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden mt-6 px-7 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
                <div className="pr-8">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f3effa] text-[#a62675] text-[10.5px] font-bold uppercase tracking-wider">
                    NEBOSH Gold Partner Admissions
                  </span>
                  <h3 className="text-xl font-bold text-[#211859] mt-1">
                    Enquire for NEBOSH IGC
                  </h3>
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

                {igcBatches.length > 0 && (
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#a62675] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      required
                      value={form.batch}
                      onChange={(e) => setForm({ ...form, batch: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-sm cursor-pointer focus:outline-none focus:border-[#a62675]"
                    >
                      <option value="">Select Upcoming NEBOSH IGC Batch *</option>
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
                  <span>{submitting ? 'Submitting...' : 'Submit Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

//PAT-2 OF NEBOSH
 //Neboshigc2.jsx
