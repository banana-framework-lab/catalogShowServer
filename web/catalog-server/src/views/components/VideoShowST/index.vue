<template>
  <VideoBody
    :video-type="videoData.videoType"
    :total-duration-sec="videoData.totalDurationSec"
    :trans-code-src-list="videoData.transCodeSrcList"
    :trans-code-info-list="videoData.transCodeInfoList"
    :trans-code-step="videoData.transCodeStep"
    @update-total-duration-sec="
      (sec:number) => {
        videoData.totalDurationSec = sec
      }
    "
    @update-total-duration-string="
      (secString:string) => {
        videoData.totalDurationString = secString
      }
    "
    @push-trans-code-queue="
      (index:number) => {
        pushTransCodeQueue(index)
      }
    "
  />
</template>
<script lang="ts">
import { defineComponent, ref, watch, onUnmounted } from 'vue'
import VideoBody from '@/views/components/VideoShowST/compoents/VideoBody.vue'
export default defineComponent({
  name: 'VideoShowST',
})
</script>
<script setup lang="ts">
import axios from 'axios'
import { urlencode } from '@/util/util'
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg'
import { timeToSec, secToTime } from '@/util/time'

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

const noTransCodeVideoType = ['video/mp4', 'video/x-matroska']
const tranceCodeQueue = ref<number[]>([])
let ffmpeg: FFmpeg
const corePath = new URL(
  `../../../util/ffmpeg/st/ffmpeg-core-st.js`,
  import.meta.url
).toString()
const workerPath = new URL(
  `../../../util/ffmpeg/st/ffmpeg-core-st.worker.js`,
  import.meta.url
).toString()
const wasmPath = new URL(
  `../../../util/ffmpeg/st/ffmpeg-core-st.wasm`,
  import.meta.url
).toString()

const worker = new Worker(
  new URL(`./workers/ffmpeg-worker.worker.js`, import.meta.url).toString()
)
worker.onmessage = (event) => {
  const res = JSON.parse(event.data)
  if (res.messageType === 'trans_result') {
    videoData.value.transCodeSrcList[res.data.index] = res.data.resultUrl
  }
}

onUnmounted(() => {
  worker.terminate()
})

class videoDataClass {
  realUrl = ''
  coverUrl = ''
  videoType = ''
  totalBytes = 0
  totalDurationString = ''
  totalDurationSec = 0
  dataList: Uint8Array[] = []
  rangeStep = 2040109465
  rangeLoadInfoList: { start: number; end: number }[] = []
  transCodeStep = 60
  transCodeInfoList: {
    rangeTimeSec: { start: number; end: number }
    rangeTimeString: { start: string; end: string }
    sourceIndex: number
  }[] = []
  transCodeSrcList: string[] = []
}

const videoData = ref(new videoDataClass())

watch(
  () => props.url,
  (newValue) => {
    videoData.value.realUrl = urlencode(newValue)
  },
  {
    immediate: true,
  }
)

watch(
  () => props.cover,
  (newValue) => {
    videoData.value.coverUrl = urlencode(newValue)
  },
  {
    immediate: true,
  }
)

function pushTransCodeQueue(index: number) {
  worker.postMessage(
    JSON.stringify({
      messageType: 'push_trans_code_queue',
      data: {
        index: index,
      },
    })
  )
}

async function init() {
  await initVideo()
  if (noTransCodeVideoType.indexOf(videoData.value.videoType) < 0) {
    initFFMGEP()
    await ffmpeg.load()
    ffmpeg.FS('writeFile', 'originInfo', videoData.value.dataList[0])
    await ffmpeg.run('-i', 'originInfo')
    ffmpeg.FS('unlink', 'originInfo')
    ffmpeg.exit()
    worker.postMessage(
      JSON.stringify({
        messageType: 'init',
        data: {
          corePath: corePath,
          workerPath: workerPath,
          wasmPath: wasmPath,
          tranceCodeQueue: tranceCodeQueue.value,
          transCodeInfoList: videoData.value.transCodeInfoList,
          transCodeSrcList: videoData.value.transCodeSrcList,
        },
      })
    )
    worker.postMessage(videoData.value.dataList[0], [
      videoData.value.dataList[0].buffer,
    ])
    worker.postMessage(
      JSON.stringify({
        messageType: 'start_trans',
        data: {},
      })
    )
  } else {
    videoData.value.transCodeSrcList[0] = videoData.value.realUrl
  }
}

async function initVideo() {
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
    videoData.value.videoType = res.headers['content-type']
    if (videoData.value.videoType === 'video/x-matroska') {
      videoData.value.videoType = 'video/mp4'
    }
    videoData.value.totalBytes = Number(contentRange.split('/')[1])
    if (noTransCodeVideoType.indexOf(videoData.value.videoType) < 0) {
      if (videoData.value.totalBytes <= videoData.value.rangeStep) {
        videoData.value.rangeStep = videoData.value.totalBytes
      }
    }
    if (noTransCodeVideoType.indexOf(videoData.value.videoType) < 0) {
      videoData.value.rangeLoadInfoList.push({
        start: 0,
        end: videoData.value.rangeStep,
      })

      for (const rangeInfo of videoData.value.rangeLoadInfoList) {
        await loadVideo(rangeInfo.start, rangeInfo.end)
      }
    }
  })
}

function initFFMGEP() {
  ffmpeg = createFFmpeg({
    log: true,
    mainName: 'main',
    corePath,
    workerPath,
    wasmPath,
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

init().catch((e) => {
  console.error(e)
})
</script>
