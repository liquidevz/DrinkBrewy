# DrinkBrewy Website

This is a 3D animated e-commerce landing page for the soda brand DrinkBrewy!

## Setup Instructions

### Local Development

1. Install dependencies:
    
    ```bash
    npm install
    ```
    
2. Run the development server:
    
    ```bash
    npm run dev
    ```
    
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Setup

#### Quick Start (Windows)
```bash
# Development environment
.\docker-setup.bat dev

# Production environment
.\docker-setup.bat prod
```

#### Quick Start (Linux/Mac)
```bash
# Development environment
./docker-setup.sh dev

# Production environment
./docker-setup.sh prod
```

#### Manual Docker Commands

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Production:**
```bash
docker-compose up --build -d
```

## Content Management

Content is managed through static data files in `src/data/content.ts`. Edit this file to update page content, slices, and copy.

## Shopify Integration

This project is integrated with Shopify for e-commerce functionality:

1. **Environment Variables**: Copy `.env.example` to `.env.local` and update with your Shopify credentials:
   - `SHOPIFY_STORE_DOMAIN`: Your Shopify store domain
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Your Storefront API access token
   - `SHOPIFY_REVALIDATION_SECRET`: Secret for webhook revalidation

2. **Features**:
   - Products are fetched from Shopify
   - 3D models are used instead of product images
   - Cart functionality uses Shopify's cart API
   - Checkout redirects to Shopify checkout

3. **Product Display**: Products are displayed using 3D models in both the carousel and product grid components.
