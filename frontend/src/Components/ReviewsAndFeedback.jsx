import React, { useState } from 'react';
import { Play, Star, Quote, ChevronDown, ChevronUp, X, Video } from 'lucide-react';
import './ReviewsAndFeedback.css';

// Part 1: Video Shorts Data (youtubeId & thumb image path future-la add pannikonga)
const videoReviews = [
  {
    id: 1,
    name: 'Mr. Pradeep',
    course: 'NEBOSH IGC',
    location: 'India',
    quote: 'Well structured, informative & highly useful for my career.',
    thumb: '/Pictures/youtube-thumb-1.jpg',     // <-- thumbnail images
    youtubeId: '4ajJI5G5RyI', // <-- YouTube Shorts ID 
  },
  {
    id: 2,
    name: 'Mr. Collinia',
    course: 'NEBOSH IGC',
    location: 'Uganda',
    quote: 'Practical tutor guidance that gave me real exam confidence.',
    thumb: '/Pictures/youtube-thumb-2.jpg',     // <-- thumbnail images
    youtubeId: 'BhzvMvsEmwk', // <-- YouTube Shorts ID 
  },
  {
    id: 3,
    name: 'Global HSE Learner',
    course: 'NEBOSH IGC',
    location: 'GCC / Overseas',
    quote: 'A fantastic learning experience from enrolment to pass.',
    thumb: '/Pictures/youtube-thumb-3.jpg',     // <-- thumbnail images
    youtubeId: 'xQ3uB7gZsJI', // <-- YouTube Shorts ID
  },
];

// Part 2: Google Reviews Data (avatar empty-aa irundha Initials badge kaatum)
const googleReviews = [
  { id: 1, name: 'Subburajr Marimuthu', rating: 5, course: 'IOSH MS', avatar: '/Pictures/review-1.png', text: 'I am studying the IOSH Managing Safely course at Cognisphere. The trainers explain every concept clearly with real industry examples and supportive mentoring.' },
  { id: 2, name: 'Pradeep Rajan.V', rating: 5, course: 'NEBOSH IGC', avatar: '/Pictures/review-2.png', text: 'Excellent training centre for all safety related courses. Very helpful faculty and structured guidance.' },
  { id: 3, name: 'Karthick Karthick', rating: 4, course: 'Safety Training', avatar: '/Pictures/review-3.png', text: 'It was a good institution and good teaching. Practical sessions made complex safety topics easy.' },
  { id: 4, name: 'BALRAJ C 7122', rating: 4, course: 'NEBOSH IGC', avatar: '', text: 'Great learning experience and practical safety training sessions at Cognisphere Management and Consultancy.' },
  { id: 5, name: 'RAMZAN ALI', rating: 5, course: 'HSE Diploma', avatar: '', text: 'The service of the training institute is very good. They support learners smoothly from registration to final certification and placement tips.' },
  { id: 6, name: 'Hari Prakash', rating: 4, course: 'IOSH MS', avatar: '', text: 'I have successfully completed the IOSH Managing Safely course with Cognisphere Management Training Institute. It was a great learning experience throughout the course and I express my gratitude to the tutors.' },
  { id: 7, name: 'AZHI MADHAN', rating: 5, course: 'NEBOSH IGC', avatar: '', text: 'The class was excellent. Class was handled by experienced tutors with clear explanations and mock practice tests.' },
  { id: 8, name: 'Vivi Anand', rating: 5, course: 'NEBOSH IGC', avatar: '', text: 'I recently completed my NEBOSH course at Cognisphere, and it was an enriching learning journey with timely exam support.' },
  { id: 9, name: 'RAGURAM R', rating: 4, course: 'NEBOSH IGC', avatar: '', text: 'Good training atmosphere and clear guidance for international industrial safety certifications.' },
];

// Clean Google 'G' SVG Icon
const GoogleBadge = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5H1.2v3.1C3.2 21.4 7.3 24 12 24z" />
    <path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3V6.6H1.2C.4 8.2 0 10.1 0 12s.4 3.8 1.2 5.4l4-3.1z" />
    <path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.2 2.6 1.2 6.6l4 3.1c1-2.9 3.7-5 6.8-5z" />
  </svg>
);

