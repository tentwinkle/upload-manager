import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { storage } from '$lib/storage';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;
    
    // Get file metadata from database
    const result = await db.query(
      'SELECT filename, file_path, file_type FROM files WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return new Response('File not found', { status: 404 });
    }
    
    const { filename, file_path, file_type } = result.rows[0];
    
    // Get file from storage
    const fileBuffer = await storage.getFile(file_path);
    
    // Return file as response
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': file_type,
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return new Response('Failed to download file', { status: 500 });
  }
};