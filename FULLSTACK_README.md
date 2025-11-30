# DrinkBrewy Full-Stack Application

A complete e-commerce platform for DrinkBrewy with integrated payment processing via Shiprocket Faster Checkout and comprehensive admin management.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI/UX** with existing DrinkBrewy styling (Tailwind CSS)
- **Product Catalog** with dynamic product pages
- **Shopping Cart** with Zustand state management
- **Shiprocket Faster Checkout** integration for seamless payment and delivery
- **Order Tracking** with real-time status updates
- **Responsive Design** optimized for all devices

### Backend (Node.js + Express + MongoDB)
- **RESTful API** with TypeScript
- **MongoDB Database** for data persistence
- **JWT Authentication** for admin access
- **Product Management** CRUD operations
- **Order Management** with status tracking
- **Shiprocket Integration**:
  - Faster Checkout for combined payment + shipping
  - Automatic shipment creation
  - Real-time tracking
  - Serviceability checks
- **Razorpay Integration** (fallback payment option)
- **Security Features**:
  - Helmet.js for HTTP headers
  - Rate limiting
  - CORS configuration
  - Input validation

### Admin Dashboard
- **Product Management**: Create, update, delete products with full details
- **Order Management**: View orders, create shipments, track deliveries
- **Inventory Management**: Stock tracking and updates
- **Shipment Management**: Integrated Shiprocket controls
- **Authentication**: Secure admin login

## 📁 Project Structure

```
DrinkBrewy/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # MongoDB models (Product, Order, Admin)
│   │   ├── routes/            # API routes
│   │   ├── services/          # External service integrations
│   │   ├── middleware/        # Authentication & validation
│   │   └── server.ts          # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── src/                       # Frontend Next.js app
│   ├── app/                   # Next.js 14 app directory
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── checkout/         # Checkout flow
│   │   └── products/         # Product pages
│   ├── components/           # React components
│   └── data/                 # Static data & types
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB 6.0+ (local or cloud)
- Shiprocket account with API credentials
- Razorpay account (optional, for fallback)

### 1. Clone the Repository
```bash
git clone https://github.com/liquidevz/DrinkBrewy.git
cd DrinkBrewy
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your actual credentials:
# - MongoDB URI
# - Shiprocket email & password
# - Razorpay keys (optional)
# - JWT secret

# Build TypeScript
npm run build

# Start development server
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ..  # Back to root directory

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env

## 🔑 API Endpoints

### Public Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:identifier` - Get product by ID or handle

#### Orders
- `GET /api/orders/:orderId` - Get order by ID
- `POST /api/orders` - Create new order

#### Shiprocket Faster Checkout
- `POST /api/faster-checkout/create` - Create checkout session
- `POST /api/faster-checkout/verify` - Verify payment
- `GET /api/faster-checkout/status/:orderId` - Get order status
- `POST /api/faster-checkout/check-serviceability` - Check delivery availability
- `POST /api/faster-checkout/webhook` - Webhook handler

### Admin Endpoints (Requires Authentication)

#### Admin Auth
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin info
- `POST /api/admin/create` - Create new admin (superadmin only)
- `POST /api/admin/change-password` - Change password

#### Product Management
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/stock` - Update stock

#### Order Management
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:orderId/status` - Update order status
- `PATCH /api/orders/:orderId/payment` - Update payment info
- `PATCH /api/orders/:orderId/shipment` - Update shipment info

#### Shipment Management
- `POST /api/shipment/create` - Create shipment
- `POST /api/shipment/generate-awb` - Generate AWB
- `POST /api/shipment/request-pickup` - Request pickup
- `GET /api/shipment/track/:shipmentId` - Track shipment
- `POST /api/shipment/cancel` - Cancel shipment

## 🔐 Authentication

### Admin Login
Default credentials (change in production):
- Password: `admin123`

Store the password in localStorage after login:
```javascript
localStorage.setItem('adminPassword', 'admin123');
```

Or use JWT token:
```javascript
localStorage.setItem('authToken', token);
```

## 🚢 Shiprocket Faster Checkout Integration

### How It Works

