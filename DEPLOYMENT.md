# Docker Deployment Guide

## Local Development with Docker

```bash
# Build the image
docker build -t drinkbrewy:latest .

# Run the container
docker run -p 3000:3000 --env-file .env.local drinkbrewy:latest
```

## Using Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## VPS Deployment

### 1. Prepare VPS
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Deploy Application
```bash
# Clone repository
git clone <your-repo-url>
cd DrinkBrewy

# Set environment variables
cp .env.production .env.local
nano .env.local  # Edit with your production keys

# Build and start
docker-compose up -d --build
```

### 3. Nginx Reverse Proxy (Optional)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

## Production Optimizations

- Multi-stage build reduces image size by ~70%
- Layer caching speeds up rebuilds
- Standalone output includes only necessary files
- Health checks ensure container reliability
- Non-root user for security

## Monitoring

```bash
# Check container status
docker-compose ps

# View resource usage
docker stats

# Check health
docker inspect --format='{{.State.Health.Status}}' drinkbrewy
```
