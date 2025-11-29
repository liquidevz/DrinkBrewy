# DrinkBrewy Deployment Guide

Complete guide for deploying the full-stack DrinkBrewy application to production.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB database setup (local or cloud)
- [ ] Shiprocket account with API credentials
- [ ] Razorpay account (optional)
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (for production)
- [ ] Environment variables prepared

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select region closest to your users
   - Click "Create Cluster"

3. **Configure Access**
   - Database Access: Create database user
   - Network Access: Add IP address (0.0.0.0/0 for all, or specific IPs)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

5. **Update Environment Variable**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/drinkbrewy?retryWrites=true&w=majority
   ```

### Option 2: Self-Hosted MongoDB

```bash
# Ubuntu/Debian
sudo apt-get install mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/drinkbrewy
```

## 🚀 Backend Deployment

### Option A: Railway (Easiest)

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose DrinkBrewy repository

3. **Configure Build**
   - Root directory: `/backend`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

4. **Add Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ADMIN_PASSWORD=your_admin_password
   SHIPROCKET_API_KEY=your_shiprocket_api_key
   SHIPROCKET_API_SECRET=your_shiprocket_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   FRONTEND_URL=https://your-frontend-domain.com
   BACKEND_URL=https://your-backend-domain.railway.app
   SHIPROCKET_PICKUP_PINCODE=400001
   ```

5. **Deploy**
   - Railway will auto-deploy
   - Get your backend URL from Railway dashboard

### Option B: Heroku

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd backend
   heroku create drinkbrewy-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   heroku config:set SHIPROCKET_API_KEY=your_api_key
   heroku config:set SHIPROCKET_API_SECRET=your_api_secret
   # ... add all other variables
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option C: DigitalOcean/AWS/VPS

1. **Create Droplet/Instance**
   - Ubuntu 22.04 LTS
   - At least 1GB RAM

2. **SSH into Server**
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install MongoDB (if not using Atlas)
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod

   # Install PM2
   sudo npm install -g pm2
   ```

4. **Clone and Setup**
   ```bash
   cd /var/www
   git clone https://github.com/liquidevz/DrinkBrewy.git
   cd DrinkBrewy/backend
   npm install
   npm run build
   ```

5. **Create .env File**
   ```bash
   nano .env
   # Paste your environment variables
   ```

6. **Start with PM2**
   ```bash
   pm2 start dist/server.js --name drinkbrewy-api
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/drinkbrewy
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name api.drinkbrewy.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/drinkbrewy /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.drinkbrewy.com
   ```

## 🎨 Frontend Deployment

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd /path/to/DrinkBrewy
   vercel
   ```

4. **Configure Environment Variables** (in Vercel dashboard)
   - Add any frontend-specific variables
   - Update API URLs to point to production backend

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Option B: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and Deploy**
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

### Option C: Self-Hosted with Nginx

1. **Build Frontend**
   ```bash
   cd /var/www/DrinkBrewy
   npm install
   npm run build
   ```

2. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/drinkbrewy-frontend
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name drinkbrewy.com www.drinkbrewy.com;
       root /var/www/DrinkBrewy/.next;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Start with PM2**
   ```bash
   cd /var/www/DrinkBrewy
   pm2 start npm --name drinkbrewy-frontend -- start
   pm2 save
   ```

4. **Setup SSL**
   ```bash
   sudo certbot --nginx -d drinkbrewy.com -d www.drinkbrewy.com
   ```

## 🔧 Post-Deployment Configuration

### 1. Update API URLs

Update all API calls in frontend to use production backend URL:
```typescript
// Instead of: http://localhost:5000/api/...
// Use: https://api.drinkbrewy.com/api/...
```

### 2. Configure Shiprocket Webhooks

1. Login to Shiprocket dashboard
2. Go to Settings > Webhooks
3. Add webhook URL: `https://api.drinkbrewy.com/api/faster-checkout/webhook`
4. Select events:
   - Payment Success
   - Shipment Created
   - Shipment Delivered
   - Order Cancelled

### 3. Test Payment Flow

1. Create test order
2. Complete payment
3. Verify webhook received
4. Check order status in admin dashboard
5. Verify shipment creation

### 4. Setup Monitoring

**Backend Monitoring:**
```bash
# PM2 monitoring
pm2 monit

# Or use PM2 Plus (free tier)
pm2 link your_secret_key your_public_key
```

**Database Monitoring:**
- MongoDB Atlas has built-in monitoring
- Set up alerts for high CPU/memory usage

### 5. Backup Strategy

**Database Backups:**
```bash
# MongoDB Atlas: Enable automated backups in dashboard

# Self-hosted MongoDB:
mongodump --uri="mongodb://localhost:27017/drinkbrewy" --out=/backups/$(date +%Y%m%d)

# Add to crontab for daily backups:
0 2 * * * mongodump --uri="mongodb://localhost:27017/drinkbrewy" --out=/backups/$(date +\%Y\%m\%d)
```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ random characters)
- [ ] Enable HTTPS/SSL on all domains
- [ ] Configure CORS to allow only your frontend domain
- [ ] Set up rate limiting (already configured in code)
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Regular security updates: `npm audit fix`
- [ ] Setup firewall rules (UFW on Ubuntu)
- [ ] Enable MongoDB IP whitelist
- [ ] Regular database backups

## 📊 Performance Optimization

### Backend
- Enable compression (already configured)
- Use PM2 cluster mode: `pm2 start dist/server.js -i max`
- Setup Redis for session caching (optional)
- Enable MongoDB indexes

### Frontend
- Enable Next.js image optimization
- Use CDN for static assets
- Enable caching headers
- Minimize bundle size

## 🐛 Troubleshooting

### Backend Issues

**Server won't start:**
```bash
# Check logs
pm2 logs drinkbrewy-api

# Check port availability
sudo lsof -i :5000

# Restart server
pm2 restart drinkbrewy-api
```

**Database connection errors:**
```bash
# Test MongoDB connection
mongosh "your_connection_string"

# Check MongoDB status
sudo systemctl status mongod
```

### Frontend Issues

**Build errors:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**API connection errors:**
- Verify backend URL is correct
- Check CORS settings
- Verify SSL certificates

## 📈 Scaling

### Horizontal Scaling
- Use PM2 cluster mode
- Setup load balancer (Nginx/HAProxy)
- Deploy multiple backend instances

### Database Scaling
- MongoDB Atlas auto-scaling
- Setup read replicas
- Enable sharding for large datasets

## 📞 Support

If you encounter issues:
1. Check logs: `pm2 logs`
2. Review error messages
3. Check environment variables
4. Verify all services are running
5. Contact support: support@drinkbrewy.com

---

**Deployment Complete! 🎉**

Your DrinkBrewy full-stack application is now live and ready to serve customers!
