import { createApp } from './app';
import { connectDatabase } from './config/database';
import { config, validateEnvironment } from './config/environment';

const startServer = async (): Promise<void> => {
  try {
    validateEnvironment();

    await connectDatabase();

    const app = createApp();

    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    const gracefulShutdown = async (): Promise<void> => {
      server.close(async () => {
        try {
          const { disconnectDatabase } = await import('./config/database');
          await disconnectDatabase();
          process.exit(0);
        } catch (error) {
          process.exit(1);
        }
      });

      setTimeout(() => {
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown());
    process.on('SIGINT', () => gracefulShutdown());
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
