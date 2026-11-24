import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { User, Award, ShieldCheck, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './Learnersection.css';

// Compact Learners List (img empty-aa irundha Avatar placeholder kaatum)
const learners = [
  { name: 'Ms. MARIYA KHATIP', course: 'Hightfeild International Level 3 IADT', img: '/Pictures/learner-1.webp', to: '/courses/iosh' },
  { name: 'Mr. ALEX KANNAN', course: 'NEBOSH IGC', img: '/Pictures/learner-2.webp', to: '/courses/nebosh-igc' },
  { name: 'Ms. EDWIN DEVADHAS SELVARAJ', course: 'Highfield International Level 3 IADT', img: '/Pictures/learner-3.webp', to: '/courses/highfield' },
  { name: 'Mr. KIRAN KUMAR POLOJU', course: 'Diploma In Construction Safety', img: '/Pictures/learner-4.webp', to: '/courses/nebosh-igc' },
  { name: 'Mr. KAVIN K', course: 'Diploma In Fire Fighting', img: '/Pictures/learner-5.webp', to: '/courses/osha' },
  { name: 'Mr. PRANEET', course: 'IOSH MS', img: '/Pictures/learner-6.webp', to: '/courses/nebosh-idip' },
  { name: 'Mr. KALIYAPERUMAL', course: 'NEBOSH IGC', img: '/Pictures/learner-7.webp', to: '/courses/bcsp' },
];
const neboshCertImg = '/Pictures/Gold-Certificate.webp'; 

 function Learnersection() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#a62675]">
            WE'RE PROUD TO SHOWCASE THE SUCCESSFUL
          </p>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#211859]">
            Course Completed Learners
          </h2>
        </div>

        {/* 3D Curved Coverflow Slider */}
        <Swiper
          modules={[Autoplay, EffectCoverflow, Pagination]}
          effect="coverflow"
          centeredSlides
          loop
          grabCursor
          initialSlide={1}
          speed={2500}
          autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          coverflowEffect={{ rotate: 26, stretch: 0, depth: 140, modifier: 1.15, slideShadows: false }}
          breakpoints={{
            0: { slidesPerView: 1.35, spaceBetween: 14 },
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 28 },
          }}
          className="learners-swiper"
        >
          {learners.map((item) => (
            <SwiperSlide key={item.name}>
              <div className="learner-card flex flex-col items-center text-center py-2">
                
                {/* Photo Slot */}
                <div className="learner-photo-box w-44 h-52 sm:w-48 sm:h-56 rounded-2xl overflow-hidden bg-[#f8f7fc] flex items-center justify-center">
                  {item.img ? (
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="flex flex-col items-center text-[#211859]/50">
                      
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="mt-4 text-sm font-bold text-[#211859] uppercase tracking-wide">
                  {item.name}
                </h3>

                {/* Redirect Course Button */}
                <Link
                  to={item.to}
                  className="brand-glow-btn hidden lg:inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white max-w-[225px]"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{item.course}</span>
                </Link>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

  {/* ================= PART 2: NEBOSH GOLD LEARNING PARTNER CERTIFICATE ================= */}
       
        <div className="mt-14 sm:mt-20 pt-12 sm:pt-16 border-t border-[#ece7f6]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* LEFT: Certificate Image Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="nebosh-cert-frame w-full max-w-[310px] sm:max-w-[360px] lg:max-w-[400px] aspect-[3/4] rounded-2xl overflow-hidden p-3 flex items-center justify-center">
                {neboshCertImg ? (
                  <img
                    src={neboshCertImg}
                    alt="NEBOSH Gold Learning Partner Certificate - Cognisphere"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-[#dfd6f2] rounded-xl bg-[#f8f7fc] flex flex-col items-center justify-center text-center p-6">
                    <Award className="w-12 h-12 text-[#E0B04A] mb-3" />
                    <p className="text-sm font-bold text-[#211859]">NEBOSH Gold Certificate</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Learning Partner • Gold 1844
                    </p>
                    <span className="mt-3 text-[11px] px-3 py-1 rounded-full bg-white border border-[#e4dcf2] text-[#a62675] font-medium">
                      Certificate Image Slot
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Title, Description & Redirect CTA */}
            <div className="lg:col-span-7 text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f3effa] border border-[#e2daf3] text-xs font-semibold text-[#211859] mb-4">
                <ShieldCheck className="w-4 h-4 text-[#E0B04A]" />
                Accredited Gold Status 
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#211859] leading-snug">
                We&apos;re Proud to be a{' '}
                <span className="text-[#a62675]">NEBOSH Gold Learning Partner</span>
              </h2>

              <div className="mt-5 space-y-4 text-sm sm:text-[15px] text-black leading-relaxed">
                <p>
                  Cognisphere Management and Consultancy is proud to hold Gold Learning Partner status
                  with NEBOSH — a mark of excellence awarded only to training providers that
                  demonstrate outstanding quality, learner support, and proven results.
                </p>
                <p>
                  This recognition highlights our dedication to delivering world-class NEBOSH
                  qualifications designed to equip professionals with practical knowledge, global
                  credibility, and career advancement opportunities. Our expert tutors, structured
                  learning approach, and commitment to student success ensure a premium training
                  experience from enrolment to certification.
                </p>
                <p>
                  By choosing Cognisphere Management and Consultancy, learners gain access to trusted,
                  internationally recognized qualifications backed by Gold-standard training excellence.
                </p>
                <p>
                  At Cognisphere Management and Consultancy, we believe that education is the key to
                  workplace accident prevention. Our mission is to raise global safety standards,
                  reduce risks, and help professionals advance their careers through high-quality,
                  career-focused training.
                </p>
              </div>

              {/* Redirect Button with Global Hover Effect */}
              {/* <div className="mt-7">
                <Link
                  to="/courses/nebosh-igc"
                  className="brand-glow-btn px-7 py-3 rounded-full text-sm font-semibold gap-2"
                >
                  <span>Explore NEBOSH Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div> */}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
export default Learnersection;