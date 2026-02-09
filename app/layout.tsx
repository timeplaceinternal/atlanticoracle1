
// Added React import to satisfy TypeScript namespace requirement for React.ReactNode
import React from 'react';
import type { Metadata } from 'next'
import { Cinzel, Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atlantic Oracle | Ancient Wisdom for the Modern Soul',
  description: 'Premium astrology and numerology services for the modern soul. Discover your path through professional soul horoscopes and celestial guidance.',
  keywords: 'astrology Europe, soul horoscope, numerology, career forecast, union harmony, spiritual guidance Atlantic Oracle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} ${playfair.variable}`}>
      <body className="bg-cosmic-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
