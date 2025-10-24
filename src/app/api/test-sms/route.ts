import { NextRequest, NextResponse } from 'next/server';
import { testSMSConnection, sendSMS } from '@/lib/smsService';

export async function GET(request: NextRequest) {
  try {
    const result = await testSMSConnection();
    return NextResponse.json(result);
  } catch (error) {
    console.error('SMS test error:', error);
    return NextResponse.json(
      { success: false, message: 'SMS test failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, templateType, data } = body;

    if (!phoneNumber || !templateType || !data) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendSMS(phoneNumber, templateType, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('SMS send error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}
