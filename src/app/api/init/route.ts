import { NextRequest, NextResponse } from 'next/server';
import { initializeRooms } from '@/lib/init-db';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Initialize rooms
    const roomResult = await initializeRooms();
    
    // Initialize users
    const hashPassword = (password: string) => {
      return crypto.createHash('sha256').update(password).digest('hex');
    };

    const users = [
      {
        username: 'superadmin',
        passwordHash: hashPassword('superadmin123'),
        role: 'super_admin' as const
      },
      {
        username: 'admin',
        passwordHash: hashPassword('admin123'),
        role: 'admin' as const
      },
      {
        username: 'frontdesk',
        passwordHash: hashPassword('frontdesk123'),
        role: 'frontdesk' as const
      }
    ];

    const createdUsers = [];
    
    for (const userData of users) {
      const existingUser = await User.findOne({ username: userData.username });
      
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        createdUsers.push({
          username: user.username,
          role: user.role,
          status: 'created'
        });
      } else {
        // Update password hash and role to ensure they match
        existingUser.passwordHash = userData.passwordHash;
        existingUser.role = userData.role;
        await existingUser.save();
        createdUsers.push({
          username: existingUser.username,
          role: existingUser.role,
          status: 'updated'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      rooms: roomResult,
      users: createdUsers
    });
    
  } catch (error) {
    console.error('Error in init API:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}





