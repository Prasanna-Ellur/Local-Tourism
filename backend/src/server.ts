import app from './app';
import { ENV } from './config/env';
import prisma from './config/database';

const server = app.listen(ENV.PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 ExploreLocal API Server Running!`);
  console.log(`📡 URL: http://localhost:${ENV.PORT}`);
  console.log(`🩺 Health: http://localhost:${ENV.PORT}/api/health`);
  console.log(`🌱 Environment: ${ENV.NODE_ENV}`);
  console.log(`===============================================`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Database connection disconnected.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
