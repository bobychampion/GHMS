import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  roomType: string;
  price: number;
  description: string;
  photos: string[];
  status: 'available' | 'occupied' | 'maintenance';
  amenities: string[];
  maxOccupancy: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>({
  roomType: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  photos: [{ type: String }],
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  amenities: [{ type: String }],
  maxOccupancy: { type: Number, required: true },
}, {
  timestamps: true
});

export const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);

