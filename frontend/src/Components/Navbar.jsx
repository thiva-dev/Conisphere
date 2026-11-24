import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Briefcase, X, ArrowRight, PhoneCall } from 'lucide-react';
import './Navbar.css';

// Standard Dropdown Menus
// Exact Dropdown Menus (Verified From Your Screenshots)
const dropdownMenus = {
  Locations: [
    { label: 'Dubai', path: '/locations/dubai' },
    { label: 'Abu Dhabi', path: '/locations/abu-dhabi' },
    { label: 'Delhi', path: '/locations/delhi' },
    { label: 'Mumbai', path: '/locations/mumbai' },
    { label: 'Chennai', path: '/locations/chennai' },
    { label: 'Bangalore', path: '/locations/bangalore' },
    { label: 'Hyderabad', path: '/locations/hyderabad' },
    { label: 'Kochi', path: '/locations/kochi' },
    { label: 'Kolkata', path: '/locations/kolkata' },
    { label: 'Pune', path: '/locations/pune' },
    { label: 'Patna', path: '/locations/patna' },
    { label: 'Coimbatore', path: '/locations/coimbatore' },
    { label: 'Madurai', path: '/locations/madurai' },
    { label: 'Trichy', path: '/locations/trichy' },
  ],
  'Corporate Trainings': [
    { label: 'Workplace First Aid Training', path: '/corporate-trainings/workplace-first-aid' },
    { label: 'Asbestos Awareness Course (Category A)', path: '/corporate-trainings/asbestos-awareness' },
    { label: 'Working at Height', path: '/corporate-trainings/working-at-height' },
    { label: 'Fire Warden (Fire Marshal) Training', path: '/corporate-trainings/fire-warden' },
    { label: 'Fire Safety Awareness', path: '/corporate-trainings/fire-safety-awareness' },
    { label: 'General Safety Awareness', path: '/corporate-trainings/general-safety-awareness' },
    { label: 'International Program for Real Estate Management', path: '/corporate-trainings/real-estate-management' },
    { label: 'Control of Substances Hazardous to Health (COSHH)', path: '/corporate-trainings/coshh' },
    { label: 'Working in Confined Spaces', path: '/corporate-trainings/confined-spaces' },
    { label: 'Fire Risk Assessment Training', path: '/corporate-trainings/fire-risk-assessment' },
  ],
  Services: [
    { label: 'Facilities Management', path: '/services/facilities-management' },
    { label: 'Health and Safety', path: '/services/health-and-safety' },
    { label: 'Property Management', path: '/services/property-management' },
    { label: 'Community Association Management', path: '/services/community-association-management' },
    { label: 'Compliance', path: '/services/compliance' },
    { label: 'Recruitment and Staffing', path: '/services/recruitment-and-staffing' },
  ],
};



