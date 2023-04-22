<template>
  <div
    ref="player"
    class="player min-h-[57px] w-full"
    :class="{ fullscreen: fullscreen }"
    :style="{ maxWidth: width, maxHeight: height }"
  >
    <section
      ref="screen"
      class="screen w-full"
      @mousemove="screenMousemove"
      @click="screenClick"
    >
      <component
        :is="video ? 'video' : 'audio'"
        v-show="video"
        ref="media"
        v-bind="$attrs"
        preload="metadata"
        class="w-full"
        @play="play"
        @pause="pause"
        @timeupdate="timeupdate"
      >
        <source
          v-for="elem in src.split(',')"
          :key="elem"
          :src="elem"
          :type="getType(elem)"
        />
      </component>
    </section>
    <transition name="fade">
      <section v-if="!video || (controls && showMenu)" ref="menu" class="menu">
        <div class="progressbar" @click="moveToVideo">
          <span
            class="progress"
            :style="{ width: (currentTime / duration) * 100 + '%' }"
          ></span>
        </div>
        <div class="btns">
          <button class="ppbtn" @click="clkPPbtn">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 36 36"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <defs>
                <path
                  id="pp"
                  :d="
                    played
                      ? 'M 11 10 L 17 10 L 17 26 L 11 26 M 20 10 L 26 10 L 26 26 L 20 26'
                      : 'M11 10 L18 13.74 18 22.28 11 26 M18 13.74 L26 18 26 18 18 22.28'
                  "
                ></path>
              </defs>
              <use xlink:href="#pp"></use>
            </svg>
          </button>
          <button class="stopbtn" @click="stopBtn">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 16 16"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <path
                id="s"
                d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"
              />
              <use xlink:href="#s"></use>
            </svg>
          </button>
          <div
            class="volume"
            @mouseover="volumeRateShow = true"
            @mouseout="volumeRateShow = false"
          >
            <button class="vbtn" @click="vBtnClick">
              <svg
                style="position: relative; top: -5px; left: -5px"
                width="100%"
                height="100%"
                viewBox="0 0 26 26"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <path
                  id="v"
                  :d="
                    volumeRateValue != 0
                      ? volumeRateValue < 0.5
                        ? 'M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z'
                        : 'M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z'
                      : 'm 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z'
                  "
                />
                <use xlink:href="#v"></use>
              </svg>
            </button>
            <div
              class="vslider"
              :class="{ active: volumeRateShow }"
              @click="changeVolume"
            >
              <div class="progressbar">
                <span
                  class="progress vsld"
                  :style="{ width: volumeRateValue * 100 + '%' }"
                ></span>
              </div>
            </div>
          </div>
          <div class="times">
            <span>{{ getTime(currentTime) }}</span>
            /
            <span>{{ getTime(duration) }}</span>
          </div>
          <div class="to_right">
            <div
              class="rate"
              @mouseover="rateShow = true"
              @mouseout="rateShow = false"
            >
              <div class="options" :class="{ active: rateShow }">
                <div class="optionRate" data-val="2" @click="changeRate">
                  2x
                </div>
                <div class="optionRate" data-val="1.5" @click="changeRate">
                  1.5x
                </div>
                <div class="optionRate" data-val="1" @click="changeRate">
                  1x
                </div>
                <div class="optionRate" data-val="0.5" @click="changeRate">
                  0.5x
                </div>
              </div>
              <div class="selectRate">{{ selectRate }}x</div>
            </div>
            <button
              v-if="video && fullscreenable"
              class="fullPage"
              @click="fullPage"
            >
              <svg
                style="position: relative; left: 10px; top: 10px"
                width="100%"
                height="100%"
                viewBox="0 0 30 30"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <path
                  id="f"
                  d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"
                />
                <use xlink:href="#f"></use>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>
