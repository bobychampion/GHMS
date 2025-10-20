'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

export default function RoomFilter() {
  const [priceRange, setPriceRange] = useState([15000, 50000]);
  const [maxOccupancy, setMaxOccupancy] = useState(0);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleOccupancyChange = (value: number) => {
    setMaxOccupancy(value);
  };

  const clearFilters = () => {
    setPriceRange([15000, 50000]);
    setMaxOccupancy(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-gold-600" />
        <h3 className="text-xl font-semibold text-navy-900">Filter Rooms</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Range (₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()})
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="15000"
              max="50000"
              step="5000"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="15000"
              max="50000"
              step="5000"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₦15,000</span>
            <span>₦50,000</span>
          </div>
        </div>

        {/* Max Occupancy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Maximum Occupancy
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4, 5, 6].map((occupancy) => (
              <button
                key={occupancy}
                onClick={() => handleOccupancyChange(occupancy === maxOccupancy ? 0 : occupancy)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  maxOccupancy === occupancy
                    ? 'bg-gold-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {occupancy}+
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={clearFilters}
          className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          Clear Filters
        </button>
        <div className="text-sm text-gray-600">
          Showing rooms within your criteria
        </div>
      </div>
    </motion.div>
  );
}
