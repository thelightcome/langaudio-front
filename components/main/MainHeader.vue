<template>
  <header class="relative w-full">
    <MainContainer class="flex justify-between">
      <UiLogo />
      <div class="flex justify-end items-center gap-2 md:gap-4 ml-4 md:ml-8">
        <UiSwitchTheme />
        <UiSwitchLang />
        <div class="text-light">
          <ClientOnly>
            <template v-if="!$auth.isLoggedIn.value">
              <NuxtLink
                :to="localePath('/auth/signin')"
                class="main-links block md:inline whitespace-nowrap duration-300 px-2"
                >Sign In</NuxtLink
              >
              <span class="hidden md:inline">/</span>
              <NuxtLink
                :to="localePath('/auth/signup')"
                class="main-links block md:inline whitespace-nowrap duration-300 px-2"
                >Sign Up</NuxtLink
              >
            </template>
            <template v-else>
              <div class="flex items-center gap-3">
                <NuxtLink
                  :to="localePath('/')"
                  class="hidden xs:inline main-links duration-300 px-2"
                  >Main</NuxtLink
                >
                <UiDropDown>
                  <template #trigger>
                    <button
                      class="w-6 h-6 md:w-10 md:h-10 rounded-full border border-white flex justify-center items-center"
                    >
                      <IconUser class="w-6 h-6" />
                    </button>
                  </template>
                  <template #body>
                    <NuxtLink
                      :to="localePath('/playlist')"
                      class="block px-2 py-1 text-light capitalize text-md mb-2 whitespace-nowrap text-right"
                      >My playlist
                    </NuxtLink>
                    <NuxtLink
                      :to="localePath('/add')"
                      class="block px-2 py-1 text-light capitalize text-md mb-2 whitespace-nowrap text-right"
                      >Add Source
                    </NuxtLink>
                    <button
                      class="block px-2 py-1 text-light capitalize text-md whitespace-nowrap text-right"
                      @click="logout"
                    >
                      Log out
                    </button>
                  </template>
                </UiDropDown>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </MainContainer>
  </header>
</template>

<script lang="ts" setup>
import IconUser from "~/assets/icons/user.svg?component";

const localePath = useLocalePath();
const { $auth } = useNuxtApp();

function logout() {
  $auth.logout();
}
</script>
