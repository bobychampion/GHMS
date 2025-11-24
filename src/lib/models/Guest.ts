import mongoose, { Document, Schema } from 'mongoose';

export interface IGuest extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  bookingHistory: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  deletedBy?: mongoose.Types.ObjectId;
  deletedAt?: Date;
  deletedByUsername?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  bookingHistory: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  isDeleted: { type: Boolean, default: false },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
  deletedByUsername: { type: String },
}, {
  timestamps: true
});

export const Guest = mongoose.models.Guest || mongoose.model<IGuest>('Guest', GuestSchema);





