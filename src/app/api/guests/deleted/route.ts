import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Guest } from '@/lib/models/Guest';
import { User } from '@/lib/models/User';

// Get all deleted guests (super admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('role');

    // Only super_admin can view deleted guests
    if (userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Only super admin can view deleted guests' },
        { status: 403 }
      );
    }

    const deletedGuests = await Guest.find({ isDeleted: true })
      .populate('deletedBy', 'username role')
      .populate('bookingHistory')
      .sort({ deletedAt: -1 });

    return NextResponse.json({
      success: true,
      guests: deletedGuests
    });

  } catch (error) {
    console.error('Error fetching deleted guests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch deleted guests' },
      { status: 500 }
    );
  }
}

// Restore a deleted guest (super admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { guestId, userRole } = await request.json();

    // Only super_admin can restore guests
    if (userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Only super admin can restore guests' },
        { status: 403 }
      );
    }

    const guest = await Guest.findById(guestId);
    
    if (!guest) {
      return NextResponse.json(
        { success: false, message: 'Guest not found' },
        { status: 404 }
      );
    }

    if (!guest.isDeleted) {
      return NextResponse.json(
        { success: false, message: 'Guest is not deleted' },
        { status: 400 }
      );
    }

    // Restore the guest
    await Guest.findByIdAndUpdate(guestId, {
      isDeleted: false,
      $unset: { deletedBy: 1, deletedAt: 1, deletedByUsername: 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Guest restored successfully'
    });

  } catch (error) {
    console.error('Error restoring guest:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to restore guest' },
      { status: 500 }
    );
  }
}

