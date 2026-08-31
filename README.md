# DrinkBrewy Website

This is a 3D animated marketing site for the soda brand DrinkBrewy.

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
