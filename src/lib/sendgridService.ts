import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Simple email templates
const emailTemplates = {
  checkin: {
    subject: 'Welcome to Godatin Hotel - Check-in Reminder',
    template: (guestName: string, checkInDate: string, bookingRef: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #d97706); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Godatin Hotel</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Warri, Delta State</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e3a8a; margin-top: 0;">Dear ${guestName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            We're excited to welcome you to Godatin Hotel! Your check-in is scheduled for:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">
              Check-in Date: ${new Date(checkInDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p style="margin: 5px 0 0 0; color: #6b7280;">
              Booking Reference: ${bookingRef}
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            We look forward to providing you with an exceptional stay experience. 
            If you have any special requests or need assistance, please don't hesitate to contact us.
          </p>
          
          <div style="background: #1e3a8a; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Information</h3>
            <p style="margin: 5px 0;">📞 Phone: +234 912 163 9047</p>
            <p style="margin: 5px 0;">📧 Email: info@godatinhotel.com</p>
            <p style="margin: 5px 0;">📍 Address: Warri, Delta State, Nigeria</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thank you for choosing Godatin Hotel. We can't wait to welcome you!
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Best regards,<br>
            <strong>The Godatin Hotel Team</strong>
          </p>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 Godatin Hotel. All rights reserved.
          </p>
        </div>
      </div>
    `
  },
  
  checkout: {
    subject: 'Check-out Reminder - Godatin Hotel',
    template: (guestName: string, checkOutDate: string, bookingRef: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #d97706); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Godatin Hotel</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Warri, Delta State</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e3a8a; margin-top: 0;">Dear ${guestName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            We hope you've enjoyed your stay with us! Your check-out is scheduled for:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">
              Check-out Date: ${new Date(checkOutDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p style="margin: 5px 0 0 0; color: #6b7280;">
              Booking Reference: ${bookingRef}
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Please ensure all your belongings are collected and return your room key to the front desk.
            Check-out time is 11:00 AM.
          </p>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-weight: bold;">
              💡 Reminder: Please check all drawers, closets, and bathroom areas for personal items.
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thank you for choosing Godatin Hotel. We hope to welcome you back soon!
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Best regards,<br>
            <strong>The Godatin Hotel Team</strong>
          </p>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 Godatin Hotel. All rights reserved.
          </p>
        </div>
      </div>
    `
  },
  
  payment: {
    subject: 'Payment Confirmation - Godatin Hotel',
    template: (guestName: string, bookingRef: string, amount: number) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #d97706); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Payment Confirmed</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Godatin Hotel</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e3a8a; margin-top: 0;">Dear ${guestName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Your payment has been successfully processed! Here are your booking details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">
              Booking Reference: ${bookingRef}
            </p>
            <p style="margin: 5px 0 0 0; color: #6b7280;">
              Amount Paid: ₦${amount.toLocaleString()}
            </p>
            <p style="margin: 5px 0 0 0; color: #6b7280;">
              Payment Date: ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div style="background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #065f46; font-weight: bold;">
              ✅ Payment Status: Confirmed
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thank you for choosing Godatin Hotel. We look forward to providing you with an exceptional stay experience.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            If you have any questions about your booking, please contact us at +234 912 163 9047.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Best regards,<br>
            <strong>The Godatin Hotel Team</strong>
          </p>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 Godatin Hotel. All rights reserved.
          </p>
        </div>
      </div>
    `
  }
};

// Send email function using SendGrid
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
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    const template = emailTemplates[templateType];
    
    let htmlContent = '';
    switch (templateType) {
      case 'checkin':
        htmlContent = template.template(data.guestName, data.checkInDate!, data.bookingRef);
        break;
      case 'checkout':
        htmlContent = template.template(data.guestName, data.checkOutDate!, data.bookingRef);
        break;
      case 'payment':
        htmlContent = template.template(data.guestName, data.bookingRef, data.amount!);
        break;
    }
    
    const msg = {
      to: to,
      from: 'bobychampion87@gmail.com', // Use verified email
      subject: template.subject,
      html: htmlContent,
    };
    
    const result = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid:', result[0].statusCode);
    
    return {
      success: true,
      messageId: result[0].headers['x-message-id'],
      message: 'Email sent successfully via SendGrid'
    };
    
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to send email via SendGrid'
    };
  }
};

// Test email function
export const testEmailConnection = async () => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }
    
    // Test with a simple API call
    const testMsg = {
      to: 'bobychampion87@gmail.com',
      from: 'bobychampion87@gmail.com',
      subject: 'Test Email from Godatin Hotel',
      text: 'This is a test email from Godatin Hotel system.',
      html: '<h2>Test Email</h2><p>This is a test email from Godatin Hotel system.</p>'
    };
    
    await sgMail.send(testMsg);
    console.log('SendGrid connection verified');
    return { success: true, message: 'SendGrid connection verified' };
  } catch (error) {
    console.error('SendGrid connection failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SendGrid connection failed' 
    };
  }
};