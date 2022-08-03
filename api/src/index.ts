import { startServer } from './server';

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection');
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  console.error('uncaughtException');
  console.error(reason);
});

startServer();
