import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { storage } from '$lib/storage';
import { v4 as uuidv4 } from 'uuid';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const searchQuery = url.searchParams.get("q") || ""

    // If no search query, return all files
    if (!searchQuery.trim()) {
      const files = await db.query(
        "SELECT id, title, description, category, language, provider, roles, filename, created_at FROM files ORDER BY created_at DESC",
      )
      return json(files.rows)
    }

    // If search query exists, filter the results
    const searchPattern = `%${searchQuery}%`
    const files = await db.query(
      `SELECT id, title, description, category, language, provider, roles, filename, created_at 
       FROM files 
       WHERE 
         title ILIKE $1 OR
         description ILIKE $1 OR
         category ILIKE $1 OR
         language ILIKE $1 OR
         provider ILIKE $1 OR
         filename ILIKE $1 OR
         array_to_string(roles, ',') ILIKE $1
       ORDER BY created_at DESC`,
      [searchPattern]
    );
    

    return json(files.rows)
  } catch (error) {
    console.error("Error fetching files:", error)
    return json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const language = formData.get('language') as string;
    const provider = formData.get('provider') as string;
    const roles = JSON.parse(formData.get('roles') as string);
    const file = formData.get('file') as File;
    
    if (!title || !category || !language || !provider || !roles.length || !file) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Generate a unique filename
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const filename = `${fileId}.${fileExtension}`;
    
    // Upload file to storage
    const fileBuffer = await file.arrayBuffer();
    const filePath = await storage.uploadFile(filename, new Uint8Array(fileBuffer), file.type);
    
    // Save file metadata to database
    const result = await db.query(
      `INSERT INTO files (
        title, description, category, language, provider, roles, filename, file_path, file_type, file_size
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        title,
        description,
        category,
        language,
        provider,
        roles,
        file.name,
        filePath,
        file.type,
        file.size
      ]
    );
    
    return json(result.rows[0]);
  } catch (error) {
    console.error('Error uploading file:', error);
    return json({ error: 'Failed to upload file' }, { status: 500 });
  }
};