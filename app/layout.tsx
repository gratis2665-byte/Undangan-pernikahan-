import type {Metadata} from 'next';
import {Cinzel, Playfair_Display, Plus_Jakarta_Sans, Great_Vibes} from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Royal Islamic Wedding of Satria & Nadia',
  description: 'Undangan Pernikahan Islami Satria Pratama & Nadia Angela. Walimatul Ursy di Masjid Agung.',
  openGraph: {
    title: 'The Royal Islamic Wedding of Satria & Nadia',
    description: 'Undangan Pernikahan Islami Satria Pratama & Nadia Angela di Masjid Agung.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Royal Islamic Wedding of Satria & Nadia',
    description: 'Undangan Pernikahan Islami Satria Pratama & Nadia Angela di Masjid Agung.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="id"
      className={`${cinzel.variable} ${playfair.variable} ${plusJakarta.variable} ${greatVibes.variable}`}
    >
      <body suppressHydrationWarning className="bg-[#1f030a] text-stone-100 antialiased selection:bg-[#c59b27]/30 selection:text-[#f8e7b9]">
        {children}
      </body>
    </html>
  );
}
