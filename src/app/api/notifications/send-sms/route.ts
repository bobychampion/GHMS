import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { sendSMS } from '@/lib/smsService';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      bookingId, 
      templateId, 
      guestPhone, 
      guestName, 
      bookingRef, 
      checkInDate, 
      checkOutDate, 
      amount 
    } = body;

    if (!guestPhone || !templateId || !guestName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: guestPhone, templateId, guestName' },
        { status: 400 }
      );
    }

    // Determine template type based on templateId
    let templateType: 'checkin' | 'checkout' | 'payment' = 'checkin';
    switch (templateId) {
      case '1': templateType = 'checkin'; break;
      case '2': templateType = 'checkout'; break;
      case '3': templateType = 'payment'; break;
    }

    // Send SMS
    const smsResult = await sendSMS(guestPhone, templateType, {
      guestName,
      checkInDate,
      checkOutDate,
      bookingRef,
      amount
    });

    if (!smsResult.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to send SMS', error: smsResult.error },
        { status: 500 }
      );
    }

    // Mock SMS notification record
    const notification = {
      id: Date.now().toString(),
      bookingId,
      templateId,
      guestPhone,
      guestName,
      bookingRef,
      templateType,
      status: 'sent',
      sentAt: new Date().toISOString(),
      messageId: smsResult.messageId,
      message: 'SMS notification sent successfully',
      smsContent: smsResult.smsContent
    };

    return NextResponse.json({
      success: true,
      notification,
      message: 'SMS notification sent successfully'
    });

  } catch (error) {
    console.error('Error sending SMS notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send SMS notification' },
      { status: 500 }
    );
  }
}
