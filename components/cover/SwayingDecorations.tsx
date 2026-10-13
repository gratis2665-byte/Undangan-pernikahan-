'use client';

import React from 'react';

export function SwayingDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* ============================================================== */}
      {/* 1. TOP CURTAIN DRAPES & SWAYING ISLAMIC FANOUS LANTERNS */}
      {/* ============================================================== */}
      {/* Top Arch Curtain Pelmet */}
      <div className="absolute top-0 inset-x-0 h-32 md:h-44 pointer-events-none z-20">
        <svg
          viewBox="0 0 1000 240"
          className="w-full h-full object-cover object-top"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="velvetDrape" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#430917" />
              <stop offset="60%" stopColor="#2e050f" />
              <stop offset="100%" stopColor="#190207" />
            </linearGradient>
            <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#fae5aa" />
              <stop offset="100%" stopColor="#b38728" />
            </linearGradient>
          </defs>

          {/* Scalloped velvet drapery valance with Islamic arch curve */}
          <path
            d="M 0,0 L 1000,0 L 1000,70 Q 875,140 750,70 Q 625,150 500,70 Q 375,150 250,70 Q 125,140 0,70 Z"
            fill="url(#velvetDrape)"
            opacity="0.95"
          />
          <path
            d="M 0,70 Q 125,140 250,70 Q 375,150 500,70 Q 625,150 750,70 Q 875,140 1000,70"
            fill="none"
            stroke="url(#goldTrim)"
            strokeWidth="5"
          />

          {/* Left Curtain Swag Cascade */}
          <path
            d="M 0,0 L 160,0 C 130,90 90,170 0,220 Z"
            fill="url(#velvetDrape)"
          />
          <path
            d="M 0,220 C 90,170 130,90 160,0"
            fill="none"
            stroke="url(#goldTrim)"
            strokeWidth="3.5"
          />

          {/* Right Curtain Swag Cascade */}
          <path
            d="M 1000,0 L 840,0 C 870,90 910,170 1000,220 Z"
            fill="url(#velvetDrape)"
          />
          <path
            d="M 1000,220 C 910,170 870,90 840,0"
            fill="none"
            stroke="url(#goldTrim)"
            strokeWidth="3.5"
          />
        </svg>
      </div>

      {/* SWAYING ISLAMIC MOROCCAN FANOUS LANTERN (LEFT) - Pendulum Swing */}
      <div 
        className="absolute top-8 left-[6%] md:left-[12%] z-30 animate-pendulum origin-top"
        style={{ transformOrigin: 'top center' }}
      >
        <svg width="60" height="135" viewBox="0 0 60 135" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hanging Gold Chain */}
          <line x1="30" y1="0" x2="30" y2="40" stroke="#d4af37" strokeWidth="2.5" strokeDasharray="3 3" />
          
          {/* Fanous Crescent Finial on top */}
          <g transform="translate(30, 38)">
            <path d="M 0,-6 A 5 5 0 1 1 -2 2 A 3.5 3.5 0 1 0 0 -6 Z" fill="#fae5aa" />
          </g>

          {/* Fanous Dome Cap */}
          <path d="M 16,52 Q 30,38 44,52 Z" fill="#f0d17d" stroke="#8c6418" strokeWidth="1" />
          <polygon points="18,52 42,52 38,58 22,58" fill="#d4af37" />

          {/* Arabesque Glass Cage with Arched Windows */}
          <polygon points="18,58 42,58 48,94 12,94" fill="#fef3c7" fillOpacity="0.4" stroke="#d4af37" strokeWidth="2" />
          {/* Arch filigree on glass */}
          <path d="M 22,94 L 22,70 Q 30,62 38,70 L 38,94" stroke="#d4af37" strokeWidth="1.2" fill="none" />

          {/* Glowing Candle / Light Source */}
          <ellipse cx="30" cy="76" rx="6" ry="10" fill="#fff" />
          <ellipse cx="30" cy="76" rx="14" ry="16" fill="#fef08a" fillOpacity="0.5" />
          <ellipse cx="30" cy="76" rx="24" ry="24" fill="#f59e0b" fillOpacity="0.25" />

          {/* Bottom Islamic Pedestal & Crystal Drops */}
          <polygon points="20,94 40,94 30,108" fill="#d4af37" stroke="#8c6418" strokeWidth="1" />
          <circle cx="30" cy="115" r="4" fill="#fae5aa" />
          <circle cx="20" cy="102" r="3" fill="#fae5aa" />
          <circle cx="40" cy="102" r="3" fill="#fae5aa" />
        </svg>
      </div>

      {/* SWAYING ISLAMIC MOROCCAN FANOUS LANTERN (RIGHT) - Pendulum Swing */}
      <div 
        className="absolute top-8 right-[6%] md:right-[12%] z-30 animate-pendulum-delay origin-top"
        style={{ transformOrigin: 'top center' }}
      >
        <svg width="60" height="135" viewBox="0 0 60 135" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="30" y1="0" x2="30" y2="40" stroke="#d4af37" strokeWidth="2.5" strokeDasharray="3 3" />
          
          <g transform="translate(30, 38)">
            <path d="M 0,-6 A 5 5 0 1 1 -2 2 A 3.5 3.5 0 1 0 0 -6 Z" fill="#fae5aa" />
          </g>

          <path d="M 16,52 Q 30,38 44,52 Z" fill="#f0d17d" stroke="#8c6418" strokeWidth="1" />
          <polygon points="18,52 42,52 38,58 22,58" fill="#d4af37" />

          <polygon points="18,58 42,58 48,94 12,94" fill="#fef3c7" fillOpacity="0.4" stroke="#d4af37" strokeWidth="2" />
          <path d="M 22,94 L 22,70 Q 30,62 38,70 L 38,94" stroke="#d4af37" strokeWidth="1.2" fill="none" />

          <ellipse cx="30" cy="76" rx="6" ry="10" fill="#fff" />
          <ellipse cx="30" cy="76" rx="14" ry="16" fill="#fef08a" fillOpacity="0.5" />
          <ellipse cx="30" cy="76" rx="24" ry="24" fill="#f59e0b" fillOpacity="0.25" />

          <polygon points="20,94 40,94 30,108" fill="#d4af37" stroke="#8c6418" strokeWidth="1" />
          <circle cx="30" cy="115" r="4" fill="#fae5aa" />
          <circle cx="20" cy="102" r="3" fill="#fae5aa" />
          <circle cx="40" cy="102" r="3" fill="#fae5aa" />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* 2. SWAYING ROYAL TIERED PARASOLS (Payung Tedung Emas Diraja) */}
      {/* ============================================================== */}
      <div 
        className="absolute bottom-16 -left-3 md:left-4 z-20 w-36 md:w-52 animate-sway-gentle origin-bottom-left"
        style={{ transformOrigin: 'bottom left' }}
      >
        <svg viewBox="0 0 160 300" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="80" y1="40" x2="80" y2="300" stroke="#cda142" strokeWidth="4" />
          <polygon points="80,10 75,40 85,40" fill="#fde68a" />
          <circle cx="80" cy="12" r="5" fill="#f59e0b" />

          {/* Tier 1 */}
          <path d="M 40,75 Q 80,45 120,75 L 115,85 Q 80,65 45,85 Z" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
          {[45, 60, 75, 90, 105, 115].map((px) => (
            <line key={`p1-${px}`} x1={px} y1="85" x2={px} y2="92" stroke="#d97706" strokeWidth="1.5" />
          ))}

          {/* Tier 2 */}
          <path d="M 25,115 Q 80,75 135,115 L 130,128 Q 80,95 30,128 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
          {[32, 50, 68, 86, 104, 122].map((px) => (
            <line key={`p2-${px}`} x1={px} y1="128" x2={px} y2="137" stroke="#d97706" strokeWidth="1.5" />
          ))}

          {/* Tier 3 */}
          <path d="M 10,165 Q 80,115 150,165 L 145,182 Q 80,140 15,182 Z" fill="#fffbeb" stroke="#92400e" strokeWidth="2" />
          {[18, 40, 62, 84, 106, 128, 142].map((px) => (
            <g key={`p3-${px}`}>
              <line x1={px} y1="182" x2={px} y2="194" stroke="#d97706" strokeWidth="2" />
              <circle cx={px} cy="195" r="2.5" fill="#f59e0b" />
            </g>
          ))}
        </svg>
      </div>

      <div 
        className="absolute bottom-16 -right-3 md:right-4 z-20 w-36 md:w-52 animate-sway-gentle origin-bottom-right"
        style={{ transformOrigin: 'bottom right', animationDelay: '1.2s' }}
      >
        <svg viewBox="0 0 160 300" className="w-full h-auto scale-x-[-1]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="80" y1="40" x2="80" y2="300" stroke="#cda142" strokeWidth="4" />
          <polygon points="80,10 75,40 85,40" fill="#fde68a" />
          <circle cx="80" cy="12" r="5" fill="#f59e0b" />

          <path d="M 40,75 Q 80,45 120,75 L 115,85 Q 80,65 45,85 Z" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
          {[45, 60, 75, 90, 105, 115].map((px) => (
            <line key={`p1r-${px}`} x1={px} y1="85" x2={px} y2="92" stroke="#d97706" strokeWidth="1.5" />
          ))}

          <path d="M 25,115 Q 80,75 135,115 L 130,128 Q 80,95 30,128 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
          {[32, 50, 68, 86, 104, 122].map((px) => (
            <line key={`p2r-${px}`} x1={px} y1="128" x2={px} y2="137" stroke="#d97706" strokeWidth="1.5" />
          ))}

          <path d="M 10,165 Q 80,115 150,165 L 145,182 Q 80,140 15,182 Z" fill="#fffbeb" stroke="#92400e" strokeWidth="2" />
          {[18, 40, 62, 84, 106, 128, 142].map((px) => (
            <g key={`p3r-${px}`}>
              <line x1={px} y1="182" x2={px} y2="194" stroke="#d97706" strokeWidth="2" />
              <circle cx={px} cy="195" r="2.5" fill="#f59e0b" />
            </g>
          ))}
        </svg>
      </div>

      {/* ============================================================== */}
      {/* 3. FLUTTERING GOLDEN BUTTERFLIES WITH FLAPPING WINGS */}
      {/* ============================================================== */}
      <div className="absolute top-[22%] left-[14%] md:left-[22%] z-40 animate-butterfly-1 pointer-events-none">
        <div className="animate-wing-flap">
          <svg width="44" height="40" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bfGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="40%" stopColor="#f7d070" />
                <stop offset="100%" stopColor="#c27803" />
              </linearGradient>
            </defs>
            <path d="M 30,22 C 22,6 8,8 6,20 C 4,30 18,34 30,25 Z" fill="url(#bfGrad1)" stroke="#5c3803" strokeWidth="1" />
            <path d="M 30,25 C 20,28 10,38 18,45 C 26,48 30,35 30,25 Z" fill="url(#bfGrad1)" stroke="#5c3803" strokeWidth="1" />
            <path d="M 30,22 C 38,6 52,8 54,20 C 56,30 42,34 30,25 Z" fill="url(#bfGrad1)" stroke="#5c3803" strokeWidth="1" />
            <path d="M 30,25 C 40,28 50,38 42,45 C 34,48 30,35 30,25 Z" fill="url(#bfGrad1)" stroke="#5c3803" strokeWidth="1" />
            <ellipse cx="30" cy="25" rx="2" ry="9" fill="#3a1c02" />
            <path d="M 30,16 Q 24,10 22,8 M 30,16 Q 36,10 38,8" stroke="#3a1c02" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      <div className="absolute top-[36%] right-[12%] md:right-[20%] z-40 animate-butterfly-2 pointer-events-none">
        <div className="animate-wing-flap" style={{ animationDuration: '0.48s' }}>
          <svg width="36" height="32" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bfGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
            <path d="M 30,22 C 22,6 8,8 6,20 C 4,30 18,34 30,25 Z" fill="url(#bfGrad2)" stroke="#451a03" strokeWidth="0.8" />
            <path d="M 30,25 C 20,28 10,38 18,45 C 26,48 30,35 30,25 Z" fill="url(#bfGrad2)" stroke="#451a03" strokeWidth="0.8" />
            <path d="M 30,22 C 38,6 52,8 54,20 C 56,30 42,34 30,25 Z" fill="url(#bfGrad2)" stroke="#451a03" strokeWidth="0.8" />
            <path d="M 30,25 C 40,28 50,38 42,45 C 34,48 30,35 30,25 Z" fill="url(#bfGrad2)" stroke="#451a03" strokeWidth="0.8" />
            <ellipse cx="30" cy="25" rx="1.8" ry="8" fill="#2d1202" />
          </svg>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SWAYING BOTANICAL REEDS / PAMPAS GRASS AT BOTTOM RIVERBANK */}
      {/* ============================================================== */}
      <div className="absolute bottom-0 inset-x-0 h-28 md:h-36 z-25 pointer-events-none flex justify-between items-end px-2 md:px-12">
        <div className="w-1/3 max-w-[240px] animate-sway-reeds origin-bottom">
          <svg viewBox="0 0 200 120" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="reedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e5c07b" />
                <stop offset="40%" stopColor="#82662c" />
                <stop offset="100%" stopColor="#2c1a06" />
              </linearGradient>
            </defs>
            <path d="M 20,120 Q 25,60 10,10 Q 30,55 35,120" fill="url(#reedGrad)" />
            <path d="M 50,120 Q 60,40 40,5 Q 70,45 65,120" fill="url(#reedGrad)" />
            <path d="M 80,120 Q 95,50 85,20 Q 100,55 95,120" fill="url(#reedGrad)" />
            <path d="M 120,120 Q 135,45 140,15 Q 140,60 130,120" fill="url(#reedGrad)" />
            <path d="M 160,120 Q 170,55 180,25 Q 175,65 170,120" fill="url(#reedGrad)" />
            <ellipse cx="10" cy="12" rx="4" ry="14" fill="#fae5aa" opacity="0.85" />
            <ellipse cx="40" cy="8" rx="4.5" ry="16" fill="#fae5aa" opacity="0.85" />
            <ellipse cx="85" cy="22" rx="4" ry="12" fill="#fae5aa" opacity="0.85" />
            <ellipse cx="140" cy="18" rx="4" ry="15" fill="#fae5aa" opacity="0.85" />
            <ellipse cx="180" cy="27" rx="3.5" ry="12" fill="#fae5aa" opacity="0.85" />
          </svg>
        </div>

        <div className="w-1/3 max-w-[200px] animate-sway-reeds origin-bottom" style={{ animationDelay: '0.8s' }}>
          <svg viewBox="0 0 160 100" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 30,100 Q 40,40 25,10 Q 45,45 40,100" fill="url(#reedGrad)" />
            <path d="M 70,100 Q 80,30 90,5 Q 90,45 80,100" fill="url(#reedGrad)" />
            <path d="M 110,100 Q 125,45 135,20 Q 125,55 120,100" fill="url(#reedGrad)" />
            <ellipse cx="25" cy="12" rx="3.5" ry="12" fill="#fae5aa" opacity="0.8" />
            <ellipse cx="90" cy="8" rx="4" ry="14" fill="#fae5aa" opacity="0.8" />
            <ellipse cx="135" cy="22" rx="3.5" ry="11" fill="#fae5aa" opacity="0.8" />
          </svg>
        </div>

        <div className="w-1/3 max-w-[240px] animate-sway-reeds origin-bottom" style={{ animationDelay: '1.5s' }}>
          <svg viewBox="0 0 200 120" className="w-full h-auto scale-x-[-1]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20,120 Q 25,60 10,10 Q 30,55 35,120" fill="url(#reedGrad)" />
            <path d="M 50,120 Q 60,40 40,5 Q 70,45 65,120" fill="url(#reedGrad)" />
            <path d="M 80,120 Q 95,50 85,20 Q 100,55 95,120" fill="url(#reedGrad)" />
            <path d="M 120,120 Q 135,45 140,15 Q 140,60 130,120" fill="url(#reedGrad)" />
            <path d="M 160,120 Q 170,55 180,25 Q 175,65 170,120" fill="url(#reedGrad)" />
            <ellipse cx="10" cy="12" rx="4" ry="14" fill="#fae5aa" opacity="0.85" />
            <ellipse cx="40" cy="8" rx="4.5" ry="16" fill="#fae5aa" opacity="0.85" />
            <ellipse cx="85" cy="22" rx="4" ry="12" fill="#fae5aa" opacity="0.85" />
          </svg>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. LUXURIOUS VINTAGE FLORAL BOUQUET BORDER (BOTTOM CORNERS) */}
      {/* ============================================================== */}
      <div 
        className="absolute -bottom-4 -left-6 md:left-0 z-30 w-52 md:w-80 animate-sway-gentle origin-bottom-left"
        style={{ transformOrigin: 'bottom left' }}
      >
        <svg viewBox="0 0 300 240" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="rosePink" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fae8eb" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="85%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#500724" />
            </radialGradient>
            <radialGradient id="goldFlora" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <radialGradient id="peachFlower" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff1f2" />
              <stop offset="50%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
          </defs>

          <g opacity="0.9">
            <path d="M 60,180 Q 20,120 40,70 Q 70,120 60,180 Z" fill="#4d5320" stroke="#cda142" strokeWidth="1" />
            <path d="M 90,200 Q 120,140 100,80 Q 80,140 90,200 Z" fill="#364018" stroke="#cda142" strokeWidth="1" />
            <path d="M 120,210 Q 180,160 170,100 Q 140,160 120,210 Z" fill="#586526" stroke="#cda142" strokeWidth="1" />
          </g>

          <path d="M 10,220 Q 80,180 140,110" stroke="#d4af37" strokeWidth="3" fill="none" strokeDasharray="6 3" />

          <g transform="translate(65, 120)">
            <circle cx="40" cy="40" r="38" fill="url(#rosePink)" />
            <path d="M 40,10 C 60,10 70,30 65,45 C 60,60 40,65 30,55 C 20,45 25,25 40,10 Z" fill="#fbcfe8" opacity="0.8" />
            <circle cx="40" cy="40" r="14" fill="#be185d" />
            <circle cx="40" cy="40" r="8" fill="#fde047" />
          </g>

          <g transform="translate(140, 140)">
            <circle cx="35" cy="35" r="32" fill="url(#goldFlora)" />
            <circle cx="35" cy="35" r="18" fill="#fef08a" opacity="0.9" />
            <circle cx="35" cy="35" r="8" fill="#78350f" />
          </g>

          <g transform="translate(10, 150)">
            <circle cx="30" cy="30" r="28" fill="url(#peachFlower)" />
            <circle cx="30" cy="30" r="14" fill="#fda4af" opacity="0.85" />
          </g>
        </svg>
      </div>

      <div 
        className="absolute -bottom-4 -right-6 md:right-0 z-30 w-52 md:w-80 animate-sway-gentle origin-bottom-right"
        style={{ transformOrigin: 'bottom right', animationDelay: '0.9s' }}
      >
        <svg viewBox="0 0 300 240" className="w-full h-auto scale-x-[-1]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.9">
            <path d="M 60,180 Q 20,120 40,70 Q 70,120 60,180 Z" fill="#4d5320" stroke="#cda142" strokeWidth="1" />
            <path d="M 90,200 Q 120,140 100,80 Q 80,140 90,200 Z" fill="#364018" stroke="#cda142" strokeWidth="1" />
            <path d="M 120,210 Q 180,160 170,100 Q 140,160 120,210 Z" fill="#586526" stroke="#cda142" strokeWidth="1" />
          </g>

          <path d="M 10,220 Q 80,180 140,110" stroke="#d4af37" strokeWidth="3" fill="none" strokeDasharray="6 3" />

          <g transform="translate(65, 120)">
            <circle cx="40" cy="40" r="38" fill="url(#rosePink)" />
            <path d="M 40,10 C 60,10 70,30 65,45 C 60,60 40,65 30,55 C 20,45 25,25 40,10 Z" fill="#fbcfe8" opacity="0.8" />
            <circle cx="40" cy="40" r="14" fill="#be185d" />
            <circle cx="40" cy="40" r="8" fill="#fde047" />
          </g>

          <g transform="translate(140, 140)">
            <circle cx="35" cy="35" r="32" fill="url(#goldFlora)" />
            <circle cx="35" cy="35" r="18" fill="#fef08a" opacity="0.9" />
            <circle cx="35" cy="35" r="8" fill="#78350f" />
          </g>

          <g transform="translate(10, 150)">
            <circle cx="30" cy="30" r="28" fill="url(#peachFlower)" />
            <circle cx="30" cy="30" r="14" fill="#fda4af" opacity="0.85" />
          </g>
        </svg>
      </div>
    </div>
  );
}
