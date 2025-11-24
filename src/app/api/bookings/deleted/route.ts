import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { User } from '@/lib/models/User';

// Get all deleted bookings (super admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('role');

    // Only super_admin can view deleted bookings
    if (userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Only super admin can view deleted bookings' },
        { status: 403 }
      );
    }

    const deletedBookings = await Booking.find({ isDeleted: true })
      .populate('guestId', 'name email phone')
      .populate('deletedBy', 'username role')
      .sort({ deletedAt: -1 });

    return NextResponse.json({
      success: true,
      bookings: deletedBookings
    });

  } catch (error) {
    console.error('Error fetching deleted bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch deleted bookings' },
      { status: 500 }
    );
  }
}

// Restore a deleted booking (super admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { bookingId, userRole } = await request.json();

    // Only super_admin can restore bookings
    if (userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Only super admin can restore bookings' },
        { status: 403 }
      );
    }

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    if (!booking.isDeleted) {
      return NextResponse.json(
        { success: false, message: 'Booking is not deleted' },
        { status: 400 }
      );
    }

    // Restore the booking
    await Booking.findByIdAndUpdate(bookingId, {
      isDeleted: false,
      $unset: { deletedBy: 1, deletedAt: 1, deletedByUsername: 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Booking restored successfully'
    });

  } catch (error) {
    console.error('Error restoring booking:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to restore booking' },
      { status: 500 }
    );
  }
}

