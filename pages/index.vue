<template>
  <div class="relative w-full pt-12 pb-12">
    <TabHeadsUi
      :heads="TAB_HEADS"
      :label="'name'"
      :current="currentTab"
      class="mb-8"
      @select="changeTab"
    />
    <div class="mb-8">
      <CountriesSelectorMain
        v-if="currentTab === 0"
        :model-value="selectedCountries"
        @update:model-value="setCountry($event)"
      />
      <LanguagesSelectorMain
        v-else
        :model-value="selectedLang"
        @update:model-value="setLang($event)"
      />
    </div>
    <div class="mb-10">
      <InputFieldUi
        :key="'input' + currentTab"
        :model-value="filterText"
        type="text"
        :action="true"
        @update:model-value="changeFilterText($event)"
      />
    </div>
    <div>
      <ImplementorsListMain
        v-if="currentTab === 0 && !selectedImplementor"
        :countries="selectedCountries"
        :filter-text="filterText"
        @select="selectImplementor($event)"
      />
      <SongsListMain
        v-if="currentTab === 1 || selectedImplementor"
        :langs="selectedLang"
        :implementor="selectedImplementor"
        :filter-text="filterText"
        @back="backFromSongList"
        @select="selectSource($event)"
      />
    </div>
    <transition name="slide-up">
      <SourceItemMain
        v-if="selectedSource"
        :source-id="selectedSource"
        @back="selectSource(null)"
      />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useCountryStore } from "~/store/countries";
import { useLanguageStore } from "~/store/languages";

import { ICountry } from "~/types/countries.types";
import { ILanguage } from "~/types/languages.types";
import { IImplementor } from "~/types/implementors.types";
import { ISource } from "~/types/sources.types";

const $router = useRouter();
const $route = useRoute();
const $localePath = useLocalePath();

const countryStore = useCountryStore();
const languageStore = useLanguageStore();

const TAB_HEADS = [
  {
    name: "Implementors",
    type: "implementors",
  },
  {
    name: "Songs",
    type: "songs",
  },
];

const currentTab = computed(() => {
  return TAB_HEADS.findIndex((t) => t.type === $route.query.tabHead);
});

const selectedCountries = computed(() => {
  return countryStore._getCountries.filter(
    (c) => $route.query.country && $route.query.country.includes(c.name)
  );
});

const selectedLang = computed(() => {
  return languageStore._getLanguages.filter(
    (l) => $route.query.lang && $route.query.lang.includes(String(l.id))
  );
});

const filterText = computed(() => {
  return $route.query.filterText ? String($route.query.filterText) : "";
});

const selectedImplementor = computed(() => {
  return $route.query.implementor ? String($route.query.implementor) : "";
});

const selectedSource = computed(() => {
  return $route.query.source ? String($route.query.source) : "";
});

onMounted(() => {
  if (!$route.query.tabHead) {
    $router.push({
      path: $localePath($route.path),
      query: { tabHead: TAB_HEADS[0].type },
    });
  }
});

function setCountry(country: ICountry[]) {
  $router.push({
    path: $localePath($route.path),
    query: {
      ...($route.query || {}),
      implementor: "",
      page: 0,
      country: country.map((c) => c.name),
    },
  });
}

function setLang(lang: ILanguage[]) {
  $router.push({
    path: $localePath($route.path),
    query: {
      ...($route.query || {}),
      spage: 0,
      lang: lang.map((l) => l.id),
    },
  });
}

function changeFilterText(filterText: string) {
  $router.push({
    path: $localePath($route.path),
    query: {
      ...($route.query || {}),
      page: 0,
      spage: 0,
      filterText,
      implementor: "",
    },
  });
}

function changeTab(val: number) {
  $router.push({
    path: $localePath($route.path),
    query: { tabHead: TAB_HEADS[val].type },
  });
}

function selectImplementor(implementor: IImplementor | null) {
  $router.push({
    path: $localePath($route.path),
    query: {
      ...($route.query || {}),
      implementor: implementor?.name || "",
    },
  });
}

function selectSource(source: ISource | null) {
  $router.push({
    path: $localePath($route.path),
    query: {
      ...($route.query || {}),
      source: source?.id || "",
    },
  });
}

function backFromSongList() {
  $router.push({
    path: $localePath($route.path),
    query: {
      ...($route.query || {}),
      spage: 0,
      implementor: "",
      source: "",
    },
  });
}
</script>
