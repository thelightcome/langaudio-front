<template>
  <main class="h-full flex justify-start items-stretch">
    <AdminMenu class="w-[300px]" />
    <div class="grow">
      <NuxtPage />
    </div>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth-middleware"],
});
</script>
