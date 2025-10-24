import { NextRequest, NextResponse } from 'next/server';
import { testEmailConnection, sendEmail } from '@/lib/simpleEmailService';

export async function GET(request: NextRequest) {
  try {
    const result = await testEmailConnection();
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      error: result.error || null
    });

  } catch (error) {
    console.error('Error testing email connection:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to test email connection' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, templateType, data } = body;
    
    const result = await sendEmail(to, templateType, data);
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      messageId: result.messageId,
      error: result.error || null
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
