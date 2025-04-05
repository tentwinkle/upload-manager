import { initDb } from '$lib/db';

// Initialize the database when the server starts
initDb().catch(console.error);