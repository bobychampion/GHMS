import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    guestName: 'John Doe',
    guestEmail: 'john.doe@email.com',
    guestPhone: '+234 801 234 5678',
    bookingReference: 'GH123456',
    roomType: 'Deluxe',
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date(Date.now() + 86400000).toISOString(),
    notificationType: 'checkin',
    status: 'sent',
    sentAt: new Date().toISOString(),
    message: 'Welcome to Godatin Hotel! Your check-in is scheduled for today.'
  },
  {
    id: '2',
    guestName: 'Jane Smith',
    guestEmail: 'jane.smith@email.com',
    guestPhone: '+234 802 345 6789',
    bookingReference: 'GH123457',
    roomType: 'Executive Suite',
    checkInDate: new Date(Date.now() - 86400000).toISOString(),
    checkOutDate: new Date().toISOString(),
    notificationType: 'checkout',
    status: 'pending',
    message: 'Your check-out is scheduled for today. Please ensure all belongings are collected.'
  },
  {
    id: '3',
    guestName: 'Mike Johnson',
    guestEmail: 'mike.johnson@email.com',
    guestPhone: '+234 803 456 7890',
    bookingReference: 'GH123458',
    roomType: 'Special Deluxe',
    checkInDate: new Date(Date.now() + 172800000).toISOString(),
    checkOutDate: new Date(Date.now() + 259200000).toISOString(),
    notificationType: 'payment',
    status: 'sent',
    sentAt: new Date().toISOString(),
    message: 'Your payment for booking GH123458 has been confirmed. Thank you for choosing Godatin Hotel!'
  }
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let notifications = mockNotifications;
    
    if (status && status !== 'all') {
      notifications = notifications.filter(notification => notification.status === status);
    }
    
    return NextResponse.json({
      success: true,
      notifications,
      total: notifications.length,
      sent: notifications.filter(n => n.status === 'sent').length,
      pending: notifications.filter(n => n.status === 'pending').length,
      failed: notifications.filter(n => n.status === 'failed').length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newNotification = {
      id: Date.now().toString(),
      ...body,
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    
    // In a real app, you would save to database here
    mockNotifications.push(newNotification);
    
    return NextResponse.json({
      success: true,
      notification: newNotification,
      message: 'Notification sent successfully'
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
