import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  initDatabase, 
  saveSurveyResponse, 
  getAllSurveyResponses, 
  getSurveyStats 
} from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4000';

// Middleware
const corsOptions = {
  origin: CORS_ORIGIN.split(',').map(origin => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Survey API is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/survey', async (req: Request, res: Response) => {
  try {
    const { experience, features, feedback } = req.body;

    if (!experience || !features) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Experience and features are required'
      });
    }

    const newResponse = await saveSurveyResponse(
      experience,
      features,
      feedback || ''
    );

    console.log('Survey response received:', {
      id: newResponse.id,
      timestamp: newResponse.timestamp
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

app.get('/api/survey/responses', async (req: Request, res: Response) => {
  try {
    const responses = await getAllSurveyResponses();
    res.json({
      success: true,
      count: responses.length,
      data: responses,
    });
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch survey responses'
    });
  }
});

app.get('/api/survey/stats', async (req: Request, res: Response) => {
  try {
    const stats = await getSurveyStats();
    res.json({
      success: true,
      totalResponses: stats.totalResponses,
      stats: {
        experience: stats.experience,
        features: stats.features,
      },
    });
  } catch (error) {
    console.error('Error fetching survey stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch survey stats'
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`CORS enabled for: ${CORS_ORIGIN}`);
      console.log('Database connected successfully');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