<script>
export default {
  name: "VideoCustom",
  expose: ["$refs"],
  props: {
    src: {
      type: String,
      required: true,
    },
    video: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    controls: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      played: false,
      showMenu: true,
      timer: null,
      currentTime: 0,
      duration: 0,
      volumeRateShow: false,
      volumeLastValue: 0.3,
      volumeRateValue: 0.3,
      selectRate: 1,
      rateShow: false,
      fullscreen: false,
      fullscreenable: true,
    };
  },
  mounted() {
    this.fullscreenable = !!(
      document.fullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled ||
      document.webkitSupportsFullscreen ||
      document.webkitFullscreenEnabled ||
      document.createElement("video").webkitRequestFullScreen
    );
  },
  beforeUnmount() {
    if (!this.$refs.media?.paused) this.$refs.media?.pause();
  },
  methods: {
    getType(elem) {
      const type = elem.split(".").slice(-1);
      if (this.video)
        return (
          "video/" + (["mp4", "webm", "ogv"].includes(type) ? type : "mp4")
        );
      else return "audio/" + (["mp3", "wav"].includes(type) ? type : "mp3");
    },
    screenClick(e) {
      if (!this.video) return;
      if (e.target.closest(".screen")) {
        this.showMenu = false;
      }
    },
    screenMousemove() {
      if (!this.video) return;
      this.showMenu = true;

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showMenu = false;
      }, 6000);
    },
    play() {
      if (!this.duration) this.duration = this.$refs.media.duration;
      this.played = true;
    },
    pause() {
      this.played = false;
    },
    timeupdate() {
      try {
        this.currentTime = this.$refs.media.currentTime;
      } catch (e) {}
    },
    moveToVideo(e) {
      const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
      this.currentTime = this.$refs.media.currentTime =
        (this.duration * x) / e.currentTarget.getBoundingClientRect().width;
    },
    clkPPbtn() {
      if (this.played) {
        this.$refs.media.pause();
      } else {
        this.$refs.media.play();
      }
    },
    stopBtn() {
      try {
        if (this.played) {
          this.$refs.media.pause();
        }
        this.currentTime = this.$refs.media.currentTime = 0;
        this.played = false;
      } catch (e) {}
    },
    vBtnClick() {
      if (this.volumeRateValue) {
        this.volumeRateValue = this.$refs.media.volume = 0;
      } else {
        this.volumeRateValue = this.$refs.media.volume = this.volumeLastValue;
      }
    },
    changeVolume(e) {
      const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
      this.volumeLastValue =
        this.volumeRateValue =
        this.$refs.media.volume =
          (Math.round(
            Math.round(
              (x / e.currentTarget.getBoundingClientRect().width) * 100
            ) / 5
          ) *
            5) /
          100;
    },
    changeRate(e) {
      this.selectRate = this.$refs.media.playbackRate =
        e.currentTarget.dataset.val;
    },
    fullPage() {
      const isFullScreen = function () {
        return !!(
          document.fullscreen ||
          document.webkitIsFullScreen ||
          document.mozFullScreen ||
          document.msFullscreenElement ||
          document.fullscreenElement
        );
      };
      if (isFullScreen()) {
        if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
        else if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        this.fullscreen = false;
      } else {
        if (this.$refs.player.requestFullscreen)
          this.$refs.player.requestFullscreen();
        else if (this.$refs.player.mozRequestFullScreen)
          this.$refs.player.mozRequestFullScreen();
        else if (this.$refs.player.webkitRequestFullScreen)
          this.$refs.player.webkitRequestFullScreen();
        else if (this.$refs.player.msRequestFullscreen)
          this.$refs.player.msRequestFullscreen();
        this.fullscreen = true;
      }
    },
    getTime(time) {
      const hour = Math.floor(time / 3600);
      const min = Math.floor((time % 3600) / 60);
      const sec = Math.floor(time % 60);

      function getTimeFormat(time) {
        return time < 10 ? "0" + time : time;
      }

      if (hour) {
        return `${getTimeFormat(hour)}:${getTimeFormat(min)}:${getTimeFormat(
          sec
        )}`;
      } else {
        return `${getTimeFormat(min)}:${getTimeFormat(sec)}`;
      }
    },
  },
};
</script>
<style scoped>
.player {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  border: 1px solid #020202;
  font-size: 10px;
  background: gray;
}

.player.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.player.fullscreen:-moz-full-screen {
  position: fixed !important;
  top: 0px !important;
  right: 0px !important;
  bottom: 0px !important;
  left: 0px !important;
}

.player.fullscreen:-webkit-full-screen {
  position: fixed !important;
  top: 0px !important;
  right: 0px !important;
  bottom: 0px !important;
  left: 0px !important;
}

.player.fullscreen:-ms-fullscreen {
  position: fixed !important;
  top: 0px !important;
  right: 0px !important;
  bottom: 0px !important;
  left: 0px !important;
}

.player.fullscreen:fullscreen {
  position: fixed !important;
  top: 0px !important;
  right: 0px !important;
  bottom: 0px !important;
  left: 0px !important;
}

video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-enclosure {
  display: none !important;
}

.screen,
.screen video {
  width: 100%;
  height: 100%;
}

.menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  left: 0;
  right: 0;
  bottom: 0;
  height: auto;
  background: #020202;
  color: grey;
  font-size: 1.6em;
  transition: 0.3s;
}

.menu:hover {
  color: rgb(218, 216, 216);
}

.player.fullscreen .menu {
  z-index: 2147483647;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.progressbar {
  background-color: grey;
  width: 98%;
  height: 5px;
  margin: 5px 1%;
  cursor: pointer;
}

.progress {
  display: block;
  height: 100%;
  transition: 0.1s;
  width: 0;
  background: red;
}

.btns {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.selectRate,
.options > div,
.fullPage,
.stopbtn,
.vbtn,
.ppbtn {
  height: 40px;
  width: 60px;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  transition: 0.3s;
  fill: #fff;
  margin-left: 5px;
  cursor: pointer;
  line-height: 40px;
  align-items: center;
  vertical-align: middle;
}

.vbtn {
  height: 25px;
  width: 40px;
  margin-right: 5px;
}

.volume {
  height: 40px;
  display: flex;
  align-items: center;
}

.vslider {
  width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
}

.vslider.active {
  width: 60px;
}

.options > div:hover,
.options > div:focus,
.fullPage:hover,
.fullPage:focus,
.stopbtn:hover,
.stopbtn:focus,
.vbtn:hover,
.vbtn:focus,
.ppbtn:hover,
.ppbtn:focus {
  box-shadow: inset 0 0 10px 3px rgba(128, 128, 128, 0.5);
}

.to_right {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
}

.rate {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  cursor: pointer;
}

.options {
  position: absolute;
  top: 0;
  right: 0;
  width: 0px;
  transition: linear 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: hidden;
  background: #020202;
  z-index: 1;
}

.options.active {
  width: 160px;
}

.fullPage,
.selectRate {
  width: 40px;
}

.fullPage {
  margin-right: 10px;
}

.options > div {
  min-width: 40px;
  flex-basis: 40px;
  margin-left: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
