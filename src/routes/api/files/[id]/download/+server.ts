import type { RequestHandler } from './$types';
import { getFileData, createFileResponse, FileNotFoundError } from '$lib/utils/fileHelpers';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const fileMetadata = await getFileData(params.id, true);
    return await createFileResponse(fileMetadata, 'attachment');
  } catch (error) {
    console.error('Error downloading file:', error);
    
    if (error instanceof FileNotFoundError) {
      return new Response('File not found', { status: 404 });
    }
    
    return new Response('Failed to download file', { status: 500 });
  }
};