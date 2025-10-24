import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Payment } from '@/lib/models/Payment';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { bookingId, action, extraCharges = 0, notes } = body;

    const booking = await Booking.findById(bookingId).populate('guestId');
    
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    let updatedBooking;
    let updatedPayment;

    switch (action) {
      case 'check-in':
        if (booking.status !== 'confirmed') {
          return NextResponse.json(
            { success: false, message: 'Booking must be confirmed before check-in' },
            { status: 400 }
          );
        }

        updatedBooking = await Booking.findByIdAndUpdate(
          bookingId,
          { 
            status: 'checked-in',
            checkInTime: new Date(),
            extraCharges,
            notes
          },
          { new: true }
        );

        // Update payment if there are extra charges
        if (extraCharges > 0) {
          updatedPayment = await Payment.findOneAndUpdate(
            { bookingId },
            { 
              amount: booking.totalAmount + extraCharges,
              status: 'pending'
            },
            { new: true }
          );
        }

        break;

      case 'check-out':
        if (booking.status !== 'checked-in') {
          return NextResponse.json(
            { success: false, message: 'Guest must be checked-in before check-out' },
            { status: 400 }
          );
        }

        const finalAmount = booking.totalAmount + extraCharges;
        
        updatedBooking = await Booking.findByIdAndUpdate(
          bookingId,
          { 
            status: 'checked-out',
            checkOutTime: new Date(),
            extraCharges,
            notes,
            finalAmount
          },
          { new: true }
        );

        // Update payment status
        updatedPayment = await Payment.findOneAndUpdate(
          { bookingId },
          { 
            amount: finalAmount,
            status: 'completed'
          },
          { new: true }
        );

        break;

      case 'confirm-payment':
        if (booking.status !== 'pending') {
          return NextResponse.json(
            { success: false, message: 'Only pending bookings can have payment confirmed' },
            { status: 400 }
          );
        }

        updatedBooking = await Booking.findByIdAndUpdate(
          bookingId,
          { 
            status: 'confirmed',
            paymentStatus: 'paid'
          },
          { new: true }
        );

        updatedPayment = await Payment.findOneAndUpdate(
          { bookingId },
          { 
            status: 'completed',
            paymentDate: new Date()
          },
          { new: true }
        );

        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      payment: updatedPayment,
      message: `Booking ${action} successful`
    });

  } catch (error) {
    console.error('Error processing check-in/check-out:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const targetDate = new Date(date);

    // Get today's check-ins
    const todayCheckIns = await Booking.find({
      checkInDate: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['confirmed', 'checked-in'] }
    }).populate('guestId');

    // Get today's check-outs
    const todayCheckOuts = await Booking.find({
      checkOutDate: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['checked-in', 'checked-out'] }
    }).populate('guestId');

    // Get current guests (checked-in)
    const currentGuests = await Booking.find({
      status: 'checked-in',
      checkInDate: { $lte: targetDate },
      checkOutDate: { $gte: targetDate }
    }).populate('guestId');

    return NextResponse.json({
      success: true,
      data: {
        checkIns: todayCheckIns,
        checkOuts: todayCheckOuts,
        currentGuests
      }
    });

  } catch (error) {
    console.error('Error fetching check-in/check-out data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}





