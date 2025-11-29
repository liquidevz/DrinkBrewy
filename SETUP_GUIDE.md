# DrinkBrewy - Complete Setup Guide

## ✅ What's Been Implemented

### Backend Integration
- ✅ Node.js/Express backend with MongoDB
- ✅ Product API routes (`/api/products`, `/api/products/:handle`)
- ✅ 5 sample products seeded (Black Cherry, Grape, Lemon Lime, Strawberry Lemonade, Watermelon)
- ✅ CORS configuration for frontend communication

### Frontend Features
- ✅ Next.js API proxy routes to avoid CORS issues
- ✅ Product carousel with 3D models
- ✅ Carousel routes to individual product pages on click
- ✅ Dynamic product pages at `/products/[handle]`
- ✅ Existing cart functionality maintained
- ✅ Razorpay payment gateway integration
- ✅ Shiprocket shipping integration

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Set Up Environment Variables

**Backend `.env`:**
```bash
cd backend
cp .env.example .env
# Edit with your values:
# MONGODB_URI=mongodb://localhost:27017/drinkbrewy
# PORT=5000
```

**Frontend `.env.local`:**
```bash
cp .env.example .env.local
# Edit with your values:
# BACKEND_URL=http://localhost:5000
# NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
# RAZORPAY_KEY_SECRET=your_secret
# SHIPROCKET_EMAIL=your_email
# SHIPROCKET_PASSWORD=your_password
```

### 3. Start MongoDB

```bash
# If using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
```

### 4. Seed Products

```bash
cd backend
node seed-products.js
```

### 5. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### 6. Access the Website

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/products

## 📁 Key Files

### Backend
- `backend/src/server.ts` - Main server with CORS config
- `backend/src/routes/products.ts` - Product API routes
- `backend/src/models/Product.ts` - Product schema
- `backend/seed-products.js` - Sample data seeder

### Frontend
- `src/lib/backend-products.ts` - Backend API client
- `src/app/api/backend/products/route.ts` - API proxy for all products
- `src/app/api/backend/products/[handle]/route.ts` - API proxy for single product
- `src/slices/Carousel/index.tsx` - Product carousel (routes to product pages)
- `src/app/products/[handle]/page.tsx` - Individual product page
- `src/components/RazorpayCheckout.tsx` - Payment with shipping info
- `src/app/api/razorpay/verify-payment/route.ts` - Payment verification + shipping
- `src/app/api/shiprocket/create-shipment/route.ts` - Shipment creation

## 🧪 Testing

### Test Backend API
```bash
curl http://localhost:5000/api/products
curl http://localhost:5000/api/products/watermelon
```

### Test Frontend Flow
1. Visit http://localhost:3000
2. Scroll down to product carousel
3. Click "View product details" or click on product
4. Should navigate to `/products/watermelon` (or other flavor)
5. Add to cart
6. Proceed to checkout
7. Fill shipping information
8. Complete payment (use Razorpay test mode)

## 🔧 Troubleshooting

### Products not loading in carousel
- Check backend is running: `curl http://localhost:5000/api/products`
- Check MongoDB has data: `mongosh` → `use drinkbrewy` → `db.products.find()`
- Check browser console for errors

### Product page shows "unavailable"
- Check API proxy: `curl http://localhost:3000/api/backend/products/watermelon`
- Check backend logs for errors
- Verify product handle exists in database

### Payment not working
- Verify Razorpay credentials in `.env.local`
- Use test mode keys for development
- Check browser console for Razorpay script errors

### Shipping not creating
- Verify Shiprocket credentials
- Check backend logs after payment
- Ensure products have dimensions in database

## 🌐 Deployment

See `DEPLOYMENT.md` for Docker and VPS deployment instructions.

For quick deployment:
1. Push to GitHub (already done)
2. Deploy backend to Railway/Render with MongoDB
3. Deploy frontend to Vercel
4. Update environment variables with production URLs

## 📝 Environment Variables Reference

### Backend
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Backend port (default: 5000)
- `NODE_ENV` - development/production
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `BACKEND_URL` - Backend API URL (server-side only)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay public key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `SHIPROCKET_EMAIL` - Shiprocket account email
- `SHIPROCKET_PASSWORD` - Shiprocket account password

## ✨ Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Backend API | ✅ | RESTful API for products |
| Product Carousel | ✅ | 3D models with navigation |
| Product Pages | ✅ | Dynamic routing from carousel |
| Cart System | ✅ | Existing cart maintained |
| Payment Gateway | ✅ | Razorpay integration |
| Shipping | ✅ | Shiprocket integration |
| Database | ✅ | MongoDB with 5 products |

## 🎯 Next Steps

1. **Add more products**: Edit `backend/seed-products.js` and run it again
2. **Customize styling**: Update Tailwind classes in components
3. **Add product images**: Place images in `/public/labels/` directory
4. **Configure live payments**: Update Razorpay keys to live mode
5. **Set up domain**: Deploy and point your domain to the deployment

## 📞 Support

Repository: https://github.com/liquidevz/DrinkBrewy
All changes have been committed and pushed to the main branch.
