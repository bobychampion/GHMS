'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Star, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/Hotel Exterior.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 text-shadow-lg">
            Welcome to{' '}
            <span className="text-gradient">Godatin Hotel</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto">
            Experience luxury and comfort in the heart of Warri, Delta State. 
            Your perfect getaway awaits.
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
              <Star className="w-5 h-5 text-gold-400" />
              <span className="font-medium">5-Star Service</span>
            </div>
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPin className="w-5 h-5 text-gold-400" />
              <span className="font-medium">Prime Location</span>
            </div>
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
              <Calendar className="w-5 h-5 text-gold-400" />
              <span className="font-medium">24/7 Available</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn-primary text-lg px-8 py-4">
              Book Your Stay
            </Link>
            <Link href="/rooms" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-navy-900">
              View Rooms
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
}





