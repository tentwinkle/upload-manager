<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { FileEntry } from '../../../types';

	let file: FileEntry | null = null;
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await fetch(`/api/files/${$page.params.id}`);
			if (response.ok) {
				file = await response.json();
			} else {
				error = 'Failed to load file details';
			}
		} catch (err) {
			console.error('Error fetching file:', err);
			error = 'An error occurred while loading the file';
		} finally {
			loading = false;
		}
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getFileExtension(filename: string): string {
		return filename.split('.').pop()?.toLowerCase() || '';
	}

	function canPreviewInBrowser(filename: string): boolean {
		const ext = getFileExtension(filename);
		return [
			'pdf',
			'txt',
			'jpg',
			'jpeg',
			'png',
			'gif',
			'mp4',
			'webm',
			'ppt',
			'pptx',
			'doc',
			'docx',
			'xls',
			'xlsx',
			'csv'
		].includes(ext);
	}
</script>

<div class="container mx-auto px-4 py-8">
	<a href="/" class="mb-6 inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="mr-1 h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
				clip-rule="evenodd"
			/>
		</svg>
		Back to Files
	</a>

	{#if loading}
		<div class="flex justify-center py-12">
			<div
				class="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-orange-500"
			></div>
		</div>
	{:else if error}
		<div class="rounded-md bg-red-100 p-4 text-red-700">
			{error}
		</div>
	{:else if file}
		<div class="overflow-hidden rounded-lg bg-white shadow-md">
			<div class="p-6 pb-3">
				<h1 class="text-2xl font-bold">{file.title}</h1>
				<div class="mt-2 text-gray-500">Uploaded on {formatDate(file.created_at)}</div>
			</div>

      <hr class="border-orange-400 mx-6">

			<div class="grid grid-cols-1 gap-6 p-6 pt-4 md:grid-cols-2">
				<div>
					<h2 class="mb-4 text-lg font-semibold">File Information</h2>

					<div class="space-y-4">
						{#if file.description}
							<div>
								<h3 class="text-sm font-medium text-gray-500">Description</h3>
								<p class="mt-1">{file.description}</p>
							</div>
						{/if}

						<div class="grid grid-cols-2 gap-4">
							<div>
								<h3 class="text-sm font-medium text-gray-500">Category</h3>
								<p class="mt-1">{file.category}</p>
							</div>

							<div>
								<h3 class="text-sm font-medium text-gray-500">Language</h3>
								<p class="mt-1 uppercase">{file.language}</p>
							</div>

							<div>
								<h3 class="text-sm font-medium text-gray-500">Provider</h3>
								<p class="mt-1">{file.provider}</p>
							</div>

							<div>
								<h3 class="text-sm font-medium text-gray-500">File Type</h3>
								<p class="mt-1 uppercase">{getFileExtension(file.filename)}</p>
							</div>
						</div>

						<div>
							<h3 class="text-sm font-medium text-gray-500">Roles</h3>
							<div class="mt-1 flex flex-wrap gap-2">
								{#each file.roles as role}
									<span class="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm">{role}</span
									>
								{/each}
							</div>
						</div>
					</div>

					<div class="mt-6">
						<a
							href={`/api/files/${file.id}/download`}
							class="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
							download
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							Download File
						</a>
					</div>
				</div>

				<div>
					<h2 class="mb-4 text-lg font-semibold">File Preview</h2>

					<div
						class="flex min-h-[300px] items-center justify-center overflow-hidden rounded-md border bg-gray-50"
					>
						{#if canPreviewInBrowser(file.filename)}
							{#if getFileExtension(file.filename) === 'pdf'}
								<iframe
									src={`/api/files/${file.id}/view`}
									class="h-[500px] w-full"
									title={file.title}
								></iframe>
							{:else if ['jpg', 'jpeg', 'png', 'gif'].includes(getFileExtension(file.filename))}
								<img
									src={`/api/files/${file.id}/view`}
									alt={file.title}
									class="max-h-[500px] max-w-full object-contain"
								/>
							{:else if ['mp4', 'webm'].includes(getFileExtension(file.filename))}
								<video src={`/api/files/${file.id}/view`} controls class="max-h-[500px] max-w-full"
								></video>
              {:else if getFileExtension(file.filename) === 'mp3'}
                <audio src={`/api/files/${file.id}/view`} controls class="max-h-[500px] max-w-full"></audio>
              {:else if getFileExtension(file.filename) === 'txt'}
                <pre class="whitespace-pre-wrap">{file.content || 'Preview not available'}</pre>
              {:else if getFileExtension(file.filename) === 'json'}
                <pre class="whitespace-pre-wrap">{file.content || 'Preview not available'}</pre>
              {:else if getFileExtension(file.filename) === 'csv'}
                <pre class="whitespace-pre-wrap">{file.content || 'Preview not available'}</pre>
              {:else if getFileExtension(file.filename) === 'xml'}
                <pre class="whitespace-pre-wrap">{file.content || 'Preview not available'}</pre>
							{:else}
								<div class="h-[500px] w-full overflow-auto p-4">
									<pre class="whitespace-pre-wrap">{file.content || 'Preview not available'}</pre>
								</div>
							{/if}
						{:else}
							<div class="p-8 text-center">
								<div class="mb-4 text-5xl">📄</div>
								<p class="text-gray-500">Preview not available for this file type</p>
								<p class="mt-2 text-sm">Please download the file to view its contents</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="rounded-md bg-yellow-100 p-4 text-yellow-700">File not found</div>
	{/if}
</div>

<style>
	:global(.container) {
		max-width: 1200px;
	}

  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f9fafb;
    color: #111827;
  }
</style>