// Exact Courses Tree 
const coursesTree = [
  {
    label: 'NEBOSH',
    children: [
      { label: 'NEBOSH IGC', path: '/courses/nebosh-igc' },
      { label: 'NEBOSH HSW', path: '/courses/nebosh-hsw' },
    ],
  },
  {
    label: 'OSHA',
    children: [
      { label: 'OSHA 30hrs General Industry', path: '/courses/osha-30-general' },
      { label: 'OSHA 10hrs General Industry', path: '/courses/osha-10-general' },
      { label: 'OSHA 30hrs Construction Industry', path: '/courses/osha-30-construction' },
      { label: 'OSHA 10hrs Construction Industry', path: '/courses/osha-10-construction' },
    ],
  },
  {
    label: 'IOSH',
    children: [
      { label: 'IOSH Managing Safely', path: '/courses/iosh-managing-safely' },
    ],
  },
  {
    label: 'Highfield International',
    children: [
      {
        label: 'Level 4 Award',
        children: [
          { label: 'Health and Safety in the Workplace', path: '/courses/highfield-l4-health-safety' },
          { label: 'Food Safety Management for Manufacturing', path: '/courses/highfield-l4-food-manufacturing' },
          { label: 'HACCP Management for Catering', path: '/courses/highfield-l4-haccp-catering' },
          { label: 'Managing Food Safety for Catering', path: '/courses/highfield-l4-food-catering' },
        ],
      },
      {
        label: 'Level 3 Award',
        children: [
          { label: 'Delivering Training – IADT', path: '/courses/highfield-l3-iadt' },
          { label: 'HACCP for Catering', path: '/courses/highfield-l3-haccp-catering' },
          { label: 'HACCP for Food Manufacturing', path: '/courses/highfield-l3-haccp-manufacturing' },
          { label: 'First Aid at Work and Use of an AED', path: '/courses/highfield-l3-first-aid' },
        ],
      },
      {
        label: 'Level 2 Award',
        children: [
          { label: 'Risk Assessment', path: '/courses/highfield-l2-risk-assessment' },
          { label: 'Fire Safety', path: '/courses/highfield-l2-fire-safety' },
          { label: 'Control of Substances Hazardous to Health (COSHH)', path: '/courses/highfield-l2-coshh' },
        ],
      },
    ],
  },
  {
    label: 'National Diploma',
    children: [
      { label: 'Post Diploma', path: '/courses/post-diploma' },
      { label: 'Advanced Diploma', path: '/courses/advanced-diploma' },
      {
        label: 'Diploma',
        children: [
          { label: 'Fire and Industrial Safety', path: '/courses/diploma-fire-industrial-safety' },
          { label: 'Fire and Safety', path: '/courses/diploma-fire-safety' },
        ],
      },
    ],
  },
  {
    label: 'ISO',
    children: [
      { label: 'ISO 9001:2015 QMS', path: '/courses/iso-9001-qms' },
      { label: 'ISO 14001:2015 EMS', path: '/courses/iso-14001-ems' },
      { label: 'ISO 45001:2018 OHSMS', path: '/courses/iso-45001-ohsms' },
    ],
  },
  {
    label: 'BCSP',
    children: [
      { label: 'Associate Safety Professional (ASP)', path: '/courses/bcsp-asp' },
      { label: 'Certified Safety Professional (CSP)', path: '/courses/bcsp-csp' },
    ],
  },
];

