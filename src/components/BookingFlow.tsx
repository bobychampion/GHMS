'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { roomTypes } from '@/data/rooms';
import { formatCurrency, calculateNights, calculateTotalAmount } from '@/utils/helpers';
import { Calendar, Users, CreditCard, CheckCircle } from 'lucide-react';

interface BookingData {
  roomType: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  numberOfGuests: number;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  specialRequests: string;
  paymentMethod: string;
}

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    roomType: '',
    checkInDate: null,
    checkOutDate: null,
    numberOfGuests: 1,
    guestInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    specialRequests: '',
    paymentMethod: 'bank_transfer'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const selectedRoom = roomTypes.find(room => room.roomType === bookingData.roomType);
  const nights = bookingData.checkInDate && bookingData.checkOutDate 
    ? calculateNights(bookingData.checkInDate.toISOString(), bookingData.checkOutDate.toISOString())
    : 0;
  const totalAmount = selectedRoom ? calculateTotalAmount(selectedRoom.price, nights) : 0;

  const steps = [
    { id: 1, title: 'Select Dates & Room', icon: Calendar },
    { id: 2, title: 'Guest Information', icon: Users },
    { id: 3, title: 'Payment', icon: CreditCard },
    { id: 4, title: 'Confirmation', icon: CheckCircle }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestInfo: bookingData.guestInfo,
          roomType: bookingData.roomType,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          numberOfGuests: bookingData.numberOfGuests,
          specialRequests: bookingData.specialRequests,
          paymentMethod: bookingData.paymentMethod
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentStep(4);
        // Store booking reference for display
        setBookingReference(data.bookingReference);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Room Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomTypes.map((room) => (
                  <div
                    key={room.roomType}
                    onClick={() => setBookingData({...bookingData, roomType: room.roomType})}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                      bookingData.roomType === room.roomType
                        ? 'border-gold-600 bg-gold-50'
                        : 'border-gray-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-navy-900">{room.roomType}</h3>
                      <span className="text-gold-600 font-bold">{formatCurrency(room.price)}/night</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{room.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{room.maxOccupancy} guests</span>
                      <span>{room.amenities.length} amenities</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Check-in Date
                </label>
                <DatePicker
                  selected={bookingData.checkInDate}
                  onChange={(date) => setBookingData({...bookingData, checkInDate: date})}
                  minDate={new Date()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholderText="Select check-in date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Check-out Date
                </label>
                <DatePicker
                  selected={bookingData.checkOutDate}
                  onChange={(date) => setBookingData({...bookingData, checkOutDate: date})}
                  minDate={bookingData.checkInDate || new Date()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholderText="Select check-out date"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Number of Guests
              </label>
              <select
                value={bookingData.numberOfGuests}
                onChange={(e) => setBookingData({...bookingData, numberOfGuests: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookingData.guestInfo.name}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    guestInfo: {...bookingData.guestInfo, name: e.target.value}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={bookingData.guestInfo.email}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    guestInfo: {...bookingData.guestInfo, email: e.target.value}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={bookingData.guestInfo.phone}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    guestInfo: {...bookingData.guestInfo, phone: e.target.value}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="+234 123 456 7890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={bookingData.guestInfo.address}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    guestInfo: {...bookingData.guestInfo, address: e.target.value}
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Your address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                rows={4}
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                placeholder="Any special requests or preferences..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Room Type:</span>
                  <span className="font-medium">{selectedRoom?.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span className="font-medium">{bookingData.checkInDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span className="font-medium">{bookingData.checkOutDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="font-medium">{bookingData.numberOfGuests}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-gold-600">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank_transfer" 
                    className="text-gold-600" 
                    checked={bookingData.paymentMethod === 'bank_transfer'}
                    onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                  />
                  <div>
                    <span className="font-medium">Bank Transfer</span>
                    <div className="text-sm text-gray-600 mt-1">
                      <p><strong>Bank:</strong> Eco Bank</p>
                      <p><strong>Account No:</strong> 0000000000</p>
                      <p><strong>Account Name:</strong> Godatin Hotel</p>
                    </div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cash" 
                    className="text-gold-600" 
                    checked={bookingData.paymentMethod === 'cash'}
                    onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                  />
                  <span>Pay at Hotel (Cash/Card)</span>
                </label>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Bank Transfer Instructions:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Transfer the total amount to the account above</li>
                  <li>2. Use your booking reference as payment description</li>
                  <li>3. Send proof of payment via WhatsApp or email</li>
                  <li>4. Your booking will be confirmed within 24 hours</li>
                </ol>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900">Booking Submitted!</h3>
            <p className="text-gray-600">
              Thank you for choosing Godatin Hotel. Your reservation request has been submitted.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h4 className="font-semibold mb-2">Booking Reference: {bookingReference}</h4>
              <p className="text-sm text-gray-600 mb-4">
                A confirmation email will be sent to {bookingData.guestInfo.email}
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">Next Steps:</h5>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Transfer ₦{totalAmount.toLocaleString()} to Eco Bank account: 0000000000</li>
                  <li>2. Send proof of payment to +234 912 163 9047 (WhatsApp)</li>
                  <li>3. Your booking will be confirmed within 24 hours</li>
                  <li>4. You'll receive a confirmation email/SMS</li>
                </ol>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-gold-600 border-gold-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-gold-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-gold-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        {renderStepContent()}

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              disabled={!bookingData.roomType || !bookingData.checkInDate || !bookingData.checkOutDate || isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : currentStep === 3 ? 'Complete Booking' : 'Next'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
