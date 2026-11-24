import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Keyboard } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight, Image as ImageIcon } from 'lucide-react';

// Swiper Base + Fade Effect CSS mattum (Ugly default navigation CSS load pannala!)
import 'swiper/css';
import 'swiper/css/effect-fade';
import './Heroslider.css';

/* =====================================================================
   SLIDES DATA ARRAY:
   - image: Inga unga banner image path kudunga (e.g. '/images/banner1.jpg')
   - buttonText: Button-la enna text varanum
   - redirectTo: Click panna endha page-ku poganum (Future-la mathikalam)
   ===================================================================== */
const slidesData = [
  {
    id: 1,
    image: '/Pictures/banner-1.webp', 
    alt: 'Cognisphere NEBOSH IGC Results Banner',
    buttonText: 'Book Your Seat',
    redirectTo: '/contact',
  },
  {
    id: 2,
    image: '/Pictures/banner-2.webp', 
    alt: 'Global HSE Certification Courses - NEBOSH, IOSH, OSHA',
    buttonText: 'Explore Courses',
    redirectTo: '/courses/nebosh-igc',
  },
  {
    id: 3,
    image: '/Pictures/banner-3.webp',
    alt: 'India & Dubai/GCC HSE Job Placement Support',
    buttonText: 'View Latest Jobs',
    redirectTo: '/jobs',
  },
];

function Heroslider() {
  // Swiper instance & current slide index-ah React state-la control panrom
  const [swiperRef, setSwiperRef] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Future-la external link (https://...) or internal route (/contact) rendum work aaga helper
  const renderRedirectButton = (slide) => {
    const isExternal = slide.redirectTo.startsWith('http');

    const btnClasses =
      'hero-cta-btn inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full text-xs sm:text-sm lg:text-base font-semibold tracking-wide cursor-pointer';

    if (isExternal) {
      return (
        <a
          href={slide.redirectTo}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClasses}
        >
          <span>{slide.buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      );
    }

    return (
      <Link to={slide.redirectTo} className={btnClasses}>
        <span>{slide.buttonText}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  };

  return (
    <section className="hero-slider-wrapper w-full group">
      <Swiper
        modules={[Autoplay, EffectFade, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        speed={800}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        onSwiper={setSwiperRef}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-[270px] sm:h-[390px] md:h-[460px] lg:h-[530px]"
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            
            {/* 1. BANNER IMAGE SLOT (Image irundha <img> kaatum, illaati placeholder box kaatum) */}
            {slide.image ? (
              <img
                src={slide.image}
                alt={slide.alt}
                className="hero-slide-img"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-[#1b144a] via-[#211859] to-[#3a1654]">
                <div className="border-2 border-dashed border-purple-300/35 rounded-2xl px-6 py-8 sm:px-14 sm:py-12 bg-white/5 backdrop-blur-sm max-w-xl w-full">
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-300/70 mx-auto mb-2.5" />
                  <p className="text-white font-semibold text-sm sm:text-lg">
                    Slide {slide.id} — Banner Image Slot
                  </p>
                  <p className="text-purple-200/75 text-xs sm:text-sm mt-1">
                    {slide.alt}
                  </p>
                </div>
              </div>
            )}

            {/* 2. BOTTOM GRADIENT & REDIRECT BUTTON OVERLAY */}
            <div className="hero-bottom-overlay absolute inset-x-0 bottom-0 h-32 sm:h-40 flex items-end justify-center sm:justify-start pb-11 sm:pb-12 px-4 sm:px-10 lg:px-16 pointer-events-none">
              <div className="pointer-events-auto">
                {renderRedirectButton(slide)}
              </div>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>

      {/* ================= CUSTOM LEFT / RIGHT GLASS ARROWS ================= */}
      <button
        type="button"
        onClick={() => swiperRef?.slidePrev()}
        className="hero-arrow-btn absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={() => swiperRef?.slideNext()}
        className="hero-arrow-btn absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* ================= CUSTOM ANIMATED PAGINATION DOTS ================= */}
      <div className="absolute bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slidesData.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => swiperRef?.slideToLoop(index)}
            className={`hero-dot ${activeIndex === index ? 'is-active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

export default Heroslider;