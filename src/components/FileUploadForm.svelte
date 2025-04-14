<script lang="ts">
	import MultiSelect from './inputs/MultiSelect.svelte';
	import FileInput from './inputs/FileInput.svelte';
	import SelectField from './inputs/SelectField.svelte';

	export let onFileUploaded: (file: any) => void = () => {};

	// Form data
	let title = '';
	let description = '';
	let category = '';
	let language = '';
	let provider = '';
	let roles: string[] = [];
	let file: File | null = null;

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

	function validateForm(): string | null {
		if (!title || !category || !language || !provider || !file) {
			return 'Please fill in all required fields';
		}

		if (title.length > 200) {
			return 'Title must be less than 200 characters';
		}

		if (description && description.length > 1000) {
			return 'Description must be less than 1000 characters';
		}

		if (roles.length === 0) {
			return 'Please select at least one role';
		}

		if (roles.length > 2) {
			return 'Maximum of two roles can be selected';
		}

		return null;
	}

	async function handleSubmit() {
		const validationError = validateForm();
		if (validationError) {
			error = validationError;
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
			formData.append('file', file ?? '');

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

			onFileUploaded(newFile);
		} catch (err) {
			console.error('Upload error:', err);
			error = err instanceof Error ? err.message : 'An error occurred during upload';
		} finally {
			loading = false;
		}
	}
</script>

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
				bind:value={description}
				maxlength="1000"
				rows="3"
				placeholder="Description"
				class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-400 focus:outline-none"
			></textarea>
		</div>

		<!-- Category -->
		<SelectField bind:value={category} options={categoryOptions} placeholder="Category*" required />

		<!-- Language -->
		<SelectField bind:value={language} options={languageOptions} placeholder="Language*" required />

		<!-- Provider -->
		<SelectField bind:value={provider} options={providerOptions} placeholder="Provider*" required />

		<!-- Role -->
		<MultiSelect
			options={roleOptions}
			bind:selected={roles}
			placeholder="Select roles*"
			onChange={(newRoles) => (roles = newRoles)}
		/>

		<!-- File Upload -->
		<FileInput bind:selectedFile={file} required onChange={(newFile) => (file = newFile)} />
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
	input::placeholder,
	textarea::placeholder {
		color: #9ca3af;
	}
</style>
