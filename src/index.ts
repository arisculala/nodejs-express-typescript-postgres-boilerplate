import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import gracefulShutdown from 'http-graceful-shutdown';
import cors from 'cors';

import Logger from './lib/logger';
import healthCheckRoutes from './routes/healthcheck.route';
import userRoutes from './routes/user.route';
import UserService from './services/user.service';
import UserController from './controllers/user.controller';

const environment = process.env.NODE_ENV || 'local';
const PORT = process.env.PORT || 3000;

export const app = express();
app.use(express.json());
app.use(cors());

// create a router for /api prefix
const apiRouter = express.Router();
app.use('/api', apiRouter);

// mount routes
apiRouter.use(healthCheckRoutes);
apiRouter.use(userRoutes);

/**
 * Initializes the server, sets up services and controllers, and handles graceful shutdown.
 */
(async () => {
  try {
    // initialize repositories
    const userService = new UserService();
    const userController = new UserController(userService);

    // set userController instance in the app for dependency injection
    app.set('userController', userController);

    // start the Express server
    const server = app.listen(PORT, () => {
      Logger.info(
        `🚀 [${environment}] nodejs-express-typescript-postgres-boilerplate API Service listening on port ${PORT} 🚀`,
      );
    });

    // set keepAliveTimeout and headersTimeout for graceful shutdown
    server.keepAliveTimeout = 181 * 1000;
    server.headersTimeout = 185 * 1000;

    // enable graceful shutdown
    gracefulShutdown(server);
  } catch (error) {
    Logger.error(`Error encountered starting application`);
    Logger.error(error);
    process.exit(1);
  }
})();
