export default defineNuxtRouteMiddleware((to, _) => {
  if (process.server) return;

  const { $auth } = useNuxtApp();
  const localePath = useLocalePath();
  const router = useRouter();
  if (to.fullPath.includes("auth")) {
    if ($auth.isLoggedIn.value) router.push(localePath("/"));
  } else if (to.fullPath.includes("admin")) {
    if (
      !$auth.isLoggedIn.value ||
      !(
        $auth.user.value?.roles?.includes("ADMIN") ||
        $auth.user.value?.roles?.includes("ROOT_ADMIN")
      )
    )
      router.push(localePath("/"));
  } else if (!$auth.isLoggedIn.value) router.push(localePath("/"));

  return true;
});
