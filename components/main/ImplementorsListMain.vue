<template>
  <div>
    <UiLoading v-if="loading" />
    <div v-else>
      <div class="text-lg text-light mb-6">Implementors</div>
      <ListHoverItemsUi
        v-for="implementor in getImplementors"
        :key="implementor.id"
        @click="select(implementor)"
      >
        <div>{{ implementor.name }}</div>
        <div class="text-sm">
          <span>Country:</span>
          {{
            implementor.countries.reduce(
              (acc, c) => ((acc += (acc.length ? ", " : "") + c.name), acc),
              ""
            )
          }}
        </div>
      </ListHoverItemsUi>
      <div
        v-if="getImplementors.length === 0"
        class="w-full text-center text-light"
      >
        No Items
      </div>
      <div v-if="isPaginable" class="flex justify-center mt-4">
        <UiPagination
          :current="curPage"
          :total="implementorStore._getImplementorsTotal / PAGE_SIZE"
          @change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useImplementorStore } from "~/store/implementors";
import { ICountry } from "~/types/countries.types";
import { IImplementor } from "~/types/implementors.types";

const implementorStore = useImplementorStore();
const $router = useRouter();
const $route = useRoute();
const $localePath = useLocalePath();

const props = defineProps<{
  countries: ICountry[] | null;
  filterText: string;
}>();

const $emits = defineEmits(["select"]);

const PAGE_SIZE = ref(5);

const getImplementors = computed(() => {
  return implementorStore._getImplementors;
});
const curPage = computed(() => (Number($route.query.page) || 1) - 1);
const isPaginable = computed(() => {
  return implementorStore._getImplementorsTotal > PAGE_SIZE.value;
});

watch(
  () => [props.countries, props.filterText],
  () => request()
);

const { loading, request } = useRequestHook(async () => {
  await implementorStore._fetchImplementors({
    name: props.filterText,
    countries: props.countries?.map((c) => c.name),
    isVerified: true,
    offset: curPage.value * PAGE_SIZE.value,
    limit: PAGE_SIZE.value,
  });
});

onMounted(async () => await request());

function changePage(page: number) {
  $router.push({
    path: $localePath($route.path),
    query: { ...($route.query || {}), page: page + 1 },
  });
}

function select(implementor: IImplementor) {
  $emits("select", implementor);
}
</script>
