import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'godatin-hotel-secret-change-in-production';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    return NextResponse.json({ success: true, user: { id: payload.id, username: payload.username, role: payload.role } });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid or expired session' }, { status: 401 });
  }
}
