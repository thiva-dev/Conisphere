import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import './App.css';
import { attachGlobalEmailValidation } from './api';
import ErrorBoundary from './Components/ErrorBoundary';
import TopBar from './Components/TopBar';
import Navbar from './Components/Navbar';
import Heroslider from './Components/Heroslider';
import Partnersection from './Components/Partnersection';
import Learnersection from './Components/Learnersection';
import Placements from './Components/Placements';
import TrainingAndContacts from './Components/TrainingAndContacts';
import ReviewsAndFeedback from './Components/ReviewsAndFeedback';
import RegisterSection from './Components/RegisterSection';
import Footer from './Components/Footer';
import FloatingWidgets from './Components/Floatingwidgets';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import UpcomingBatches from './Pages/UpcomingBatches';
import NeboshIgc from './Pages/NeboshIgc';
import NeboshIgc2 from './Pages/NeboshIgc2';
import Jobs from './Pages/Jobs';


// 1. Home Page Sections (Route "/" la mattum varum)
function HomePage() {
  return (
    <>
      <Heroslider />
      <Partnersection />
      <Learnersection />
      <Placements />
      <TrainingAndContacts />
      <ReviewsAndFeedback />
      <RegisterSection />
    </>
  );
}

// 2. Layout Wrapper (Admin Dashboard-la Website Header/Footer hide panna)
function AppLayout() {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/admin-dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Admin Dashboard illadha ella pages-layum TopBar & Navbar varum */}
      {!isAdminDashboard && <TopBar />}
      {!isAdminDashboard && <Navbar />}

      <main className="w-full flex-1">
        <Routes>
          {/* Main Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Admin Portal Routes */}
          <Route path="/lms-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/jobs" element={<Jobs />} />
           <Route
            path="*"
            element={
              <div className="max-w-xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center">
                <span className="px-3.5 py-1 rounded-full bg-[#f3effa] border border-[#e2daf3] text-[11px] font-bold uppercase tracking-widest text-[#a62675]">
                  404 • Under Construction
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-[#211859]">
                  Page Coming Soon
                </h2>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  This page is currently under construction. Please explore our home page or upcoming batches.
                </p>
                <div className="mt-7 flex justify-center">
                  <Link
                    to="/"
                    className="brand-glow-btn inline-flex items-center justify-center relative overflow-hidden px-7 py-3 rounded-full text-xs sm:text-sm font-semibold"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="/upcoming-batches" element={<UpcomingBatches />} />
          <Route path="/courses/nebosh-igc" element={
            <>
            <NeboshIgc />
            <NeboshIgc2 />
            </>
            }
           />
        </Routes>
      </main>

      {/* Admin Dashboard illadha ella pages-layum Footer & FloatingWidgets varum */}
      {!isAdminDashboard && <Footer />}
      {!isAdminDashboard && <FloatingWidgets />}
    </div>
  );
}

function App() {
  // Unga Global Button Cursor Glow Effect (Preserved 100%)
  
  useEffect(() => {
    const trackCursor = (e) => {
      const btn = e.target?.closest?.('.brand-glow-btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--x', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--y', `${e.clientY - rect.top}px`);
    };
    document.addEventListener('mousemove', trackCursor);
    return () => document.removeEventListener('mousemove', trackCursor);
  }, []);
  useEffect(() => attachGlobalEmailValidation(), []);
  
  return (
    <ErrorBoundary>
      <Router>
        <AppLayout />
      </Router>
    </ErrorBoundary>
  );
}

export default App;