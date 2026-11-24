import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, ExternalLink, ShieldCheck,
  ChevronRight, Globe, Laptop, CreditCard, Award
} from 'lucide-react';
import './Footer.css';

// Optional ISO Logo Image Slot 
const isoBadgeImg = '/Pictures/certified_training.avif'; 

const quickLinks = [
  { label: 'NEBOSH IGC', to: '/courses/nebosh-igc' },
  { label: 'NEBOSH HSW', to: '/courses/nebosh-hsw' },
  { label: 'IOSH', to: '/courses/iosh' },
  { label: 'Highfield International', to: '/courses/highfield' },
  { label: 'National Diploma', to: '/courses/national-diploma' },
  { label: 'BCSP', to: '/courses/bcsp' },
  { label: 'ISO', to: '/courses/iso-lead-auditor' },
  { label: 'OSHA 30hrs General Industry', to: '/courses/osha-30-general' },
  { label: 'OSHA 10hrs General Industry', to: '/courses/osha-10-general' },
  { label: 'OSHA 30hrs Construction Industry', to: '/courses/osha-30-construction' },
  { label: 'OSHA 10hrs Construction Industry', to: '/courses/osha-10-construction' },
];

const policyLinks = [
  { label: 'Privacy Policy', to: '/policies/privacy' },
  { label: 'Refund & Cancellation Policy', to: '/policies/refund' },
  { label: 'Compliance & Grievance Policy', to: '/policies/compliance' },
];

const presenceData = {
  GCC: [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Bahrain', 'Kuwait',
    'Qatar', 'Saudi Arabia', 'Oman', 'Ajman', 'Fujairah', 'Ras Al-Khaimah',
  ],
  India: [
    'Tamilnadu', 'Chennai', 'Bangalore', 'Hyderabad', 'Kochi',
    'Mumbai', 'Delhi', 'Kolkata', 'Pune', 'Patna',
    'Coimbatore', 'Madurai', 'Trichy', 'Nagercoil', 'Dindigul',
    'Tirunelveli', 'Kanyakumari', 'Pondicherry', 'Lucknow',
  ],
  Worldwide: [
    'Malaysia', 'Singapore', 'Thailand', 'Indonesia', 'Botswana',
    'South Africa', 'Iraq', 'Philippines', 'Egypt',
  ],
};

// Branch Offices (when you Click the Address + Phone + Column 1 Map column will sync!)
const branchOffices = [
  {
    id: 'dubai',
    label: 'UAE - Dubai',
    short: 'Dubai',
    address: 'Ground Floor, Giovanni Boutique Suites – Roma – Dubai Sports City – Dubai – United Arab Emirates.',
    phones: ['+971504607383'],
    mapQuery: 'Giovanni Boutique Suites Dubai Sports City Dubai',
  },
  {
    id: 'chennai',
    label: 'India - Chennai',
    short: 'Chennai',
    address: 'Cabin No. 301, Regus Shyamala Gardens, 136, Arcot Road 3rd Floor, Shyamala Tower, Saligramam, Chennai, Tamil Nadu 600092.',
    phones: ['+91 73057 33883'],
    mapQuery: 'Shyamala Tower Saligramam Chennai 600092',
  },
  {
    id: 'coimbatore',
    label: 'India - Coimbatore',
    short: 'Coimbatore',
    address: '35/9, Desabandhu St, Ramarkovil, Ram Nagar, Coimbatore, Tamil Nadu 641009.',
    phones: ['+91 90431 33993'],
    mapQuery: 'Ram Nagar Coimbatore Tamil Nadu 641009',
  },
  {
    id: 'trichy',
    label: 'India - Trichy',
    short: 'Trichy',
    address: '60/3, Krishna Complex, Second Floor, Sastri Road, Thennur, Trichy – 620 017. Landmark: Opposite Old Sippy Theatre.',
    phones: ['+91 90431 33663', '+91 97899 35573', '+91 90438 36636'],
    mapQuery: 'Sastri Road Thennur Trichy 620017',
  },
  {
    id: 'delhi',
    label: 'India - Delhi',
    short: 'Delhi',
    address: 'E 44/3, Pocket D, Okhla Phase II, Okhla Industrial Estate, New Delhi, Delhi – 110020.',
    phones: ['+91 96670 78893', '+91 733 884 7733'],
    mapQuery: 'Okhla Phase II New Delhi 110020',
  },
];

