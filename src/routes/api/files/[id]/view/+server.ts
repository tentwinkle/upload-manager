import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { storage } from '$lib/storage';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;
    
    // Get file metadata from database
    const result = await db.query(
      'SELECT file_path, file_type FROM files WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return new Response('File not found', { status: 404 });
    }
    
    const { file_path, file_type } = result.rows[0];
    
    // Get file from storage
    const fileBuffer = await storage.getFile(file_path);
    
    // Return file as response for inline viewing
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': file_type,
        'Content-Disposition': 'inline',
      }
    });
  } catch (error) {
    console.error('Error viewing file:', error);
    return new Response('Failed to view file', { status: 500 });
  }
};