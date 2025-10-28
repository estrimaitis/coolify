import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    // Create surveys table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id SERIAL PRIMARY KEY,
        experience VARCHAR(50) NOT NULL,
        features VARCHAR(100) NOT NULL,
        feedback TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const saveSurveyResponse = async (
  experience: string,
  features: string,
  feedback: string
) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO survey_responses (experience, features, feedback, timestamp) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING *`,
      [experience, features, feedback]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getAllSurveyResponses = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM survey_responses ORDER BY timestamp DESC'
    );
    return result.rows;
  } finally {
    client.release();
  }
};

export const getSurveyStats = async () => {
  const client = await pool.connect();
  try {
    const experienceResult = await client.query(`
      SELECT experience, COUNT(*) as count 
      FROM survey_responses 
      GROUP BY experience
    `);
    
    const featuresResult = await client.query(`
      SELECT features, COUNT(*) as count 
      FROM survey_responses 
      GROUP BY features
    `);
    
    const totalResult = await client.query(
      'SELECT COUNT(*) as total FROM survey_responses'
    );
    
    const experienceStats: Record<string, number> = {};
    experienceResult.rows.forEach((row: { experience: string; count: string }) => {
      experienceStats[row.experience] = parseInt(row.count);
    });
    
    const featureStats: Record<string, number> = {};
    featuresResult.rows.forEach((row: { features: string; count: string }) => {
      featureStats[row.features] = parseInt(row.count);
    });
    
    return {
      totalResponses: parseInt(totalResult.rows[0].total),
      experience: experienceStats,
      features: featureStats,
    };
  } finally {
    client.release();
  }
};

export default pool;

