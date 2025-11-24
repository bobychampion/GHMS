import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Guest } from '@/lib/models/Guest';
import { User } from '@/lib/models/User';

// Get all guests (excluding deleted ones by default)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const userRole = searchParams.get('role');
    const userId = searchParams.get('userId');

    let query: any = {};
    
    // Only show deleted guests to super_admin
    if (!includeDeleted || userRole !== 'super_admin') {
      query.isDeleted = false;
    }

    const guests = await Guest.find(query)
      .populate('bookingHistory')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      guests
    });

  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

// Delete a guest (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('role');

    if (!guestId || !userId || !userRole) {
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

    const guest = await Guest.findById(guestId);
    
    if (!guest) {
      return NextResponse.json(
        { success: false, message: 'Guest not found' },
        { status: 404 }
      );
    }

    if (guest.isDeleted) {
      return NextResponse.json(
        { success: false, message: 'Guest is already deleted' },
        { status: 400 }
      );
    }

    // Get user info for tracking
    const user = await User.findById(userId);
    const deletedByUsername = user?.username || 'Unknown';

    // Soft delete the guest
    await Guest.findByIdAndUpdate(guestId, {
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
      deletedByUsername
    });

    return NextResponse.json({
      success: true,
      message: 'Guest deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete guest' },
      { status: 500 }
    );
  }
}

