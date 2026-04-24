'use client';

import { Navigation } from 'lucide-react';

const HOTEL_LAT = 5.5731851;
const HOTEL_LNG = 5.8000128;
const HOTEL_ADDRESS = 'No+2+Ayoro+lane+Enerhen+road+Uvwie+Warri+Delta+State+Nigeria';
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${HOTEL_LAT},${HOTEL_LNG}`;

export default function CommuteMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const embedSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${HOTEL_LAT},${HOTEL_LNG}&zoom=15`
    : `https://maps.google.com/maps?q=${HOTEL_LAT},${HOTEL_LNG}&z=15&output=embed`;

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-lg">
      <iframe
        title="Godatin Hotel Location"
        src={embedSrc}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '420px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full"
      />
      {/* Directions overlay button */}
      <a
        href={MAPS_DIRECTIONS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg hover:bg-gold-50 hover:text-gold-700 transition-colors duration-200 z-10"
      >
        <Navigation className="w-4 h-4" />
        Get Directions
      </a>
    </div>
  );
}
