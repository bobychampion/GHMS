'use client';

import { useState, useEffect } from 'react';
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
  MoreVertical,
  LogIn,
  LogOut,
  BarChart3,
  TrendingUp,
  FileText,
  Home,
  Bell,
  Wrench,
  MessageSquare,
  Trash2,
  RotateCcw,
  UserX
} from 'lucide-react';
import RoomAvailabilityCalendar from './RoomAvailabilityCalendar';
import GuestNotifications from './GuestNotifications';
import RevenueAnalytics from './RevenueAnalytics';
import RoomMaintenance from './RoomMaintenance';
import GuestFeedback from './GuestFeedback';

interface Booking {
  _id: string;
  guestId: {
    name: string;
    email: string;
    phone: string;
  };
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  numberOfGuests: number;
  bookingReference: string;
  checkInTime?: string;
  checkOutTime?: string;
  extraCharges?: number;
  finalAmount?: number;
  notes?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'card' | null;
  isDeleted?: boolean;
  deletedBy?: any;
  deletedAt?: string;
  deletedByUsername?: string;
}

interface ReportData {
  overview: {
    totalBookings: number;
    confirmedBookings: number;
    checkedInBookings: number;
    pendingBookings: number;
    totalRevenue: number;
  };
  revenueByRoomType: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  monthlyRevenue: Array<{
    _id: { year: number; month: number };
    total: number;
    count: number;
  }>;
}

interface Guest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bookingHistory: any[];
  isDeleted?: boolean;
  deletedBy?: any;
  deletedAt?: string;
  deletedByUsername?: string;
  createdAt: string;
}

