import { env } from '$env/dynamic/private';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Determine if we're using cloud storage or local storage
const useCloudStorage = !!env.CLOUD_STORAGE_ENABLED;

// For local storage, we need to create the uploads directory
if (!useCloudStorage) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

// const supabaseClient = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

// Storage interface
export const storage = {
  /**
   * Upload a file to storage
   * @param filename The name to save the file as
   * @param data The file data as a Uint8Array
   * @param contentType The MIME type of the file
   * @returns The path to the file in storage
   */
  uploadFile: async (filename: string, data: Uint8Array, contentType: string): Promise<string> => {
    if (useCloudStorage) {
      // For now, we'll just use local storage as a fallback
      return await localUploadFile(filename, data);
    } else {
      // Use local file system storage
      return await localUploadFile(filename, data);
      // throw new Error('Cloud storage not enabled');
    }
  },
  
  /**
   * Get a file from storage
   * @param filePath The path to the file in storage
   * @returns The file data as a Buffer
   */
  getFile: async (filePath: string): Promise<Buffer> => {
    if (useCloudStorage) {
      // For now, we'll just use local storage as a fallback
      return await localGetFile(filePath);
    } else {
      // Use local file system storage
      return await localGetFile(filePath);
      // return Buffer.from('');
    }
  },
  
  /**
   * Delete a file from storage
   * @param filePath The path to the file in storage
   */
  deleteFile: async (filePath: string): Promise<void> => {
    if (useCloudStorage) {  
      // For now, we'll just use local storage as a fallback
      await localDeleteFile(filePath);
    } else {
      // Use local file system storage
      await localDeleteFile(filePath);
    }
  }
};

// Local storage implementation
async function localUploadFile(filename: string, data: Uint8Array): Promise<string> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = path.join(__dirname, '../../uploads', filename);
  
  await fs.promises.writeFile(filePath, data);
  
  // Return the relative path to the file
  return filename;
}

async function localGetFile(filePath: string): Promise<Buffer> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fullPath = path.join(__dirname, '../../uploads', filePath);
  
  return await fs.promises.readFile(fullPath);
}

async function localDeleteFile(filePath: string): Promise<void> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fullPath = path.join(__dirname, '../../uploads', filePath);
  
  await fs.promises.unlink(fullPath);
}