<template>
  <div id="playerBody" ref="playerBodyRef">
    <div id="playerContent" ref="playerContentRef">
      <div id="playerVideo">
        <n-spin :show="player.videoLoading">
          <video
            ref="videoRef"
            style="width: 100%; background-color: black; object-fit: fill"
            controls="false"
            :src="player.srcList[player.srcIndex]"
            :autoplay="player.autoplay"
            :muted="player.muted"
            :loop="player.loop"
            :volume="player.volume / 100"
            @timeupdate="_timeUpdate()"
            @ended="_ended()"
            @canplay="_canPlay()"
            @click="_videoClick()"
          ></video>
        </n-spin>
      </div>
    </div>
    <div
      v-if="!player.videoLoading || !player.contentLoading"
      id="playerController"
    >
      <div id="controller">
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
        <!-- <button id="btngo" @click="_back(5)">快退</button> -->
        <!-- <button v-if="!player.isPlay" id="start" @click="_play()">播放</button>
        <button v-if="player.isPlay" id="pause" @click="_pause()">停止</button> -->
        <!-- <button id="btnback" @click="_go(5)">快进</button> -->
        <n-slider
          v-model:value="player.current"
          style="margin-left: 2px; margin-right: 2px"
          :step="1"
          :max="player.durationSec"
          :min="0"
          :marks="transcodeMarks()"
          :format-tooltip="
            (number:number) => {
              return secToTime(number) + '   (' +  String(player.srcIndex) + '/' +  String(player.srcList.length - 1) +')  ' + (player.srcList.filter((el) => el).length >=
          player.durationSecList.length
            ? 'complete'
            : 'loading')
            }
          "
          @mousedown="_timeMouseDown()"
          @update:value="_timechange()"
        />
        <!-- <input
          id="
          btntime"
          style="width: 100%"
          type="range"
          :max="player.durationSec"
          @mousedown="_timeMouseDown()"
          @input="_timechange()"
        /> -->
        <n-icon
          size="25"
          color="#63e2b7"
          style="margin-left: 2px; margin-right: 2px"
          @click="_muted()"
        >
          <Speaker220Filled v-if="!player.muted" />
          <SpeakerMute16Filled v-if="player.muted" />
        </n-icon>
        <!-- <button id="nosound" @click="_muted()">
          {{ player.muted ? '启音' : '静音' }}
        </button> -->
        <!-- <input
          id="btnsound"
          v-model="player.volume"
          style="width: 200px"
          :title="player.volume + '%'"
          type="range"
          max="100"
          @input="_volume()"
        /> -->
        <n-icon
          size="25"
          color="#63e2b7"
          style="margin-left: 2px; margin-right: 2px"
          @click="_fullScreen()"
        >
          <FullScreenMaximize16Filled v-if="!player.fullScreen" />
          <FullScreenMinimize24Filled v-if="player.fullScreen" />
        </n-icon>
        <!-- <button id="all_screen" @click="_fullScreen()">
          {{ player.fullScreen ? '缩小' : '全屏' }}
        </button> -->
      </div>
      <br />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
export default defineComponent({
  name: 'VideoShow',
})
</script>
<script setup lang="ts">
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { timeToSec, secToTime } from '@/util/time'
import {
  Rewind16Filled,
  FastForward16Filled,
  Pause16Filled,
  Play16Filled,
  Speaker220Filled,
  SpeakerMute16Filled,
  FullScreenMaximize16Filled,
  FullScreenMinimize24Filled,
} from '@vicons/fluent'

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
})

const originWidth = ref<number>(0)

const playerBodyRef = ref<InstanceType<typeof HTMLDivElement>>()
const playerContentRef = ref<InstanceType<typeof HTMLDivElement>>()
const videoRef = ref<InstanceType<typeof HTMLVideoElement>>()

onMounted(() => {
  originWidth.value = Number(playerContentRef.value?.clientWidth)
  const height = (originWidth.value * 9) / 16 + 'px'
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  playerBodyRef.value!.style.height = height
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  playerContentRef.value!.style.height = height
})

function _timeMouseDown() {
  videoRef.value?.pause()
}

function _back(time: number) {
  if (player.value.current - time <= 0) {
    player.value.current = 0
    _doTimechange(player.value.current)
  } else {
    _doTimechange((player.value.current -= time))
  }
}

function _go(time: number) {
  if (player.value.current + time > player.value.durationSec) {
    player.value.current = 0
    _doTimechange(player.value.current)
  } else {
    _doTimechange((player.value.current += time))
  }
}

function _timechange() {
  _doTimechange(player.value.current)
}

function _doTimechange(newTime: number) {
  let srcIndex = parseInt(String(newTime / player.value.transCodeStep))
  if (srcIndex >= player.value.durationSecList.length) {
    srcIndex = player.value.durationSecList.length - 1
  }
  if (!player.value.srcList[srcIndex]) {
    player.value.videoLoading = true
    for (
      let index = player.value.durationSecList.length - 1;
      index >= srcIndex;
      index--
    ) {
      tranceCodeQueue.value.push(index)
    }
  }
  if (srcIndex == player.value.srcIndex) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    videoRef.value!.currentTime =
      player.value.current - srcIndex * player.value.transCodeStep
    player.value.currentJump = 0
  } else {
    player.value.currentJump =
      player.value.current - srcIndex * player.value.transCodeStep
  }
  player.value.srcIndex = srcIndex

  videoRef.value?.play()
  player.value.isPlay = true
}

function _timeUpdate() {
  player.value.current =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    videoRef.value!.currentTime +
    player.value.srcIndex * player.value.transCodeStep
}

