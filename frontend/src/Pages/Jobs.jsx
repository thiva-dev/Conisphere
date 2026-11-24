import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, MapPin, Wallet, Clock, Users, Globe, Search,
  RotateCcw, ExternalLink, Award, SlidersHorizontal, X, Calendar, Sparkles, Building2
} from 'lucide-react';
import { fetchPublicJobs } from '../api';
import './Jobs.css';
import CognisphereLoader from './CognisphereLoader';


const jobsHeroImg = ''; // <-- Optional Banner Image Path (e.g. '/images/jobs-banner.jpg')
const WHATSAPP_NUMBER = '919043133663';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [neboshOnly, setNeboshOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchPublicJobs()
      .then((res) => setJobs(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(jobs.map((j) => j.category).filter(Boolean))],
    [jobs]
  );

  // Date Posted Counts (Live feedback so filter counts are crystal clear!)
  const dateCounts = useMemo(() => {
    const now = Date.now();
    const withinDays = (days) =>
      jobs.filter((j) => (now - new Date(j.created_at).getTime()) / 86400000 <= days).length;
    return {
      all: jobs.length,
      '24h': withinDays(1),
      '7d': withinDays(7),
      '30d': withinDays(30),
    };
  }, [jobs]);

  const dateFilters = [
    { value: 'all', label: 'All' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
  ];

  const locationOptions = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Fujairah', 'UAE', 'India'];

  const filteredJobs = useMemo(() => {
    const now = Date.now();
    return jobs.filter((job) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company_name.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);

      const matchCat = !categoryFilter || job.category === categoryFilter;
      const matchLoc =
        !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchNebosh = !neboshOnly || job.nebosh_required;

      let matchDate = true;
      if (dateFilter !== 'all' && job.created_at) {
        const daysAgo = (now - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (dateFilter === '24h') matchDate = daysAgo <= 1;
        else if (dateFilter === '7d') matchDate = daysAgo <= 7;
        else if (dateFilter === '30d') matchDate = daysAgo <= 30;
      }

      return matchSearch && matchCat && matchLoc && matchNebosh && matchDate;
    });
  }, [jobs, search, categoryFilter, locationFilter, neboshOnly, dateFilter]);

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setLocationFilter('');
    setDateFilter('all');
    setNeboshOnly(false);
  };

  const renderFilterControls = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[#ece7f6] pb-3">
        <span className="text-sm font-bold text-[#211859] inline-flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#a62675]" />
          Filter Jobs
        </span>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold text-[#a62675] hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Search Role / Company
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#a62675] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Safety Officer, Dubai..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm focus:outline-none focus:border-[#a62675]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Job Category
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm font-medium text-[#211859] cursor-pointer focus:outline-none focus:border-[#a62675]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Location
        </label>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[#faf9fd] border border-[#dcd3ef] text-xs sm:text-sm font-medium text-[#211859] cursor-pointer focus:outline-none focus:border-[#a62675]"
        >
          <option value="">All Locations</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Date Posted
        </label>
        <div className="space-y-2">
          {dateFilters.map((df) => (
            <label key={df.value} className="flex items-center justify-between text-xs sm:text-sm text-[#211859] cursor-pointer">
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="datePosted"
                  checked={dateFilter === df.value}
                  onChange={() => setDateFilter(df.value)}
                  className="accent-[#a62675] w-4 h-4 cursor-pointer"
                />
                <span>{df.label}</span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#f3effa] text-[#a62675]">
                {dateCounts[df.value]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2.5 pt-2 border-t border-[#ece7f6] text-xs font-semibold text-[#211859] cursor-pointer">
        <input
          type="checkbox"
          checked={neboshOnly}
          onChange={(e) => setNeboshOnly(e.target.checked)}
          className="accent-[#a62675] w-4 h-4 rounded cursor-pointer"
        />
        <span>NEBOSH IGC Required Only</span>
      </label>
    </div>
  );

  return (
    <div className="w-full bg-[#f8f7fc] min-h-screen">

      {/* 1. HERO BANNER */}
      <section className="jobs-hero-bg w-full py-14 sm:py-20 px-4 sm:px-6 text-white text-center">
        {jobsHeroImg && (
          <img src={jobsHeroImg} alt="Find and Apply Safety Officer Jobs 2026" className="jobs-hero-img" />
        )}
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            UAE • GCC • India Safety Careers
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-tight">
            Find and Apply Safety Officer Jobs &ndash; 2026
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-purple-100/90 max-w-2xl mx-auto">
            Build Your Career in Health &amp; Safety • Top Job Opportunities • Global Career Growth
          </p>
        </div>
      </section>

      {/* 2. INTRO PARAGRAPH */}
      <div className="bg-white border-b border-[#ece7f6] py-6 px-4 sm:px-6">
        <p className="max-w-6xl mx-auto text-xs sm:text-sm lg:text-[15px] text-slate-600 leading-relaxed text-center">
          Explore the latest Safety Officer job opportunities across UAE, India, Dubai, Abu Dhabi,
          Kuwait, Qatar, Oman, Bahrain, and Saudi Arabia (KSA). Discover career opportunities and
          take the next step in your HSE career!
        </p>
      </div>

      {/* 3. STICKY LEFT SIDEBAR + RIGHT JOB CARDS FEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row items-start gap-7">

          <div className="w-full lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#e3dbf3] shadow-sm">
            <span className="text-sm font-bold text-[#211859]">
              {filteredJobs.length} Safety Officer Jobs
            </span>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="px-4 py-2 rounded-xl bg-[#211859] text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              {mobileFilterOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
              <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Jobs'}</span>
            </button>
          </div>

          {mobileFilterOpen && (
            <div className="w-full lg:hidden jobs-filter-sidebar rounded-2xl p-5">
              {renderFilterControls()}
            </div>
          )}

          <aside className="hidden lg:block w-[290px] shrink-0 lg:sticky lg:top-24 jobs-filter-sidebar rounded-3xl p-6">
            {renderFilterControls()}
          </aside>

          <div className="flex-1 w-full space-y-5">
            <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#e4dcf3] shadow-sm">
              <h2 className="text-base font-bold text-[#211859] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#a62675]" />
                <span>Safety Officer Jobs ({filteredJobs.length})</span>
              </h2>
              <span className="text-xs font-semibold text-[#a62675]">
                Click Apply Now to visit official application link
              </span>
            </div>

           {loading ? (
              <CognisphereLoader label="Loading Safety Officer Jobs..." />
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#e4dcf3]">
                <p className="text-base font-bold text-[#211859]">No matching jobs found.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden mt-4 px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const applyTarget =
                  job.apply_url ||
                  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hi Cognisphere MC, I'm interested in applying for ${job.title} at ${job.company_name} (${job.location}).`
                  )}`;

                return (
                  <article
                    key={job.id}
                    className="job-feed-card rounded-3xl p-5 sm:p-6 flex flex-col gap-4"
                  >
                    {/* TOP COMPANY LOGO SHOWCASE + POSTED DATE (Exact Screenshot Hierarchy Upgraded!) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0ebf8]">
                      <div className="flex items-center gap-4">
                        {/* Prominent Company Logo Box */}
                        <div className="w-28 sm:w-36 h-14 rounded-2xl bg-[#f8f7fc] border border-[#e4dcf3] flex items-center justify-center p-2 overflow-hidden shrink-0">
                          {job.company_logo ? (
                            <img
                              src={job.company_logo}
                              alt={job.company_name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5 text-[#211859] font-extrabold text-xs sm:text-sm text-center">
                              <Building2 className="w-4 h-4 text-[#a62675] shrink-0" />
                              <span className="truncate max-w-[100px]">{job.company_name}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-[#211859] leading-snug">
                            {job.title}
                          </h3>
                          <p className="text-xs sm:text-sm font-semibold text-[#a62675] mt-0.5">
                            {job.company_name}
                          </p>
                        </div>
                      </div>

                      {job.posted_label && (
                        <span className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3effa] text-[#211859] text-[11px] font-semibold shrink-0">
                          <Calendar className="w-3 h-3 text-[#a62675]" />
                          {job.posted_label}
                        </span>
                      )}
                    </div>

                    {/* MIDDLE JOB DETAILS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs bg-[#faf9fd] p-3.5 rounded-2xl border border-[#ece7f6]">
                      <div className="flex items-center gap-2 text-[#211859]">
                        <Wallet className="w-3.5 h-3.5 text-[#a62675] shrink-0" />
                        <span><strong>Salary:</strong> {job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#211859]">
                        <Clock className="w-3.5 h-3.5 text-[#a62675] shrink-0" />
                        <span><strong>Experience:</strong> {job.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#211859]">
                        <Briefcase className="w-3.5 h-3.5 text-[#a62675] shrink-0" />
                        <span><strong>Job Type:</strong> {job.job_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#211859]">
                        <Users className="w-3.5 h-3.5 text-[#a62675] shrink-0" />
                        <span><strong>Vacancy:</strong> {job.vacancy}</span>
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2 text-[#211859]">
                        <Globe className="w-3.5 h-3.5 text-[#a62675] shrink-0" />
                        <span><strong>Nationality:</strong> {job.nationality}</span>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-2 text-[#211859] pt-1 border-t border-[#ece7f6]">
                        <MapPin className="w-3.5 h-3.5 text-[#a62675] shrink-0" />
                        <span><strong>Job Location:</strong> {job.location}</span>
                      </div>
                    </div>

                    {job.nebosh_required && (
                      <p className="text-xs font-bold text-rose-600">
                        *NEBOSH IGC certificate is a must*
                      </p>
                    )}

                    {/* BOTTOM ACTION BUTTONS */}
                    <div className="pt-2 border-t border-[#f0ebf8] flex flex-wrap items-center gap-3">
                      <a
                        href={applyTarget}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold gap-2"
                      >
                        <span>Apply Now</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <Link
                        to="/courses/nebosh-igc"
                        className="job-learn-btn inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold gap-1.5"
                      >
                        <Award className="w-4 h-4 text-[#a62675]" />
                        <span>Learn NEBOSH IGC to Get High Pay</span>
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>

        </div>

        {/* 4. EXACT DISCLAIMER ABOVE FOOTER */}
        <div className="mt-14 bg-white rounded-2xl p-5 sm:p-6 border border-[#e4dcf3] text-[11px] sm:text-xs text-slate-600 leading-relaxed">
          <strong>***Disclaimer:</strong> This job vacancy is shared for informational purposes only
          and was sourced from publicly available recruitment information, including Naukrigulf.
          Cognisphere Management and Consultancy is not the original recruiter or employer and is
          not affiliated with Naukrigulf unless expressly stated. Candidates are advised to verify
          all vacancy details directly with the original employer or recruitment platform before
          applying. All trademarks, logos, and job-related content belong to their respective
          owners. For content removal or corrections, please contact{' '}
          <a href="mailto:info@cognispheremc.com" className="text-[#a62675] font-semibold underline">
            info@cognispheremc.com
          </a>
          .***
        </div>
      </section>

    </div>
  );
}