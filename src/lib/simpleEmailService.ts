// Simple email service using a different approach
// This will work without sender verification for testing

export const sendEmail = async (
  to: string,
  templateType: 'checkin' | 'checkout' | 'payment',
  data: {
    guestName: string;
    checkInDate?: string;
    checkOutDate?: string;
    bookingRef: string;
    amount?: number;
  }
) => {
  try {
    // For now, we'll simulate email sending
    // In production, you would use SendGrid with verified sender
    
    const template = getEmailTemplate(templateType, data);
    
    console.log('📧 Email would be sent to:', to);
    console.log('📧 Subject:', template.subject);
    console.log('📧 Guest:', data.guestName);
    console.log('📧 Booking Ref:', data.bookingRef);
    
    // Simulate successful email sending
    return {
      success: true,
      messageId: `sim_${Date.now()}`,
      message: 'Email sent successfully (simulated)'
    };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to send email'
    };
  }
};

// Test email function
export const testEmailConnection = async () => {
  try {
    console.log('📧 Email service connection test');
    console.log('📧 SendGrid API Key:', process.env.SENDGRID_API_KEY ? 'Configured' : 'Not configured');
    console.log('📧 From Email:', process.env.FROM_EMAIL || 'Not configured');
    
    return { 
      success: true, 
      message: 'Email service ready (simulated mode)',
      note: 'To enable real email sending, verify sender in SendGrid dashboard'
    };
  } catch (error) {
    console.error('Email service test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Email service test failed' 
    };
  }
};

// Email templates
const getEmailTemplate = (templateType: 'checkin' | 'checkout' | 'payment', data: any) => {
  const templates = {
    checkin: {
      subject: 'Welcome to Godatin Hotel - Check-in Reminder',
      content: `Dear ${data.guestName},\n\nWelcome to Godatin Hotel! Your check-in is scheduled for ${data.checkInDate}.\n\nBooking Reference: ${data.bookingRef}\n\nWe look forward to providing you with an exceptional stay experience.\n\nBest regards,\nThe Godatin Hotel Team`
    },
    checkout: {
      subject: 'Check-out Reminder - Godatin Hotel',
      content: `Dear ${data.guestName},\n\nWe hope you've enjoyed your stay! Your check-out is scheduled for ${data.checkOutDate}.\n\nBooking Reference: ${data.bookingRef}\n\nPlease ensure all belongings are collected and return your room key.\n\nThank you for choosing Godatin Hotel!\n\nBest regards,\nThe Godatin Hotel Team`
    },
    payment: {
      subject: 'Payment Confirmation - Godatin Hotel',
      content: `Dear ${data.guestName},\n\nYour payment has been successfully processed!\n\nBooking Reference: ${data.bookingRef}\nAmount Paid: ₦${data.amount?.toLocaleString()}\nPayment Date: ${new Date().toLocaleDateString()}\n\nThank you for choosing Godatin Hotel!\n\nBest regards,\nThe Godatin Hotel Team`
    }
  };
  
  return templates[templateType];
};
