import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'super_admin' | 'admin' | 'frontdesk';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'frontdesk'], default: 'frontdesk' },
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);





