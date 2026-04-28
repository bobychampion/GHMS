import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Guest } from '@/lib/models/Guest';
import { Payment } from '@/lib/models/Payment';
import { User } from '@/lib/models/User';
import { sendBookingConfirmationEmail, sendBookingSMS } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { guestInfo, roomType, checkInDate, checkOutDate, numberOfGuests, specialRequests, paymentMethod } = body;

    // Generate booking reference
    const bookingReference = `GH${Date.now().toString().slice(-6)}`;

    // Create or find guest
    let guest = await Guest.findOne({ email: guestInfo.email });
    if (!guest) {
      guest = new Guest({
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        address: guestInfo.address || 'Not provided',
        bookingHistory: []
      });
      await guest.save();
    }

    // Calculate total amount (simplified - you'd get this from room data)
    const roomPrices: { [key: string]: number } = {
      'Alcove': 20000,
      'Deluxe': 25000,
      'Special Deluxe': 30000,
      'Executive Suite': 40000,
      'Appartment Suite': 80000
    };

    const nights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = roomPrices[roomType] * nights;

    // Create booking
    const booking = new Booking({
      guestId: guest._id,
      roomType,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      numberOfGuests,
      specialRequests,
      totalAmount,
      status: paymentMethod === 'bank_transfer' ? 'pending' : 'confirmed',
      paymentStatus: paymentMethod === 'bank_transfer' ? 'pending' : 'pending',
      bookingReference
    });

    await booking.save();

    // Create payment record
    const payment = new Payment({
      bookingId: booking._id,
      method: paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'cash',
      amount: totalAmount,
      status: paymentMethod === 'bank_transfer' ? 'pending' : 'pending',
      bookingReference
    });

    await payment.save();

    // Update guest booking history
    guest.bookingHistory.push(booking._id);
    await guest.save();

    // Send confirmation email and SMS
    const confirmationData = {
      guestName: guestInfo.name,
      guestEmail: guestInfo.email,
      guestPhone: guestInfo.phone,
      bookingReference,
      roomType,
      checkInDate,
      checkOutDate,
      totalAmount,
      numberOfGuests,
      specialRequests
    };

    // Send email confirmation
    await sendBookingConfirmationEmail(confirmationData);
    
    // Send SMS confirmation
    await sendBookingSMS(confirmationData);

    return NextResponse.json({
      success: true,
      bookingId: booking._id,
      bookingReference,
      message: 'Booking created successfully. Confirmation email and SMS sent.'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query: any = { isDeleted: { $ne: true } };
    if (status) query.status = status;
    if (date) {
      const targetDate = new Date(date);
      query.checkInDate = { $lte: targetDate };
      query.checkOutDate = { $gte: targetDate };
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'guestId',
        match: { isDeleted: { $ne: true } },
        select: 'name email phone'
      })
      .sort({ createdAt: -1 })
      .then(bookings => bookings.filter(booking => booking.guestId !== null));

    // Fetch payment information for each booking
    const bookingsWithPayment = await Promise.all(
      bookings.map(async (booking) => {
        const payment = await Payment.findOne({ bookingId: booking._id });
        return {
          ...booking.toObject(),
          paymentMethod: payment?.method || null
        };
      })
    );

    return NextResponse.json({
      success: true,
      bookings: bookingsWithPayment
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// Delete a booking (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('role');

    if (!bookingId || !userId || !userRole) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if user has permission (admin, frontdesk, or super_admin can delete)
    if (!['admin', 'frontdesk', 'super_admin'].includes(userRole)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Insufficient permissions' },
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

    if (booking.isDeleted) {
      return NextResponse.json(
        { success: false, message: 'Booking is already deleted' },
        { status: 400 }
      );
    }

    // Get user info for tracking
    const user = await User.findById(userId);
    const deletedByUsername = user?.username || 'Unknown';

    // Soft delete the booking
    await Booking.findByIdAndUpdate(bookingId, {
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
      deletedByUsername
    });

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
