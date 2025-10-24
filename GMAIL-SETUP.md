# Gmail Email Setup Guide for Godatin Hotel

## 📧 **Gmail Email Notification Setup**

### **Step 1: Enable 2-Factor Authentication**
1. Go to your Google Account settings
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-factor authentication if not already enabled

### **Step 2: Generate App Password**
1. In Google Account settings, go to **Security**
2. Under **2-Step Verification**, click **App passwords**
3. Select **Mail** as the app
4. Select **Other** as the device and enter "Godatin Hotel"
5. Copy the generated 16-character password (e.g., `abcd efgh ijkl mnop`)

### **Step 3: Update Environment Variables**
Add these to your `.env.local` file:

```env
MONGODB_URI=mongodb+srv://jabpa87_db_user:zHrL6SCTEdO5SGxK@godatin.ypscnoo.mongodb.net/?retryWrites=true&w=majority&appName=godatin

# Gmail Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_APP_PASSWORD=your-16-character-app-password
```

**Replace:**
- `your-gmail@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password from Step 2

### **Step 4: Test Email Connection**
1. Start your development server: `npm run dev`
2. Test the connection: `curl http://localhost:3000/api/test-email`
3. You should see: `{"success":true,"message":"Email server connection verified"}`

### **Step 5: Send Test Email**
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "templateType": "checkin",
    "data": {
      "guestName": "Test Guest",
      "checkInDate": "2024-10-25",
      "bookingRef": "GH123456"
    }
  }'
```

## 🎯 **Email Templates Available**

### **1. Check-in Reminder**
- Sent 24 hours before check-in
- Includes welcome message and check-in details
- Beautiful HTML template with hotel branding

### **2. Check-out Reminder**
- Sent 1 hour before check-out
- Includes check-out time and reminders
- Professional template with contact information

### **3. Payment Confirmation**
- Sent immediately after payment
- Includes booking details and payment confirmation
- Clean template with booking reference

## 🔧 **Features**

✅ **Professional HTML Templates** - Beautiful, responsive email designs
✅ **Gmail Integration** - Uses Gmail SMTP for reliable delivery
✅ **Template Variables** - Dynamic content based on booking data
✅ **Error Handling** - Proper error messages and logging
✅ **Security** - Uses App Passwords for secure authentication

## 📱 **Usage in Admin Dashboard**

1. Go to **Notifications** tab in admin dashboard
2. Click **Send Notification** button
3. Select template and guest details
4. Email will be sent automatically via Gmail

## 🚨 **Important Notes**

- **Never use your regular Gmail password** - always use App Passwords
- **App Passwords are 16 characters** with spaces (remove spaces when adding to .env.local)
- **Test the connection** before using in production
- **Check spam folder** for test emails

## 🔍 **Troubleshooting**

### **"Invalid login" Error**
- Verify 2-factor authentication is enabled
- Check App Password is correct (16 characters)
- Ensure no spaces in EMAIL_APP_PASSWORD

### **"Connection refused" Error**
- Check EMAIL_USER is correct Gmail address
- Verify internet connection
- Check Gmail SMTP settings

### **Emails not received**
- Check spam/junk folder
- Verify recipient email address
- Check Gmail sending limits

## 📞 **Support**

If you need help setting up Gmail integration, contact:
- **Phone**: +234 912 163 9047
- **Email**: info@godatinhotel.com

---

**Your Gmail email notification system is now ready!** 🎉