function _ended() {
  player.value.srcIndex++
  player.value.srcIndex >= player.value.srcList.length &&
  player.value.srcList.length >= player.value.durationSecList.length
    ? (player.value.srcIndex = 0)
    : ''
  if (!player.value.srcList[player.value.srcIndex]) {
    player.value.videoLoading = true
  }
}

function _canPlay() {
  if (player.value.isPlay) {
    videoRef.value?.play()
    if (player.value.currentJump) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      videoRef.value!.currentTime = player.value.currentJump
    }
    player.value.currentJump = 0
    if (player.value.srcList[player.value.srcIndex]) {
      player.value.videoLoading = false
    }
  }
}

function _videoClick() {
  player.value.isPlay ? videoRef.value?.pause() : videoRef.value?.play()
  player.value.isPlay = !player.value.isPlay
}

function _play() {
  videoRef.value?.play()
  player.value.isPlay = !player.value.isPlay
}

function _pause() {
  videoRef.value?.pause()
  player.value.isPlay = !player.value.isPlay
}

function _muted() {
  player.value.muted = !player.value.muted
  if (!player.value.muted) {
    player.value.volume = 10
  } else {
    player.value.volume = 0
  }
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
      player.value.fullScreen = !player.value.fullScreen
      playerBodyRef.value?.requestFullscreen()
    }
  } else {
    document.exitFullscreen()
  }
}

document.addEventListener('fullscreenchange', (event) => {
  if (!document.fullscreenElement) {
    const height = (originWidth.value * 9) / 16 + 'px'
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    playerBodyRef.value!.style.height = height
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    playerContentRef.value!.style.height = height
    player.value.fullScreen = !player.value.fullScreen
  }
})

const player = ref({
  realUrl: '',
  coverUrl: '',
  current: 0,
  currentJump: 0,
  durationString: '',
  durationSec: 0,
  //
  videoLoading: true,
  contentLoading: true,
  autoplay: false,
  muted: false,
  loop: false,
  volume: 100,
  isPlay: false,
  fullScreen: false,
  srcIndex: 0,
  srcList: <string[]>[''],
  durationSecList: <{ start: number; end: number }[]>[],
  transCodeStep: 30,
})

watch(
  () => props.url,
  (newValue) => {
    player.value.realUrl = newValue
  },
  {
    immediate: true,
  }
)

watch(
  () => props.cover,
  (newValue) => {
    player.value.coverUrl = newValue
  },
  {
    immediate: true,
  }
)

function transcodeMarks() {
  const marks: Record<number, string> = {}
  player.value.srcList.filter((el, index) => {
    if (el) {
      marks[Number(player.value.durationSecList[index].end)] = ''
    }
  })
  return marks
}

const tranceCodeQueue = ref<number[]>([])

function calcVideoTimeList(durationSec: number) {
  const timeList = <{ start: number; end: number }[]>[]
  // eslint-disable-next-line no-constant-condition
  for (let start = 0; true; start += player.value.transCodeStep) {
    let end = start + player.value.transCodeStep
    if (end >= durationSec) {
      end = durationSec
      timeList.push({
        start: start,
        end: end,
      })
      break
    } else {
      timeList.push({
        start: start,
        end: end,
      })
    }
  }
  return timeList
}

const ffmpeg = createFFmpeg({
  log: true,
})

ffmpeg.setLogger((log: { type: string; message: string }) => {
  if (log.type === 'fferr' && log.message.includes('Duration')) {
    const m = log.message.split('  Duration: ')[1].split(', ')
    let dur = m[0]
    if (dur) {
      const durArray = dur.split(':')
      durArray[2] = String(parseInt(durArray[2]))
      if (parseInt(durArray[2]) < 10) {
        durArray[2] = '0' + durArray[2]
      }
      dur = durArray.join(':')
      player.value.durationString = dur
      player.value.durationSec = timeToSec(dur)
    }
  }
})

async function transcode() {
  const fileArrayBuffer = await fetchFile(player.value.realUrl)
  await ffmpeg.load()
  ffmpeg.FS('writeFile', 'origin', fileArrayBuffer)
  await ffmpeg.run('-i', 'origin')
  player.value.durationSecList = calcVideoTimeList(player.value.durationSec)

  for (
    let index = player.value.durationSecList.length - 1;
    index >= 0;
    index--
  ) {
    tranceCodeQueue.value.push(index)
  }
  await daTransCode()
}

async function daTransCode() {
  let index
  while ((index = tranceCodeQueue.value.pop()) != undefined) {
    if (!player.value.srcList[index]) {
      await ffmpeg.run(
        '-i',
        'origin',
        '-ss',
        secToTime(player.value.durationSecList[index].start),
        '-to',
        secToTime(player.value.durationSecList[index].end),
        '-preset',
        'ultrafast', // ultrafast superfast veryfast faster
        'result' + index + '.mp4'
      )
      player.value.srcList[index] = URL.createObjectURL(
        new Blob([ffmpeg.FS('readFile', 'result' + index + '.mp4').buffer], {
          type: 'video/mp4',
        })
      )

      if (player.value.srcList[0]) {
        player.value.videoLoading = false
        player.value.contentLoading = false
      }
    }
  }
}

transcode().catch((e) => {
  console.error(e)
})
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
  flex: 1;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;
}

#playerController {
  position: relative;
  width: 100%;
  height: 35px;
  display: none;
  background-color: rgb(102, 102, 102);
  transition: all 0.3s ease-in;
  z-index: 2147483647;
  opacity: 1;
}

#controller {
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: nowrap;
  flex-direction: row;
  padding-top: 5px;
  padding-bottom: 5px;
}

#playerBody:hover #playerController {
  display: inline-block;
  top: -35px;
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
}
</style>
