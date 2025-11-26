import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-royal-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <h3 className="text-xl font-bold font-serif">Godatin Hotel</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Experience luxury and comfort in the heart of Warri, Delta State. 
              Your perfect getaway awaits.
            </p>
            <div className="flex space-x-4">
              <a href="https://web.facebook.com/godatinhotel/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/godatinhotel/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-gold-400 transition-colors">Home</Link></li>
              <li><Link href="/rooms" className="text-gray-300 hover:text-gold-400 transition-colors">Rooms</Link></li>
              <li><Link href="/gallery" className="text-gray-300 hover:text-gold-400 transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-gold-400 transition-colors">Contact</Link></li>
              <li><Link href="/booking" className="text-gray-300 hover:text-gold-400 transition-colors">Book Now</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">No 2 Ayoro lane Enerehen road</p>
                  <p className="text-gray-300">Warri Uwain, Warri 330102</p>
                  <p className="text-gray-300">Delta State, Nigeria</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gold-400" />
                  <a href="tel:+2348147807794" className="text-gray-300 hover:text-gold-400 transition-colors">+234 814 780 7794</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gold-400" />
                  <a href="https://wa.me/2349121639047" className="text-gray-300 hover:text-gold-400 transition-colors">+234 912 163 9047 (WhatsApp)</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gold-400" />
                  <a href="https://wa.me/23450621080" className="text-gray-300 hover:text-gold-400 transition-colors">+234 5062 1080 (WhatsApp)</a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold-400" />
                <span className="text-gray-300">info@godatinhotel.com</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gold-400" />
                <div>
                  <p className="text-gray-300">24/7 Reception</p>
                  <p className="text-gray-300">Always Available</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-300 text-sm">
                  Check-in: 2:00 PM
                </p>
                <p className="text-gray-300 text-sm">
                  Check-out: 12:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Godatin Hotel. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-300 hover:text-gold-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-gold-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
