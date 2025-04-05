<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Form data
	let title = '';
	let description = '';
	let category = '';
	let language = '';
	let provider = '';
	let roles: string[] = [];
	let file: File | null = null;
	let fileInputRef: HTMLInputElement;

	// Form state
	let loading = false;
	let error = '';
	let success = '';

	// Options for select fields
	const categoryOptions = [
		'Leadership',
		'Managing Complexity',
		'Communication',
		'Problem Solving',
		'Innovation'
	];
	const languageOptions = ['English', 'Italian', 'Spanish', 'French', 'German'];
	const providerOptions = ['Skilla', 'Linkedin', 'Pack', 'Mentor', 'Internal'];
	const roleOptions = ['Mentor/Coach', 'Mentee/Coachee'];

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			file = input.files[0];
		}
	}

	function selectFile() {
		fileInputRef.click();
	}

	function handleRoleChange(role: string) {
		if (roles.includes(role)) {
			roles = roles.filter((r) => r !== role);
		} else {
			roles = [...roles, role];
		}
	}

	// Toggle dropdown visibility
	let isOpen = false;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.multi-select-container')) {
			isOpen = false;
		}
	}

	async function handleSubmit() {
		if (!title || !category || !language || !provider || !file) {
			error = 'Please fill in all required fields';
			return;
		}

		if (title.length > 200) {
			error = 'Title must be less than 200 characters';
			return;
		}

		if (description && description.length > 1000) {
			error = 'Description must be less than 1000 characters';
			return;
		}

		error = '';
		loading = true;

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('category', category);
			formData.append('language', language);
			formData.append('provider', provider);
			formData.append('roles', JSON.stringify(roles));
			formData.append('file', file);

			const response = await fetch('/api/files', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to upload file');
			}

			const newFile = await response.json();

			// Reset form
			title = '';
			description = '';
			category = '';
			language = '';
			provider = '';
			roles = [];
			file = null;

			// Show success message
			success = 'File uploaded successfully!';
			setTimeout(() => (success = ''), 3000);

			// Dispatch event to parent
			dispatch('fileUploaded', newFile);
		} catch (err) {
			console.error('Upload error:', err);
			error = err instanceof Error ? err.message : 'An error occurred during upload';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<form on:submit|preventDefault={handleSubmit} class="px-4 pb-6">
	{#if error}
		<div class="mb-6 rounded-md bg-red-100 p-3 text-red-700">
			{error}
		</div>
	{/if}

	{#if success}
		<div class="mb-6 rounded-md bg-green-100 p-3 text-green-700">
			{success}
		</div>
	{/if}

	<div class="space-y-4">
		<!-- Title -->
		<div>
			<input
				id="title"
				type="text"
				bind:value={title}
				maxlength="200"
				required
				placeholder="Title*"
				class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-400 focus:outline-none"
			/>
		</div>

		<!-- Description -->
		<div>
			<textarea
				id="description"
				bind:value={description}
				maxlength="1000"
				rows="3"
				placeholder="Description*"
				class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-400 focus:outline-none"
			></textarea>
		</div>

		<!-- Category -->
		<div>
			<select
				id="category"
				bind:value={category}
				required
				class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-gray-400 focus:outline-none {category === '' ? 'text-gray-400' : 'text-gray-900'}"
			>
				<option value="" disabled selected hidden>Category*</option>
				{#each categoryOptions as option}
					<option class="text-gray-900" value={option}>{option}</option>
				{/each}
			</select>
			<div class="pointer-events-none relative">
				<div
					class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700"
					style="top: -42px;"
				>
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
						></path>
					</svg>
				</div>
			</div>
		</div>

		<!-- Language -->
		<div>
			<select
				id="language"
				bind:value={language}
				required
				class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-gray-400 focus:outline-none {language === "" ? 'text-gray-400' : 'text-gray-900'}"
			>
				<option value="" disabled selected hidden>Language*</option>
				{#each languageOptions as option}
					<option class="text-gray-900" value={option}>{option}</option>
				{/each}
			</select>
			<div class="pointer-events-none relative">
				<div
					class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700"
					style="top: -42px;"
				>
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
						></path>
					</svg>
				</div>
			</div>
		</div>

		<!-- Provider -->
		<div>
			<select
				id="provider"
				bind:value={provider}
				required
				class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-gray-400 focus:outline-none
		{provider === '' ? 'text-gray-400' : 'text-gray-900'}"
			>
				<option value="" disabled hidden>Provider*</option>
				{#each providerOptions as option}
					<option class="text-gray-900" value={option}>{option}</option>
				{/each}
			</select>
			<div class="pointer-events-none relative">
				<div
					class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700"
					style="top: -42px;"
				>
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
						></path>
					</svg>
				</div>
			</div>
		</div>

		<!-- Role -->
		<div class="multi-select-container relative w-full">
			<!-- Selected options display -->
			<div
				class="flex w-full cursor-pointer appearance-none items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-gray-400 focus:outline-none"
				on:click={toggleDropdown}
			>
				<div class="flex flex-wrap gap-1">
					{#if roles.length === 0}
						<span class="text-gray-400">Select roles</span>
					{:else}
						{#each roles as role}
							<span class="flex items-center rounded-md bg-gray-200 px-2 py-1 text-sm">
								{role}
								<button
									class="ml-1 text-gray-600 hover:text-gray-800"
									on:click|stopPropagation={() => {
										roles = roles.filter((r) => r !== role);
									}}
								>
									×
								</button>
							</span>
						{/each}
					{/if}
				</div>
				<div class="text-gray-700">
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
						></path>
					</svg>
				</div>
			</div>

			<!-- Dropdown options -->
			{#if isOpen}
				<div
					class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg"
				>
					{#each roleOptions as option}
						<label
							class="block flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
							for={`checkbox-${option}`}
						>
							<input
								type="checkbox"
								id={`checkbox-${option}`}
								checked={roles.includes(option)}
								on:change={() => {
									if (roles.includes(option)) {
										roles = roles.filter((r) => r !== option);
									} else {
										roles = [...roles, option];
									}
								}}
								class="mr-2"
							/>
							<span class="flex-grow">{option}</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>

		<!-- File Upload -->
		<div class="flex gap-4">
			<div class="flex-1">
				<div class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-400">
					{file ? file.name : 'No file selected*'}
				</div>
				<input
					id="file"
					type="file"
					on:change={handleFileChange}
					required
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
	</div>

	<div class="mt-4 flex justify-end">
		<button
			type="submit"
			disabled={loading}
			class="rounded-lg bg-orange-500 px-4 py-2 text-lg font-medium text-white hover:bg-orange-600 focus:outline-none disabled:opacity-50"
		>
			{#if loading}
				<span class="flex items-center justify-center">
					<span class="mr-2 h-5 w-5 animate-spin rounded-full border-t-2 border-b-2 border-white"
					></span>
					Uploading...
				</span>
			{:else}
				Upload
			{/if}
		</button>
	</div>
</form>

<style>
	/* Hide default select arrow */
	select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}

	.multi-select-container {
		user-select: none;
	}

	/* Custom styling for placeholder text */
	input::placeholder,
	textarea::placeholder,
	select option[value=''] {
		color: #9ca3af;
	}
</style>
