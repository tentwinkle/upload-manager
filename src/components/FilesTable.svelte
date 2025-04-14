<script lang="ts">
	import type { FileEntry } from '../types';

	export let files: FileEntry[] = [];

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getFileIcon(filename: string): string {
		const extension = filename.split('.').pop()?.toLowerCase() || '';

		switch (extension) {
			case 'pdf':
				return '📄';
			case 'txt':
				return '📝';
			case 'mp4':
			case 'mov':
			case 'avi':
				return '🎬';
			case 'ppt':
			case 'pptx':
				return '📊';
			case 'doc':
			case 'docx':
				return '📃';
			case 'xls':
			case 'xlsx':
				return '📈';
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
				return '📷';
			case 'mp3':
			case 'wav':
			case 'ogg':
				return '🎵';
			case 'zip':
			case 'tar':
			case 'gz':
			case '7z':
				return '📦';
			case 'exe':
			case 'msi':
				return '💻';
			case 'iso':
				return '💿';
			case 'torrent':
				return '🔗';
			default:
				return '📂';
		}
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full overflow-hidden rounded-lg bg-white shadow-md">
		<thead class="bg-gray-100 text-gray-700">
			<tr>
				<th class="px-4 py-3 text-left font-medium">Title</th>
				<th class="px-4 py-3 text-left font-medium">Category</th>
				<th class="px-4 py-3 text-left font-medium">Language</th>
				<th class="px-4 py-3 text-left font-medium">Provider</th>
				<th class="px-4 py-3 text-left font-medium">Roles</th>
				<th class="px-4 py-3 text-left font-medium">Uploaded</th>
				<th class="px-4 py-3 text-left font-medium">Download</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200">
			{#each files as file (file.id)}
				<tr
					class="cursor-pointer hover:bg-gray-50"
					on:click={() => (window.location.href = `/files/${file.id}`)}
				>
					<td class="px-4 py-3">
						<div class="flex items-center">
							<span class="mr-2 text-xl">{getFileIcon(file.filename)}</span>
							<div>
								<div class="font-medium">{file.title}</div>
								{#if file.description}
									<div class="max-w-xs truncate text-sm text-gray-500">{file.description}</div>
								{/if}
							</div>
						</div>
					</td>
					<td class="px-4 py-3 text-sm">{file.category}</td>
					<td class="px-4 py-3 text-sm uppercase">{file.language}</td>
					<td class="px-4 py-3 text-sm">{file.provider}</td>
					<td class="px-4 py-3 text-sm">
						<div class="flex flex-wrap gap-1">
							{#each file.roles as role}
								<span class="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs">{role}</span>
							{/each}
						</div>
					</td>
					<td class="px-4 py-3 text-sm">{formatDate(file.created_at)}</td>
					<td class="flex justify-center px-4 py-3">
						<button
							aria-label="Download"
							type="button"
							class="p-1 text-orange-500 hover:cursor-pointer hover:text-orange-600"
							on:click|stopPropagation={() =>
								window.open(`/api/files/${file.id}/download`, '_blank')}
							title="Download"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-7 w-7"
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
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
