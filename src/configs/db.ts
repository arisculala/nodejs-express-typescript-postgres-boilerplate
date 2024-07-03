import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Interface representing the configuration for the PostgreSQL connection pool.
 */
interface PoolConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

/**
 * Configuration object for the PostgreSQL connection pool.
 * It uses environment variables with default values if the environment variables are not set.
 */
const poolConfig: PoolConfig = {
  user: process.env.POSTGRES_USER || 'defaultUser',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'defaultDb',
  password: process.env.POSTGRES_PASSWORD || 'defaultPassword',
  port: process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT, 10)
    : 5432,
};

/**
 * The PostgreSQL connection pool instance.
 */
const pool = new Pool(poolConfig);

/**
 * Executes a query on the PostgreSQL database using the provided query text and parameters.
 *
 * @param {string} text - The query text to execute.
 * @param {any[]} [params] - An optional array of parameters to be used in the query.
 * @returns {Promise<any>} - A promise that resolves with the result of the query.
 */
const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export { query, pool };
