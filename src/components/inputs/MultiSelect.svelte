<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let options: string[] = [];
  export let selected: string[] = [];
  export let placeholder = 'Select options';
  
  const dispatch = createEventDispatcher();
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
  
  function handleOptionChange(option: string) {
    if (selected.includes(option)) {
      selected = selected.filter((r) => r !== option);
    } else {
      selected = [...selected, option];
    }
    dispatch('change', selected);
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="multi-select-container relative w-full">
  <div
    class="flex w-full cursor-pointer appearance-none items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-gray-400 focus:outline-none"
    on:click={toggleDropdown}
  >
    <div class="flex flex-wrap gap-1">
      {#if selected.length === 0}
        <span class="text-gray-400">{placeholder}</span>
      {:else}
        {#each selected as option}
          <span class="flex items-center rounded-md bg-gray-200 px-2 py-1 text-sm">
            {option}
            <button
              class="ml-1 text-gray-600 hover:text-gray-800"
              on:click|stopPropagation={() => handleOptionChange(option)}
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>

  {#if isOpen}
    <div
      class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg"
    >
      {#each options as option}
        <label
          class="block flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
          for={`checkbox-${option}`}
        >
          <input
            type="checkbox"
            id={`checkbox-${option}`}
            checked={selected.includes(option)}
            on:change={() => handleOptionChange(option)}
            class="mr-2"
          />
          <span class="flex-grow">{option}</span>
        </label>
      {/each}
    </div>
  {/if}
</div>

<style>
  .multi-select-container {
    user-select: none;
  }
</style>