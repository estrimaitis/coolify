# Survey App - Coolify Deployment Test

A simple survey application built with Next.js (frontend) and Express (backend) in a monorepo structure, designed for easy deployment on Coolify with separate domains.

## 📁 Project Structure

```
.
├── app/                    # Next.js frontend application (root)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── server/                 # Express backend application
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── package.json            # Frontend dependencies
├── next.config.js
├── tsconfig.json
├── .env.example
└── README.md
```

## 🚀 Features

- **Frontend (Next.js 14)**: Interactive survey form with modern UI
- **Backend (Express)**: RESTful API with TypeScript
- **Separate Deployments**: Each app can be deployed to different domains
- **Environment Variables**: Configured for different environments
- **CORS Support**: Properly configured for cross-origin requests

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Configure environment variables:**

   **Frontend (.env in root):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4001
   ```

   **Backend (server/.env):**
   ```env
   PORT=4001
   CORS_ORIGIN=http://localhost:4000
   ```

### Running Locally

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:4000`

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:4001`

## 🐳 Coolify Deployment

Deploy both applications to separate domains on Coolify.

### Prerequisites

- Coolify instance running
- GitHub repository with this code
- Two domain names (or subdomains)

### Deployment Steps

#### 1. Deploy Backend (Server)

1. In Coolify, create a new **Resource** → **Application**
2. Connect your GitHub repository
3. Configure the application:
   - **Name**: `survey-app-server`
   - **Build Pack**: `nixpacks`
   - **Base Directory**: `server`
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `4001`

4. Set environment variables:
   ```
   PORT=4001
   CORS_ORIGIN=https://your-frontend-domain.com
   ```
   
5. Set your domain (e.g., `api.yourdomain.com`)
6. Deploy the application

#### 2. Deploy Frontend (Next.js)

1. In Coolify, create a new **Resource** → **Application**
2. Connect the same GitHub repository
3. Configure the application:
   - **Name**: `survey-app-frontend`
   - **Build Pack**: `nixpacks`
   - **Base Directory**: `.` (root directory)
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `4000`

4. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```
   
5. Set your domain (e.g., `survey.yourdomain.com`)
6. Deploy the application

### Important Notes for Coolify

- **Separate Builds**: Even though both apps are in the same repository, Coolify will build them separately using the Base Directory setting
- **Environment Variables**: Make sure the `CORS_ORIGIN` in the backend matches your frontend domain
- **HTTPS**: Coolify automatically provisions SSL certificates for your domains
- **Port Mapping**: Coolify handles port mapping automatically
- **Deployment Order**: Deploy the backend first, then use its URL in the frontend environment variables

### Environment Variables Reference

**Frontend (.env):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

**Backend (server/.env):**
```env
PORT=4001
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status

### Submit Survey
```
POST /api/survey
Content-Type: application/json

{
  "experience": "Excellent",
  "features": "Easy Deployment",
  "feedback": "Great tool!"
}
```

### Get All Responses
```
GET /api/survey/responses
```

### Get Statistics
```
GET /api/survey/stats
```

## 🧪 Testing the Deployment

1. Visit your frontend domain
2. Fill out the survey form
3. Submit the form
4. Check if the response is saved successfully
5. Visit `https://your-backend-domain.com/api/health` to verify the API is running
6. Visit `https://your-backend-domain.com/api/survey/stats` to see statistics

## 📝 Notes

- The backend stores responses in memory (not persistent). For production, consider using a database.
- Both applications use TypeScript for type safety
- The frontend uses Next.js 14 with App Router
- CORS is configured to allow requests from your frontend domain

## 🔧 Troubleshooting

### Frontend can't connect to backend

1. Check that `NEXT_PUBLIC_API_URL` in frontend matches your backend domain
2. Verify `CORS_ORIGIN` in backend includes your frontend domain
3. Ensure both applications are running

### Coolify deployment fails

1. Check build logs in Coolify dashboard
2. Verify Base Directory is set correctly (`server` for backend, `.` for frontend)
3. Ensure all dependencies are listed in package.json
4. Check that start commands are correct

### CORS errors

1. Update `CORS_ORIGIN` in backend to include your frontend domain
2. Redeploy the backend application
3. Clear browser cache and try again

## 📄 License

MIT

## 🤝 Contributing

This is a test application for Coolify deployment. Feel free to use it as a template for your own projects!

