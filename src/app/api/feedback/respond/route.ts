import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { feedbackId, response } = body;
    
    // Mock feedback response
    const feedbackResponse = {
      id: feedbackId,
      response,
      respondedAt: new Date().toISOString(),
      status: 'responded'
    };
    
    // In a real app, you would:
    // 1. Find the feedback by ID
    // 2. Update with response
    // 3. Send email to guest
    // 4. Save to database
    
    return NextResponse.json({
      success: true,
      feedbackResponse,
      message: 'Response sent successfully'
    });

  } catch (error) {
    console.error('Error sending feedback response:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send response' },
      { status: 500 }
    );
  }
}
