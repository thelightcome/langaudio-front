<template>
  <div id="videoPlayer" ref="videoPlayerWrapper">
    <div ref="videoPlayer"></div>
  </div>
</template>

<script lang="ts" setup>
const { $youtubeApi } = useNuxtApp();

const props = defineProps<{
  src: string;
}>();

const $emits = defineEmits(["ended"]);

const done = ref<boolean>(false);
const player = ref<any>(null);
const isPlaying = ref<boolean>(false);
const videoPlayerWrapper = ref<HTMLDivElement | null>(null);
const videoPlayer = ref<HTMLDivElement | null>(null);
const videoId = computed(() => {
  return props.src.split("/").pop();
});

watch(
  () => props.src,
  () => {
    if (videoId.value) {
      isPlaying.value = false;
      player.value.loadVideoById(videoId.value);
      player.value.seekTo(0, true);
    }
  }
);

watch(
  () => $youtubeApi.options.ready,
  (newVal) => {
    if (newVal) onYouTubeIframeAPIReady();
  }
);

onMounted(() => {
  if ($youtubeApi.options.ready) onYouTubeIframeAPIReady();
});

onBeforeUnmount(() => player.value.destroy());

defineExpose({
  isPlaying,
  playVideo,
  stopVideo,
});

function onYouTubeIframeAPIReady() {
  if (videoPlayer.value) {
    player.value = new YT.Player(videoPlayer.value, {
      height: "360",
      width: "640",
      videoId: videoId.value,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  }
}

function onPlayerReady() {
  playVideo();
  player.value.seekTo(0, true);
}

function onPlayerStateChange(event: any) {
  if (event.data === YT.PlayerState.PLAYING && !done.value) {
    done.value = true;
  }
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying.value = true;
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying.value = false;
  } else if (event.data === YT.PlayerState.ENDED) {
    $emits("ended");
  }
}

function playVideo() {
  if (isPlaying.value === false) {
    player.value.playVideo();
  }
}

function stopVideo() {
  if (isPlaying.value === true) {
    player.value.pauseVideo();
  }
}
</script>

<style lang="scss" scoped>
#player {
  transform: scaleX(1.35);
  position: relative;
  z-index: -100;
}
</style>
