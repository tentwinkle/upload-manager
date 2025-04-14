<script lang="ts">
	export let selectedFile: File | null = null;
	export let required = false;
	export let onChange: (file: File) => void = () => {};

	let fileInputRef: HTMLInputElement;

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			selectedFile = input.files[0];
			onChange(selectedFile); // call the prop
		}
	}

	function selectFile() {
		fileInputRef.click();
	}
</script>

<div class="flex gap-4">
	<div class="flex-1">
		<div class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-400">
			{selectedFile ? selectedFile.name : 'No file selected*'}
		</div>
		<input
			type="file"
			on:change={handleFileChange}
			{required}
			class="hidden"
			bind:this={fileInputRef}
		/>
	</div>
	<button
		type="button"
		on:click={selectFile}
		class="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-800 hover:bg-gray-50"
	>
		Select file
	</button>
</div>
