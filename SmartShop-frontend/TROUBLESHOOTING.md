# SmartShop Frontend - Troubleshooting Authentication

## Critical Fix Required!

### CORS Configuration Missing in Backend

I've created a **CorsConfig.java** file in your backend to fix the login issue:

**Location:** `/home/kali/IdeaProjects/SmartShop/src/main/java/org/SmartShop/config/CorsConfig.java`

### ⚠️ You MUST Rebuild the Backend

```bash
cd /path/to/SmartShop-backend
docker-compose down
docker-compose up -d --build
```

Without this CORS configuration, the browser blocks all API calls from the frontend!

## Test Credentials

**Admin:**
- Username: `admin`
- Password: `pass123`

**Client:**
- Username: `techsolutions`
- Password: `pass123`

## Debugging Tips

1. Open Browser DevTools (F12)
2. Check Console tab for errors
3. Look for CORS errors - this means backend needs rebuild
4. Check Network tab to see API requests

## Quick Test

After rebuilding backend, try:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"pass123"}'
```

Should return user data!
