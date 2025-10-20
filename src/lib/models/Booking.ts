import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  guestId: mongoose.Types.ObjectId;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  numberOfGuests: number;
  specialRequests?: string;
  bookingReference: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  extraCharges?: number;
  finalAmount?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  guestId: { type: Schema.Types.ObjectId, ref: 'Guest', required: true },
  roomType: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'], 
    default: 'pending' 
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'partial', 'refunded'], 
    default: 'pending' 
  },
  numberOfGuests: { type: Number, required: true },
  specialRequests: { type: String },
  bookingReference: { type: String, required: true, unique: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  extraCharges: { type: Number, default: 0 },
  finalAmount: { type: Number },
  notes: { type: String },
}, {
  timestamps: true
});

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
