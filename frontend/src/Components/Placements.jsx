import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, GraduationCap, Laptop, SlidersHorizontal, ShieldCheck,
  FileCheck2, ZoomIn, X, Briefcase, ArrowRight,Building2
} from 'lucide-react';
import './Placements.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Part 1 Data: Why Choose Us
const features = [
  { title: 'Certified Instructors', img: '/Pictures/train-1.webp', icon: GraduationCap },
  { title: 'Flexible Learning', img: '/Pictures/train-2.webp', icon: Laptop },
  { title: 'Customized Training', img: '/Pictures/train-3.webp', icon: SlidersHorizontal },
  { title: 'Regulatory Compliance', img: '/Pictures/train-4.webp', icon: ShieldCheck },
];

// Part 2 Data: Placement Offer Letters (img path kudutha offer letter load aagum)
const offerLetters = [
  { id: 1, role: 'Safety Officer', company: 'Repplen Projects Pvt. Ltd.', candidate: 'Mr. Silambarasan N', img: '/Pictures/placement-1.webp' },
  { id: 2, role: 'Jr. Engineer - Safety', company: 'Repplen Projects Pvt. Ltd.', candidate: 'Mr. Saran P', img: '/Pictures/placement-2.webp' },
  { id: 3, role: 'Safety Engineer', company: 'Repplen Projects Pvt. Ltd.', candidate: 'Mr. Kaliyaperumal M', img: '/Pictures/placement-3.webp' },
];

// Part 3 Data: Collaborating Companies (img path kudutha company logo load aagum)
const companies = [
  { name: 'ADITHYA BIRLA', img: '/Pictures/Company-1.webp' },
  { name: 'CUSHMAN', img: '/Pictures/Company-2.webp' },
  { name: 'PROFAC', img: '/Pictures/Company-3.webp' },
  { name: 'BETTER COMMUNITIES', img: '/Pictures/Company-4.webp' },
  { name: 'GAIL', img: '/Pictures/Company-5.webp' },
  { name: 'CEAT', img: '/Pictures/Company-6.webp' },
  { name: 'HERO', img: '/Pictures/Company-7.webp' },
  { name: 'MAINETT', img: '/Pictures/Company-8.webp' },
  { name: 'TATA HITACHI', img: '/Pictures/Company-9.webp' },
  { name: 'IndianOil', img: '/Pictures/Company-10.webp' },
  { name: 'PI Industries', img: '/Pictures/Company-11.webp' },
  { name: 'M3M', img: '/Pictures/Company-12.webp' },
  { name: 'Haldirams', img: '/Pictures/Company-13.webp' },
  { name: 'ASOKA', img: '/Pictures/Company-14.webp' },
  
];

function Placements() {
  // Click panna offer letter zoom panni kaata simple state
  const [preview, setPreview] = useState(null);

  return (
    <>
      {/* ================= PART 1: WHY CHOOSE US ================= */}
      <section className="w-full bg-[#f8f7fc] py-12 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#211859]">
              Why Choose Us?
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#211859] to-[#a62675] mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="why-card relative rounded-2xl overflow-hidden flex flex-col">
                  <div className="why-top-bar w-full" />
                  <div className="p-2.5 sm:p-3.5 pb-0">
                    <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#f3effa] flex items-center justify-center">
                      {item.img ? (
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-[#211859]/55">
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-center gap-2 text-center mt-auto">
                    <span className="why-check-badge w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    </span>
                    <h3 className="text-xs sm:text-sm lg:text-[15px] font-semibold text-[#211859] leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PART 2: PLACEMENT SUPPORT (OFFER LETTERS) ================= */}
      <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-8 sm:mb-12">

            <h1 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#211859]">
              Placement Support
            </h1>
          </div>

          {/* 3 Offer Cards: Mobile Horizontal Swipe | Desktop 3-Column Row */}
         <div className="no-scrollbar flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pt-5 pb-8 px-1">
            {offerLetters.map((offer) => (
              <div
                key={offer.id}
                onClick={() => setPreview(offer)}
                className="offer-card group w-[78%] sm:w-[48%] md:w-full shrink-0 snap-center rounded-2xl overflow-hidden cursor-pointer flex flex-col">
                {/* Top Verified Strip */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#f8f7fc] border-b border-[#ece7f6]">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#211859]">
                    <FileCheck2 className="w-3.5 h-3.5 text-[#E0B04A]" />
                    {offer.role}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#a62675] bg-white px-2 py-0.5 rounded-full border border-[#e7dff5]">
                    <ZoomIn className="w-3 h-3" /> View
                  </span>
                </div>

                {/* Offer Letter Image Frame */}
                <div className="p-3 bg-white flex-1">
                  <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#f8f7fc] border border-[#ece7f6] flex items-center justify-center">
                    {offer.img ? (
                      <img
                        src={offer.img}
                        alt={`${offer.candidate} Offer Letter`}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center p-5 flex flex-col items-center">
                        <Briefcase className="w-9 h-9 text-[#211859]/45 mb-2" />
                        <p className="text-xs font-bold text-[#211859]">{offer.candidate}</p>
                        <p className="text-[11px] text-[#a62675] font-medium mt-0.5">{offer.company}</p>
                        <span className="mt-3 text-[10px] px-2.5 py-1 rounded-full bg-white border border-[#e2daf3] text-slate-500">
                          Offer Letter Image Slot
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= SIMPLE ZOOM PREVIEW MODAL ================= */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 bg-[#120c30]/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e4dcf2]"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#f8f7fc] border-b border-[#ece7f6]">
              <div>
                <h4 className="text-sm font-bold text-[#211859]">{preview.candidate}</h4>
                <p className="text-xs text-[#a62675] font-medium">{preview.role} • {preview.company}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="p-1.5 rounded-lg bg-white border border-[#dfd6f2] text-[#211859] hover:bg-[#a62675] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-[75vh] overflow-y-auto flex justify-center bg-slate-50">
              {preview.img ? (
                <img src={preview.img} alt={preview.candidate} className="w-full rounded-lg object-contain" />
              ) : (
                <div className="py-16 text-center text-slate-500 text-xs">
                  Add <code className="text-[#a62675] font-semibold">img</code> path in <code className="text-[#211859] font-semibold">offerLetters</code> to view full offer letter here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ================= PART 3: COLLABORATING COMPANIES ================= */}
      <section className="w-full bg-white pb-14 sm:pb-18 pt-4 px-4 sm:px-6">
        <div className="collab-box max-w-6xl mx-auto rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-8 sm:py-10">

          {/* Heading */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="mt-1 text-xl sm:text-2xl lg:text-[28px] font-semibold text-[#211859]">
              We Collaborate with Leading Companies
            </h2>
          </div>

          {/* Smooth Auto-Sliding Logo Carousel */}
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            grabCursor
            speed={2000}
            autoplay={{ delay: 2200, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 12 },
              640: { slidesPerView: 3, spaceBetween: 18 },
              1024: { slidesPerView: 4, spaceBetween: 22 },
            }}
            className="collab-swiper"
          >
            {companies.map((comp) => (
              <SwiperSlide key={comp.name}>
                <div className="collab-logo-card h-24 sm:h-28 lg:h-32 rounded-xl p-2.5 sm:p-3 flex items-center justify-center">
                  {comp.img ? (
                    <img
                      src={comp.img}
                      alt={comp.name}
                      className="w-[95%] h-[85%] object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-[#211859]">
                    
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </section>
    </>
  );
}

export default Placements;