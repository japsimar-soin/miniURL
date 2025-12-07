import '@/types/express';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import path, { join } from 'path';

import config from '@/config';
import corsOptions from '@/lib/cors';
import { logger, logtail } from '@/lib/winston';
import { connectDatabase, disconnectDatabase } from './lib/mongoose';

import router from '@/routes';

const server = express();

server.use(cors(corsOptions));

// server.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "'unsafe-inline'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         connectSrc: [
//           "'self'",
//           ...(config.NODE_ENV === 'development'
//             ? ['http://localhost:*', 'ws://localhost:*']
//             : []),
//         ],
//       },
//     },
//   }),
// );
server.use(helmet({contentSecurityPolicy: false,}));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(compression());

server.use(express.static(join(process.cwd(), 'src', 'client')));

server.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src", "client", "pages", "dashboard.html"));
});

server.get("/code/:code", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src", "client", "pages", "stats.html"));
});

server.use('/', router);

(async function (): Promise<void> {
  try {
    await connectDatabase();
  } catch (error) {
    logger.error('Failed to connect database', error);
    if (config.NODE_ENV === 'production') {
      logger.error(
        'Exiting in production mode due to database connection failure',
      );
      process.exit(1);
    }
    logger.warn(
      'Continuing in development mode despite database connection failure',
    );
  }

  server.listen(config.PORT, () => {
    logger.info(`Server is listening at ${config.PORT}`);
  });
})();

const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    await disconnectDatabase();
    logger.info('Server shutdown', signal);

    logtail.flush();
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown', error);
  }
};

process.on('SIGTERM', serverTermination);
process.on('SIGINT', serverTermination);
