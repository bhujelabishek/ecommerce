

<template>
  <div>
    <h1 class="text-2xl font-bold text-green-600">About Page</h1>
    <p>This is the about page of the Nuxt application.</p>
    {{ counter }}
  </div>
</template>

<script lang="ts" setup>

const counter = useState<number>('count', () => 0);

</script>