// Clean SVG Social Icons
const socialLinks = [
  { name: 'Facebook', href: '#', svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
  { name: 'Instagram', href: '#', svg: <><rect width="20" height="20" x="2" y="2" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></> },
  { name: 'LinkedIn', href: '#', svg: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></> },
  { name: 'YouTube', href: '#', svg: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></> },
  { name: 'TikTok', href: '#', svg: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /> },
];

export default function Footer() {
  const [regionTab, setRegionTab] = useState('GCC');
  const [activeBranchIndex, setActiveBranchIndex] = useState(0);

  const activeBranch = branchOffices[activeBranchIndex];
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(activeBranch.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeBranch.mapQuery)}`;

  return (
    <footer className="footer-surface w-full text-[#211859]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-7">

          {/* ================= COLUMN 1: BRAND, SOCIALS, FREE LIVE MAP & ISO ================= */}
          <div className="lg:col-span-3 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#211859] leading-snug">
                Cognisphere Management and Consultancy
              </h3>
              <p className="text-xs font-medium text-[#a62675] mt-1">
                Empowering Safety, Protecting Lives
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.name}
                  className="footer-social-btn w-9 h-9 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                    {soc.svg}
                  </svg>
                </a>
              ))}
            </div>

            {/* 100% Free Interactive Google Map Embed (Syncs with selected branch!) */}
            <div className="footer-card rounded-2xl overflow-hidden">
              <div className="relative h-44 w-full bg-[#ede8f8]">
                <iframe
                  title={`Map - ${activeBranch.label}`}
                  src={mapEmbedUrl}
                  loading="lazy"
                  className="w-full h-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={mapOpenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 text-[11px] font-semibold text-[#211859] shadow-md hover:text-[#a62675]"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="px-3 py-2 bg-[#faf9fd] border-t border-[#ece7f6] flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#211859]">Showing: {activeBranch.short}</span>
                <span className="text-[#a62675] font-medium">Free Live Map</span>
              </div>
            </div>

            {/* ISO 9001:2015 Certified Card */}
            <div className="footer-card rounded-2xl p-3.5 flex items-center gap-3 border-l-4 border-l-[#E0B04A]">
              <div className="w-12 h-12 rounded-xl bg-[#f8f7fc] border border-[#e3dbf3] flex items-center justify-center shrink-0">
                {isoBadgeImg ? (
                  <img src={isoBadgeImg} alt="ISO 9001:2015" className="w-10 h-10 object-contain" />
                ) : (
                  <Award className="w-6 h-6 text-[#211859]" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-[#211859]">ISO 9001:2015 Certified</p>
                <p className="text-[11px] text-slate-500">Safety Training Institute</p>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 2: QUICK LINKS, POLICIES & PORTAL BUTTONS ================= */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#a62675] mb-3">
                Quick Links
              </h4>
              <ul className="space-y-1.5">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="footer-link-item inline-flex items-center gap-1.5 text-[13px] font-medium text-[#211859]/85"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-[#a62675] shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#a62675] mb-2.5">
                Cognisphere Policies
              </h4>
              <ul className="space-y-1.5">
                {policyLinks.map((pol) => (
                  <li key={pol.label}>
                    <Link
                      to={pol.to}
                      className="footer-link-item inline-flex items-center gap-1.5 text-[13px] font-medium text-[#211859]/85"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#211859]/60 shrink-0" />
                      <span>{pol.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#a62675] mb-2.5">
                Get Membership
              </h4>
              <div className="flex flex-col gap-2.5 max-w-[230px]">
                <Link to="/lms-login" className="brand-glow-btn py-2.5 px-4 rounded-xl text-xs font-semibold gap-2">
                  <Laptop className="w-4 h-4 text-amber-300" />
                  <span>E-Learning Access</span>
                </Link>
                <Link to="/payment" className="brand-glow-btn py-2.5 px-4 rounded-xl text-xs font-semibold gap-2">
                  <CreditCard className="w-4 h-4 text-amber-300" />
                  <span>Payment Gateway</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 3: INTERACTIVE OUR PRESENCE (NO ENDLESS SCROLL!) ================= */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#a62675] mb-3">
              Our Presence
            </h4>

            {/* Region Switcher Tabs */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {Object.keys(presenceData).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRegionTab(tab)}
                  className={`footer-tab-pill px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    regionTab === tab ? 'is-active' : ''
                  }`}
                >
                  {tab === 'Worldwide' ? 'Worldwide Online' : tab}
                </button>
              ))}
            </div>

            {/* Active Region Locations Grid */}
            <div className="footer-card rounded-2xl p-4">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#f0ebf8]">
                <span className="text-xs font-bold text-[#211859] inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#a62675]" />
                  {regionTab === 'Worldwide' ? 'Worldwide Online Classes' : `${regionTab} Training Hubs`}
                </span>
                <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[#f3effa] text-[#a62675]">
                  {presenceData[regionTab].length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {presenceData[regionTab].map((loc) => (
                  <div
                    key={loc}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#faf9fd] border border-[#ece7f6] text-xs font-medium text-[#211859]"
                  >
                    <MapPin className="w-3 h-3 text-[#a62675] shrink-0" />
                    <span className="truncate">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= COLUMN 4: EMAIL + INTERACTIVE BRANCH ADDRESSES ================= */}
          <div className="lg:col-span-3 space-y-5">
            {/* Email Card */}
            <div className="footer-card rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#a62675]">
                Get Details Via Email
              </p>
              <a
                href="mailto:info@cognispheremc.com"
                className="mt-1.5 inline-flex items-center gap-2 text-sm font-bold text-[#211859] hover:text-[#a62675] transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-[#a62675] shrink-0" />
                <span>info@cognispheremc.com</span>
              </a>
            </div>

            {/* Interactive Branch Selector (Syncs with Live Map!) */}
            <div className="footer-card rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#a62675] mb-2.5">
                Branch Offices (Tap to View Map)
              </p>

              {/* Branch Pill Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {branchOffices.map((br, idx) => (
                  <button
                    key={br.id}
                    type="button"
                    onClick={() => setActiveBranchIndex(idx)}
                    className={`footer-tab-pill px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                      activeBranchIndex === idx ? 'is-active' : ''
                    }`}
                  >
                    {br.short}
                  </button>
                ))}
              </div>

              {/* Active Branch Full Address & Clickable Phones */}
              <div className="bg-[#faf9fd] rounded-xl p-3.5 border border-[#ece7f6]">
                <p className="text-xs font-bold text-[#211859] mb-1">{activeBranch.label}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{activeBranch.address}</p>

                <div className="mt-3 pt-2.5 border-t border-[#e8e2f4] flex flex-col gap-1.5">
                  {activeBranch.phones.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#211859] hover:text-[#a62675]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#a62675] shrink-0" />
                      <span>{num}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM COPYRIGHT BAR ================= */}
      <div className="bg-white border-t border-[#e7e1f4] py-4 px-4 text-center">
        <p className="text-xs sm:text-[13px] font-medium text-[#211859]/80">
          &copy; {new Date().getFullYear()} Cognisphere Management and Consultancy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}