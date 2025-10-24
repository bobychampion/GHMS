# SMSLive247 SMS Setup Guide for Godatin Hotel

## 📱 **SMSLive247 SMS Notification Setup**

SMSLive247 is a professional SMS service provider that's perfect for hotel notifications!

### **Step 1: Create SMSLive247 Account**
1. Go to [smslive247.com](https://smslive247.com)
2. Click **"Sign Up"** or **"Register"**
3. Fill in your details:
   - **Company Name**: Godatin Hotel
   - **Email**: Your business email
   - **Phone**: Your business phone
4. **Verify your email** address

### **Step 2: Get API Key**
1. **Login to SMSLive247 Dashboard**
2. Go to **API Settings** or **Developer Tools**
3. Click **"Generate API Key"**
4. **Copy the API key** (it will look like: `sk_xxxxxxxxxxxxxxxx`)

### **Step 3: Set Up Sender ID**
1. Go to **Sender ID** section in dashboard
2. Click **"Add Sender ID"**
3. Enter: **"GODATIN"** (or your preferred sender name)
4. **Submit for approval** (usually takes 24-48 hours)
5. **Wait for approval** before using

### **Step 4: Update Environment Variables**
Add these to your `.env.local` file:

```env
MONGODB_URI=your-mongodb-connection-string

# SendGrid Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key-here
FROM_EMAIL=your-email@example.com

# SMSLive247 SMS Configuration
SMSLIVE247_API_KEY=your-smslive247-api-key-here
SMS_SENDER_ID=GODATIN
```

**Replace:**
- `your-smslive247-api-key-here` with your actual SMSLive247 API key
- `GODATIN` with your approved sender ID

### **Step 5: Test SMS Connection**
1. Start your development server: `npm run dev`
2. Test the connection: `curl http://localhost:3000/api/test-sms`
3. You should see: `{"success":true,"message":"SMS service ready"}`

### **Step 6: Send Test SMS**
```bash
curl -X POST http://localhost:3000/api/test-sms \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "08012345678",
    "templateType": "checkin",
    "data": {
      "guestName": "Test Guest",
      "checkInDate": "2024-10-25",
      "bookingRef": "GH123456"
    }
  }'
```

## 🎯 **SMSLive247 Benefits**

✅ **Easy Setup** - Just API key and sender ID  
✅ **Reliable Delivery** - High SMS delivery rates  
✅ **Nigerian Focus** - Optimized for Nigerian numbers  
✅ **Professional** - Used by major businesses  
✅ **Cost Effective** - Competitive pricing  
✅ **Real-time** - Instant SMS delivery  

## 📊 **Pricing (Approximate)**

- **Local SMS**: ₦3-5 per SMS
- **International SMS**: ₦15-25 per SMS
- **Bulk SMS**: Discounted rates for large volumes
- **Free Trial**: Usually includes free credits

## 🔧 **Features Included**

✅ **3 SMS Templates**:
- 🏨 **Check-in Reminder** - Welcome message
- 🚪 **Check-out Reminder** - Check-out details  
- 💳 **Payment Confirmation** - Payment details

✅ **Smart Phone Formatting**:
- **Auto-detects** Nigerian numbers
- **Adds +234** country code
- **Handles** various formats (080, +234, etc.)

✅ **Admin Dashboard Integration**:
- **Dual notification** (Email + SMS)
- **Template selection**
- **Guest data input**
- **Send status feedback**

## 📱 **Usage in Admin Dashboard**

1. Go to **Notifications** tab in admin dashboard
2. Click **"Send Notification"** button
3. **Select notification type**: Email or SMS
4. **Choose template** (Check-in, Check-out, Payment)
5. **Enter guest details**:
   - Name (required)
   - Email (for email notifications)
   - Phone (for SMS notifications)
   - Booking reference
   - Additional data based on template
6. **Click "Send SMS"** or **"Send Email"**

## 🚨 **Important Notes**

- **Sender ID Approval**: Required before sending SMS
- **Phone Format**: Supports Nigerian formats (080, 081, etc.)
- **API Key Security**: Keep your API key secure
- **Rate Limits**: Check SMSLive247 for sending limits
- **Delivery Reports**: Available in SMSLive247 dashboard

## 🔍 **Troubleshooting**

### **"API key not configured" Error**
- Check SMSLIVE247_API_KEY is set in .env.local
- Verify API key format (starts with `sk_`)
- Restart your development server

### **"Sender ID not approved" Error**
- Wait for sender ID approval (24-48 hours)
- Use approved sender ID only
- Check SMSLive247 dashboard for status

### **SMS not received**
- Check phone number format
- Verify sender ID is approved
- Check SMSLive247 delivery reports
- Ensure sufficient account balance

## 📞 **Support**

If you need help setting up SMSLive247:
- **SMSLive247 Support**: Available in dashboard
- **Documentation**: [smslive247api.readme.io](https://smslive247api.readme.io/v5.0/reference/introduction)
- **Hotel Support**: +234 912 163 9047

## 🆚 **SMS vs Email**

| Feature | SMS | Email |
|---------|-----|-------|
| **Delivery Speed** | Instant | Seconds |
| **Open Rate** | 98% | 20-30% |
| **Character Limit** | 160 chars | Unlimited |
| **Cost** | ₦3-5 per SMS | Free |
| **Reliability** | Very High | High |
| **Mobile Friendly** | Perfect | Good |

---

**SMSLive247 is perfect for urgent hotel notifications!** 🎉

## 🚀 **Quick Start**

1. **Sign up** at smslive247.com
2. **Get API key** from dashboard
3. **Set up sender ID** (GODATIN)
4. **Add to .env.local**
5. **Test connection**
6. **Start sending SMS!**

## 📱 **Sample SMS Messages**

### **Check-in Reminder**
```
Dear John Doe, welcome to Godatin Hotel! Your check-in is scheduled for 10/25/2024. Booking Ref: GH123456. We look forward to welcoming you!
```

### **Check-out Reminder**
```
Dear John Doe, your check-out from Godatin Hotel is scheduled for 10/27/2024. Booking Ref: GH123456. Please ensure all belongings are collected.
```

### **Payment Confirmation**
```
Dear John Doe, your payment for booking GH123456 has been confirmed. Amount: ₦50,000. Thank you for choosing Godatin Hotel!
```

**Your hotel now has both email AND SMS notifications!** 📧📱
