import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import {
  Image as ImageIcon, Award, ShieldCheck, MapPin,
  Phone, Copy, Check, ArrowRight
} from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import './TrainingAndContacts.css';

// Part 1: Training Approach Photo & Numbered Pillars
const approachImg = '/Pictures/training.webp'; 
const approachSteps = [
  { title: 'Clear Instruction', desc: 'Clear, easy-to-understand instruction.' },
  { title: 'Scenario-Based Learning', desc: 'Interactive activities and scenario-based learning.' },
  { title: 'Industry Best Practices', desc: 'Real-world examples based on industry best practices.' },
  { title: 'Assessments', desc: ' Assessments that reinforce key concepts.' },
];

// Part 2: Rich Course Cards Data 
const topCourses = [
  { title: 'NEBOSH IGC',  img: '/Pictures/course1.webp', to: '/courses/nebosh-igc' },
  { title: 'Highfield International',  img: '/Pictures/course-2.webp', to: '/courses/highfield' },
  { title: 'IOSH', img: '/Pictures/course-3.webp', to: '/courses/iosh' },
  { title: 'BCSP',   img: '/Pictures/course-4.webp', to: '/courses/bcsp' },
  { title: 'National Diploma',   img: '/Pictures/course-5.webp', to: '/courses/national-diploma' },
  { title: 'ISO Lead Auditor',  img: '/Pictures/course-6.webp', to: '/courses/iso-lead-auditor' },
];

// Part 3: Regional Contact Numbers with Region Tags
const regionTabs = ['All', 'South India', 'North & East', 'West'];
const regionalContacts = [
  { city: 'Chennai', region: 'South India', phone: '+91 90431 33663' },
  { city: 'Mumbai', region: 'West', phone: '+91 73388 47733' },
  { city: 'Delhi', region: 'North & East', phone: '+91 90438 36636' },
  { city: 'Kolkata', region: 'North & East', phone: '+91 73388 47733' },
  { city: 'Bangalore', region: 'South India', phone: '+91 97899 35573' },
  { city: 'Hyderabad', region: 'South India', phone: '+91 97899 35573' },
  { city: 'Kochi', region: 'South India', phone: '+91 90431 33993' },
  { city: 'Lucknow', region: 'North & East', phone: '+91 73388 47733' },
  { city: 'Patna', region: 'North & East', phone: '+91 90431 33663' },
  { city: 'Coimbatore', region: 'South India', phone: '+91 90431 33993' },
  { city: 'Madurai', region: 'South India', phone: '+91 90431 33663' },
  { city: 'Trichy', region: 'South India', phone: '+91 90431 33663' },
];

export default function TrainingAndContacts() {
  // Region Filter & Copy Feedback States
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [copiedCity, setCopiedCity] = useState(null);

  // Selected tab padi cities-ah filter pannum
  const visibleCities =
    selectedRegion === 'All'
      ? regionalContacts
      : regionalContacts.filter((item) => item.region === selectedRegion);

  // One-Tap Phone Number Copy Function
  const handleCopy = (city, phone) => {
    navigator.clipboard.writeText(phone);
    setCopiedCity(city);
    setTimeout(() => setCopiedCity(null), 1500);
  };

  return (
    <>
      {/* ================= PART 1: OUR TRAINING APPROACH (PURE WHITE) ================= */}
      <section className="w-full bg-white py-14 sm:py-18 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left: Heading + 4 Interactive Numbered Cards */}
          <div className="lg:col-span-6">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#a62675]">
              ABOUT US
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-[36px] font-semibold text-[#211859]">
              Our Training Approach
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
              Every course is designed to help participants stay safe and empower organizations to
              meet global compliance with confidence.
            </p>

            <div className="mt-6 space-y-3">
              {approachSteps.map((step) => (
                <div key={step.title} className="approach-step-card rounded-xl p-3.5 sm:p-4 flex items-start gap-3.5">
                  <span className="approach-check-badge w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#211859]">{step.title}</h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Double-Ring Curved Arch + Floating Trust Pill */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[330px] sm:max-w-[410px]">
              <div className="approach-arch-outer aspect-square p-4 sm:p-6 flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden bg-white border-4 border-white/90 flex items-center justify-center shadow-inner">
                  {approachImg ? (
                    <img src={approachImg} alt="Cognisphere Training" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6 flex flex-col items-center text-[#211859]/60">
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= PART 2: TOP COURSE ACCREDITATION (PURE WHITE) ================= */}
      <section className="w-full bg-white py-14 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#a62675]">
              SAFETY COURSES
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#211859]">
              Top Course Accreditation
            </h2>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            grabCursor
            speed={2800}
            autoplay={{ delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1.2, spaceBetween: 14 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="courses-swiper"
          >
            {topCourses.map((course) => (
              <SwiperSlide key={course.title}>
                <div className="course-pro-card rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center h-full">
                  
                  {/* Top Accreditation Pill */}
                  <span className="self-end text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f3effa] text-[#a62675] border border-[#e5dcf5] mb-3">
                    {course.tag}
                  </span>

                  {/* Logo Slot */}
                  <div className="w-full h-24 rounded-xl bg-[#f8f7fc] border border-[#ece7f6] flex items-center justify-center p-3 mb-4">
                    {course.img ? (
                      <img src={course.img} alt={course.title} className="max-h-full max-w-[85%] object-contain" />
                    ) : (
                      <div className="flex flex-col items-center text-[#211859]/60">
                      </div>
                    )}
                  </div>

                  {/* Global Cursor Glow Button */}
                  <Link
                    to={course.to}
                    className="brand-glow-btn mt-auto w-full py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold gap-1.5"
                  >
                    <span>Explore Courses</span><ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </section>

      {/* ================= PART 3: INTERACTIVE REGIONAL CONTACTS (PURE WHITE) ================= */}
      <section className="w-full bg-white py-14 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-6 sm:mb-8">
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#211859]">
              Regional Contact Numbers
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              Get in touch with our offices across different locations
            </p>
          </div>

          {/* Interactive Region Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-7 sm:mb-9">
            {regionTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedRegion(tab)}
                className={`region-filter-pill px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-[13px] font-semibold cursor-pointer ${
                  selectedRegion === tab ? 'is-active' : ''
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Spacious 4-Column Desktop / 2-Column Tablet & Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {visibleCities.map((item) => {
              const isCopied = copiedCity === item.city;
              return (
                <div key={item.city} className="region-pro-card rounded-2xl p-4 flex flex-col justify-between">
                  
                  {/* Top Row: City + Region Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#a62675] shrink-0" />
                      <h3 className="text-[15px] font-bold text-[#211859]">{item.city}</h3>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f8f7fc] text-slate-500 border border-[#ebe5f7]">
                      {item.region}
                    </span>
                  </div>

                  {/* Phone Number */}
                  <p className="mt-2.5 text-sm font-semibold text-[#211859]/85 tracking-wide">
                    {item.phone}
                  </p>

                  {/* Action Buttons: Instant Call + One-Tap Copy */}
                  <div className="mt-3.5 pt-3 border-t border-[#f1edf9] flex items-center gap-2">
                    <a
                      href={`tel:${item.phone.replace(/\s+/g, '')}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#211859] hover:bg-[#a62675] text-white text-xs font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.city, item.phone)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border transition-colors cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-[#f8f7fc] text-[#211859] border-[#e2daf3] hover:border-[#a62675]'
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
      </section>
    </>
  );
}