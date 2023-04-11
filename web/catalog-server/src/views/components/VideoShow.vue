<template>
  <div id="playerBody" ref="playerBodyRef" style="position: relative">
    <div
      id="playerContent"
      ref="playerContentRef"
      v-loading="player.videoLoading"
    >
      <div id="playerVideo">
        <!-- <n-spin :show="player.videoLoading"> -->
        <video
          id="playerVideoBody"
          ref="videoRef"
          controls="false"
          :src="videoData.transCodeSrcList[player.srcIndex]"
          :autoplay="player.autoplay"
          :muted="player.muted"
          :loop="player.loop"
          :volume="player.volume / 100"
          @timeupdate="_timeUpdate()"
          @ended="_ended()"
          @canplay="_canPlay()"
        ></video>
        <!-- </n-spin> -->
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
              :max="videoData.totalDurationSec"
              :min="0"
              :marks="transcodeMarks()"
              placement="top"
              :format-tooltip="
                (number: number) => {
                  return secToTime(number) + '/' + videoData.totalDurationString
                }
              "
              @mousedown="_timeMouseDown()"
              @update:value="_timechange()"
            />
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
import { defineComponent, ref, watch, onMounted } from 'vue'
import { env } from 'process'
export default defineComponent({
  name: 'VideoShow',
})
</script>
<script setup lang="ts">
import axios from 'axios'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
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
  Play48Regular,
  Pause48Regular,
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

const playerBodyRef = ref<InstanceType<typeof HTMLDivElement>>()
const playerContentRef = ref<InstanceType<typeof HTMLDivElement>>()
const allControllerRef = ref<InstanceType<typeof HTMLDivElement>>()
const videoRef = ref<InstanceType<typeof HTMLVideoElement>>()

onMounted(() => {
  const height = (Number(playerContentRef.value?.clientWidth) * 9) / 16 + 'px'
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  playerBodyRef.value!.style.height = height
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  playerContentRef.value!.style.height = height
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  allControllerRef.value!.style.height = height
})

function _timeMouseDown() {
  videoRef.value?.pause()
}

function _back(time: number) {
  if (player.value.current - time <= 0) {
    _doTimechange(0)
  } else {
    _doTimechange((player.value.current -= time))
  }
}

function _go(time: number) {
  if (player.value.current + time > videoData.value.totalDurationSec) {
    _doTimechange(0)
  } else {
    _doTimechange((player.value.current += time))
  }
}

function _ended() {
  let nextIndex = player.value.srcIndex + 1
  if (
    nextIndex >= videoData.value.transCodeSrcList.length &&
    videoData.value.transCodeSrcList.length >=
      videoData.value.transCodeInfoList.length
  ) {
    nextIndex = 0
  }
  _doTimechange(videoData.value.transCodeInfoList[nextIndex].rangeTimeSec.start)
}

function _timechange() {
  _doTimechange(player.value.current)
}

function _doTimechange(newTime: number) {
  player.value.current = newTime
  let srcIndex = parseInt(String(newTime / videoData.value.transCodeStep))
  if (srcIndex >= videoData.value.transCodeInfoList.length) {
    srcIndex = videoData.value.transCodeInfoList.length - 1
  }
  if (!videoData.value.transCodeSrcList[srcIndex]) {
    player.value.videoLoading = true
    for (
      let index = videoData.value.transCodeInfoList.length - 1;
      index >= srcIndex;
      index--
    ) {
      tranceCodeQueue.value.push(index)
    }
  }
  if (srcIndex == player.value.srcIndex) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    videoRef.value!.currentTime =
      player.value.current - srcIndex * videoData.value.transCodeStep
    player.value.currentJump = 0
  } else {
    player.value.currentJump =
      player.value.current - srcIndex * videoData.value.transCodeStep
  }
  player.value.srcIndex = srcIndex
}

function _timeUpdate() {
  if (player.value) {
    player.value.current =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      videoRef.value!.currentTime +
      player.value.srcIndex * videoData.value.transCodeStep
  }
}

function _canPlay() {
  if (player.value.currentJump > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    videoRef.value!.currentTime = player.value.currentJump
    player.value.currentJump = 0
  }

  if (videoData.value.transCodeSrcList[player.value.srcIndex]) {
    player.value.videoLoading = false
  }

  if (player.value.isPlay) {
    videoRef.value?.play()
  }
}

