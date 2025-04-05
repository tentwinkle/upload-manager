import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;
    
    const result = await db.query(
      'SELECT id, title, description, category, language, provider, roles, filename, file_path, file_type, file_size, created_at FROM files WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return json({ error: 'File not found' }, { status: 404 });
    }
    
    return json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching file:', error);
    return json({ error: 'Failed to fetch file' }, { status: 500 });
  }
};