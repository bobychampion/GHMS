'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Lagos, Nigeria',
    rating: 5,
    text: 'Absolutely amazing experience! The staff was incredibly welcoming and the room was luxurious. The swimming pool was perfect for relaxation. Will definitely be back!',
    avatar: 'SJ'
  },
  {
    name: 'Michael Adebayo',
    location: 'Abuja, Nigeria',
    rating: 5,
    text: 'Godatin Hotel exceeded all my expectations. The Diplomatic Suite was breathtaking, and the service was impeccable. Perfect for business trips and leisure stays.',
    avatar: 'MA'
  },
  {
    name: 'Grace Okafor',
    location: 'Port Harcourt, Nigeria',
    rating: 5,
    text: 'The best hotel in Warri! The rooms are beautifully designed, the food is delicious, and the location is perfect. Highly recommended for anyone visiting Delta State.',
    avatar: 'GO'
  }
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-royal-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
            What Our <span className="text-gradient">Guests Say</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued guests 
            have to say about their experience at Godatin Hotel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg card-hover relative"
            >
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-gold-200" />
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">
                "{testimonial.text}"
              </p>
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
          <p className="text-gray-300 mb-6">
            Join hundreds of satisfied guests who have experienced luxury at Godatin Hotel
          </p>
          <div className="flex justify-center space-x-8 text-2xl font-bold text-gold-400">
            <div>
              <div className="text-4xl">500+</div>
              <div className="text-sm text-gray-300">Happy Guests</div>
            </div>
            <div>
              <div className="text-4xl">98%</div>
              <div className="text-sm text-gray-300">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl">5★</div>
              <div className="text-sm text-gray-300">Average Rating</div>
            </div>
          </div>
        </motion.div>

        {/* Google Reviews CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10"
        >
          {/* QR Code */}
          <div className="flex-shrink-0 bg-white p-4 rounded-2xl shadow-lg">
            <Image
              src="/images/google-review-qr.png"
              alt="Scan to leave a Google Review"
              width={160}
              height={160}
              className="rounded-lg"
            />
            <p className="text-center text-xs text-gray-500 mt-2 font-medium">Scan to Review</p>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              {/* Google coloured dots */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-white font-semibold text-lg">Leave us a Google Review</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Enjoyed your stay at Godatin Hotel? Your review helps other travellers discover us and means the world to our team. It only takes a minute.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-gold-400 fill-current" />
              ))}
              <span className="text-gray-300 text-sm ml-2">Rate us on Google</span>
            </div>
            <a
              href="https://g.page/r/CbO2hBp4yNYDEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200"
            >
              Write a Review
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
