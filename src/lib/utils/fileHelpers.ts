import { db } from '$lib/db';
import { storage } from '$lib/storage';

interface FileMetadata {
  filename?: string;
  file_path: string;
  file_type: string;
}

export class FileNotFoundError extends Error {
  constructor() {
    super('File not found');
    this.name = 'FileNotFoundError';
  }
}

export async function getFileData(id: string, includeFilename = false): Promise<FileMetadata> {
  const columns = includeFilename 
    ? 'filename, file_path, file_type' 
    : 'file_path, file_type';
    
  const result = await db.query(
    `SELECT ${columns} FROM files WHERE id = $1`,
    [id]
  );
  
  if (result.rows.length === 0) {
    throw new FileNotFoundError();
  }
  
  return result.rows[0];
}

export async function createFileResponse(
  fileMetadata: FileMetadata,
  disposition: 'attachment' | 'inline'
): Promise<Response> {
  const fileBuffer = await storage.getFile(fileMetadata.file_path);
  
  const headers: Record<string, string> = {
    'Content-Type': fileMetadata.file_type,
    'Content-Disposition': disposition === 'attachment' && fileMetadata.filename
      ? `attachment; filename="${fileMetadata.filename}"`
      : 'inline'
  };
  
  return new Response(fileBuffer, { headers });
}