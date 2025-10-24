import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// Mock data for maintenance tasks
const mockMaintenanceTasks = [
  {
    id: '1',
    roomNumber: '101',
    roomType: 'Deluxe',
    issueType: 'cleaning',
    description: 'Deep cleaning required after guest checkout',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'Housekeeping Team',
    scheduledDate: new Date().toISOString(),
    estimatedDuration: 2,
    notes: 'Guest reported minor issues'
  },
  {
    id: '2',
    roomNumber: '205',
    roomType: 'Executive Suite',
    issueType: 'repair',
    description: 'Air conditioning unit needs maintenance',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Maintenance Team',
    scheduledDate: new Date().toISOString(),
    estimatedDuration: 4,
    notes: 'Unit making unusual noise'
  },
  {
    id: '3',
    roomNumber: '150',
    roomType: 'Special Deluxe',
    issueType: 'inspection',
    description: 'Monthly safety inspection',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Safety Inspector',
    scheduledDate: new Date(Date.now() - 86400000).toISOString(),
    completedDate: new Date().toISOString(),
    estimatedDuration: 1,
    actualDuration: 1,
    cost: 5000,
    notes: 'All safety checks passed'
  }
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let tasks = mockMaintenanceTasks;
    
    if (status && status !== 'all') {
      tasks = tasks.filter(task => task.status === status);
    }
    
    return NextResponse.json({
      success: true,
      tasks,
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    });

  } catch (error) {
    console.error('Error fetching maintenance tasks:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch maintenance tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newTask = {
      id: Date.now().toString(),
      ...body,
      status: 'pending',
      scheduledDate: body.scheduledDate || new Date().toISOString()
    };
    
    // In a real app, you would save to database here
    mockMaintenanceTasks.push(newTask);
    
    return NextResponse.json({
      success: true,
      task: newTask,
      message: 'Maintenance task created successfully'
    });

  } catch (error) {
    console.error('Error creating maintenance task:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create maintenance task' },
      { status: 500 }
    );
  }
}