function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeCourseL1, setActiveCourseL1] = useState(null);
  const [activeCourseL2, setActiveCourseL2] = useState(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [mobileCourseL1, setMobileCourseL1] = useState(null);
  const [mobileCourseL2, setMobileCourseL2] = useState(null);

  const navRef = useRef(null);

  useEffect(() => {
    const closeOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setActiveCourseL1(null);
        setActiveCourseL2(null);
      }
    };
    document.addEventListener('mousedown', closeOutside);
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.removeEventListener('mousedown', closeOutside);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeAll = () => {
    setMobileOpen(false);
    setMobileAccordion(null);
    setMobileCourseL1(null);
    setMobileCourseL2(null);
    setOpenDropdown(null);
    setActiveCourseL1(null);
    setActiveCourseL2(null);
  };

  const toggleDesktopMenu = (menuName) => {
    setOpenDropdown((prev) => (prev === menuName ? null : menuName));
    setActiveCourseL1(null);
    setActiveCourseL2(null);
  };

  return (
    <>
      <header ref={navRef} className="navbar-glass sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-16 lg:h-20 gap-2">

         
  {/* Logo Placeholders */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link to="/" onClick={closeAll}>
              <div className="w-36 sm:w-40 h-10 lg:h-11 flex items-center">
                <img
                    src="/Pictures/Logo-0.png"
                    alt="Cognisphere Management and Consultancy"
                    className="h-13 sm:h-13 lg:h-16 w-60"
                />
              </div>
            </Link>

            <div className="hidden xl:flex w-23 h-15 items-center justify-center">
                <img
                src="/Pictures/Nebosh-logo-Horizontal.webp"
                alt="NEBOSH Gold Learning Partner"
                className="h-15 w-auto object-contain"
                />
            </div>
          </div>

          {/* CENTER: Desktop Navigation (>= 1024px) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-[13px] xl:text-[14px] font-medium">
            <Link to="/" onClick={closeAll} className="nav-link-item px-2.5 py-2">Home</Link>

            <Link to="/jobs" onClick={closeAll} className="nav-jobs-pill inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-semibold mx-0.5">
              <Briefcase className="w-3.5 h-3.5 text-[#a62675]" />
              <span>Jobs</span>
            </Link>

            <Link to="/about" onClick={closeAll} className="nav-link-item px-2.5 py-2">About</Link>

            {/* 1. Locations Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDesktopMenu('Locations')}
                className={`nav-link-item inline-flex items-center gap-1 px-2.5 py-2 cursor-pointer whitespace-nowrap ${
                  openDropdown === 'Locations' ? 'text-[#a62675]' : ''
                }`}
              >
                <span>Locations</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'Locations' ? 'rotate-180 text-[#a62675]' : ''}`} />
              </button>

              {openDropdown === 'Locations' && (
                <div className="nav-dropdown-card absolute left-0 mt-3 w-64 rounded-2xl py-2 z-50">
                  {dropdownMenus.Locations.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeAll}
                      className="flex items-center justify-between px-4 py-2 text-sm text-[#1e1b4b] hover:bg-[#f3effa] hover:text-[#a62675] font-medium"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 2. EXACT 3-LEVEL CASCADING COURSES DROPDOWN (Left Flyout Format!) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDesktopMenu('Courses')}
                className={`nav-link-item inline-flex items-center gap-1 px-2.5 py-2 cursor-pointer whitespace-nowrap ${
                  openDropdown === 'Courses' ? 'text-[#a62675]' : ''
                }`}
              >
                <span>Courses</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'Courses' ? 'rotate-180 text-[#a62675]' : ''}`} />
              </button>

              {openDropdown === 'Courses' && (
                <div className="nav-dropdown-card absolute left-0 mt-3 w-56 rounded-2xl py-2 z-50">
                  {coursesTree.map((cat) => {
                    const isL1Open = activeCourseL1 === cat.label;
                    return (
                      <div
                        key={cat.label}
                        className="relative"
                        onMouseEnter={() => { setActiveCourseL1(cat.label); setActiveCourseL2(null); }}
                      >
                        <button
                          type="button"
                          onClick={() => { setActiveCourseL1(cat.label); setActiveCourseL2(null); }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                            isL1Open
                              ? 'bg-[#f3effa] text-[#a62675] font-semibold'
                              : 'text-[#1e1b4b] hover:bg-[#f3effa] hover:text-[#a62675]'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isL1Open ? 'text-[#a62675]' : 'text-slate-400'}`} />
                        </button>

                        {/* LEVEL 2 FLYOUT (Opens to the Left cleanly!) */}
                        {isL1Open && cat.children && (
                          <div className="absolute right-full top-0 pr-1.5 z-50">
                            <div className="nav-flyout-card w-60 rounded-2xl py-2">
                              {cat.children.map((sub) => {
                                const hasL3 = Array.isArray(sub.children);
                                const isL2Open = activeCourseL2 === sub.label;

                                if (!hasL3) {
                                  return (
                                    <Link
                                      key={sub.label}
                                      to={sub.path}
                                      onClick={closeAll}
                                      className="block px-4 py-2.5 text-[13.5px] font-medium text-[#1e1b4b] hover:bg-[#f3effa] hover:text-[#a62675] transition-colors"
                                    >
                                      {sub.label}
                                    </Link>
                                  );
                                }

                                return (
                                  <div
                                    key={sub.label}
                                    className="relative"
                                    onMouseEnter={() => setActiveCourseL2(sub.label)}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => setActiveCourseL2(sub.label)}
                                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-[13.5px] font-medium transition-colors cursor-pointer ${
                                        isL2Open
                                          ? 'bg-[#f3effa] text-[#a62675] font-semibold'
                                          : 'text-[#1e1b4b] hover:bg-[#f3effa] hover:text-[#a62675]'
                                      }`}
                                    >
                                      <span>{sub.label}</span>
                                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isL2Open ? 'text-[#a62675]' : 'text-slate-400'}`} />
                                    </button>

                                    {/* LEVEL 3 FLYOUT (Opens to the Left of Level 2!) */}
                                    {isL2Open && (
                                      <div className="absolute right-full top-0 pr-1.5 z-50">
                                        <div className="nav-flyout-card w-64 rounded-2xl py-2">
                                          {sub.children.map((leaf) => (
                                            <Link
                                              key={leaf.label}
                                              to={leaf.path}
                                              onClick={closeAll}
                                              className="block px-4 py-2.5 text-[13px] font-medium text-[#1e1b4b] hover:bg-[#f3effa] hover:text-[#a62675] transition-colors leading-snug"
                                            >
                                              {leaf.label}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Corporate Trainings & Services Dropdowns */}
            {['Corporate Trainings', 'Services'].map((menu) => (
              <div key={menu} className="relative">
                <button
                  type="button"
                  onClick={() => toggleDesktopMenu(menu)}
                  className={`nav-link-item inline-flex items-center gap-1 px-2.5 py-2 cursor-pointer whitespace-nowrap ${
                    openDropdown === menu ? 'text-[#a62675]' : ''
                  }`}
                >
                  <span>{menu}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === menu ? 'rotate-180 text-[#a62675]' : ''}`} />
                </button>

                {openDropdown === menu && (
                  <div className="nav-dropdown-card absolute left-0 mt-3 w-60 rounded-2xl py-2 z-50">
                    {dropdownMenus[menu].map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeAll}
                        className="flex items-center justify-between px-4 py-2 text-sm text-[#1e1b4b] hover:bg-[#f3effa] hover:text-[#a62675] font-medium"
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link to="/blogs" onClick={closeAll} className="nav-link-item px-2.5 py-2">Blogs</Link>
          </nav>

          {/* RIGHT: Desktop Contact CTA + Mobile Hamburger */}
          <div className="flex items-center shrink-0">
            <Link to="/contact" onClick={closeAll} className="nav-contact-cta hidden lg:inline-flex px-5 py-2.5 rounded-full text-sm font-semibold">
              Contact Us
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`flex lg:hidden flex-col items-center justify-center hamburger-btn ${mobileOpen ? 'is-open' : ''}`}
              aria-label="Toggle Menu"
            >
              <span className="hamburger-line line-top"></span>
              <span className="hamburger-line line-mid"></span>
              <span className="hamburger-line line-bot"></span>
            </button>
          </div>

        </div>
      </header>

      {/* ================= MOBILE BACKDROP & SMOOTH SIDE NAV DRAWER ================= */}

      <div onClick={closeAll} className={`mobile-backdrop ${mobileOpen ? 'is-open' : ''}`} />

      <aside className={`mobile-side-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ece8f5] bg-[#f8f7fc]">
          <div className="w-32 h-9 border-2 rounded-md bg-white flex items-center justify-center text-[11px] font-semibold text-[#211859]/60">
            <img
                    src="/Pictures/Logo-0.png"
                    alt="Cognisphere Management and Consultancy"
                    className="h-13 sm:h-13 lg:h-16 w-60"
                />
          </div>
          <button type="button" onClick={closeAll} className="p-2 rounded-lg bg-white border border-[#e2daf3] text-[#211859] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          <Link to="/" onClick={closeAll} className="block px-3.5 py-2.5 rounded-xl font-semibold text-[#211859] hover:bg-[#f3effa]">Home</Link>
          <Link to="/jobs" onClick={closeAll} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold bg-[#f3effa] text-[#211859]">
            <span>Jobs &amp; Placements</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a62675] text-white">Live</span>
          </Link>
          <Link to="/about" onClick={closeAll} className="block px-3.5 py-2.5 rounded-xl font-semibold text-[#211859] hover:bg-[#f3effa]">About</Link>

          {/* Mobile Locations Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileAccordion(mobileAccordion === 'Locations' ? null : 'Locations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold cursor-pointer ${
                mobileAccordion === 'Locations' ? 'bg-[#f3effa] text-[#a62675]' : 'text-[#211859]'
              }`}
            >
              <span>Locations</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'Locations' ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion === 'Locations' && (
              <div className="pl-4 py-1 space-y-1 border-l-2 border-[#a62675] ml-3 my-1">
                {dropdownMenus.Locations.map((item) => (
                  <Link key={item.path} to={item.path} onClick={closeAll} className="block px-3 py-1.5 text-sm text-slate-700 hover:text-[#a62675]">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile 3-Level Courses Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileAccordion(mobileAccordion === 'Courses' ? null : 'Courses')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold cursor-pointer ${
                mobileAccordion === 'Courses' ? 'bg-[#f3effa] text-[#a62675]' : 'text-[#211859]'
              }`}
            >
              <span>Courses</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'Courses' ? 'rotate-180' : ''}`} />
            </button>

            {mobileAccordion === 'Courses' && (
              <div className="pl-3 py-1 space-y-1 border-l-2 border-[#a62675] ml-3 my-1">
                {coursesTree.map((cat) => {
                  const isL1Open = mobileCourseL1 === cat.label;
                  return (
                    <div key={cat.label}>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileCourseL1(isL1Open ? null : cat.label);
                          setMobileCourseL2(null);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm font-semibold cursor-pointer ${
                          isL1Open ? 'text-[#a62675] bg-[#f8f7fc]' : 'text-[#211859]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isL1Open ? 'rotate-180' : ''}`} />
                      </button>

                      {isL1Open && (
                        <div className="pl-3 py-1 space-y-1 border-l border-[#dcd3ef] ml-2 my-1">
                          {cat.children.map((sub) => {
                            const hasL3 = Array.isArray(sub.children);
                            const isL2Open = mobileCourseL2 === sub.label;

                            if (!hasL3) {
                              return (
                                <Link
                                  key={sub.label}
                                  to={sub.path}
                                  onClick={closeAll}
                                  className="block px-2.5 py-1.5 text-[13px] text-slate-700 hover:text-[#a62675]"
                                >
                                  {sub.label}
                                </Link>
                              );
                            }

                            return (
                              <div key={sub.label}>
                                <button
                                  type="button"
                                  onClick={() => setMobileCourseL2(isL2Open ? null : sub.label)}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer ${
                                    isL2Open ? 'text-[#a62675]' : 'text-[#211859]'
                                  }`}
                                >
                                  <span>{sub.label}</span>
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isL2Open ? 'rotate-180' : ''}`} />
                                </button>

                                {isL2Open && (
                                  <div className="pl-3 py-1 space-y-1 border-l border-[#a62675]/50 ml-2">
                                    {sub.children.map((leaf) => (
                                      <Link
                                        key={leaf.label}
                                        to={leaf.path}
                                        onClick={closeAll}
                                        className="block px-2 py-1 text-xs text-slate-600 hover:text-[#a62675]"
                                      >
                                        {leaf.label}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Corporate Trainings & Services Accordions */}
          {['Corporate Trainings', 'Services'].map((menu) => (
            <div key={menu}>
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === menu ? null : menu)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold cursor-pointer ${
                  mobileAccordion === menu ? 'bg-[#f3effa] text-[#a62675]' : 'text-[#211859]'
                }`}
              >
                <span>{menu}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === menu ? 'rotate-180' : ''}`} />
              </button>

              {mobileAccordion === menu && (
                <div className="pl-4 py-1 space-y-1 border-l-2 border-[#a62675] ml-3 my-1">
                  {dropdownMenus[menu].map((item) => (
                    <Link key={item.path} to={item.path} onClick={closeAll} className="block px-3 py-1.5 text-sm text-slate-700 hover:text-[#a62675]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link to="/blogs" onClick={closeAll} className="block px-3.5 py-2.5 rounded-xl font-semibold text-[#211859] hover:bg-[#f3effa]">Blogs</Link>
          <Link to="/lms-login" onClick={closeAll} className="block px-3.5 py-2.5 rounded-xl font-semibold text-[#211859] hover:bg-[#f3effa]">LMS Login</Link>
        </div>

        <div className="p-4 border-t border-[#ece8f5] bg-[#f8f7fc] space-y-2">
          <Link to="/contact" onClick={closeAll} className="nav-contact-cta w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold">
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="tel:+919043133663" className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-[#d9d0ee] bg-white text-[#211859] text-xs font-semibold">
            <PhoneCall className="w-3.5 h-3.5 text-[#a62675]" />
            <span>+91 90431 33663</span>
          </a>
        </div>
      </aside>
    </>
  );
}

export default Navbar;