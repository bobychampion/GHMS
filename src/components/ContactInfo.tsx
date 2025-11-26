'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+234 814 780 7794'],
      description: 'Call us anytime for reservations or inquiries'
    },
    {
      icon: Mail,
      title: 'WhatsApp',
      details: ['+234 912 163 9047', '+234 5062 1080'],
      description: 'Message us on WhatsApp for quick responses'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['No 2 Ayoro lane Enerehen road', 'Warri Uwain, Warri 330102', 'Delta State, Nigeria'],
      description: 'Visit us at our beautiful location in Warri'
    },
    {
      icon: Clock,
      title: 'Reception Hours',
      details: ['24/7 Reception', 'Check-in: 2:00 PM', 'Check-out: 12:00 PM'],
      description: 'Our reception is always available to assist you'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold text-navy-900 mb-6 font-serif">Get in Touch</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          We're here to help make your stay at Godatin Hotel exceptional. 
          Whether you have questions about our rooms, need assistance with 
          reservations, or want to provide feedback, we'd love to hear from you.
        </p>
      </div>

      <div className="space-y-6">
        {contactMethods.map((method, index) => (
          <motion.div
            key={method.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
          >
            <div className="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center flex-shrink-0">
              <method.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">{method.title}</h3>
              <div className="space-y-1 mb-2">
                {method.details.map((detail, i) => (
                  <p key={i} className="text-gray-700 font-medium">{detail}</p>
                ))}
              </div>
              <p className="text-gray-600 text-sm">{method.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gold-50 border border-gold-200 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-6 h-6 text-gold-600" />
          <h3 className="text-xl font-semibold text-navy-900">Quick Response</h3>
        </div>
        <p className="text-gray-700">
          We typically respond to all inquiries within 2-4 hours during business hours. 
          For urgent matters, please call us directly.
        </p>
      </motion.div>
    </motion.div>
  );
}
