'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Star, MapPin } from 'lucide-react';
import Image from 'next/image';

// 4-col × 3-row = 12 cells. Spans must add up exactly.
const bentoImages = [
  // Row 1-2 left anchor (2×2)
  { src: '/images/Hotel Exterior1.jpeg',      alt: 'Hotel Exterior',   className: 'col-span-2 row-span-2' },
  // Top-right two cells (1×1 each)
  { src: '/images/Hotel Exterior (2).jpeg',   alt: 'Hotel Exterior 2', className: 'col-span-1 row-span-1' },
  { src: '/images/Hotel Exterior (3).jpeg',   alt: 'Hotel Exterior 3', className: 'col-span-1 row-span-1' },
  // Mid-right two cells (1×1 each)
  { src: '/images/Pool.jpeg',                 alt: 'Pool',             className: 'col-span-1 row-span-1' },
  { src: '/images/Out door Bar.jpeg',         alt: 'Outdoor Bar',      className: 'col-span-1 row-span-1' },
  // Bottom row — 4 cells (1×1 each)
  { src: '/images/Entrance.jpeg',             alt: 'Entrance',         className: 'col-span-1 row-span-1' },
  { src: '/images/Walkway.jpeg',              alt: 'Walkway',          className: 'col-span-1 row-span-1' },
  { src: '/images/Executive suite.jpeg',      alt: 'Executive Suite',  className: 'col-span-1 row-span-1' },
  { src: '/images/Deluxe Room.jpeg',          alt: 'Deluxe Room',      className: 'col-span-1 row-span-1' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-950">
      {/* Bento Grid Background */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-1 opacity-60" style={{ gridAutoRows: '1fr' }}>
        {bentoImages.map((img, i) => (
          <motion.div
            key={i}
            className={`relative overflow-hidden ${img.className}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: i * 0.15 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="h-px w-10 bg-gold-400" />
            <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">Warri, Delta State</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 text-white leading-tight">
            Welcome to{' '}
            <span className="text-gradient">Godatin Hotel</span>
          </h1>

          <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-xl">
            Experience luxury and comfort in the heart of Warri. Your perfect getaway awaits.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { icon: <Star className="w-4 h-4 text-gold-400" />, label: '5-Star Service' },
              { icon: <MapPin className="w-4 h-4 text-gold-400" />, label: 'Prime Location' },
              { icon: <Calendar className="w-4 h-4 text-gold-400" />, label: '24/7 Available' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                {icon}
                <span className="text-white text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/booking" className="btn-primary text-lg px-8 py-4 text-center">
              Book Your Stay
            </Link>
            <Link href="/rooms" className="btn-outline text-lg px-8 py-4 text-center border-white text-white hover:bg-white hover:text-navy-900">
              View Rooms
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bento grid preview strip — bottom right */}
      <motion.div
        className="absolute bottom-6 right-6 hidden lg:grid grid-cols-3 gap-1.5 w-64"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {['/images/Special Deluxe.jpeg', '/images/Diplomatic suite.jpeg', '/images/Alcove.jpeg',
          '/images/Walkway2.jpeg', '/images/Deluxe.jpeg', '/images/WhatsApp Image 2026-04-24 at 1.54.39 PM (2).jpeg'].map((src, i) => (
          <div key={i} className="relative h-16 rounded-lg overflow-hidden border border-white/20">
            <Image src={src} alt="Hotel" fill className="object-cover" sizes="80px" />
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}
