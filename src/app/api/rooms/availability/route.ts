import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { roomTypes } from '@/data/rooms';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const targetDate = dateParam ? new Date(dateParam) : new Date();

    // Get all bookings that overlap with the target date
    const bookings = await Booking.find({
      $and: [
        { checkInDate: { $lte: targetDate } },
        { checkOutDate: { $gt: targetDate } },
        { status: { $in: ['confirmed', 'checked-in'] } }
      ]
    }).populate('guestId');

    // Calculate availability for each room type
    const roomAvailability = roomTypes.map(roomType => {
      const bookingsForRoomType = bookings.filter(booking => 
        booking.roomType === roomType.roomType
      );

      // Mock data for total rooms per type (in real system, this would come from database)
      const totalRoomsPerType = {
        'Alcove': 5,
        'Deluxe': 8,
        'Special Deluxe': 6,
        'Executive Suite': 4,
        'Diplomatic Suite': 2
      };

      const totalRooms = totalRoomsPerType[roomType.roomType as keyof typeof totalRoomsPerType] || 1;
      const bookedRooms = bookingsForRoomType.length;
      const maintenanceRooms = 0; // Could be tracked in database
      const availableRooms = totalRooms - bookedRooms - maintenanceRooms;

      return {
        roomType: roomType.roomType,
        totalRooms,
        availableRooms: Math.max(0, availableRooms),
        bookedRooms,
        maintenanceRooms,
        occupancyRate: Math.round((bookedRooms / totalRooms) * 100)
      };
    });

    return NextResponse.json({
      success: true,
      data: roomAvailability,
      date: targetDate.toISOString(),
      totalRooms: roomAvailability.reduce((sum, room) => sum + room.totalRooms, 0),
      totalAvailable: roomAvailability.reduce((sum, room) => sum + room.availableRooms, 0),
      totalBooked: roomAvailability.reduce((sum, room) => sum + room.bookedRooms, 0)
    });

  } catch (error) {
    console.error('Error fetching room availability:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch room availability' },
      { status: 500 }
    );
  }
}
