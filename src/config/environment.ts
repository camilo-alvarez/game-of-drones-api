import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/game-of-drones',

  // API configuration
  apiVersion: process.env.API_VERSION || 'v1',
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'],
  openaiApiKey: process.env.OPENAI_API_KEY || '',
} as const;

export const validateEnvironment = (): void => {
  const requiredVars = ['MONGODB_URI'];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn('Warning: Missing optional environment variables:', missingVars.join(', '));
    console.warn('Using default values. Check .env.example for reference.');
  }

  console.log('Environment configuration loaded');
};

export const isProduction = (): boolean => {
  return config.nodeEnv === 'production';
};

export const isDevelopment = (): boolean => {
  return config.nodeEnv === 'development';
};

export const isTest = (): boolean => {
  return config.nodeEnv === 'test';
};
