import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Guest } from '@/lib/models/Guest';
import { Payment } from '@/lib/models/Payment';
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
      'Alcove': 15000,
      'Deluxe': 20000,
      'Special Deluxe': 25000,
      'Executive Suite': 35000,
      'Diplomatic Suite': 50000
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

    let query: any = {};
    if (status) query.status = status;
    if (date) {
      const targetDate = new Date(date);
      query.checkInDate = { $lte: targetDate };
      query.checkOutDate = { $gte: targetDate };
    }

    const bookings = await Booking.find(query)
      .populate('guestId', 'name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
