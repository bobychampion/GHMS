import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface BookingConfirmationData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  bookingReference: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  numberOfGuests: number;
  specialRequests?: string;
}

export async function sendBookingConfirmationEmail(data: BookingConfirmationData) {
  try {
    // For demo purposes, we'll simulate email sending
    // In production, configure EMAIL_USER and EMAIL_PASS environment variables
    console.log('=== EMAIL CONFIRMATION ===');
    console.log('To:', data.guestEmail);
    console.log('Subject: Booking Confirmation -', data.bookingReference);
    console.log('Guest:', data.guestName);
    console.log('Room:', data.roomType);
    console.log('Check-in:', data.checkInDate);
    console.log('Check-out:', data.checkOutDate);
    console.log('Amount: ₦' + data.totalAmount.toLocaleString());
    console.log('========================');
    
    return { success: true, message: 'Confirmation email sent successfully (simulated)' };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
}

export async function sendBookingSMS(data: BookingConfirmationData) {
  try {
    // For demo purposes, we'll simulate SMS sending
    // In production, integrate with SMS service like Twilio
    const message = `Dear ${data.guestName}, your booking ${data.bookingReference} at Godatin Hotel is confirmed. Check-in: ${new Date(data.checkInDate).toLocaleDateString()}. Total: ₦${data.totalAmount.toLocaleString()}. For queries: +234 912 163 9047`;
    
    console.log('SMS would be sent to:', data.guestPhone);
    console.log('Message:', message);
    
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, message: 'Failed to send SMS' };
  }
}
