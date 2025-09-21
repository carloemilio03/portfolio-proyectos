<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ["redirect-if-auth"],
});

const authState = useUserStore()

</script>

<template>
<NuxtLayout>
  <LoginForm/>
</NuxtLayout>
</template>

<style scoped>

</style>