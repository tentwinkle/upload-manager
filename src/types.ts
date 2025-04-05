export interface FileEntry {
  id: number;
  title: string;
  description: string | null;
  category: string;
  language: string;
  provider: string;
  roles: string[];
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  content?: string; // Optional field for text file content preview
}