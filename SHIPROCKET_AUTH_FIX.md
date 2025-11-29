# Shiprocket Authentication - CORRECTED

## ⚠️ Important Correction

Shiprocket uses **API Key and API Secret** for authentication, NOT email and password.

## ✅ Correct Configuration

### In `backend/.env`:

```env
# Shiprocket Configuration
SHIPROCKET_API_KEY=your_shiprocket_api_key
SHIPROCKET_API_SECRET=your_shiprocket_api_secret
SHIPROCKET_PICKUP_PINCODE=400001
```

## 📍 Where to Find Your Credentials

1. Login to your Shiprocket dashboard
2. Go to **Settings** → **API**
3. You'll find:
   - **API Key** (also called Email in API context)
   - **API Secret** (also called Password in API context)

## 🔧 How It Works

The backend services (`shiprocket.ts` and `shiprocket-faster.ts`) authenticate like this:

```typescript
const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
  email: process.env.SHIPROCKET_API_KEY,      // Your API Key
  password: process.env.SHIPROCKET_API_SECRET  // Your API Secret
});
```

Note: Shiprocket's API endpoint uses "email" and "password" fields, but you should provide your **API Key** and **API Secret** respectively.

## ✅ All Files Updated

The following files have been corrected:
- ✅ `backend/src/services/shiprocket.ts`
- ✅ `backend/src/services/shiprocket-faster.ts`
- ✅ `backend/.env.example`
- ✅ `backend/.env`
- ✅ `FULLSTACK_README.md`
- ✅ `DEPLOYMENT_GUIDE.md`
- ✅ `IMPLEMENTATION_SUMMARY.md`

## 🚀 Ready to Use

Simply update your `backend/.env` file with your actual Shiprocket API credentials and you're good to go!
