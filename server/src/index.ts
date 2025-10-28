import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4000';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN.split(',').map(origin => origin.trim()),
  credentials: true,
}));
app.use(express.json());

// In-memory storage for survey responses (in production, use a database)
interface SurveyResponse {
  id: string;
  experience: string;
  features: string;
  feedback: string;
  timestamp: string;
}

const surveyResponses: SurveyResponse[] = [];

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Survey API is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/survey', (req: Request, res: Response) => {
  try {
    const { experience, features, feedback } = req.body;

    if (!experience || !features) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Experience and features are required'
      });
    }

    const newResponse: SurveyResponse = {
      id: Date.now().toString(),
      experience,
      features,
      feedback: feedback || '',
      timestamp: new Date().toISOString(),
    };

    surveyResponses.push(newResponse);

    console.log('Survey response received:', {
      id: newResponse.id,
      totalResponses: surveyResponses.length
    });

    res.status(201).json({
      success: true,
      message: 'Survey response saved',
      data: newResponse,
    });
  } catch (error) {
    console.error('Error saving survey response:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to save survey response'
    });
  }
});

app.get('/api/survey/responses', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: surveyResponses.length,
    data: surveyResponses,
  });
});

app.get('/api/survey/stats', (req: Request, res: Response) => {
  const experienceStats: Record<string, number> = {};
  const featureStats: Record<string, number> = {};

  surveyResponses.forEach(response => {
    experienceStats[response.experience] = (experienceStats[response.experience] || 0) + 1;
    featureStats[response.features] = (featureStats[response.features] || 0) + 1;
  });

  res.json({
    success: true,
    totalResponses: surveyResponses.length,
    stats: {
      experience: experienceStats,
      features: featureStats,
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for: ${CORS_ORIGIN}`);
});

