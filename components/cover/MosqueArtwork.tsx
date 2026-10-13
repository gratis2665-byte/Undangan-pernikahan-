'use client';

import React from 'react';

export function MosqueArtwork() {
  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Sky Background with Deep Burgundy / Crimson Wine Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 32%, #580d1e 0%, #3a0715 45%, #180207 100%)',
        }}
      />

      {/* Royal Islamic 8-Point Geometric Arabesque Star Pattern in Burgundy Sky */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="islamic-arabesque" width="100" height="100" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#d4af37" strokeWidth="1.2" opacity="0.75" transform="translate(10, 10)">
              <polygon points="40,20 46,34 60,40 46,46 40,60 34,46 20,40 34,34" fill="#d4af37" fillOpacity="0.2" />
              <rect x="26" y="26" width="28" height="28" />
              <rect x="26" y="26" width="28" height="28" transform="rotate(45 40 40)" />
              <circle cx="0" cy="0" r="14" />
              <circle cx="80" cy="0" r="14" />
              <circle cx="0" cy="80" r="14" />
              <circle cx="80" cy="80" r="14" />
              <circle cx="40" cy="40" r="4" fill="#fae5aa" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-arabesque)" />
      </svg>

      {/* Lightweight CSS Sparkles / Stardust (Using pure CSS for 60fps smoothness) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { l: '12%', t: '20%', d: '0s', s: 3 },
          { l: '28%', t: '35%', d: '1.2s', s: 4 },
          { l: '45%', t: '18%', d: '2.1s', s: 3 },
          { l: '62%', t: '25%', d: '0.8s', s: 4 },
          { l: '78%', t: '32%', d: '1.7s', s: 3 },
          { l: '88%', t: '15%', d: '2.5s', s: 4 },
          { l: '35%', t: '48%', d: '3.0s', s: 3 },
          { l: '70%', t: '44%', d: '1.5s', s: 3 },
        ].map((pt, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#fce79f] animate-soft-sparkle pointer-events-none"
            style={{
              left: pt.l,
              top: pt.t,
              width: `${pt.s}px`,
              height: `${pt.s}px`,
              boxShadow: '0 0 8px #fae5aa',
              animationDelay: pt.d,
            }}
          />
        ))}
      </div>

      {/* Architectural Illustration of the Grand Islamic Mosque & River */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <svg
          viewBox="0 0 900 1200"
          className="w-full h-full object-cover object-bottom"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mosqueDomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8c5867" />
              <stop offset="45%" stopColor="#4a1525" />
              <stop offset="100%" stopColor="#2c0914" />
            </linearGradient>

            <linearGradient id="facadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7a3447" />
              <stop offset="60%" stopColor="#481424" />
              <stop offset="100%" stopColor="#25050e" />
            </linearGradient>

            <linearGradient id="goldHilight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fae5aa" />
              <stop offset="50%" stopColor="#cda142" />
              <stop offset="100%" stopColor="#7a4f10" />
            </linearGradient>

            <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="80%" stopColor="#e5a93b" />
              <stop offset="100%" stopColor="#6e2d09" />
            </linearGradient>

            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#20040b" />
              <stop offset="40%" stopColor="#3d0917" />
              <stop offset="80%" stopColor="#27050e" />
              <stop offset="100%" stopColor="#150207" />
            </linearGradient>

            <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#632637" />
              <stop offset="100%" stopColor="#290710" />
            </linearGradient>

            <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fae5aa" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#cda142" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#cda142" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Distant Hills / Garden Palm Silhouette */}
          <path
            d="M 0,720 Q 220,680 450,710 T 900,690 L 900,780 L 0,780 Z"
            fill="#1e040a"
            opacity="0.8"
          />

          {/* ============================================================== */}
          {/* GRAND ISLAMIC MOSQUE (MASJID AGUNG DENGAN KUBAH & MENARA HILAL) */}
          {/* ============================================================== */}
          <g transform="translate(150, 230)">
            {/* Ambient Mosque Soft Aura Glow (Using lightweight radialGradient instead of CPU feGaussianBlur) */}
            <circle cx="300" cy="280" r="280" fill="url(#auraGlow)" />

            {/* Central Mosque Main Hall Facade */}
            <rect x="170" y="380" width="260" height="150" fill="url(#facadeGrad)" />

            {/* Islamic Arched Colonnades / Iwan Gateway */}
            {[195, 230, 265, 300, 335, 370, 405].map((cx, i) => (
              <g key={`arch-${i}`}>
                {/* Islamic Horseshoe Arch */}
                <path
                  d={`M ${cx - 12},530 L ${cx - 12},450 Q ${cx - 15},430 ${cx},415 Q ${cx + 15},430 ${cx + 12},450 L ${cx + 12},530 Z`}
                  fill="url(#windowGlow)"
                  opacity="0.9"
                />
                <rect x={cx - 15} y="440" width="4" height="90" fill="#914558" />
                <rect x={cx - 16} y="410" width="6" height="6" fill="url(#goldHilight)" />
              </g>
            ))}

            {/* Main Central Grand Iwan Arch / Mihrab Portal */}
            <path
              d="M 255,530 L 255,440 Q 250,400 300,370 Q 350,400 345,440 L 345,530 Z"
              fill="#22040b"
              stroke="#cda142"
              strokeWidth="2.5"
            />
            {/* Inner Portal Light */}
            <path
              d="M 268,530 L 268,455 Q 265,420 300,395 Q 335,420 332,455 L 332,530 Z"
              fill="url(#windowGlow)"
              opacity="0.95"
            />
            <circle cx="300" cy="385" r="7" fill="#fae5aa" />
            <path d="M 285,410 Q 300,400 315,410" stroke="#cda142" strokeWidth="2" fill="none" />

            {/* Facade Cornice / Crenellations (Merlon Gigi Balang) */}
            <rect x="160" y="375" width="280" height="8" rx="2" fill="url(#goldHilight)" />
            {[...Array(19)].map((_, i) => (
              <polygon
                key={`cren-${i}`}
                points={`${165 + i * 14},375 ${170 + i * 14},365 ${175 + i * 14},375`}
                fill="#fae5aa"
              />
            ))}

            {/* ================= CENTRAL GRAND DOME (KUBAH UTAMA MASJID) ================= */}
            {/* Drum base of dome with arched windows */}
            <rect x="210" y="240" width="180" height="75" rx="4" fill="url(#facadeGrad)" stroke="#823245" strokeWidth="2" />
            {[230, 255, 280, 300, 320, 345, 370].map((wx, i) => (
              <g key={`drum-win-${i}`}>
                <path
                  d={`M ${wx - 6},295 L ${wx - 6},260 Q ${wx},248 ${wx + 6},260 L ${wx + 6},295 Z`}
                  fill="url(#windowGlow)"
                  opacity="0.95"
                />
              </g>
            ))}

            <rect x="200" y="235" width="200" height="7" rx="2" fill="url(#goldHilight)" />

            {/* Grand Pointed Islamic Onion Dome (Kubah Masjid) */}
            <path
              d="M 210,235 C 190,170 240,110 300,80 C 360,110 410,170 390,235 Z"
              fill="url(#mosqueDomeGrad)"
              stroke="#cda142"
              strokeWidth="2.8"
            />

            {/* Arabesque Gold Filigree Ribs on Dome */}
            <path d="M 300,82 L 300,235" stroke="#e5c07b" strokeWidth="2.5" opacity="0.9" />
            <path d="M 300,82 Q 255,145 240,235" stroke="#e5c07b" strokeWidth="1.8" opacity="0.75" />
            <path d="M 300,82 Q 345,145 360,235" stroke="#e5c07b" strokeWidth="1.8" opacity="0.75" />
            <path d="M 300,82 Q 225,160 220,235" stroke="#e5c07b" strokeWidth="1.4" opacity="0.6" />
            <path d="M 300,82 Q 375,160 380,235" stroke="#e5c07b" strokeWidth="1.4" opacity="0.6" />

            {/* Dome Spire with Crescent Moon (Hilal Bulan Sabit Emas) */}
            <line x1="300" y1="80" x2="300" y2="35" stroke="#fae5aa" strokeWidth="3" />
            <circle cx="300" cy="55" r="5" fill="#fde68a" />
            <circle cx="300" cy="42" r="3.5" fill="#fde68a" />
            
            {/* Islamic Crescent Moon (Hilal) atop main dome */}
            <g transform="translate(300, 30)">
              <circle cx="0" cy="0" r="14" fill="#fae5aa" />
              <circle cx="4" cy="-3" r="12" fill="#580d1e" />
              <polygon points="4,-2 5,1 8,1.5 5.5,3.5 6.5,6.5 4,4.5 1.5,6.5 2.5,3.5 0,1.5 3,1" fill="#fff" />
            </g>

            {/* ================= LEFT MINARET (MENARA KIRI) ================= */}
            <g transform="translate(60, 110)">
              {/* Tall slender minaret shaft */}
              <rect x="25" y="100" width="35" height="320" fill="url(#facadeGrad)" />
              {/* Lower Balcony / Muezzin Gallery */}
              <rect x="20" y="240" width="45" height="10" fill="url(#goldHilight)" />
              <polygon points="20,250 65,250 55,270 30,270" fill="#46101e" />
              {/* Upper Balcony */}
              <rect x="20" y="140" width="45" height="8" fill="url(#goldHilight)" />
              <polygon points="20,148 65,148 55,162 30,162" fill="#46101e" />

              {/* Minaret Lantern with warm glow */}
              <rect x="27" y="100" width="31" height="40" fill="#20040b" />
              <path d="M 35,135 L 35,115 Q 42,108 50,115 L 50,135 Z" fill="url(#windowGlow)" />

              {/* Minaret Pointed Cupola */}
              <path d="M 23,100 Q 42,40 62,100 Z" fill="url(#mosqueDomeGrad)" stroke="#cda142" strokeWidth="1.5" />
              {/* Minaret Finial with Crescent Moon */}
              <line x1="42" y1="40" x2="42" y2="15" stroke="#fae5aa" strokeWidth="2" />
              <circle cx="42" cy="28" r="2.5" fill="#fae5aa" />
              <g transform="translate(42, 12)">
                <circle cx="0" cy="0" r="7" fill="#fae5aa" />
                <circle cx="2" cy="-1.5" r="6" fill="#580d1e" />
              </g>
            </g>

            {/* ================= RIGHT MINARET (MENARA KANAN) ================= */}
            <g transform="translate(480, 110)">
              <rect x="25" y="100" width="35" height="320" fill="url(#facadeGrad)" />
              <rect x="20" y="240" width="45" height="10" fill="url(#goldHilight)" />
              <polygon points="20,250 65,250 55,270 30,270" fill="#46101e" />
              <rect x="20" y="140" width="45" height="8" fill="url(#goldHilight)" />
              <polygon points="20,148 65,148 55,162 30,162" fill="#46101e" />

              <rect x="27" y="100" width="31" height="40" fill="#20040b" />
              <path d="M 35,135 L 35,115 Q 42,108 50,115 L 50,135 Z" fill="url(#windowGlow)" />

              <path d="M 23,100 Q 42,40 62,100 Z" fill="url(#mosqueDomeGrad)" stroke="#cda142" strokeWidth="1.5" />
              <line x1="42" y1="40" x2="42" y2="15" stroke="#fae5aa" strokeWidth="2" />
              <circle cx="42" cy="28" r="2.5" fill="#fae5aa" />
              <g transform="translate(42, 12)">
                <circle cx="0" cy="0" r="7" fill="#fae5aa" />
                <circle cx="2" cy="-1.5" r="6" fill="#580d1e" />
              </g>
            </g>

            {/* Flanking Side Domes (Kubah Sayap Kiri & Kanan) */}
            <path d="M 150,380 C 135,320 185,270 215,380 Z" fill="url(#mosqueDomeGrad)" stroke="#cda142" strokeWidth="1.5" />
            <line x1="182" y1="280" x2="182" y2="255" stroke="#fae5aa" strokeWidth="1.5" />
            <circle cx="182" cy="252" r="2" fill="#fae5aa" />

            <path d="M 385,380 C 415,270 465,320 450,380 Z" fill="url(#mosqueDomeGrad)" stroke="#cda142" strokeWidth="1.5" />
            <line x1="418" y1="280" x2="418" y2="255" stroke="#fae5aa" strokeWidth="1.5" />
            <circle cx="418" cy="252" r="2" fill="#fae5aa" />
          </g>

          {/* Riverbank Promenade Wall */}
          <rect x="0" y="760" width="900" height="35" fill="#3d121f" stroke="#8c2f48" strokeWidth="1" />
          {[...Array(30)].map((_, idx) => (
            <rect key={`bal-${idx}`} x={idx * 30 + 10} y="750" width="6" height="12" fill="#cda142" opacity="0.75" />
          ))}
          <line x1="0" y1="750" x2="900" y2="750" stroke="#cda142" strokeWidth="2" />

          {/* ============================================================== */}
          {/* STONE ARCH BRIDGE ACROSS THE REFLECTING WATER */}
          {/* ============================================================== */}
          <g id="bridge">
            <path
              d="M 0,780 Q 450,760 900,780 L 900,850 L 0,850 Z"
              fill="url(#bridgeGrad)"
            />
            {/* Islamic Horseshoe Bridge Arches */}
            <path
              d="M 80,850 C 80,795 240,795 240,850 Z"
              fill="#140207"
            />
            <path
              d="M 370,850 C 370,790 530,790 530,850 Z"
              fill="#140207"
            />
            <path
              d="M 660,850 C 660,795 820,795 820,850 Z"
              fill="#140207"
            />

            <rect x="235" y="795" width="25" height="55" fill="#541a29" />
            <rect x="525" y="795" width="25" height="55" fill="#541a29" />
            <circle cx="160" cy="815" r="4" fill="#cda142" />
            <circle cx="450" cy="808" r="4" fill="#cda142" />
            <circle cx="740" cy="815" r="4" fill="#cda142" />

            {/* Vintage Moroccan Fanous Lanterns along Bridge */}
            {[100, 300, 450, 600, 800].map((lx, i) => (
              <g key={`lamp-${i}`} transform={`translate(${lx}, 755)`}>
                <line x1="0" y1="20" x2="0" y2="0" stroke="#25050e" strokeWidth="3" />
                <polygon points="-5,0 5,0 3,-10 -3,-10" fill="#cda142" />
                <circle cx="0" cy="-5" r="5" fill="#fff3b0" />
              </g>
            ))}
          </g>

          {/* ============================================================== */}
          {/* REFLECTING WATER WITH SHIMMERING MOSQUE LIGHTS */}
          {/* ============================================================== */}
          <rect x="0" y="850" width="900" height="350" fill="url(#riverGrad)" />

          {/* Golden Light Reflections Shimmering on Water */}
          <g opacity="0.65">
            <ellipse cx="450" cy="890" rx="90" ry="6" fill="#fae5aa" opacity="0.7" />
            <ellipse cx="450" cy="930" rx="130" ry="5" fill="#cda142" opacity="0.5" />
            <ellipse cx="450" cy="980" rx="180" ry="7" fill="#8c2f48" opacity="0.4" />
            <ellipse cx="200" cy="910" rx="60" ry="4" fill="#fae5aa" opacity="0.5" />
            <ellipse cx="700" cy="910" rx="60" ry="4" fill="#fae5aa" opacity="0.5" />
            <ellipse cx="450" cy="1040" rx="220" ry="8" fill="#e5a93b" opacity="0.25" />
          </g>
        </svg>
      </div>

      {/* Subtle Vignette Gradient overlay around the screen edges */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(20, 2, 7, 0.75) 100%)',
        }}
      />
    </div>
  );
}
