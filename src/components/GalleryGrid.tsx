'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const galleryImages = [
  {
    src: '/images/Hotel Exterior.jpeg',
    alt: 'Hotel Exterior',
    category: 'Exterior',
    title: 'Beautiful Hotel Exterior'
  },
  {
    src: '/images/Alcove.jpeg',
    alt: 'Alcove Room',
    category: 'Rooms',
    title: 'Cozy Alcove Room'
  },
  {
    src: '/images/Deluxe.jpeg',
    alt: 'Deluxe Room',
    category: 'Rooms',
    title: 'Spacious Deluxe Room'
  },
  {
    src: '/images/Special Deluxe.jpeg',
    alt: 'Special Deluxe Room',
    category: 'Rooms',
    title: 'Luxurious Special Deluxe'
  },
  {
    src: '/images/Executive suite.jpeg',
    alt: 'Executive Suite',
    category: 'Suites',
    title: 'Executive Suite'
  },
  {
    src: '/images/Diplomatic suite.jpeg',
    alt: 'Diplomatic Suite',
    category: 'Suites',
    title: 'Diplomatic Suite'
  },
  {
    src: '/images/Pool.jpeg',
    alt: 'Swimming Pool',
    category: 'Amenities',
    title: 'Crystal Clear Pool'
  },
  {
    src: '/images/Out door Bar.jpeg',
    alt: 'Outdoor Bar',
    category: 'Amenities',
    title: 'Outdoor Bar & Lounge'
  },
  {
    src: '/images/Walkway.jpeg',
    alt: 'Hotel Walkway',
    category: 'Exterior',
    title: 'Elegant Walkway'
  },
  {
    src: '/images/Walkway2.jpeg',
    alt: 'Garden Walkway',
    category: 'Exterior',
    title: 'Garden Walkway'
  },
  {
    src: '/images/Entrance.jpeg',
    alt: 'Hotel Entrance',
    category: 'Exterior',
    title: 'Grand Entrance'
  },
  {
    src: '/images/hotel-exterior.jpeg',
    alt: 'Hotel Building',
    category: 'Exterior',
    title: 'Modern Hotel Building'
  }
];

const categories = ['All', 'Exterior', 'Rooms', 'Suites', 'Amenities'];

export default function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <>
      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gold-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.src}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer card-hover"
            onClick={() => setSelectedImage(image.src)}
          >
            <div className="relative h-64">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-semibold">{image.title}</h3>
                <p className="text-sm text-gray-200">{image.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold z-10"
            >
              ×
            </button>
            <Image
              src={selectedImage}
              alt="Gallery Image"
              width={800}
              height={600}
              className="object-contain max-h-[80vh] rounded-lg"
            />
          </div>
        </motion.div>
      )}
    </>
  );
}



