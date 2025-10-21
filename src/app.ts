import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/environment';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { errorHandler, notFoundHandler, requestLogger } from './middlewares';

export const createApp = (): Application => {
  const app: Application = express();

  // Middleware
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Welcome to Game of Drones API',
      version: config.apiVersion,
      documentation: '/api-docs',
      endpoints: {
        health: `/api/${config.apiVersion}/health`,
        players: `/api/${config.apiVersion}/players`,
        matches: `/api/${config.apiVersion}/matches`,
      },
    });
  });

  // API routes
  app.use(`/api/${config.apiVersion}`, routes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};
