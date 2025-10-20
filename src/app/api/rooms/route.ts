import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Room } from '@/lib/models/Room';

export async function GET() {
  try {
    await connectDB();
    
    const rooms = await Room.find({ status: 'available' }).sort({ price: 1 });

    return NextResponse.json({
      success: true,
      rooms
    });

  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { roomType, price, description, photos, amenities, maxOccupancy } = body;

    const room = new Room({
      roomType,
      price,
      description,
      photos,
      amenities,
      maxOccupancy,
      status: 'available'
    });

    await room.save();

    return NextResponse.json({
      success: true,
      room,
      message: 'Room created successfully'
    });

  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create room' },
      { status: 500 }
    );
  }
}

