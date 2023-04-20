<template>
  <div id="playerBody" ref="playerBodyRef" style="position: relative">
    <div id="playerContent" ref="playerContentRef">
      <div id="playerVideo">
        <n-spin :show="player.videoLoading" />
        <video
          id="playerVideoBody"
          ref="videoRef"
          controls="false"
          :src="props.transCodeSrcList[player.srcIndex]"
          :autoplay="player.autoplay"
          :muted="player.muted"
          :loop="player.loop"
          :volume="player.volume / 100"
          @timeupdate="_timeUpdate()"
          @ended="_ended()"
          @canplay="_canPlay()"
        ></video>
      </div>
    </div>
    <div
      v-show="!player.videoLoading || !player.contentLoading"
      id="controller"
    >
      <div id="allController" ref="allControllerRef">
        <div id="videoController">
          <div v-show="!player.videoLoading" id="videoControllerContent">
            <span>
              <n-icon
                v-if="!player.isPlay"
                size="35"
                color="#63e2b7"
                style="margin-left: 2px; margin-right: 2px"
                @click="_play()"
              >
                <Play48Regular />
              </n-icon>
              <n-icon
                v-if="player.isPlay"
                size="35"
                color="#63e2b7"
                style="margin-left: 2px; margin-right: 2px"
                @click="_pause()"
              >
                <Pause48Regular />
              </n-icon>
            </span>
          </div>
        </div>
        <div id="playerController">
          <div id="playerControllerContent">
            <n-icon
              size="25"
              color="#63e2b7"
              style="margin-left: 2px; margin-right: 2px"
              @click="_back(5)"
            >
              <Rewind16Filled />
            </n-icon>
            <n-icon
              v-if="!player.isPlay"
              size="25"
              color="#63e2b7"
              style="margin-left: 2px; margin-right: 2px"
              @click="_play()"
            >
              <Play16Filled />
            </n-icon>
            <n-icon
              v-if="player.isPlay"
              style="margin-left: 2px; margin-right: 2px"
              size="25"
              color="#63e2b7"
              @click="_pause()"
            >
              <Pause16Filled />
            </n-icon>
            <n-icon
              size="25"
              color="#63e2b7"
              style="margin-left: 2px; margin-right: 2px"
              @click="_go(5)"
            >
              <FastForward16Filled />
            </n-icon>
            <n-slider
              v-model:value="player.current"
              style="margin-left: 2px; margin-right: 2px"
              :step="1"
              :max="props.totalDurationSec"
              :min="0"
              :marks="transcodeMarks()"
              placement="top"
              :format-tooltip="
                  (number: number) => {
                    return secToTime(number) 
                  }
                "
              @mousedown="_timeMouseDown()"
              @update:value="_timechange()"
            />
            <n-button
              text
              type="primary"
              style="margin-left: 5px; margin-right: 2px"
            >
              {{ secToTime(props.totalDurationSec) }}
            </n-button>

            <n-popover placement="top" trigger="hover">
              <template #trigger>
                <n-icon
                  size="25"
                  color="#63e2b7"
                  style="margin-left: 2px; margin-right: 2px"
                >
                  <Speaker220Filled v-if="!player.muted" />
                  <SpeakerMute16Filled v-if="player.muted" />
                </n-icon>
              </template>
              <span>
                <n-slider
                  v-model:value="player.volume"
                  style="height: 100px"
                  vertical
                  placement="top"
                  :step="1"
                  :max="100"
                  :min="0"
                  @update:value="_volume()"
                />
              </span>
            </n-popover>
            <n-icon
              size="25"
              color="#63e2b7"
              style="margin-left: 2px; margin-right: 2px"
              @click="_fullScreen()"
            >
              <FullScreenMaximize16Filled v-if="!player.fullScreen" />
              <FullScreenMinimize24Filled v-if="player.fullScreen" />
            </n-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, onMounted, onUnmounted } from 'vue'
export default defineComponent({
  name: 'VideoShowST',
})
</script>
<script setup lang="ts">
import {
  Rewind16Filled,
  FastForward16Filled,
  Pause16Filled,
  Play16Filled,
  Speaker220Filled,
  SpeakerMute16Filled,
  FullScreenMaximize16Filled,
  FullScreenMinimize24Filled,
  Play48Regular,
  Pause48Regular,
} from '@vicons/fluent'
import { secToTime } from '@/util/time'
const videoRef = ref<InstanceType<typeof HTMLVideoElement>>()
const playerBodyRef = ref<InstanceType<typeof HTMLDivElement>>()
const playerContentRef = ref<InstanceType<typeof HTMLDivElement>>()
const allControllerRef = ref<InstanceType<typeof HTMLDivElement>>()

