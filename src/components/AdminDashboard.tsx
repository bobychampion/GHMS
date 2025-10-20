'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Bed, 
  CheckCircle, 
  Clock,
  Plus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';

// Mock data for demonstration
const mockBookings = [
  {
    id: 'GH001',
    guestName: 'John Doe',
    email: 'john@example.com',
    phone: '+234 123 456 7890',
    roomType: 'Deluxe',
    checkIn: '2024-01-15',
    checkOut: '2024-01-17',
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 40000,
    guests: 2
  },
  {
    id: 'GH002',
    guestName: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+234 987 654 3210',
    roomType: 'Executive Suite',
    checkIn: '2024-01-16',
    checkOut: '2024-01-18',
    status: 'checked-in',
    paymentStatus: 'paid',
    totalAmount: 70000,
    guests: 4
  },
  {
    id: 'GH003',
    guestName: 'Michael Adebayo',
    email: 'michael@example.com',
    phone: '+234 555 123 4567',
    roomType: 'Diplomatic Suite',
    checkIn: '2024-01-20',
    checkOut: '2024-01-22',
    status: 'pending',
    paymentStatus: 'pending',
    totalAmount: 100000,
    guests: 6
  }
];

const mockStats = {
  totalBookings: 156,
  todayCheckIns: 8,
  todayCheckOuts: 5,
  occupancyRate: 78,
  totalRevenue: 2450000
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = mockBookings.filter(booking =>
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-royal-900 text-white min-h-screen">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <h1 className="text-xl font-bold font-serif">Godatin Hotel</h1>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-gold-600' : 'hover:bg-royal-800'
                }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'bookings' ? 'bg-gold-600' : 'hover:bg-navy-800'
              }`}
            >
              <Bed className="w-5 h-5" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'guests' ? 'bg-gold-600' : 'hover:bg-navy-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Guests</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'reports' ? 'bg-gold-600' : 'hover:bg-navy-800'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Reports</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 font-serif">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'bookings' && 'Booking Management'}
              {activeTab === 'guests' && 'Guest Management'}
              {activeTab === 'reports' && 'Reports & Analytics'}
            </h2>
            <p className="text-gray-600 mt-1">
              {activeTab === 'overview' && 'Welcome back! Here\'s what\'s happening at your hotel.'}
              {activeTab === 'bookings' && 'Manage all hotel bookings and reservations.'}
              {activeTab === 'guests' && 'View and manage guest information.'}
              {activeTab === 'reports' && 'View occupancy and revenue reports.'}
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Booking</span>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold text-navy-900">{mockStats.totalBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Today's Check-ins</p>
                    <p className="text-2xl font-bold text-navy-900">{mockStats.todayCheckIns}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Today's Check-outs</p>
                    <p className="text-2xl font-bold text-navy-900">{mockStats.todayCheckOuts}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-navy-900">{mockStats.occupancyRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bed className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-navy-900">₦{mockStats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-gold-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-navy-900 mb-4">Recent Bookings</h3>
              <div className="space-y-4">
                {mockBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center text-white font-bold">
                        {booking.guestName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-navy-900">{booking.guestName}</p>
                        <p className="text-sm text-gray-600">{booking.roomType} • {booking.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-navy-900">₦{booking.totalAmount.toLocaleString()}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="btn-outline flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-navy-900">{booking.guestName}</div>
                            <div className="text-sm text-gray-500">{booking.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-navy-900">{booking.roomType}</div>
                          <div className="text-sm text-gray-500">{booking.guests} guests</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-navy-900">{booking.checkIn}</div>
                          <div className="text-sm text-gray-500">to {booking.checkOut}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                          ₦{booking.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-gold-600 hover:text-gold-700">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guests' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-navy-900 mb-4">Guest Management</h3>
            <p className="text-gray-600">Guest management features will be implemented here.</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-navy-900 mb-4">Reports & Analytics</h3>
            <p className="text-gray-600">Reports and analytics features will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
