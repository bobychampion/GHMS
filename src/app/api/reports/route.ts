import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Payment } from '@/lib/models/Payment';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    switch (reportType) {
      case 'overview':
        const totalBookings = await Booking.countDocuments(dateFilter);
        const confirmedBookings = await Booking.countDocuments({ ...dateFilter, status: 'confirmed' });
        const checkedInBookings = await Booking.countDocuments({ ...dateFilter, status: 'checked-in' });
        const pendingBookings = await Booking.countDocuments({ ...dateFilter, status: 'pending' });
        
        const totalRevenue = await Booking.aggregate([
          { $match: { ...dateFilter, paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const revenueByRoomType = await Booking.aggregate([
          { $match: { ...dateFilter, paymentStatus: 'paid' } },
          { $group: { _id: '$roomType', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
          { $sort: { total: -1 } }
        ]);

        const monthlyRevenue = await Booking.aggregate([
          { $match: { ...dateFilter, paymentStatus: 'paid' } },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              total: { $sum: '$totalAmount' },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);

        return NextResponse.json({
          success: true,
          data: {
            overview: {
              totalBookings,
              confirmedBookings,
              checkedInBookings,
              pendingBookings,
              totalRevenue: totalRevenue[0]?.total || 0
            },
            revenueByRoomType,
            monthlyRevenue
          }
        });

      case 'occupancy':
        const occupancyData = await Booking.aggregate([
          { $match: { ...dateFilter, status: { $in: ['confirmed', 'checked-in'] } } },
          {
            $group: {
              _id: {
                roomType: '$roomType',
                checkInDate: '$checkInDate'
              },
              bookings: { $sum: 1 }
            }
          },
          {
            $group: {
              _id: '$_id.roomType',
              totalBookings: { $sum: '$bookings' },
              avgOccupancy: { $avg: '$bookings' }
            }
          }
        ]);

        return NextResponse.json({
          success: true,
          data: occupancyData
        });

      case 'payments':
        const paymentMethods = await Payment.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: '$method',
              total: { $sum: '$amount' },
              count: { $sum: 1 },
              avgAmount: { $avg: '$amount' }
            }
          }
        ]);

        const paymentStatus = await Payment.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: '$status',
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]);

        return NextResponse.json({
          success: true,
          data: {
            paymentMethods,
            paymentStatus
          }
        });

      case 'guests':
        const guestStats = await Booking.aggregate([
          { $match: dateFilter },
          {
            $lookup: {
              from: 'guests',
              localField: 'guestId',
              foreignField: '_id',
              as: 'guest'
            }
          },
          { $unwind: '$guest' },
          {
            $group: {
              _id: null,
              totalGuests: { $sum: 1 },
              uniqueGuests: { $addToSet: '$guest.email' },
              avgGuestsPerBooking: { $avg: '$numberOfGuests' }
            }
          },
          {
            $project: {
              totalGuests: 1,
              uniqueGuestCount: { $size: '$uniqueGuests' },
              avgGuestsPerBooking: 1
            }
          }
        ]);

        return NextResponse.json({
          success: true,
          data: guestStats[0] || { totalGuests: 0, uniqueGuestCount: 0, avgGuestsPerBooking: 0 }
        });

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid report type' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate report' },
      { status: 500 }
    );
  }
}