const emit = defineEmits([
  'updateTotalDurationSec',
  'updateTotalDurationString',
  'pushTransCodeQueue',
])

class playerClass {
  videoLoading = true
  contentLoading = true
  srcIndex = 0
  current = 0
  currentJump = 0
  autoplay = false
  muted = false
  loop = false
  volume = 100
  isPlay = false
  fullScreen = false
}

const player = ref(new playerClass())

const props = defineProps({
  noTransCodeVideoType: {
    type: Array as PropType<string[]>,
    default: () => {
      return ['video/mp4', 'video/x-matroska']
    },
  },
  videoType: {
    type: String,
    default: '',
  },
  totalDurationSec: {
    type: Number,
    default: 0,
  },
  transCodeSrcList: {
    type: Array as PropType<string[]>,
    default: () => {
      return ['']
    },
  },
  transCodeInfoList: {
    type: Array as PropType<
      {
        rangeTimeSec: { start: number; end: number }
        rangeTimeString: { start: string; end: string }
        sourceIndex: number
      }[]
    >,
    default: () => {
      return []
    },
  },
  transCodeStep: {
    type: Number,
    default: 60,
  },
})

function _timeMouseDown() {
  if (props.noTransCodeVideoType.indexOf(props.videoType) < 0) {
    videoRef.value?.pause()
  }
}

function _back(time: number) {
  if (player.value.current - time <= 0) {
    _doTimechange(0)
  } else {
    _doTimechange(player.value.current - time)
  }
}

function _go(time: number) {
  if (player.value.current + time > props.totalDurationSec) {
    _doTimechange(0)
  } else {
    _doTimechange(player.value.current + time)
  }
}

function _ended() {
  if (props.noTransCodeVideoType.indexOf(props.videoType) < 0) {
    let nextIndex = player.value.srcIndex + 1
    if (
      nextIndex >= props.transCodeSrcList.length &&
      props.transCodeSrcList.length >= props.transCodeInfoList.length
    ) {
      nextIndex = 0
    }
    _doTimechange(props.transCodeInfoList[nextIndex].rangeTimeSec.start)
  }
}

function _timechange() {
  _doTimechange(player.value.current)
}

function _doTimechange(newTime: number) {
  if (props.noTransCodeVideoType.indexOf(props.videoType) < 0) {
    player.value.current = newTime
    let srcIndex = parseInt(String(newTime / props.transCodeStep))
    if (srcIndex >= props.transCodeInfoList.length) {
      srcIndex = props.transCodeInfoList.length - 1
    }
    if (!props.transCodeSrcList[srcIndex]) {
      player.value.videoLoading = true
      for (
        let index = props.transCodeInfoList.length - 1;
        index >= srcIndex;
        index--
      ) {
        emit('pushTransCodeQueue', index)
      }
    }
    if (srcIndex == player.value.srcIndex) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      videoRef.value!.currentTime =
        player.value.current - srcIndex * props.transCodeStep
      player.value.currentJump = 0
    } else {
      player.value.currentJump =
        player.value.current - srcIndex * props.transCodeStep
    }
    player.value.srcIndex = srcIndex
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    videoRef.value!.currentTime = newTime
    if (player.value.isPlay) {
      setTimeout(() => {
        videoRef.value?.play()
      }, 10)
    }
  }
}

function _timeUpdate() {
  if (player.value && videoRef.value?.currentTime) {
    player.value.current =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      videoRef.value!.currentTime + player.value.srcIndex * props.transCodeStep
  }
}

function _canPlay() {
  if (props.noTransCodeVideoType.indexOf(props.videoType) < 0) {
    if (player.value.currentJump > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      videoRef.value!.currentTime = player.value.currentJump
      player.value.currentJump = 0
    }

    if (props.transCodeSrcList[player.value.srcIndex]) {
      player.value.videoLoading = false
    }

    if (player.value.isPlay) {
      videoRef.value?.play()
    }
  } else {
    emit('updateTotalDurationSec', Number(videoRef.value?.duration))
    emit(
      'updateTotalDurationString',
      secToTime(Number(videoRef.value?.duration))
    )
    player.value.videoLoading = false
  }
}

