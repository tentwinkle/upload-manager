<script lang="ts">
  import { onMount } from 'svelte';
  import FileUploadForm from '../components/FileUploadForm.svelte';
  import FilesTable from '../components/FilesTable.svelte';
  import Modal from '../components/Modal.svelte';
  import type { FileEntry } from '../types';
  
  let files: FileEntry[] = [];
  let loading = true;
  let isUploadModalOpen = false;
  
  onMount(async () => {
    try {
      const response = await fetch('/api/files');
      if (response.ok) {
        files = await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      loading = false;
    }
  });
  
  function handleFileUploaded(event: CustomEvent) {
    files = [event.detail, ...files];
    isUploadModalOpen = false;
  }
  
  function openUploadModal() {
    isUploadModalOpen = true;
  }
  
  function closeUploadModal() {
    isUploadModalOpen = false;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">File Management System</h1>
  
  <div class="mb-10">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Uploaded Files</h2>
      <button 
        on:click={openUploadModal}
        class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Upload
      </button>
    </div>
    
    {#if loading}
      <div class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    {:else if files.length === 0}
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="text-5xl mb-4">📁</div>
        <p class="text-gray-500 mb-6">No files uploaded yet</p>
        <button 
          on:click={openUploadModal}
          class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Upload Your First File
        </button>
      </div>
    {:else}
      <FilesTable {files} />
    {/if}
  </div>
  
  <Modal 
    title="Upload Resource" 
    isOpen={isUploadModalOpen} 
    on:close={closeUploadModal}
    size="xl"
  >
    <FileUploadForm on:fileUploaded={handleFileUploaded} />
  </Modal>
</div>

<style>
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f9fafb;
    color: #111827;
  }
  
  :global(.container) {
    max-width: 1200px;
  }
  
</style>