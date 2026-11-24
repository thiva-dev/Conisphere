import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Briefcase, Calendar, LogIn } from 'lucide-react';
import './TopBar.css';

function TopBar() {
  return (
    <div className="topbar-surface w-full text-slate-100 py-1.5 lg:py-2 px-3 sm:px-6 relative z-50">
      <div className="max-w-7xl mx-auto w-full">

        {/* ================= DESKTOP VIEW (Laptop / Wide Screen) ================= */}
        <div className="hidden lg:flex items-center justify-between gap-4 text-[13px]">

          {/* LEFT: Phone Number */}
          <a
            href="tel:+919043133663"
            className="topbar-phone-pill inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md text-white font-semibold tracking-wide"
          >
            <span className="support-pulse-dot" title="Admissions Open"></span>
            <Phone className="w-3.5 h-3.5 text-sky-300" />
            <span>+91 90431 33663</span>
          </a>
          <div>
            <h6>We're Proud to be a NEBOSH Gold Learning Partner | Empowering Safety, Protecting Lives</h6>
          </div>
          {/* RIGHT: Job Listing | Upcoming batches | LMS Login */}
          <div className="flex items-center gap-4">
            <Link
              to="/jobs"
              className="topbar-job-btn inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-white font-semibold tracking-wide"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Job Listing</span>
            </Link>

            <Link
              to="/upcoming-batches"
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-sky-400 font-medium transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Upcoming batches</span>
            </Link>

            <span className="text-slate-600 select-none">|</span>

            <Link
              to="/lms-login"
              className="topbar-lms-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-100 font-semibold"
            >
              <LogIn className="w-3.5 h-3.5 text-violet-300" />
              <span>LMS Login </span>
            </Link>
          </div>

        </div>

        {/* ================= MOBILE & TABLET VIEW (Compact Single Row) ================= */}
        <div className="flex lg:hidden items-center justify-between gap-2 text-[11px] sm:text-xs">

          {/* LEFT: Compact Mobile Phone Pill */}
          <a
            href="tel:+919043133663"
            className="topbar-phone-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-white font-semibold shrink-0"
          >
            <span className="support-pulse-dot shrink-0"></span>
            <Phone className="w-3 h-3 text-sky-300 shrink-0" />
            <span>+91 90431 33663</span>
          </a>

          {/* RIGHT: Compact Upcoming Batches */}
          <Link
            to="/upcoming-batches"
            className="topbar-mobile-batch inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sky-300 font-medium shrink-0"
          >
            <Calendar className="w-3 h-3 text-sky-300 shrink-0" />
            <span>Upcoming batches</span>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default TopBar;