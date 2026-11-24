import React from 'react';
import './CognisphereLoader.css';

export default function CognisphereLoader({ label = 'Loading...', size = 'md' }) {
  const dim = size === 'sm' ? 52 : size === 'lg' ? 88 : 70;

  return (
    <div className="cg-loader-wrap py-12 px-4 text-center select-none" role="status" aria-live="polite">
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Brand Glow */}
        <div
          className="absolute rounded-full blur-xl opacity-30 pointer-events-none"
          style={{
            width: dim + 16,
            height: dim + 16,
            background: 'radial-gradient(circle, #a62675 0%, #211859 70%)',
          }}
        />

        <svg
          width={dim}
          height={dim}
          viewBox="0 0 80 80"
          className="cg-loader-svg relative z-10"
          aria-hidden="true"
        >
          {/* Subtle Track Ring */}
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="#e8e1f5"
            strokeWidth="3.5"
          />

          {/* 1. Elastic Magenta Outer Spinner */}
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="#a62675"
            strokeWidth="3.8"
            strokeLinecap="round"
            className="cg-outer-arc"
          />

          {/* 2. Counter-Rotating Gold Safety Orbit */}
          <circle
            cx="40"
            cy="40"
            r="24"
            fill="none"
            stroke="#E0B04A"
            strokeWidth="2"
            strokeDasharray="6 7"
            strokeLinecap="round"
            className="cg-gold-orbit"
          />

          {/* 3. Center HSE Safety Shield + Checkmark */}
          <g className="cg-shield-core">
            <path
              d="M40 25 L52 30 V39 C52 47 46.8 53.5 40 56 C33.2 53.5 28 47 28 39 V30 L40 25 Z"
              fill="#211859"
            />
            <path
              d="M35.2 40.6 L38.6 44 L45.4 36.6"
              fill="none"
              stroke="#E0B04A"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {label && (
        <p className="cg-loader-text mt-4 text-xs sm:text-sm font-bold tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
}