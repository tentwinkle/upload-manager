import type { RequestHandler } from './$types';
import { getFileData, createFileResponse, FileNotFoundError } from '$lib/utils/fileHelpers';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const fileMetadata = await getFileData(params.id);
    return await createFileResponse(fileMetadata, 'inline');
  } catch (error) {
    console.error('Error viewing file:', error);

    if (error instanceof FileNotFoundError) {
      return new Response('File not found', { status: 404 });
    }

    return new Response('Failed to view file', { status: 500 });
  }
};