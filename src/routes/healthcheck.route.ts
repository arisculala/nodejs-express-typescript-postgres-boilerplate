import express from 'express';
import { HttpStatusCode, HttpStatusName } from '../lib/httpstatus';
import { pool } from '../configs/db';

/**
 * Interface for dependency status.
 */
interface Dependency {
  name: string;
  ready: boolean;
}

/**
 * Interface for the health check result.
 */
interface HealthCheckResult {
  status: string;
  dependencies: {
    name: string;
    status: string;
    error: string;
  }[];
}

/**
 * Router for healthcheck endpoints.
 * Provides routes to check the liveness and readiness of the application.
 */
const router = express.Router();

/**
 * GET /healthcheck/liveness
 * Endpoint to check if the application is live.
 * Returns a JSON response with HTTP status 200 and a status message.
 */
router.get('/healthcheck/liveness', function (req, res) {
  return res
    .status(HttpStatusCode.OK)
    .json({ status: HttpStatusName[HttpStatusCode.OK] });
});

/**
 * GET /healthcheck/readiness
 * Endpoint to check if the application is ready to serve requests.
 * Checks dependencies such as database, redis, etc. (TODO: implement).
 * Returns a JSON response with HTTP status 200 and a status message.
 */
router.get('/healthcheck/readiness', async function (req, res) {
  try {
    const dbStatus: string = await checkDatabase(); // Check DB connectivity

    const dependencies: Dependency[] = [
      { name: 'DB', ready: dbStatus === 'OK' },
      // add more dependencies as needed
    ];

    const allDependenciesReady: boolean = dependencies.every(
      (dep) => dep.ready,
    );

    const result: HealthCheckResult = {
      status: allDependenciesReady ? 'OK' : 'Service Unavailable',
      dependencies: dependencies.map((dep) => ({
        name: dep.name,
        status: dep.ready ? 'OK' : 'Service Unavailable',
        error: dep.ready ? '' : 'DB connection is not established',
      })),
    };

    res
      .status(
        allDependenciesReady
          ? HttpStatusCode.OK
          : HttpStatusCode.ServiceUnavailable,
      )
      .json(result);
  } catch (error) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: HttpStatusName[HttpStatusCode.InternalServerError] });
  }
});

/**
 * Check DB database connectivity.
 * @returns {Promise<string>} 'OK' if the connection is successful, otherwise 'Service Unavailable'.
 */
async function checkDatabase(): Promise<string> {
  try {
    await pool.query('SELECT 1'); // Simple query to check the database connection
    return 'OK';
  } catch (error) {
    return 'Service Unavailable';
  }
}

export default router;
