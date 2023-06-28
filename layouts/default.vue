<template>
  <div
    class="fixed w-full h-full overflow-hidden flex flex-col justify-start bg-black"
  >
    <MainHeader />
    <div
      class="grow overflow-auto scrollbar-sweet flex flex-col justify-start items-stretch"
    >
      <MainContainer class="grow w-full">
        <NuxtPage />
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
