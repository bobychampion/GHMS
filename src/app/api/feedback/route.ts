import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// Mock data for guest feedback
const mockFeedback = [
  {
    id: '1',
    guestName: 'Sarah Wilson',
    guestEmail: 'sarah.wilson@email.com',
    bookingReference: 'GH123456',
    roomType: 'Deluxe',
    checkInDate: new Date(Date.now() - 172800000).toISOString(),
    checkOutDate: new Date(Date.now() - 86400000).toISOString(),
    overallRating: 5,
    cleanlinessRating: 5,
    serviceRating: 4,
    amenitiesRating: 5,
    valueRating: 4,
    comments: 'Excellent stay! The room was spotless and the staff was very helpful. The amenities were great and the location was perfect.',
    status: 'responded',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    response: 'Thank you for your wonderful feedback! We\'re delighted you enjoyed your stay with us.',
    respondedAt: new Date(Date.now() - 43200000).toISOString(),
    tags: ['excellent', 'clean', 'helpful']
  },
  {
    id: '2',
    guestName: 'David Brown',
    guestEmail: 'david.brown@email.com',
    bookingReference: 'GH123457',
    roomType: 'Executive Suite',
    checkInDate: new Date(Date.now() - 259200000).toISOString(),
    checkOutDate: new Date(Date.now() - 172800000).toISOString(),
    overallRating: 3,
    cleanlinessRating: 4,
    serviceRating: 3,
    amenitiesRating: 2,
    valueRating: 3,
    comments: 'The room was clean but the WiFi was very slow and the air conditioning wasn\'t working properly. Staff was friendly but couldn\'t fix the issues.',
    status: 'reviewed',
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['wifi-issue', 'ac-problem', 'friendly-staff']
  },
  {
    id: '3',
    guestName: 'Lisa Davis',
    guestEmail: 'lisa.davis@email.com',
    bookingReference: 'GH123458',
    roomType: 'Special Deluxe',
    checkInDate: new Date(Date.now() - 345600000).toISOString(),
    checkOutDate: new Date(Date.now() - 259200000).toISOString(),
    overallRating: 4,
    cleanlinessRating: 4,
    serviceRating: 5,
    amenitiesRating: 4,
    valueRating: 4,
    comments: 'Great hotel with excellent service. The staff went above and beyond to make our stay comfortable. Room was clean and well-appointed.',
    status: 'pending',
    submittedAt: new Date(Date.now() - 259200000).toISOString(),
    tags: ['excellent-service', 'clean', 'comfortable']
  }
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let feedbacks = mockFeedback;
    
    if (status && status !== 'all') {
      feedbacks = feedbacks.filter(feedback => feedback.status === status);
    }
    
    const averageRating = feedbacks.length > 0 
      ? feedbacks.reduce((sum, f) => sum + f.overallRating, 0) / feedbacks.length 
      : 0;
    
    return NextResponse.json({
      success: true,
      feedbacks,
      total: feedbacks.length,
      averageRating: Math.round(averageRating * 10) / 10,
      pending: feedbacks.filter(f => f.status === 'pending').length,
      reviewed: feedbacks.filter(f => f.status === 'reviewed').length,
      responded: feedbacks.filter(f => f.status === 'responded').length
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newFeedback = {
      id: Date.now().toString(),
      ...body,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      tags: []
    };
    
    // In a real app, you would save to database here
    mockFeedback.push(newFeedback);
    
    return NextResponse.json({
      success: true,
      feedback: newFeedback,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
