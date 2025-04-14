<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let title: string;
	export let isOpen: boolean = false;
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let onClose: () => void = () => {};

	function close() {
		onClose();
	}

	function handleEscape(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			close();
		}
	}

	function handleClickOutside(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			close();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	});

	$: sizeClass = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	}[size];
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		role="dialog"
		aria-modal="true"
		tabindex="0"
		on:click={handleClickOutside}
		on:keydown={(e) => (e.key === 'Enter') && handleClickOutside}
		transition:fade={{ duration: 200 }}
	>
		<div
			class="w-full rounded-lg bg-white shadow-xl {sizeClass} flex max-h-[90vh] flex-col"
			transition:fade={{ duration: 150 }}
		>
			<div class="flex items-center justify-between px-8 py-4">
				<h2 class="text-xl font-semibold">{title}</h2>
				<button
					aria-label="Close"
					type="button"
					class="text-gray-500 hover:text-gray-700 focus:outline-none"
					on:click={close}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<div class="overflow-y-auto p-4">
				<slot />
			</div>
		</div>
	</div>
{/if}
