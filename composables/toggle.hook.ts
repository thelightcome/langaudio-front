export function useToggleHooks(initState = false) {
  const state = ref(initState);

  function toggle(value?: boolean) {
    state.value = value !== undefined ? value : !state.value;
  }

  return { state, toggle };
}
