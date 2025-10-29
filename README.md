# Survey App - Coolify Deployment

A full-stack survey application with Next.js frontend, Express backend, and PostgreSQL database. Designed for Coolify deployment with separate domains.

## 🏗️ Stack

- **Frontend**: Next.js 14 (TypeScript)
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL
- **Deployment**: Coolify
- **Ports**: Frontend (4000), Backend (4001)

## 📁 Project Structure

```
├── app/                    # Next.js frontend (root)
├── server/                 # Express backend
│   ├── src/
│   │   ├── index.ts       # Server entry point
│   │   └── db.ts          # PostgreSQL connection
│   └── package.json
├── package.json            # Frontend dependencies
└── README.md
```

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### 2. Setup PostgreSQL
```bash
# Using Docker
docker run --name survey-postgres \
  -e POSTGRES_DB=survey_db \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:16
```

### 3. Configure Environment Variables

**Root `.env`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```

**`server/.env`:**
```env
PORT=4001
CORS_ORIGIN=http://localhost:4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/survey_db
DATABASE_SSL=false
```

### 4. Run Applications

**Terminal 1 (Frontend):**
```bash
npm run dev
# Runs on http://localhost:4000
```

**Terminal 2 (Backend):**
```bash
cd server
npm run dev
# Runs on http://localhost:4001
```

## 🐳 Coolify Deployment

### Step 1: Create PostgreSQL Database

1. Coolify → **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Configure:
   - Name: `survey-database`
   - Database: `survey_db`
   - Version: 16 (latest)
3. Copy the connection URL after creation

### Step 2: Deploy Backend

1. Coolify → **"+ New"** → **"Application"**
2. Connect your GitHub repository
3. **Configuration:**
   - Base Directory: `server`
   - Build Pack: `nixpacks`
   - Port: `4001`

4. **Environment Variables:**
   ```env
   PORT=4001
   CORS_ORIGIN=https://your-frontend-domain.com
   DATABASE_URL=postgresql://user:pass@host:5432/survey_db?sslmode=disable
   DATABASE_SSL=false
   ```
   ✅ Check "Available at Buildtime" and "Available at Runtime"

5. **Domain:**
   - Add: `https://api.yourdomain.com` (include https://)
   
6. Click **"Deploy"**

### Step 3: Deploy Frontend

1. Coolify → **"+ New"** → **"Application"**
2. Use the **same GitHub repository**
3. **Configuration:**
   - Base Directory: `.` (root)
   - Build Pack: `nixpacks`
   - Port: `4000`

4. **Environment Variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```
   ✅ Check "Available at Buildtime" and "Available at Runtime"

5. **Domain:**
   - Add: `https://survey.yourdomain.com` (include https://)
   
6. Click **"Deploy"**

### Step 4: Update CORS (After Frontend Deploys)

1. Go to backend → Environment Variables
2. Update `CORS_ORIGIN` with actual frontend URL
3. **Redeploy backend**

## 🌐 Custom Domain Setup (Cloudflare)

### 1. Configure DNS Records

In Cloudflare DNS:
```
Type: A, Name: survey, Content: YOUR_SERVER_IP, Proxy: DNS only (gray cloud)
Type: A, Name: api,    Content: YOUR_SERVER_IP, Proxy: DNS only (gray cloud)
```

⚠️ **Important**: Disable Cloudflare proxy (gray cloud) for SSL to work

### 2. Wait for DNS Propagation

Check with:
```bash
nslookup survey.yourdomain.com
nslookup api.yourdomain.com
```

Should return your server IP.

### 3. Update Domains in Coolify

- Backend: `https://api.yourdomain.com`
- Frontend: `https://survey.yourdomain.com`

### 4. Redeploy Both Applications

Coolify will auto-provision SSL certificates.

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/survey` | POST | Submit survey response |
| `/api/survey/responses` | GET | Get all responses |
| `/api/survey/stats` | GET | Get statistics |

**Example Usage:**
```bash
# View responses
curl https://api.yourdomain.com/api/survey/responses

# View stats
curl https://api.yourdomain.com/api/survey/stats
```

## 🗄️ Database Management

### Connect to PostgreSQL in Coolify

1. Go to your PostgreSQL database in Coolify
2. Click **"Terminal"** tab
3. Run:
   ```bash
   psql -U postgres -d postgres
   ```

### Useful SQL Commands

```sql
-- View all responses
SELECT * FROM survey_responses ORDER BY timestamp DESC;

-- Count total responses
SELECT COUNT(*) FROM survey_responses;

-- Stats by experience
SELECT experience, COUNT(*) FROM survey_responses GROUP BY experience;

-- Stats by features
SELECT features, COUNT(*) FROM survey_responses GROUP BY features;

-- Exit psql
\q
```

## 🔧 Common Issues & Fixes

### Issue: CORS Error

**Symptom:** "No 'Access-Control-Allow-Origin' header"

**Fix:**
1. Backend env: `CORS_ORIGIN=https://your-actual-frontend-domain.com`
2. Redeploy backend
3. Clear browser cache

### Issue: SSL Connection Error

**Symptom:** "The server does not support SSL connections"

**Fix:**
1. Add `?sslmode=disable` to DATABASE_URL
2. Set `DATABASE_SSL=false`
3. Redeploy

### Issue: Domain Shows "No Available Server"

**Fix:**
1. Ensure domain in Coolify includes `https://`
2. Redeploy application
3. Wait for SSL certificate (1-5 minutes)

### Issue: Frontend Can't Reach Backend

**Fix:**
1. Verify `NEXT_PUBLIC_API_URL` matches backend domain
2. Check both apps are running
3. Redeploy frontend (env vars need rebuild)

### Issue: DNS Not Resolving

**Fix:**
1. Check DNS: `nslookup yourdomain.com 8.8.8.8`
2. Turn off Cloudflare proxy (gray cloud)
3. Wait 5-30 minutes for propagation

## ⚙️ Environment Variables Quick Reference

### Frontend
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Backend
```env
PORT=4001
CORS_ORIGIN=https://survey.yourdomain.com
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=disable
DATABASE_SSL=false
```

### Important Notes:
- `NEXT_PUBLIC_*` variables must be set at **buildtime** (check the box in Coolify)
- Redeploy frontend after changing `NEXT_PUBLIC_*` variables
- Redeploy backend after changing `CORS_ORIGIN`

## 🎯 Testing Checklist

- [ ] Backend health: `https://api.yourdomain.com/api/health`
- [ ] Frontend loads: `https://survey.yourdomain.com`
- [ ] Submit a survey response
- [ ] Check responses: `https://api.yourdomain.com/api/survey/responses`
- [ ] View stats: `https://api.yourdomain.com/api/survey/stats`
- [ ] Check PostgreSQL: `psql` → `SELECT * FROM survey_responses;`

## 📚 Additional Documentation

- **PostgreSQL Setup**: See `POSTGRES_SETUP.md` for detailed database configuration
- **Coolify Deployment**: See `DEPLOYMENT.md` for step-by-step deployment guide

## 💡 Tips

- **Auto-Deploy**: Enable in Coolify → Configuration → Advanced → Auto Deploy
- **Container Names**: Set custom names in Configuration → Advanced (disables rolling updates)
- **Logs**: Check deployment logs in Coolify for debugging
- **Database Backup**: Set up regular backups in Coolify database settings

## 🆘 Still Stuck?

1. Check Coolify logs: Application → Logs tab
2. Check browser console: F12 → Console tab
3. Verify DNS: `nslookup yourdomain.com`
4. Test API directly: `curl https://api.yourdomain.com/api/health`

---

**Built with ❤️ for testing Coolify deployments**
