<script lang="ts">
  export let value: string = '';
  export let options: string[] = [];
  export let placeholder = 'Select an option';
  export let required = false;
</script>

<div>
  <select
    bind:value
    {required}
    class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-gray-400 focus:outline-none {value === '' ? 'text-gray-400' : 'text-gray-900'}"
  >
    <option value="" disabled selected hidden>{placeholder}</option>
    {#each options as option}
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>
</div>

<style>
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  select option[value=''] {
    color: #9ca3af;
  }
</style>