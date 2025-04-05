# File Upload System

A simple file upload system built with SvelteKit, TypeScript, and PostgreSQL.

## Features

- Upload files with metadata (title, description, category, language, provider, roles)
- View uploaded files in a table
- Download files
- View file details and preview supported file types
- Responsive design

## Tech Stack

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Storage**: Local file system (with cloud storage option)
- **Containerization**: Docker

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Docker](https://www.docker.com/) and Docker Compose

## Setup Instructions

### Option 1: Using Docker (Recommended)

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/file-upload-system.git
   cd file-upload-system
   ```

2. Build and run the Docker containers:

   ```bash
   docker-compose up -d
   ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### Option 2: Manual Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/file-upload-system.git
   cd file-upload-system
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Setup PostgreSQL:

- Install PostgreSQL if you don't have it
- Create a database named `fileupload`
- Update the `DATABASE_URL` in `.env` file

4. Create a `.env` file:

```plaintext
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fileupload
CLOUD_STORAGE_ENABLED=false
```

5. Start the development server:

   ```bash
   yarn dev
   ```

6. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Cloud Storage Setup (Optional)

To use cloud storage instead of local file system:

1. Set up a cloud storage provider (e.g., Supabase Storage, AWS S3)
2. Update the `storage.ts` file with your cloud storage implementation
3. Set `CLOUD_STORAGE_ENABLED=true` in your environment variables
4. Add any required API keys or credentials to your environment variables

## Project Structure

- `src/routes/` - SvelteKit routes
- `src/components/` - Reusable Svelte components
- `src/lib/` - Utility functions and modules
- `src/types.ts` - TypeScript type definitions
- `uploads/` - Local storage for uploaded files (when using local storage)

## API Endpoints

- `GET /api/files` - Get all files
- `POST /api/files` - Upload a new file
- `GET /api/files/:id` - Get file details
- `GET /api/files/:id/download` - Download a file
- `GET /api/files/:id/view` - View a file inline

