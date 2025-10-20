import connectDB from '@/lib/mongodb';
import { Room } from '@/lib/models/Room';
import { roomTypes } from '@/data/rooms';

export async function initializeRooms() {
  try {
    await connectDB();
    
    // Clear existing rooms
    await Room.deleteMany({});
    
    // Insert room types
    for (const roomData of roomTypes) {
      const room = new Room(roomData);
      await room.save();
    }
    
    console.log('Rooms initialized successfully');
    return { success: true, message: 'Rooms initialized successfully' };
  } catch (error) {
    console.error('Error initializing rooms:', error);
    return { success: false, message: 'Failed to initialize rooms' };
  }
}

