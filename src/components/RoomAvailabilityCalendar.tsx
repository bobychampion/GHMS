'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bed, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface RoomAvailability {
  roomType: string;
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  maintenanceRooms: number;
}

interface Booking {
  _id: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  guestId: {
    name: string;
    email: string;
  };
}

export default function RoomAvailabilityCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [roomAvailability, setRoomAvailability] = useState<RoomAvailability[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoomAvailability();
    fetchBookings();
  }, [selectedDate]);

  const fetchRoomAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/availability?date=${selectedDate.toISOString()}`);
      const data = await response.json();
      if (data.success) {
        setRoomAvailability(data.data);
      }
    } catch (error) {
      console.error('Error fetching room availability:', error);
    }
    setLoading(false);
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage >= 70) return 'text-green-600 bg-green-100';
    if (percentage >= 30) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage >= 70) return 'High Availability';
    if (percentage >= 30) return 'Limited Availability';
    return 'Fully Booked';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBookingsForDate = (roomType: string, date: Date) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const targetDate = new Date(date);
      
      return booking.roomType === roomType &&
             targetDate >= checkIn &&
             targetDate < checkOut &&
             ['confirmed', 'checked-in'].includes(booking.status);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-royal-900 font-serif">Room Availability Calendar</h2>
          <p className="text-gray-600 mt-1">Monitor room availability and occupancy</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Selected Date Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-gold-600" />
          <div>
            <h3 className="text-lg font-semibold text-royal-900">{formatDate(selectedDate)}</h3>
            <p className="text-gray-600">Room availability for selected date</p>
          </div>
        </div>
      </div>

      {/* Room Availability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomAvailability.map((room) => {
          const bookingsForDate = getBookingsForDate(room.roomType, selectedDate);
          const availableRooms = room.totalRooms - bookingsForDate.length - room.maintenanceRooms;
          
          return (
            <motion.div
              key={room.roomType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Bed className="w-6 h-6 text-gold-600" />
                  <h3 className="text-lg font-semibold text-royal-900">{room.roomType}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(availableRooms, room.totalRooms)}`}>
                  {getAvailabilityStatus(availableRooms, room.totalRooms)}
                </span>
              </div>

              {/* Room Statistics */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Rooms:</span>
                  <span className="font-semibold text-royal-900">{room.totalRooms}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold text-green-600">{availableRooms}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booked:</span>
                  <span className="font-semibold text-blue-600">{bookingsForDate.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Maintenance:</span>
                  <span className="font-semibold text-orange-600">{room.maintenanceRooms}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Occupancy</span>
                  <span>{Math.round(((room.totalRooms - availableRooms) / room.totalRooms) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gold-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((room.totalRooms - availableRooms) / room.totalRooms) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Bookings for this date */}
              {bookingsForDate.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Bookings for this date:</h4>
                  <div className="space-y-2">
                    {bookingsForDate.map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{booking.guestId.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'checked-in' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-royal-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">View Monthly Calendar</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Bed className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Room Maintenance</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <AlertCircle className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-medium">Availability Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
