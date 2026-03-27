<script setup>
// import { ref, onMounted } from 'vue'

const loading = ref(true);

// onMounted(() => {
//   setTimeout(() => {
//     loading.value = false
//   }, 1000) // simulate loading
// })


</script>


<template>
  <div>
    <NuxtLayout>
      <!-- <Loader v-if="loading" />
      <NuxtPage v-else /> -->
      <NuxtLoadingIndicator />
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>
