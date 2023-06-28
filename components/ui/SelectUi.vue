<template>
  <div v-click-outside="close" class="relative" :class="{ 'z-50': active }">
    <div
      class="relative w-full box-border px-2 py-3 bg-tertiary text-light text-center cursor-pointer"
      @click="active = !active"
    >
      <span v-if="multiple || !selectedValue.length">{{ label }}</span>
      <span
        v-if="!multiple && selectedValue.length"
        class="capitalize"
        @click="remove"
      >
        {{ getValue(selectedValue[0]) }}
      </span>
      <button
        v-if="selectedValue.length"
        class="border-none bg-transparent absolute right-4 top-1/2 transform -translate-y-1/2 p-0 cursor-pointer"
        @click="removeAll"
      >
        <IconClose />
      </button>
    </div>
    <div
      v-show="active"
      class="absolute top-full left-0 w-full bg-black max-h-[200px] overflow-y-auto scrollbar-sweet z-50"
    >
      <div class="pt-3 pb-4 px-2 bg-light/20">
        <input
          v-model="filterText"
          type="text"
          class="w-full bg-transparent border-b border-solid border-light outline-none p-1 text-light"
          :placeholder="'Filter text'"
        />
      </div>
      <div
        v-if="multiple && selectedValue.length"
        class="pb-2 border border-dark bg-light/20"
      >
        <div
          v-for="(selValue, selValueInd) in selectedValue"
          :key="selValueInd"
          class="flex justify-between items-center cursor-pointer px-4 py-2 text-light duration-300 hover:bg-light/20 hover:bg-secondary/80"
          @click="remove(selValue)"
        >
          <span class="capitalize">{{ getValue(selValue) }}</span>
          <IconClose />
        </div>
      </div>
      <div class="bg-light/20 pb-7">
        <div
          v-for="(option, optionInd) in filteredOptions"
          :key="optionInd"
          class="cursor-pointer px-2 py-2 text-light duration-300 hover:bg-primary/80 capitalize"
          :class="{ hidden: isSelected(option) }"
          @click="add(option)"
        >
          <span>{{ getValue(option) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconClose from "~/assets/icons/close.svg?component";

export interface PropsSelect {
  modelValue: any[] | null;
  label: string;
  options: any[];
  field?: string;
  multiple?: boolean;
}

const props = withDefaults(defineProps<PropsSelect>(), {
  field: "",
  multiple: false,
});

const $emits = defineEmits(["update:modelValue"]);

const active = ref<boolean>(false);
const filterText = ref<string>("");

const selectedValue = computed(() => {
  if (props.modelValue) return props.modelValue;
  return [];
});

const filteredOptions = computed(() => {
  return props.options.filter((e) => {
    if (props.field)
      return e[props.field].startsWith(filterText.value.toLocaleLowerCase());
    else return e.startsWith(filterText.value.toLocaleLowerCase());
  });
});

function close() {
  active.value = false;
}

function isSelected(val: any): boolean {
  if (!props.modelValue || !props.modelValue.length) return false;
  return !!props.modelValue.find((v) => {
    if (props.field) return v[props.field] === val[props.field];
    else return v === val;
  });
}

function add(val: any) {
  if (props.multiple) {
    $emits("update:modelValue", [...(props.modelValue || []), val]);
  } else {
    $emits("update:modelValue", [val]);
  }
}

function remove(val?: any) {
  if (props.modelValue) {
    const filtered = props.modelValue.filter((val2: any) => {
      if (props.field) return val2[props.field] !== val[props.field];
      else return val2 !== val;
    });
    $emits("update:modelValue", filtered);
  }
}

function removeAll() {
  $emits("update:modelValue", []);
}

function getValue(val: any): string {
  if (props.field && val) return val[props.field];
  else return val;
}
</script>
