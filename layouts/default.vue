<template>
  <div
    class="fixed w-full h-full overflow-hidden flex flex-col justify-start bg-bg-main"
  >
    <MainHeader />
    <div class="grow overflow-auto scrollbar-sweet">
      <MainContainer class="min-h-full">
        <slot></slot>
      </MainContainer>
    </div>

    <MainModal />
  </div>
</template>

<script lang="ts" setup>
const { $auth } = useNuxtApp();
const $api = useApiHook();

onMounted(() => {
  $auth.setRefreshApi(async (token: any) => {
    return await $api.auth.getRefresh(token);
  });
});
</script>