function ReviewsAndFeedback() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll ? googleReviews : googleReviews.slice(0, 3);

  return (
    <>
      {/* ================= PART 1: CANDIDATES VIDEO REVIEWS ================= */}
      <section className="w-full bg-white py-14 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#a62675]">
              VIDEO TESTIMONIALS
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#211859]">
              Candidates Review About Cognisphere&apos;s Safety Training
            </h2>
          </div>

          {/* Mobile Horizontal Swipe | Desktop 3-Column Shorts Grid */}
          <div className="no-scrollbar flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pt-4 pb-6 px-1">
            {videoReviews.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className="video-review-card group w-[74%] sm:w-[46%] md:w-full shrink-0 snap-center rounded-2xl overflow-hidden cursor-pointer relative aspect-[9/14] flex flex-col justify-between p-4"
              >
                {/* Background Thumbnail (Optional) */}
                {vid.thumb && (
                  <img
                    src={vid.thumb}
                    alt={vid.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120c30] via-[#120c30]/35 to-[#120c30]/65" />

                {/* Top Course & Location Badges */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 border border-white/20">
                    {vid.course}
                  </span>
                  <span className="text-[10.5px] font-medium px-2.5 py-1 rounded-full bg-black/30 text-white/90">
                    {vid.location}
                  </span>
                </div>

                {/* Center Custom Play Button */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                  <div className="video-play-btn w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-0.5" />
                  </div>
                  {!vid.thumb && (
                      <Video className="w-3.5 h-3.5" /> 
                  )}
                </div>

                {/* Bottom Learner Name & Quote */}
                <div className="relative z-10 text-white">
                  <h3 className="text-sm sm:text-base font-bold">{vid.name}</h3>
                  <p className="text-xs text-purple-100/85 mt-1 line-clamp-2">&ldquo;{vid.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= PART 2: GOOGLE REVIEWS (LEARNERS FEEDBACK) ================= */}
      <section className="w-full bg-white py-14 sm:py-16 px-4 sm:px-6 border-t border-[#ece7f6]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#a62675]">
              VERIFIED STUDENT STORIES
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#211859]">
              Learners Feedback
            </h2>
          </div>

          {/* Google Rating Trust Summary Bar */}
          <div className="google-summary-bar rounded-2xl p-4 sm:px-6 sm:py-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e3dbf3] flex items-center justify-center shadow-sm">
                <GoogleBadge />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#211859]">4.9</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#E0B04A] text-[#E0B04A]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">Based on 500+ Verified Google Reviews</p>
              </div>
            </div>

            <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white text-[#211859] border border-[#e2daf3]">
              NEBOSH • IOSH • OSHA Alumni
            </span>
          </div>

          {/* 3-Column Clean Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {visibleReviews.map((rev) => {
              const isExpanded = expandedId === rev.id;
              const isLong = rev.text.length > 105;

              return (
                <div key={rev.id} className="feedback-card rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    {/* Card Header: Avatar + Name + Google Icon */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {rev.avatar ? (
                          <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover border border-[#e2daf3]" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#211859] to-[#a62675] text-white font-bold text-sm flex items-center justify-center shrink-0">
                            {rev.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-bold text-[#211859] leading-tight">{rev.name}</h3>
                          <span className="text-[11px] font-medium text-[#a62675]">{rev.course}</span>
                        </div>
                      </div>
                      <GoogleBadge />
                    </div>

                    {/* Stars Row */}
                    <div className="flex items-center gap-1 mt-3.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < rev.rating ? 'fill-[#E0B04A] text-[#E0B04A]' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review Text (With Working Read More Toggle) */}
                    <p className="mt-2.5 text-xs sm:text-[13.5px] text-slate-600 leading-relaxed">
                      <Quote className="w-3.5 h-3.5 text-[#a62675]/40 inline mr-1 -mt-0.5" />
                      {isLong && !isExpanded ? `${rev.text.slice(0, 105)}...` : rev.text}
                    </p>
                  </div>

                  {isLong && (
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : rev.id)}
                      className="mt-2.5 text-xs font-semibold text-[#a62675] hover:text-[#211859] self-start cursor-pointer"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Show All / Show Less Toggle Button (Global Cursor Glow Hover) */}
          <div className="text-center mt-8 sm:mt-10">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="brand-glow-btn px-7 py-3 rounded-full text-xs sm:text-sm font-semibold gap-2 cursor-pointer"
            >
              <span>{showAll ? 'Show Fewer Reviews' : `View All ${googleReviews.length} Learner Reviews`}</span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </section>

      {/* ================= VIDEO PLAYER POPUP MODAL ================= */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 bg-[#120c30]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#e2daf3]"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#f8f7fc] border-b border-[#ece7f6]">
              <div>
                <h4 className="text-sm font-bold text-[#211859]">{activeVideo.name}</h4>
                <p className="text-[11px] text-[#a62675] font-semibold">{activeVideo.course} • {activeVideo.location}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg bg-white border border-[#dfd6f2] text-[#211859] hover:bg-[#a62675] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-[9/14] bg-[#16103d] flex items-center justify-center">
              {activeVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.name}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="text-center p-6 text-purple-200 text-xs">
                  <Play className="w-10 h-10 text-[#a62675] mx-auto mb-2" />
                  Add YouTube Shorts ID in <code className="text-amber-300">youtubeId</code> inside <code className="text-white">videoReviews</code> to play video here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ReviewsAndFeedback;