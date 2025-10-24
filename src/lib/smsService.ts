import axios from 'axios';

// SMSLive247 API configuration
const SMS_API_BASE_URL = 'https://api.smslive247.com/api/v5';
const SMS_API_KEY = process.env.SMSLIVE247_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID || 'GODATIN';

// SMS templates
const smsTemplates = {
  checkin: {
    message: (guestName: string, checkInDate: string, bookingRef: string) => 
      `Dear ${guestName}, welcome to Godatin Hotel! Your check-in is scheduled for ${new Date(checkInDate).toLocaleDateString()}. Booking Ref: ${bookingRef}. We look forward to welcoming you!`
  },
  checkout: {
    message: (guestName: string, checkOutDate: string, bookingRef: string) => 
      `Dear ${guestName}, your check-out from Godatin Hotel is scheduled for ${new Date(checkOutDate).toLocaleDateString()}. Booking Ref: ${bookingRef}. Please ensure all belongings are collected.`
  },
  payment: {
    message: (guestName: string, bookingRef: string, amount: number) => 
      `Dear ${guestName}, your payment for booking ${bookingRef} has been confirmed. Amount: ₦${amount.toLocaleString()}. Thank you for choosing Godatin Hotel!`
  }
};

// Send SMS function using SMSLive247 API
export const sendSMS = async (
  phoneNumber: string,
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
    if (!SMS_API_KEY) {
      throw new Error('SMSLive247 API key not configured');
    }

    const template = smsTemplates[templateType];
    
    let message = '';
    switch (templateType) {
      case 'checkin':
        message = template.message(data.guestName, data.checkInDate!, data.bookingRef);
        break;
      case 'checkout':
        message = template.message(data.guestName, data.checkOutDate!, data.bookingRef);
        break;
      case 'payment':
        message = template.message(data.guestName, data.bookingRef, data.amount!);
        break;
    }

    // Format phone number (ensure it starts with country code)
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const smsData = {
      to: formattedPhone,
      message: message,
      senderId: SMS_SENDER_ID
    };

    console.log('📱 SMS would be sent to:', formattedPhone);
    console.log('📱 Message:', message);
    console.log('📱 Sender ID:', SMS_SENDER_ID);

    // For now, simulate SMS sending
    // In production, uncomment the actual API call below
    /*
    const response = await axios.post(`${SMS_API_BASE_URL}/sms`, smsData, {
      headers: {
        'Authorization': `Bearer ${SMS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('SMS sent successfully:', response.data);
    */

    // Simulate successful SMS sending
    return {
      success: true,
      messageId: `sms_${Date.now()}`,
      message: 'SMS sent successfully (simulated)',
      phoneNumber: formattedPhone,
      smsContent: message
    };
    
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to send SMS'
    };
  }
};

// Test SMS connection
export const testSMSConnection = async () => {
  try {
    if (!SMS_API_KEY) {
      throw new Error('SMSLive247 API key not configured');
    }
    
    console.log('📱 SMS service connection test');
    console.log('📱 SMSLive247 API Key:', SMS_API_KEY ? 'Configured' : 'Not configured');
    console.log('📱 Sender ID:', SMS_SENDER_ID);
    
    return { 
      success: true, 
      message: 'SMS service ready (simulated mode)',
      note: 'To enable real SMS sending, configure SMSLive247 API key and verify sender ID'
    };
  } catch (error) {
    console.error('SMS service test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'SMS service test failed' 
    };
  }
};

// Format phone number to include country code
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it starts with 0, replace with +234 (Nigeria)
  if (cleaned.startsWith('0')) {
    return '+234' + cleaned.substring(1);
  }
  
  // If it doesn't start with +, add +234
  if (!cleaned.startsWith('+')) {
    return '+234' + cleaned;
  }
  
  return '+' + cleaned;
};

// Get SMS templates for display
export const getSMSTemplates = () => {
  return [
    {
      id: 'checkin',
      name: 'Check-in Reminder',
      type: 'checkin',
      message: 'Dear {{guestName}}, welcome to Godatin Hotel! Your check-in is scheduled for {{checkInDate}}. Booking Ref: {{bookingRef}}. We look forward to welcoming you!',
      timing: '24hours'
    },
    {
      id: 'checkout',
      name: 'Check-out Reminder',
      type: 'checkout',
      message: 'Dear {{guestName}}, your check-out from Godatin Hotel is scheduled for {{checkOutDate}}. Booking Ref: {{bookingRef}}. Please ensure all belongings are collected.',
      timing: '1hour'
    },
    {
      id: 'payment',
      name: 'Payment Confirmation',
      type: 'payment',
      message: 'Dear {{guestName}}, your payment for booking {{bookingRef}} has been confirmed. Amount: ₦{{amount}}. Thank you for choosing Godatin Hotel!',
      timing: 'immediate'
    }
  ];
};
