import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Partnersection.css';

/* =====================================================================
   PARTNERS DATA:
   - Sitthappa PNG logos kudutha udane 'public/partners/' la pottu
     src: '/partners/nebosh.png' nu add pannunga.
   ===================================================================== */
const partners = [
  {
    name: 'NEBOSH Learning Partner',
    code: 'Gold 1844',
    src: '/Pictures/Nebosh-logo-Horizontal.webp',
    redirectTo: '/courses/nebosh-igc',
    desktopSize: 'lg:w-[155px] lg:h-[105px] xl:w-[178px] xl:h-[120px]',
  },
  {
    name: 'IOSH Approved Provider',
    code: 'Centre 5331',
    src: '/Pictures/partner-1.webp',
    redirectTo: '/courses/iosh',
    desktopSize: 'lg:w-[168px] lg:h-[115px] xl:w-[192px] xl:h-[132px]',
  },
  {
    name: 'BCSP Certified',
    code: 'CSP & ASP',
    src: '/Pictures/partner-2.webp', 
    redirectTo: '/courses/bcsp',
    desktopSize: 'lg:w-[190px] lg:h-[132px] xl:w-[218px] xl:h-[150px]', // Center Highlight
    isFeatured: true,
  },
  {
    name: 'Highfield Approved Centre',
    code: 'No. 37570',
    src: '/Pictures/partner-3.webp', 
    redirectTo: '/courses/highfield',
    desktopSize: 'lg:w-[168px] lg:h-[115px] xl:w-[192px] xl:h-[132px]',
  },
  {
    name: 'Approved Training Code',
    code: 'TN / GCC / 97525',
    src: '/Pictures/partner-4.webp',
    redirectTo: '/about',
    desktopSize: 'lg:w-[155px] lg:h-[105px] xl:w-[178px] xl:h-[120px]',
  },
];

function Diamond() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0">
      <rect x="2" y="2" width="10" height="10" transform="rotate(45 7 7)" fill="#E0B04A" />
    </svg>
  );
}

function Partnersection() {
  return (
    /* Outer Wrapper: Box full width pogama centered-aa alavoda vaikum */
    <section className="w-full py-10 sm:py-14 px-4 sm:px-6">
      <div className="partners-box-bg relative max-w-6xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden px-5 sm:px-8 lg:px-10 py-9 sm:py-12">

        {/* Magenta Glow */}
        <div
          aria-hidden="true"
          className="partners-glow pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] sm:h-[420px] sm:w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />

        {/* Compact Reduced Heading */}
        <div className="relative flex items-center justify-center gap-3 sm:gap-4">
          <span className="hidden h-0.5 w-12 sm:block md:w-20 bg-gradient-to-r from-transparent to-[#E0B04A]" />
          <Diamond />
          <h2 className="text-center text-xl sm:text-2xl lg:text-[30px] font-semibold tracking-wide text-white">
            Accredited Partners
          </h2>
          <Diamond />
          <span className="hidden h-0.5 w-12 sm:block md:w-20 bg-gradient-to-l from-transparent to-[#E0B04A]" />
        </div>

        {/* ================= DESKTOP VIEW (>= 1024px): Symmetrical Podium Row ================= */}
        <div className="relative mt-10 hidden lg:flex lg:items-center lg:justify-center gap-4 xl:gap-5">
          {partners.map((p, i) => (
            <Link
              key={p.name}
              to={p.redirectTo}
              aria-label={`${p.name} - ${p.code}`}
              style={{ animationDelay: `${0.1 + i * 0.1}s, ${0.4 + i * 0.25}s` }}
              className={`partner-card group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-t-[3.5px] border-[#E0B04A] bg-white p-3 shadow-[0_12px_28px_rgba(10,8,40,0.4)] transition-[transform,box-shadow] duration-300 hover:-translate-y-2.5 hover:scale-105 hover:shadow-[0_20px_42px_rgba(166,38,117,0.5)] ${p.desktopSize}`}
            >
              {p.src ? (
                <img
                  src={p.src}
                  alt={p.name}
                  className="max-h-[80%] max-w-[88%] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <Award className="w-5 h-5 text-[#E0B04A] mb-1" />
                  <span className="text-xs font-bold text-[#211859] leading-tight">
                    {p.name}
                  </span>
                  <span className="mt-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[#f3effa] text-[#a62675]">
                    {p.code}
                  </span>
                </div>
              )}

              <span className="pointer-events-none absolute left-[-75%] top-0 h-full w-2/5 -skew-x-[20deg] bg-[#E0B04A]/25 transition-[left] duration-700 group-hover:left-[135%]" />
            </Link>
          ))}
        </div>

        {/* ================= MOBILE & TABLET VIEW (< 1024px): Smooth Slider ================= */}
        <div className="relative mt-7 block lg:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            centeredSlides
            loop
            grabCursor
            speed={750}
            autoplay={{ delay: 2400, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1.55, spaceBetween: 14 },
              480: { slidesPerView: 2.2, spaceBetween: 16 },
              640: { slidesPerView: 3, spaceBetween: 18 },
            }}
            className="partners-mobile-swiper"
          >
            {partners.map((p) => (
              <SwiperSlide key={`mob-${p.name}`}>
                <Link
                  to={p.redirectTo}
                  aria-label={`${p.name} - ${p.code}`}
                  className="partner-card group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-t-[3.5px] border-[#E0B04A] bg-white p-3.5 shadow-[0_12px_26px_rgba(10,8,40,0.38)] h-[112px] sm:h-[124px] w-full"
                >
                  {p.src ? (
                    <img
                      src={p.src}
                      alt={p.name}
                      className="max-h-[82%] max-w-[88%] object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <Award className="w-5 h-5 text-[#E0B04A] mb-1" />
                      <span className="text-[11px] font-bold text-[#211859] leading-tight">
                        {p.name}
                      </span>
                      <span className="mt-1 text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-[#f3effa] text-[#a62675]">
                        {p.code}
                      </span>
                    </div>
                  )}
                    {/* Gold Shine Sweep on Hover */}
                  <span className="pointer-events-none absolute left-[-75%] top-0 h-full w-2/5 -skew-x-[20deg] bg-[#E0B04A]/25 transition-[left] duration-700 group-hover:left-[135%]" />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}

export default Partnersection;
 