function _play() {
  setTimeout(() => {
    videoRef.value?.play()
    player.value.isPlay = !player.value.isPlay
  }, 10)
}

function _pause() {
  setTimeout(() => {
    videoRef.value?.pause()
    player.value.isPlay = !player.value.isPlay
  }, 10)
}

function _volume() {
  const volume = player.value.volume / 100
  if (volume <= 0) {
    player.value.muted = true
  } else {
    player.value.muted = false
  }
}

function _fullScreen() {
  if (!player.value.fullScreen) {
    if (playerBodyRef.value?.requestFullscreen) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      playerBodyRef.value!.style.height = window.screen.height + 'px'
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      playerContentRef.value!.style.height = window.screen.height + 'px'
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      allControllerRef.value!.style.height = window.screen.height + 'px'
      player.value.fullScreen = !player.value.fullScreen
      playerBodyRef.value?.requestFullscreen()
      document.body.style.transform = 'rotate(-90deg) translate(-50%, 50%)'
    }
  } else {
    document.exitFullscreen()
  }
}

onMounted(() => {
  const height = (Number(playerContentRef.value?.clientWidth) * 9) / 16 + 'px'
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  playerBodyRef.value!.style.height = height
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  playerContentRef.value!.style.height = height
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  allControllerRef.value!.style.height = height
})

document.addEventListener('fullscreenchange', (event) => {
  if (!document.fullscreenElement) {
    const height = (Number(playerContentRef.value?.clientWidth) * 9) / 16 + 'px'
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    playerBodyRef.value!.style.height = height
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    playerContentRef.value!.style.height = height
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    allControllerRef.value!.style.height = height
    player.value.fullScreen = !player.value.fullScreen
    document.body.style.transform = ''
  }
})

window.onresize = (a) => {
  if (!document.fullscreenElement) {
    const height = (Number(playerContentRef.value?.clientWidth) * 9) / 16 + 'px'
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    playerBodyRef.value!.style.height = height
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    playerContentRef.value!.style.height = height
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    allControllerRef.value!.style.height = height
  }
}

function transcodeMarks() {
  const marks: Record<number, string> = {}
  if (props.noTransCodeVideoType.indexOf(props.videoType) < 0) {
    props.transCodeSrcList.filter((el, index) => {
      if (el) {
        marks[Number(props.transCodeInfoList[index].rangeTimeSec.end)] = ''
      }
    })
  }
  return marks
}
</script>

<style scoped lang="scss">
#playerContent {
  width: 100%;
  // border: 0.5px solid rgb(0, 255, 200);
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: nowrap;
  flex-direction: column;
}

#playerVideo {
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}

#playerVideoBody {
  position: absolute;
  top: 0;
  left: 0;
  border: 0;
  height: 100%;
  user-select: none;
  border-radius: inherit;
  vertical-align: middle;
  width: 100%;
  outline: 0;
}

#controller {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  // z-index: 10;
}

#allController {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
}

#videoController {
  flex: 1;
  text-align: center;
  display: none;
  transition: all 0.3s ease-in;
  opacity: 1;
}

#playerController {
  width: 100%;
  height: 55px;
  display: none;
  background-color: rgb(102, 102, 102, 0.5);
  transition: all 0.3s ease-in;
  opacity: 1;
}

#playerControllerContent {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: nowrap;
  flex-direction: row;
  padding-top: 5px;
  padding-bottom: 5px;
}

#videoControllerContent {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-wrap: nowrap;
  height: 100%;
  padding-top: 21px;
}

#playerBody:hover #playerController {
  display: flex;
}

#playerBody:hover #videoController {
  display: inline-block;
}

video::-webkit-media-controls {
  display: none !important;
}

.n-slider--with-mark {
  margin: 0 !important;
}

.n-slider {
  --n-fill-color: #63e2b7 !important;
  --n-dot-color: #ffffff !important;
  --n-dot-color-modal: #ffffff !important;
  --n-dot-color-popover: #ffffff !important;
  --n-dot-height: 2px !important;
  --n-dot-width: 2px !important;
  --n-dot-border-active: 0px solid !important;
}
</style>
