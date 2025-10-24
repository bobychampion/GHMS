import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { sendEmail } from '@/lib/simpleEmailService';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { bookingId, templateId, guestEmail, guestName, bookingRef, checkInDate, checkOutDate, amount } = body;
    
    // Determine template type based on templateId
    let templateType: 'checkin' | 'checkout' | 'payment' = 'checkin';
    switch (templateId) {
      case '1': templateType = 'checkin'; break;
      case '2': templateType = 'checkout'; break;
      case '3': templateType = 'payment'; break;
    }
    
    // Send email
    const emailResult = await sendEmail(guestEmail, templateType, {
      guestName,
      checkInDate,
      checkOutDate,
      bookingRef,
      amount
    });
    
    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to send email', error: emailResult.error },
        { status: 500 }
      );
    }
    
    // Mock notification record
    const notification = {
      id: Date.now().toString(),
      bookingId,
      templateId,
      guestEmail,
      guestName,
      bookingRef,
      templateType,
      status: 'sent',
      sentAt: new Date().toISOString(),
      messageId: emailResult.messageId,
      message: 'Notification sent successfully via email'
    };
    
    return NextResponse.json({
      success: true,
      notification,
      message: 'Email notification sent successfully'
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
