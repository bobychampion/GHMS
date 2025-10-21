# Deployment Guide - Godatin Hotel Management System

## Quick Deploy to Vercel

### 1. Prepare for Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - Godatin Hotel Management System"
   git push origin main
   ```

2. **Environment Variables**
   Add these to your Vercel project settings:
   ```
   MONGODB_URI=mongodb+srv://jabpa87_db_user:zHrL6SCTEdO5SGxK@godatin.ypscnoo.mongodb.net/?retryWrites=true&w=majority&appName=godatin
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=https://your-domain.vercel.app
   JWT_SECRET=your-jwt-secret-key-here
   ```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables
5. Click "Deploy"

### 3. Initialize Database

After deployment, initialize the database:
```bash
curl -X POST https://your-domain.vercel.app/api/init
```

## Manual Deployment Steps

### Frontend (Vercel)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variables
5. Deploy

### Database (MongoDB Atlas)
- Already configured with provided connection string
- No additional setup required

## Post-Deployment Checklist

- [ ] Database initialized with room data
- [ ] Admin login working (`admin` / `password`)
- [ ] Booking flow functional
- [ ] All pages loading correctly
- [ ] Images displaying properly
- [ ] Contact form working
- [ ] Admin dashboard accessible

## Custom Domain Setup

1. **Add Domain to Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

## Monitoring & Maintenance

### Regular Tasks
- Monitor booking submissions
- Check admin dashboard functionality
- Review error logs in Vercel dashboard
- Update room availability as needed

### Backup Strategy
- MongoDB Atlas provides automatic backups
- Regular database exports recommended
- Code repository serves as backup

## Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Check MongoDB URI in environment variables
   - Verify network access in MongoDB Atlas

2. **Images Not Loading**
   - Ensure images are in `public/images/` directory
   - Check file permissions and names

3. **Admin Login Not Working**
   - Verify admin credentials
   - Check authentication configuration

### Support
- Check Vercel function logs
- Review MongoDB Atlas logs
- Contact: info@godatinhotel.com

---

**Ready to go live!** 🚀



