'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Waves, UtensilsCrossed, Car, Wifi, Coffee, Shield } from 'lucide-react';

const amenities = [
  {
    icon: Waves,
    title: 'Swimming Pool',
    description: 'Relax in our pristine outdoor swimming pool',
    image: '/images/Pool.jpeg'
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurant & Bar',
    description: 'Fine dining experience with local and international cuisine',
    image: '/images/Out door Bar.jpeg'
  },
  {
    icon: Car,
    title: 'Free Parking',
    description: 'Complimentary parking for all our guests',
    image: '/images/Walkway.jpeg'
  },
  {
    icon: Wifi,
    title: 'Free WiFi',
    description: 'High-speed internet throughout the hotel',
    image: '/images/Walkway2.jpeg'
  },
  {
    icon: Coffee,
    title: 'Room Service',
    description: '24/7 room service for your convenience',
    image: '/images/Entrance.jpeg'
  },
  {
    icon: Shield,
    title: 'Security',
    description: '24/7 security and CCTV surveillance',
    image: '/images/hotel-exterior.jpeg'
  }
];

export default function Amenities() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-navy-900 mb-6">
            Hotel <span className="text-gradient">Amenities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the exceptional facilities and services that make your stay 
            at Godatin Hotel truly memorable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl shadow-lg card-hover"
            >
              <div className="relative h-64">
                <Image
                  src={amenity.image}
                  alt={amenity.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center">
                    <amenity.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{amenity.title}</h3>
                <p className="text-gray-200">{amenity.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