1. **Customer adds products to cart**
2. **Initiates checkout** with customer details
3. **System creates Faster Checkout session** via API
4. **Customer redirects to Shiprocket** for payment and address
5. **Shiprocket handles**:
   - Payment processing
   - Address validation
   - Courier selection
   - Shipment creation
6. **Webhook updates order status** in your database
7. **Customer receives tracking info** automatically

### Configuration

In `backend/.env`:
```env
SHIPROCKET_API_KEY=your_shiprocket_api_key
SHIPROCKET_API_SECRET=your_shiprocket_api_secret
SHIPROCKET_PICKUP_PINCODE=400001
```

### Webhook Setup

Configure webhook in Shiprocket dashboard:
```
Webhook URL: https://your-domain.com/api/faster-checkout/webhook
Events: payment_success, shipment_created, shipment_delivered
```

## 📦 Product Schema

```typescript
{
  id: string;              // Unique product ID
  name: string;            // Product name
  flavor: string;          // Flavor variant
  price: number;           // Price in INR
  description: string;     // Product description
  handle: string;          // URL slug
  images: string[];        // Image URLs
  stock: number;           // Available quantity
  availableForSale: boolean;
  variants: [{
    id: string;
    title: string;
    price: number;
    availableForSale: boolean;
    sku?: string;
  }];
  dimensions: {
    length: number;        // cm
    breadth: number;       // cm
    height: number;        // cm
    weight: number;        // kg
  };
}
```

## 📋 Order Schema

```typescript
{
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'shipped' | 'delivered';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  };
  items: [{
    productId: string;
    variantId: string;
    name: string;
    quantity: number;
    price: number;
  }];
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  trackingUrl?: string;
}
```

## 🎨 Styling

The application uses the existing DrinkBrewy design system:

- **Primary Color**: `#C41E3A` (Red)
- **Secondary Color**: `#A3182F` (Dark Red)
- **Background**: `#FFF8DD` (Cream)
- **Font**: Alpino (custom font)
- **Framework**: Tailwind CSS

## 🚀 Deployment

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. Set environment variables in platform dashboard
2. Deploy from GitHub repository
3. Ensure MongoDB connection string is correct
4. Update `BACKEND_URL` and `FRONTEND_URL` in .env

### Frontend Deployment (Vercel/Netlify)

```bash
npm run build
npm start
```

Or deploy via Git integration on Vercel/Netlify

### Environment Variables for Production

Update these in your hosting platform:
- `MONGODB_URI` - Production MongoDB connection
- `SHIPROCKET_API_KEY` - Shiprocket API key
- `SHIPROCKET_API_SECRET` - Shiprocket API secret
- `RAZORPAY_KEY_ID` - Razorpay key (if using)
- `RAZORPAY_KEY_SECRET` - Razorpay secret (if using)
- `JWT_SECRET` - Strong random secret
- `FRONTEND_URL` - Production frontend URL
- `BACKEND_URL` - Production backend URL

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:3000/health

# Get products
curl http://localhost:3000/api/products

# Admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Faster Checkout Flow
1. Add products to cart on frontend
2. Go to checkout
3. Fill in customer details
4. Check serviceability (should show delivery status)
5. Click "Proceed to Payment & Delivery"
6. Complete payment on Shiprocket page
7. Verify order in admin dashboard

## 📝 Admin Usage

### Adding Products
1. Navigate to `/admin/products`
2. Fill in product form:
   - Product ID (unique)
   - Name, flavor, price
   - Description and images
   - Stock quantity
   - Dimensions for shipping
3. Click "Create Product"

### Managing Orders
1. Navigate to `/admin/orders`
2. View all orders with status
3. Click "Create Shipment" for paid orders
4. Track shipments via tracking URL
5. Update order status as needed

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env file exists and has correct values
- Check port 5000 is not in use

### Shiprocket errors
- Verify credentials in .env
- Check Shiprocket account is active
- Ensure pickup location is configured in Shiprocket dashboard

### Frontend API errors
- Verify backend is running on port 5000
- Check CORS settings in backend
- Update API URLs if using different ports

## 📄 License

Apache-2.0 License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Support

For issues or questions:
- Email: support@drinkbrewy.com
- GitHub Issues: https://github.com/liquidevz/DrinkBrewy/issues

---

**Built with ❤️ for DrinkBrewy**
