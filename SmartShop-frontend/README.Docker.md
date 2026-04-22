# SmartShop Frontend - Docker Setup

## Prerequisites

- Docker installed
- SmartShop backend running in Docker (on the same host)

## Option 1: Using Docker Compose with Shared Network (Recommended)

This option connects the frontend container to the same network as your backend.

### Step 1: Create the backend network (if not exists)

First, check if your backend is running:
```bash
cd /path/to/SmartShop-backend
docker-compose ps
```

The backend creates a network called `smartshop_default`. Verify it exists:
```bash
docker network ls | grep smartshop
```

### Step 2: Build and run the frontend

```bash
cd /path/to/SmartShop-Frontend
docker-compose up -d --build
```

The frontend will be accessible at: **http://localhost:3000**

### Step 3: Verify the connection

```bash
docker logs smartshop-frontend
```

## Option 2: Using Docker Run (Standalone)

If you prefer not to use docker-compose:

### Build the image

```bash
docker build -t smartshop-frontend .
```

### Run the container

```bash
docker run -d \
  --name smartshop-frontend \
  -p 3000:80 \
  --network smartshop_default \
  smartshop-frontend
```

## Option 3: Run Both Backend and Frontend Together

If you want to run both in the same docker-compose, add this to your backend's docker-compose.yml:

```yaml
services:
  # ... your existing backend services ...

  smartshop-frontend:
    build:
      context: ../SmartShop-Frontend  # Adjust path as needed
      dockerfile: Dockerfile
    container_name: smartshop-frontend
    ports:
      - "3000:80"
    depends_on:
      - smartshop-api
    networks:
      - default
```

Then run from the backend directory:
```bash
docker-compose up -d --build
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5433
- **PgAdmin**: http://localhost:5050

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:8080/api`.

If you need to change this (e.g., different host or port), update the `.env.production` file:

```env
VITE_API_URL=http://your-backend-host:8080/api
```

Then rebuild:
```bash
docker-compose up -d --build
```

## Troubleshooting

### Frontend can't connect to backend

**Problem**: Getting network errors when trying to login or access API.

**Solution**: Make sure both containers are on the same network:

```bash
# Check frontend network
docker inspect smartshop-frontend | grep NetworkMode

# Check backend network
docker inspect smartshop-api | grep NetworkMode
```

Both should show `smartshop_default`.

### CORS errors

**Problem**: Browser shows CORS policy errors.

**Solution**: Check that your backend allows the frontend origin. In Spring Boot, verify CORS configuration allows `http://localhost:3000`.

### Session/Cookie issues

**Problem**: Login works but session is lost on refresh.

**Solution**: Ensure `withCredentials: true` is set in the API configuration (already done in `src/services/api.js`).

## Development

For local development without Docker:

```bash
npm install
npm run dev
```

The dev server will run on http://localhost:5174

## Useful Commands

```bash
# View logs
docker logs -f smartshop-frontend

# Stop the container
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v

# Access container shell
docker exec -it smartshop-frontend sh
```

## Notes

- The production build is optimized and served by Nginx
- Static assets are cached for 1 year
- Gzip compression is enabled
- React Router is configured for client-side routing
