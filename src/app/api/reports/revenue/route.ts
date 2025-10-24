import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// Mock revenue data
const mockRevenueData = {
  totalRevenue: 2500000,
  monthlyRevenue: 450000,
  dailyRevenue: 15000,
  averageBookingValue: 25000,
  revenueGrowth: 12.5,
  occupancyRate: 78,
  roomRevenue: [
    {
      roomType: 'Alcove',
      revenue: 300000,
      bookings: 12,
      averageRate: 25000
    },
    {
      roomType: 'Deluxe',
      revenue: 800000,
      bookings: 32,
      averageRate: 25000
    },
    {
      roomType: 'Special Deluxe',
      revenue: 600000,
      bookings: 24,
      averageRate: 25000
    },
    {
      roomType: 'Executive Suite',
      revenue: 500000,
      bookings: 20,
      averageRate: 25000
    },
    {
      roomType: 'Diplomatic Suite',
      revenue: 300000,
      bookings: 12,
      averageRate: 25000
    }
  ],
  monthlyTrend: [
    { month: 'Jan', revenue: 380000, bookings: 15 },
    { month: 'Feb', revenue: 420000, bookings: 17 },
    { month: 'Mar', revenue: 450000, bookings: 18 },
    { month: 'Apr', revenue: 480000, bookings: 19 },
    { month: 'May', revenue: 520000, bookings: 21 },
    { month: 'Jun', revenue: 450000, bookings: 18 },
    { month: 'Jul', revenue: 480000, bookings: 19 },
    { month: 'Aug', revenue: 510000, bookings: 20 },
    { month: 'Sep', revenue: 450000, bookings: 18 },
    { month: 'Oct', revenue: 480000, bookings: 19 },
    { month: 'Nov', revenue: 420000, bookings: 17 },
    { month: 'Dec', revenue: 450000, bookings: 18 }
  ]
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30days';
    
    // Adjust data based on period
    let data = { ...mockRevenueData };
    
    switch (period) {
      case '7days':
        data.monthlyRevenue = data.dailyRevenue * 7;
        data.totalRevenue = data.monthlyRevenue;
        break;
      case '90days':
        data.monthlyRevenue = data.dailyRevenue * 90;
        data.totalRevenue = data.monthlyRevenue * 3;
        break;
      case '1year':
        data.monthlyRevenue = data.dailyRevenue * 365;
        data.totalRevenue = data.monthlyRevenue;
        break;
      default: // 30days
        data.monthlyRevenue = data.dailyRevenue * 30;
        data.totalRevenue = data.monthlyRevenue;
    }
    
    return NextResponse.json({
      success: true,
      data,
      period,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}
