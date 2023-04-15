export function useRequestHook(callback: Function) {
  const loading = ref(false);

  const error = ref<{
    status: number;
    message: string;
  }>();

  async function request<T, R>(option?: T): Promise<R | undefined> {
    try {
      loading.value = true;
      return await callback(option);
    } catch (err: any) {
      error.value = {
        status: err.data?.statusCode || err.status || 500,
        message: err.data?.message || err.message || "",
      };
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    request,
  };
}
