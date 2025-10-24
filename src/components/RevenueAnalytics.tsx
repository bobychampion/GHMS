'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Calendar, BarChart3, PieChart, Download } from 'lucide-react';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  averageBookingValue: number;
  revenueGrowth: number;
  occupancyRate: number;
  roomRevenue: {
    roomType: string;
    revenue: number;
    bookings: number;
    averageRate: number;
  }[];
  monthlyTrend: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
}

export default function RevenueAnalytics() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '90days' | '1year'>('30days');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/revenue?period=${selectedPeriod}`);
      const data = await response.json();
      if (data.success) {
        setRevenueData(data.data);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-end items-center space-x-4">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </select>
        <button className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors">
          <Download className="w-4 h-4 inline mr-2" />
          Export Report
        </button>
      </div>

      {/* Revenue Overview Cards */}
      {revenueData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-royal-900">{formatCurrency(revenueData.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-gold-100 rounded-full">
                <DollarSign className="w-6 h-6 text-gold-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${getGrowthColor(revenueData.revenueGrowth)}`}>
                {getGrowthIcon(revenueData.revenueGrowth)}
              </span>
              <span className={`text-sm ml-1 ${getGrowthColor(revenueData.revenueGrowth)}`}>
                {Math.abs(revenueData.revenueGrowth)}%
              </span>
              <span className="text-sm text-gray-600 ml-1">vs last period</span>
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
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-royal-900">{formatCurrency(revenueData.monthlyRevenue)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Current month</p>
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
                <p className="text-sm text-gray-600">Daily Average</p>
                <p className="text-2xl font-bold text-royal-900">{formatCurrency(revenueData.dailyRevenue)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Per day average</p>
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
                <p className="text-sm text-gray-600">Avg Booking Value</p>
                <p className="text-2xl font-bold text-royal-900">{formatCurrency(revenueData.averageBookingValue)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Per booking</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Revenue by Room Type */}
      {revenueData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-royal-900 mb-4">Revenue by Room Type</h3>
            <div className="space-y-4">
              {revenueData.roomRevenue.map((room, index) => (
                <motion.div
                  key={room.roomType}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-royal-900">{room.roomType}</p>
                    <p className="text-sm text-gray-600">{room.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-royal-900">{formatCurrency(room.revenue)}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(room.averageRate)} avg</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-royal-900 mb-4">Monthly Trend</h3>
            <div className="space-y-3">
              {revenueData.monthlyTrend.map((month, index) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gold-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">{month.month}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-royal-900">{formatCurrency(month.revenue)}</p>
                    <p className="text-xs text-gray-600">{month.bookings} bookings</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {revenueData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-royal-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PieChart className="w-8 h-8 text-gold-600" />
              </div>
              <p className="text-2xl font-bold text-royal-900">{revenueData.occupancyRate}%</p>
              <p className="text-sm text-gray-600">Occupancy Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-royal-900">
                {revenueData.roomRevenue.reduce((sum, room) => sum + room.bookings, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-royal-900">
                {revenueData.roomRevenue.reduce((sum, room) => sum + room.bookings, 0) / 30}
              </p>
              <p className="text-sm text-gray-600">Avg Bookings/Day</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
