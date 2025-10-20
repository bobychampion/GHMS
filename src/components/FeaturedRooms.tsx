'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { roomTypes } from '@/data/rooms';
import { formatCurrency } from '@/utils/helpers';
import { Users, Wifi, Coffee } from 'lucide-react';

export default function FeaturedRooms() {
  const featuredRooms = roomTypes.slice(0, 3);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-navy-900 mb-6">
            Our <span className="text-gradient">Luxury Rooms</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully curated selection of rooms, each designed 
            to provide the ultimate comfort and luxury experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room, index) => (
            <motion.div
              key={room.roomType}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
            >
              <div className="relative h-64">
                <Image
                  src={room.photos[0]}
                  alt={room.roomType}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-gold-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {formatCurrency(room.price)}/night
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-navy-900 mb-2 font-serif">
                  {room.roomType}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {room.description}
                </p>
                
                {/* Room Features */}
                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{room.maxOccupancy} guests</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wifi className="w-4 h-4" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Coffee className="w-4 h-4" />
                    <span>Room Service</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Link 
                    href={`/rooms#${room.roomType.toLowerCase().replace(' ', '-')}`}
                    className="text-gold-600 hover:text-gold-700 font-semibold transition-colors"
                  >
                    View Details
                  </Link>
                  <Link 
                    href={`/booking?room=${room.roomType}`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/rooms" className="btn-secondary text-lg px-8 py-4">
            View All Rooms
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

