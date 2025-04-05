import pkg from 'pg';
const { Pool } = pkg;
import { env } from '$env/dynamic/private';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL || 'postgresql://postgres:GoodLuck!!!@localhost:5433/fileupload',
});

// Initialize the database schema
export async function initDb() {
  try {
    // Create files table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        language VARCHAR(10) NOT NULL,
        provider VARCHAR(100) NOT NULL,
        roles TEXT[] NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size BIGINT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Export the database connection
export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  pool,
};