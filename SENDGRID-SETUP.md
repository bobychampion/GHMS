# SendGrid Email Setup Guide for Godatin Hotel

## 📧 **SendGrid Email Notification Setup**

SendGrid is a professional email service that's much easier to set up than Gmail App Passwords!

### **Step 1: Create SendGrid Account**
1. Go to [sendgrid.com](https://sendgrid.com)
2. Click **"Start for Free"**
3. Sign up with your email address
4. Verify your email address

### **Step 2: Get API Key**
1. **Login to SendGrid Dashboard**
2. Go to **Settings** → **API Keys**
3. Click **"Create API Key"**
4. Choose **"Restricted Access"**
5. Give it a name: **"Godatin Hotel"**
6. Under **Mail Send**, select **"Full Access"**
7. Click **"Create & View"**
8. **Copy the API key** (it starts with `SG.`)

### **Step 3: Verify Sender Identity**
1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details:
   - **From Name**: Godatin Hotel
   - **From Email**: info@godatinhotel.com (or your email)
   - **Reply To**: info@godatinhotel.com
   - **Company Address**: Your hotel address
4. **Verify the email** by clicking the link sent to your inbox

### **Step 4: Update Environment Variables**
Add these to your `.env.local` file:

```env
MONGODB_URI=your-mongodb-connection-string

# SendGrid Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key-here
FROM_EMAIL=info@godatinhotel.com
```

**Replace:**
- `your-sendgrid-api-key-here` with your actual SendGrid API key
- `info@godatinhotel.com` with your verified sender email

### **Step 5: Test Email Connection**
1. Start your development server: `npm run dev`
2. Test the connection: `curl http://localhost:3000/api/test-email`
3. You should see: `{"success":true,"message":"SendGrid connection verified"}`

### **Step 6: Send Test Email**
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "templateType": "checkin",
    "data": {
      "guestName": "Test Guest",
      "checkInDate": "2024-10-25",
      "bookingRef": "GH123456"
    }
  }'
```

## 🎯 **SendGrid Benefits**

✅ **Easy Setup** - Just API key, no app passwords  
✅ **Free Tier** - 100 emails/day forever  
✅ **Professional** - Used by major companies  
✅ **Reliable** - High deliverability rates  
✅ **Analytics** - Track email opens and clicks  
✅ **Templates** - Beautiful HTML email templates  

## 📊 **Free Tier Limits**

- **100 emails per day** (3,000 per month)
- **Unlimited contacts**
- **Email analytics**
- **API access**
- **Customer support**

## 🔧 **Features Included**

✅ **Professional HTML Templates** - Beautiful, responsive email designs  
✅ **SendGrid Integration** - Reliable email delivery  
✅ **Template Variables** - Dynamic content based on booking data  
✅ **Error Handling** - Proper error messages and logging  
✅ **Analytics** - Track email delivery and engagement  

## 📱 **Usage in Admin Dashboard**

1. Go to **Notifications** tab in admin dashboard
2. Click **Send Notification** button
3. Select template and guest details
4. Email will be sent automatically via SendGrid

## 🚨 **Important Notes**

- **API Key is sensitive** - Keep it secure and don't share it
- **Verify sender email** - Required for sending emails
- **Check spam folder** - For test emails initially
- **Free tier limits** - 100 emails/day

## 🔍 **Troubleshooting**

### **"API key not configured" Error**
- Check SENDGRID_API_KEY is set in .env.local
- Verify API key starts with `SG.`
- Restart your development server

### **"Sender not verified" Error**
- Complete sender verification in SendGrid dashboard
- Check your email for verification link
- Use verified email as FROM_EMAIL

### **Emails not received**
- Check spam/junk folder
- Verify recipient email address
- Check SendGrid activity feed for delivery status

## 📞 **Support**

If you need help setting up SendGrid:
- **SendGrid Support**: Available in dashboard
- **Documentation**: [sendgrid.com/docs](https://sendgrid.com/docs)
- **Hotel Support**: +234 912 163 9047

## 🆚 **SendGrid vs Gmail**

| Feature | SendGrid | Gmail |
|---------|----------|-------|
| Setup | Easy (API key) | Complex (App passwords) |
| Free Tier | 100 emails/day | Unlimited |
| Reliability | Professional | Personal |
| Analytics | Built-in | Limited |
| Templates | Advanced | Basic |

---

**SendGrid is the recommended choice for professional email notifications!** 🎉

## 🚀 **Quick Start**

1. **Sign up** at sendgrid.com
2. **Get API key** from dashboard
3. **Verify sender** email
4. **Add to .env.local**
5. **Test connection**
6. **Start sending emails!**
