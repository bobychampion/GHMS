import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  method: 'bank_transfer' | 'cash' | 'card';
  amount: number;
  transactionRef?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate: Date;
  bookingReference: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  method: { type: String, enum: ['bank_transfer', 'cash', 'card'], required: true },
  amount: { type: Number, required: true },
  transactionRef: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentDate: { type: Date, default: Date.now },
  bookingReference: { type: String, required: true },
}, {
  timestamps: true
});

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