interface UserSession {
  id: string;
  username: string;
  role: 'super_admin' | 'admin' | 'frontdesk';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [deletedBookings, setDeletedBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [deletedGuests, setDeletedGuests] = useState<Guest[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [extraCharges, setExtraCharges] = useState(0);
  const [notes, setNotes] = useState('');
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  useEffect(() => {
    // Get user session from localStorage
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserSession(user);
      
      fetchBookings();
      fetchReports();
      fetchGuests();
      if (user.role === 'super_admin') {
        fetchDeletedGuests();
        fetchDeletedBookings();
      }
    } else {
      // Redirect to login if no session
      window.location.href = '/admin/login';
      return;
    }
  }, []);

  useEffect(() => {
    if (userSession?.role === 'super_admin') {
      if (activeTab === 'deleted-guests') {
        fetchDeletedGuests();
      } else if (activeTab === 'deleted-bookings') {
        fetchDeletedBookings();
      }
    }
  }, [activeTab, userSession]);

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

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports?type=overview');
      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/guests');
      const data = await response.json();
      if (data.success) {
        setGuests(data.guests);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };

  const fetchDeletedGuests = async () => {
    const storedUser = localStorage.getItem('adminUser');
    if (!storedUser) return;
    
    const user = JSON.parse(storedUser);
    if (user.role !== 'super_admin') return;
    
    try {
      const response = await fetch(`/api/guests/deleted?role=${user.role}`);
      const data = await response.json();
      if (data.success) {
        setDeletedGuests(data.guests);
      }
    } catch (error) {
      console.error('Error fetching deleted guests:', error);
    }
  };

  const fetchDeletedBookings = async () => {
    const storedUser = localStorage.getItem('adminUser');
    if (!storedUser) return;
    
    const user = JSON.parse(storedUser);
    if (user.role !== 'super_admin') return;
    
    try {
      const response = await fetch(`/api/bookings/deleted?role=${user.role}`);
      const data = await response.json();
      if (data.success) {
        setDeletedBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching deleted bookings:', error);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!userSession) return;
    
    if (!confirm('Are you sure you want to delete this guest? This action can be reversed by a super admin.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/guests?guestId=${guestId}&userId=${userSession.id}&role=${userSession.role}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Guest deleted successfully');
        await fetchGuests();
        if (userSession.role === 'super_admin') {
          await fetchDeletedGuests();
        }
      } else {
        alert(data.message || 'Failed to delete guest');
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
      alert('An error occurred while deleting guest');
    }
    setLoading(false);
  };

  const handleRestoreGuest = async (guestId: string) => {
    if (!userSession || userSession.role !== 'super_admin') return;
    
    if (!confirm('Are you sure you want to restore this guest?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/guests/deleted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId,
          userRole: userSession.role
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Guest restored successfully');
        await fetchGuests();
        await fetchDeletedGuests();
      } else {
        alert(data.message || 'Failed to restore guest');
      }
    } catch (error) {
      console.error('Error restoring guest:', error);
      alert('An error occurred while restoring guest');
    }
    setLoading(false);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!userSession) return;
    
    if (!confirm('Are you sure you want to delete this booking? This action can be reversed by a super admin. Deleted bookings will not be counted in revenue.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bookings?bookingId=${bookingId}&userId=${userSession.id}&role=${userSession.role}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Booking deleted successfully');
        await fetchBookings();
        await fetchReports();
        if (userSession.role === 'super_admin') {
          await fetchDeletedBookings();
        }
      } else {
        alert(data.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('An error occurred while deleting booking');
    }
    setLoading(false);
  };

  const handleRestoreBooking = async (bookingId: string) => {
    if (!userSession || userSession.role !== 'super_admin') return;
    
    if (!confirm('Are you sure you want to restore this booking?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/bookings/deleted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          userRole: userSession.role
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Booking restored successfully');
        await fetchBookings();
        await fetchReports();
        await fetchDeletedBookings();
      } else {
        alert(data.message || 'Failed to restore booking');
      }
    } catch (error) {
      console.error('Error restoring booking:', error);
      alert('An error occurred while restoring booking');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const handleCheckIn = async () => {
    if (!selectedBooking) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/checkin-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          action: 'check-in',
          extraCharges,
          notes
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchBookings();
        setShowCheckInModal(false);
        setSelectedBooking(null);
        setExtraCharges(0);
        setNotes('');
      }
    } catch (error) {
      console.error('Error checking in:', error);
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    if (!selectedBooking) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/checkin-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          action: 'check-out',
          extraCharges,
          notes
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchBookings();
        setShowCheckOutModal(false);
        setSelectedBooking(null);
        setExtraCharges(0);
        setNotes('');
      }
    } catch (error) {
      console.error('Error checking out:', error);
    }
    setLoading(false);
  };

  const confirmPayment = async (bookingId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkin-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          action: 'confirm-payment'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchBookings();
        await fetchReports();
        alert('Payment recorded successfully!');
      } else {
        alert(data.message || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('An error occurred while recording payment');
    }
    setLoading(false);
  };

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
                activeTab === 'bookings' ? 'bg-gold-600' : 'hover:bg-royal-800'
              }`}
            >
              <Bed className="w-5 h-5" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => setActiveTab('checkin')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'checkin' ? 'bg-gold-600' : 'hover:bg-royal-800'
              }`}
            >
              <LogIn className="w-5 h-5" />
              <span>Check-in/out</span>
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'availability' ? 'bg-gold-600' : 'hover:bg-royal-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Room Availability</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'notifications' ? 'bg-gold-600' : 'hover:bg-royal-800'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'revenue' ? 'bg-gold-600' : 'hover:bg-royal-800'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Revenue Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'maintenance' ? 'bg-gold-600' : 'hover:bg-royal-800'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span>Maintenance</span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'feedback' ? 'bg-gold-600' : 'hover:bg-royal-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Guest Feedback</span>
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'guests' ? 'bg-gold-600' : 'hover:bg-royal-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Guests</span>
            </button>
            {userSession?.role === 'super_admin' && (
              <>
                <button
                  onClick={() => setActiveTab('deleted-bookings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'deleted-bookings' ? 'bg-gold-600' : 'hover:bg-royal-800'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Deleted Bookings</span>
                </button>
                <button
                  onClick={() => setActiveTab('deleted-guests')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'deleted-guests' ? 'bg-gold-600' : 'hover:bg-royal-800'
                  }`}
                >
                  <UserX className="w-5 h-5" />
                  <span>Deleted Guests</span>
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'reports' ? 'bg-gold-600' : 'hover:bg-royal-800'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Reports</span>
            </button>
          </nav>
          <div className="mt-8 pt-8 border-t border-royal-700">
            <div className="px-4 py-2 text-sm text-gray-300">
              <p className="font-semibold">{userSession?.username}</p>
              <p className="text-xs text-gray-400 capitalize">{userSession?.role?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-royal-800 transition-colors text-red-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-royal-900 font-serif">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'bookings' && 'Booking Management'}
              {activeTab === 'checkin' && 'Check-in/Check-out'}
              {activeTab === 'availability' && 'Room Availability'}
              {activeTab === 'notifications' && 'Guest Notifications'}
              {activeTab === 'revenue' && 'Revenue Analytics'}
              {activeTab === 'maintenance' && 'Room Maintenance'}
              {activeTab === 'feedback' && 'Guest Feedback'}
              {activeTab === 'guests' && 'Guest Management'}
              {activeTab === 'deleted-bookings' && 'Deleted Bookings'}
              {activeTab === 'deleted-guests' && 'Deleted Guests'}
              {activeTab === 'reports' && 'Reports & Analytics'}
            </h2>
            <p className="text-gray-600 mt-1">
              {activeTab === 'overview' && 'Welcome back! Here\'s what\'s happening at your hotel.'}
              {activeTab === 'bookings' && 'Manage all hotel bookings and reservations.'}
              {activeTab === 'checkin' && 'Process guest check-ins and check-outs.'}
              {activeTab === 'availability' && 'Monitor room availability and occupancy rates.'}
              {activeTab === 'notifications' && 'Send automated notifications to guests.'}
              {activeTab === 'revenue' && 'Track revenue performance and trends.'}
              {activeTab === 'maintenance' && 'Track and manage room maintenance tasks.'}
              {activeTab === 'feedback' && 'Manage guest reviews and feedback.'}
              {activeTab === 'guests' && 'View and manage all guest information.'}
              {activeTab === 'deleted-bookings' && 'View deleted bookings and restore them if needed.'}
              {activeTab === 'deleted-guests' && 'View deleted guests and restore them if needed.'}
              {activeTab === 'reports' && 'View occupancy and revenue reports.'}
            </p>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && reportData && (
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
                    <p className="text-2xl font-bold text-royal-900">{reportData.overview.totalBookings}</p>
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
                    <p className="text-gray-600 text-sm">Confirmed</p>
                    <p className="text-2xl font-bold text-royal-900">{reportData.overview.confirmedBookings}</p>
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
                    <p className="text-gray-600 text-sm">Checked-in</p>
                    <p className="text-2xl font-bold text-royal-900">{reportData.overview.checkedInBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <LogIn className="w-6 h-6 text-blue-600" />
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
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-royal-900">{reportData.overview.pendingBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
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
                    <p className="text-2xl font-bold text-royal-900">₦{reportData.overview.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-gold-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Revenue by Room Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-royal-900 mb-4">Revenue by Room Type</h3>
              <div className="space-y-4">
                {reportData.revenueByRoomType.map((room) => (
                  <div key={room._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-royal-900">{room._id}</p>
                      <p className="text-sm text-gray-600">{room.count} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-royal-900">₦{room.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
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
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-royal-900">{booking.guestId.name}</div>
                            <div className="text-sm text-gray-500">{booking.guestId.email}</div>
                            <div className="text-xs text-gray-400">{booking.bookingReference}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-royal-900">{booking.roomType}</div>
                          <div className="text-sm text-gray-500">{booking.numberOfGuests} guests</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-royal-900">{new Date(booking.checkInDate).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">to {new Date(booking.checkOutDate).toLocaleDateString()}</div>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.paymentMethod && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.paymentMethod === 'cash' 
                                ? 'bg-blue-100 text-blue-800' 
                                : booking.paymentMethod === 'bank_transfer'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.paymentMethod === 'cash' ? 'Cash' : 
                               booking.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                               booking.paymentMethod === 'card' ? 'Card' : 'N/A'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-royal-900">
                          ₦{booking.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {booking.paymentStatus === 'pending' && (
                              <button
                                onClick={() => confirmPayment(booking._id)}
                                className="text-green-600 hover:text-green-700 text-xs font-medium px-2 py-1 bg-green-50 rounded hover:bg-green-100"
                                title={booking.paymentMethod === 'cash' ? 'Record cash payment received' : 'Confirm payment received'}
                              >
                                {booking.paymentMethod === 'cash' ? 'Record Cash Payment' : 'Confirm Payment'}
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCheckInModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-700 text-xs"
                              >
                                Check-in
                              </button>
                            )}
                            {booking.status === 'checked-in' && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCheckOutModal(true);
                                }}
                                className="text-orange-600 hover:text-orange-700 text-xs"
                              >
                                Check-out
                              </button>
                            )}
                            {(userSession?.role === 'admin' || userSession?.role === 'frontdesk' || userSession?.role === 'super_admin') && (
                              <button
                                onClick={() => handleDeleteBooking(booking._id)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-700 disabled:opacity-50 text-xs ml-2"
                                title="Delete booking"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deleted-bookings' && userSession?.role === 'super_admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-royal-900">Deleted Bookings</h3>
                <p className="text-sm text-gray-600 mt-1">View and restore deleted bookings. Shows who deleted each booking and when. Deleted bookings are not counted in revenue.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted By</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted At</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deletedBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-royal-900">{booking.guestId?.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{booking.guestId?.email || 'N/A'}</div>
                            <div className="text-xs text-gray-400">{booking.bookingReference}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-royal-900">{booking.roomType}</div>
                          <div className="text-sm text-gray-500">{booking.numberOfGuests} guests</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-royal-900">{new Date(booking.checkInDate).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">to {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-royal-900">
                          ₦{booking.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.deletedByUsername || 'Unknown'}</div>
                          {booking.deletedBy && typeof booking.deletedBy === 'object' && (
                            <div className="text-xs text-gray-500 capitalize">
                              {booking.deletedBy.role?.replace('_', ' ')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.deletedAt ? new Date(booking.deletedAt).toLocaleString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRestoreBooking(booking._id)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-700 disabled:opacity-50 flex items-center space-x-1"
                            title="Restore booking"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Restore</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {deletedBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No deleted bookings found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checkin' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Today's Check-ins */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-royal-900 mb-4">Today's Check-ins</h3>
                <div className="space-y-3">
                  {bookings.filter(b => 
                    new Date(b.checkInDate).toDateString() === new Date().toDateString() && 
                    ['confirmed', 'checked-in'].includes(b.status)
                  ).map((booking) => (
                    <div key={booking._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-royal-900">{booking.guestId.name}</p>
                        <p className="text-sm text-gray-600">{booking.roomType}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Check-outs */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-royal-900 mb-4">Today's Check-outs</h3>
                <div className="space-y-3">
                  {bookings.filter(b => 
                    b.status === 'checked-out' && 
                    b.checkOutTime && 
                    new Date(b.checkOutTime).toDateString() === new Date().toDateString()
                  ).map((booking) => (
                    <div key={booking._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-royal-900">{booking.guestId.name}</p>
                        <p className="text-sm text-gray-600">{booking.roomType}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduled Check-outs */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-royal-900 mb-4">Scheduled Check-outs</h3>
                <div className="space-y-3">
                  {bookings.filter(b => 
                    b.status === 'checked-in' && 
                    new Date(b.checkOutDate).toDateString() === new Date().toDateString()
                  ).map((booking) => (
                    <div key={booking._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-royal-900">{booking.guestId.name}</p>
                        <p className="text-sm text-gray-600">{booking.roomType}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <RoomAvailabilityCalendar />
        )}

        {activeTab === 'notifications' && (
          <GuestNotifications />
        )}

        {activeTab === 'revenue' && (
          <RevenueAnalytics />
        )}

        {activeTab === 'maintenance' && (
          <RoomMaintenance />
        )}

        {activeTab === 'feedback' && (
          <GuestFeedback />
        )}

        {activeTab === 'guests' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-royal-900">All Guests</h3>
                <p className="text-sm text-gray-600 mt-1">Manage guest information and bookings</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {guests.map((guest) => (
                      <tr key={guest._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-royal-900">{guest.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{guest.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.bookingHistory?.length || 0} booking(s)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {(userSession?.role === 'admin' || userSession?.role === 'frontdesk' || userSession?.role === 'super_admin') && (
                            <button
                              onClick={() => handleDeleteGuest(guest._id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center space-x-1"
                              title="Delete guest"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {guests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No guests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deleted-guests' && userSession?.role === 'super_admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-royal-900">Deleted Guests</h3>
                <p className="text-sm text-gray-600 mt-1">View and restore deleted guests. Shows who deleted each guest and when.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted By</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted At</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deletedGuests.map((guest) => (
                      <tr key={guest._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-royal-900">{guest.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.deletedByUsername || 'Unknown'}</div>
                          {guest.deletedBy && typeof guest.deletedBy === 'object' && (
                            <div className="text-xs text-gray-500 capitalize">
                              {guest.deletedBy.role?.replace('_', ' ')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {guest.deletedAt ? new Date(guest.deletedAt).toLocaleString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRestoreGuest(guest._id)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-700 disabled:opacity-50 flex items-center space-x-1"
                            title="Restore guest"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Restore</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {deletedGuests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No deleted guests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-royal-900 mb-4">Advanced Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold">Revenue Report</h4>
                  <p className="text-sm text-gray-600">Monthly and yearly revenue analysis</p>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-semibold">Occupancy Report</h4>
                  <p className="text-sm text-gray-600">Room occupancy and utilization</p>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <FileText className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-semibold">Guest Report</h4>
                  <p className="text-sm text-gray-600">Guest demographics and preferences</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Check-in Modal */}
      {showCheckInModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-semibold text-royal-900 mb-4">Check-in Guest</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
                <p className="text-gray-900">{selectedBooking.guestId.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <p className="text-gray-900">{selectedBooking.roomType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extra Charges (₦)</label>
                <input
                  type="number"
                  value={extraCharges}
                  onChange={(e) => setExtraCharges(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCheckInModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Check-in'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-out Modal */}
      {showCheckOutModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-semibold text-royal-900 mb-4">Check-out Guest</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
                <p className="text-gray-900">{selectedBooking.guestId.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <p className="text-gray-900">{selectedBooking.roomType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Charges (₦)</label>
                <input
                  type="number"
                  value={extraCharges}
                  onChange={(e) => setExtraCharges(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCheckOutModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Check-out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
