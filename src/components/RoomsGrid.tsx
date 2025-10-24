'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { roomTypes } from '@/data/rooms';
import { formatCurrency } from '@/utils/helpers';
import { Users, Wifi, Coffee, Car, Shield, UtensilsCrossed } from 'lucide-react';

const amenityIcons = {
  'Free WiFi': Wifi,
  'Room Service': Coffee,
  'Free Parking': Car,
  'Security': Shield,
  'Restaurant': UtensilsCrossed,
};

export default function RoomsGrid() {
  const [filteredRooms, setFilteredRooms] = useState(roomTypes);

  const handleFilter = (filters: any) => {
    let filtered = roomTypes;

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(room => room.price >= min && room.price <= max);
    }

    if (filters.maxOccupancy) {
      filtered = filtered.filter(room => room.maxOccupancy >= filters.maxOccupancy);
    }

    setFilteredRooms(filtered);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {filteredRooms.map((room, index) => (
        <motion.div
          key={room.roomType}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Images */}
            <div className="relative h-64 md:h-full">
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

            {/* Content */}
            <div className="p-8">
              <h3 className="text-3xl font-bold text-navy-900 mb-3 font-serif">
                {room.roomType}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {room.description}
              </p>

              {/* Room Features */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{room.maxOccupancy} guests</span>
                  </div>
                  <div className="text-gold-600 font-semibold">
                    {formatCurrency(room.price)} per night
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {room.amenities.slice(0, 4).map((amenity) => {
                    const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                    return (
                      <div key={amenity} className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full text-xs">
                        {IconComponent && <IconComponent className="w-3 h-3 text-gold-600" />}
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                  {room.amenities.length > 4 && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      +{room.amenities.length - 4} more
                    </div>
                  )}
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
                  className="btn-primary"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}