function _play() {
  videoRef.value?.play()
  player.value.isPlay = !player.value.isPlay
}

function _pause() {
  videoRef.value?.pause()
  player.value.isPlay = !player.value.isPlay
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

const videoData = ref({
  realUrl: '',
  coverUrl: '',
  videoType: '',
  totalBytes: 0,
  totalDurationString: '',
  totalDurationSec: 0,
  dataList: <Uint8Array[]>[],
  // rangeStep: 1073741824,
  rangeStep: 2040109465,
  rangeLoadInfoList: <{ start: number; end: number }[]>[],
  transCodeStep: 60,
  transCodeInfoList: <
    {
      rangeTimeSec: { start: number; end: number }
      rangeTimeString: { start: string; end: string }
      sourceIndex: number
    }[]
  >[],
  transCodeSrcList: <string[]>[],
})

const player = ref({
  videoLoading: true,
  contentLoading: true,
  srcIndex: 0,
  current: 0,
  currentJump: 0,
  autoplay: false,
  muted: false,
  loop: false,
  volume: 100,
  isPlay: false,
  fullScreen: false,
  ffmpegWriteFileIndexList: <number[]>[],
})

watch(
  () => props.url,
  (newValue) => {
    videoData.value.realUrl = newValue
  },
  {
    immediate: true,
  }
)

watch(
  () => props.cover,
  (newValue) => {
    videoData.value.coverUrl = newValue
  },
  {
    immediate: true,
  }
)

function transcodeMarks() {
  const marks: Record<number, string> = {}
  videoData.value.transCodeSrcList.filter((el, index) => {
    if (el) {
      marks[Number(videoData.value.transCodeInfoList[index].rangeTimeSec.end)] =
        ''
    }
  })
  return marks
}

const tranceCodeQueue = ref<number[]>([])

const urlPrefix =
  window.location.protocol +
  '//' +
  window.location.host +
  import.meta.env.VITE_APP_BASE_API

const ffmpeg = createFFmpeg({
  log: true,
  corePath: urlPrefix + '/resource/ffmpeg-core.js',
  // corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
  // corePath: urlPrefix + '/resource/ffmpeg-core-st.js',
  workerPath: urlPrefix + '/resource/ffmpeg-core.worker.js',
  wasmPath: urlPrefix + '/resource/ffmpeg-core.wasm',
})

ffmpeg.setProgress((progressParams: { ratio: number }) => {
  // console.log(progressParams)
})

ffmpeg.setLogger(async (log: { type: string; message: string }) => {
  if (
    log.type === 'fferr' &&
    log.message.includes('Duration') &&
    !videoData.value.totalDurationSec
  ) {
    const m = log.message.split('  Duration: ')[1].split(', ')
    let dur = m[0]
    if (dur) {
      const durArray = dur.split(':')
      durArray[2] = String(parseInt(durArray[2]))
      if (parseInt(durArray[2]) < 10) {
        durArray[2] = '0' + durArray[2]
      }
      dur = durArray.join(':')
      videoData.value.totalDurationString = dur
      videoData.value.totalDurationSec = parseInt(
        String(
          timeToSec(dur) *
            (videoData.value.rangeStep / videoData.value.totalBytes)
        )
      )
      videoData.value.totalDurationString = secToTime(
        videoData.value.totalDurationSec
      )

      calcVideoTransCodeInfo()
      initTransCodeQueue()
    }
  }
})

async function loadVideoDataList() {
  const loadVideo = async function (start: number, end: number) {
    await axios({
      url: videoData.value.realUrl,
      responseType: 'blob',
      headers: {
        Range: 'bytes=' + start + '-' + end,
      },
    }).then(async (res: any) => {
      videoData.value.dataList.push(
        new Uint8Array(await res.data.arrayBuffer())
      )
    })
  }
  await axios({
    url: videoData.value.realUrl,
    responseType: 'blob',
    headers: {
      Range: 'bytes=0-1',
    },
  }).then(async (res: any) => {
    const contentRange = res.headers['content-range']
    videoData.value.totalBytes = Number(contentRange.split('/')[1])

    // eslint-disable-next-line no-constant-condition
    // for (let start = 0; true; start += videoData.value.rangeStep) {
    //   let end = start + videoData.value.rangeStep
    //   if (end >= videoData.value.totalBytes) {
    //     end = videoData.value.totalBytes

    //     break
    //   } else {
    //     videoData.value.rangeLoadInfoList.push({
    //       start: start,
    //       end: end,
    //     })
    //   }
    // }
    videoData.value.rangeLoadInfoList.push({
      start: 0,
      end: videoData.value.rangeStep,
    })

    for (const rangeInfo of videoData.value.rangeLoadInfoList) {
      await loadVideo(rangeInfo.start, rangeInfo.end)
    }
  })
}

function calcVideoTransCodeInfo() {
  let startTime = 0
  for (const index in videoData.value.dataList) {
    const bytes =
      videoData.value.rangeLoadInfoList[index].end -
      videoData.value.rangeLoadInfoList[index].start
    // const timeSecProportion = bytes / videoData.value.totalBytes
    const timeSecProportion = bytes / videoData.value.rangeStep
    const sourceDurationSec =
      timeSecProportion * videoData.value.totalDurationSec + startTime
    // eslint-disable-next-line no-constant-condition
    for (let start = startTime; true; start += videoData.value.transCodeStep) {
      let end = start + videoData.value.transCodeStep
      if (end >= sourceDurationSec) {
        end = sourceDurationSec
        startTime = sourceDurationSec
        videoData.value.transCodeInfoList.push({
          rangeTimeSec: { start: start, end: end },
          rangeTimeString: { start: secToTime(start), end: secToTime(end) },
          sourceIndex: Number(index),
        })
        break
      } else {
        videoData.value.transCodeInfoList.push({
          rangeTimeSec: { start: start, end: end },
          rangeTimeString: { start: secToTime(start), end: secToTime(end) },
          sourceIndex: Number(index),
        })
      }
    }
  }
}

function initTransCodeQueue() {
  for (
    let index = videoData.value.transCodeInfoList.length - 1;
    index >= 0;
    index--
  ) {
    tranceCodeQueue.value.push(index)
  }
}

async function transcode() {
  await ffmpeg.load()
  await loadVideoDataList()
  await ffmpeg.FS('writeFile', 'origin0', videoData.value.dataList[0])
  player.value.ffmpegWriteFileIndexList.push(0)
  await ffmpeg.run('-i', 'origin0')
}

async function doTransCode() {
  let index
  while ((index = tranceCodeQueue.value.pop()) != undefined) {
    if (!videoData.value.transCodeSrcList[index]) {
      if (
        player.value.ffmpegWriteFileIndexList.indexOf(
          Number(videoData.value.transCodeInfoList[index].sourceIndex)
        ) < 0
      ) {
        const originData = new Uint8Array(
          videoData.value.dataList[
            videoData.value.transCodeInfoList[index].sourceIndex
          ]
        )
        ffmpeg.FS(
          'writeFile',
          'origin' + videoData.value.transCodeInfoList[index].sourceIndex,
          originData
        )
        player.value.ffmpegWriteFileIndexList.push(
          Number(videoData.value.transCodeInfoList[index].sourceIndex)
        )
      }

      await ffmpeg.run(
        '-i',
        'origin' + videoData.value.transCodeInfoList[index].sourceIndex,
        '-ss',
        videoData.value.transCodeInfoList[index].rangeTimeString.start,
        '-to',
        videoData.value.transCodeInfoList[index].rangeTimeString.end,
        '-preset',
        'ultrafast', // ultrafast superfast veryfast faster
        'result' + index + '.mp4'
      )
      videoData.value.transCodeSrcList[index] = URL.createObjectURL(
        new Blob([ffmpeg.FS('readFile', 'result' + index + '.mp4').buffer], {
          type: 'video/mp4',
        })
      )
      if (
        videoData.value.transCodeSrcList[0] &&
        Number(player.value.srcIndex) === 0
      ) {
        player.value.videoLoading = false
        player.value.contentLoading = false
        videoRef.value
        if (videoRef.value) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          videoRef.value!.poster = videoData.value.coverUrl
        }
      }
    }
  }
  setTimeout(async () => {
    await doTransCode()
  }, 1000)
}

transcode().catch((e) => {
  console.error(e)
})

setTimeout(async () => {
  await doTransCode()
}, 1000)
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
  height: 35px;
  display: none;
  background-color: rgb(102, 102, 102, 0.8);
  transition: all 0.3s ease-in;
  opacity: 1;
}

#playerControllerContent {
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
  display: inline-block;
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
