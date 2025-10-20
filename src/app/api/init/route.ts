import { NextRequest, NextResponse } from 'next/server';
import { initializeRooms } from '@/lib/init-db';

export async function POST(request: NextRequest) {
  try {
    const result = await initializeRooms();
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error in init API:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

