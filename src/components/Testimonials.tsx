'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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
      </div>
    </section>
  );
}
