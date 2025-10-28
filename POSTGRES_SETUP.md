# PostgreSQL Setup Guide for Coolify

This guide will help you set up PostgreSQL for your survey application in Coolify.

## Step 1: Create PostgreSQL Database in Coolify

### In Coolify Dashboard:

1. Click **"+ New"** → **"Database"**
2. Select **"PostgreSQL"**
3. Configure the database:
   - **Name**: `survey-database` (or your preferred name)
   - **PostgreSQL Version**: Choose latest (e.g., 16)
   - **Database Name**: `survey_db`
   - **Username**: `postgres` (or custom username)
   - **Password**: Coolify will generate a strong password (or set your own)

4. Click **"Create"**
5. Wait for the database to be provisioned

### Get Connection Details:

After the database is created:

1. Go to your PostgreSQL database in Coolify
2. Find the **Connection Details** section
3. Copy the **Database URL** (it will look like):
   ```
   postgresql://username:password@hostname:5432/survey_db
   ```

## Step 2: Update Server Environment Variables in Coolify

### Backend Application Configuration:

1. Go to your **server application** in Coolify
2. Navigate to **Configuration** → **Environment Variables**
3. Add a new environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the PostgreSQL connection URL from Step 1
   - ✅ Check **"Available at Buildtime"**
   - ✅ Check **"Available at Runtime"**

4. Your environment variables should now include:
   ```
   PORT=4001
   CORS_ORIGIN=http://your-frontend-url.sslip.io
   DATABASE_URL=postgresql://username:password@hostname:5432/survey_db
   ```

5. Click **"Update"**

## Step 3: Link Database to Application (Optional but Recommended)

Some versions of Coolify support linking:

1. In your **server application**, go to **Configuration**
2. Look for **"Databases"** or **"Links"** section
3. Link your PostgreSQL database
4. This will automatically set up the `DATABASE_URL` environment variable

## Step 4: Redeploy Server Application

1. Click **"Redeploy"** on your server application
2. Wait for the build and deployment to complete
3. Check the logs to ensure database connection is successful

You should see:
```
Database initialized successfully
Server is running on port 4001
Database connected successfully
```

## Step 5: Verify Database Connection

### Test the API:

1. **Health Check**:
   ```
   GET http://your-server-url.sslip.io/api/health
   ```

2. **Submit a Survey** (from your frontend or via curl):
   ```bash
   curl -X POST http://your-server-url.sslip.io/api/survey \
     -H "Content-Type: application/json" \
     -d '{"experience":"Excellent","features":"Easy Deployment","feedback":"Great!"}'
   ```

3. **Check Responses**:
   ```
   GET http://your-server-url.sslip.io/api/survey/responses
   ```

4. **Check Stats**:
   ```
   GET http://your-server-url.sslip.io/api/survey/stats
   ```

## Step 6: Access Database Directly (Optional)

### Using Coolify's Database UI:

1. Go to your PostgreSQL database in Coolify
2. Some Coolify versions provide a built-in database browser
3. Or use the **Terminal** tab to access psql

### Using psql via Terminal:

```bash
psql postgresql://username:password@hostname:5432/survey_db
```

Then run SQL queries:
```sql
-- View all responses
SELECT * FROM survey_responses;

-- Count responses
SELECT COUNT(*) FROM survey_responses;

-- Get stats by experience
SELECT experience, COUNT(*) FROM survey_responses GROUP BY experience;
```

## Local Development with PostgreSQL

### Option 1: Use Docker Locally

```bash
docker run --name survey-postgres \
  -e POSTGRES_DB=survey_db \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:16
```

Update your local `server/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/survey_db
```

### Option 2: Install PostgreSQL Locally

1. Download and install PostgreSQL from postgresql.org
2. Create database:
   ```bash
   createdb survey_db
   ```
3. Update `server/.env` with your local connection string

## Database Schema

The application automatically creates this table:

```sql
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  experience VARCHAR(50) NOT NULL,
  features VARCHAR(100) NOT NULL,
  feedback TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Error: "Connection refused"

- Check that DATABASE_URL is correctly set
- Verify the PostgreSQL database is running in Coolify
- Ensure the hostname/port are correct

### Error: "SSL required"

The code automatically handles SSL for production. If you need to disable it:
```typescript
ssl: false
```

### Error: "Password authentication failed"

- Double-check the DATABASE_URL credentials
- Regenerate password in Coolify if needed

### Error: "Database does not exist"

- Ensure the database name in DATABASE_URL matches the one created in Coolify
- Check database creation logs in Coolify

## Security Best Practices

1. ✅ Use strong passwords (Coolify generates these automatically)
2. ✅ Keep DATABASE_URL secret (never commit to git)
3. ✅ Use environment variables for all credentials
4. ✅ Enable SSL in production (already configured)
5. ✅ Regularly backup your database (check Coolify backup features)

## Backup and Restore

### Create Backup:

```bash
pg_dump postgresql://username:password@hostname:5432/survey_db > backup.sql
```

### Restore Backup:

```bash
psql postgresql://username:password@hostname:5432/survey_db < backup.sql
```

## Next Steps

- ✅ Set up database backups in Coolify
- ✅ Add indexes for better query performance
- ✅ Consider adding data validation
- ✅ Implement soft deletes if needed
- ✅ Add pagination for large datasets

---

**You're all set!** Your survey app now uses PostgreSQL for persistent data storage. 🎉

