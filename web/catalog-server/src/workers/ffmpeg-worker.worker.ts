const workerFunction = async () => {
  const ffmpegMod = await import('@ffmpeg/ffmpeg')
  const timeMod = await import('@/util/time')

  const ffmpeg = ffmpegMod.createFFmpeg({
    log: true,
    mainName: 'main',
    corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
    // corePath: new URL(
    //   `../util/ffmpeg/st/ffmpeg-core-st.js`,
    //   import.meta.url
    // ).toString(),
    // workerPath: new URL(
    //   `../util/ffmpeg/st/ffmpeg-core-st.worker.js`,
    //   import.meta.url
    // ).toString(),
    // wasmPath: new URL(
    //   `../util/ffmpeg/st/ffmpeg-core-st.wasm`,
    //   import.meta.url
    // ).toString(),
  })

  class videoDataClass {
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
    transCodeSignList: boolean[] = []
  }

  const videoData = new videoDataClass()

  const tranceCodeQueue: number[] = []

  const ffmpegWriteFileIndexList: number[] = []

  ffmpeg.setLogger(async (log: { type: string; message: string }) => {
    if (
      log.type === 'fferr' &&
      log.message.includes('Duration') &&
      !videoData.totalDurationSec
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
        videoData.totalDurationString = dur
        videoData.totalDurationSec = parseInt(
          String(
            timeMod.timeToSec(dur) *
              (videoData.rangeStep / videoData.totalBytes)
          )
        )
        videoData.totalDurationString = timeMod.secToTime(
          videoData.totalDurationSec
        )
        self.postMessage({
          messageType: 'setDuration',
          data: {
            totalDurationString: videoData.totalDurationString,
            totalDurationSec: videoData.totalDurationSec,
          },
        })
        calcVideoTransCodeInfo()
        initTransCodeQueue()
      }
    }
  })

  function calcVideoTransCodeInfo() {
    let startTime = 0
    for (const index in videoData.dataList) {
      const bytes =
        videoData.rangeLoadInfoList[index].end -
        videoData.rangeLoadInfoList[index].start
      // const timeSecProportion = bytes / videoData.totalBytes
      const timeSecProportion = bytes / videoData.rangeStep
      const sourceDurationSec =
        timeSecProportion * videoData.totalDurationSec + startTime
      // eslint-disable-next-line no-constant-condition
      for (let start = startTime; true; start += videoData.transCodeStep) {
        let end = start + videoData.transCodeStep
        if (end >= sourceDurationSec) {
          end = sourceDurationSec
          startTime = sourceDurationSec
          videoData.transCodeInfoList.push({
            rangeTimeSec: { start: start, end: end },
            rangeTimeString: {
              start: timeMod.secToTime(start),
              end: timeMod.secToTime(end),
            },
            sourceIndex: Number(index),
          })
          break
        } else {
          videoData.transCodeInfoList.push({
            rangeTimeSec: { start: start, end: end },
            rangeTimeString: {
              start: timeMod.secToTime(start),
              end: timeMod.secToTime(end),
            },
            sourceIndex: Number(index),
          })
        }
      }
    }
    self.postMessage({
      messageType: 'setTransCodeInfoList',
      data: {
        transCodeInfoList: videoData.transCodeInfoList,
      },
    })
  }

  function initTransCodeQueue() {
    for (
      let index = videoData.transCodeInfoList.length - 1;
      index >= 0;
      index--
    ) {
      tranceCodeQueue.push(index)
    }
  }

  async function transcode() {
    await ffmpeg.load()
    console.log(videoData.dataList[0])
    await ffmpeg.FS('writeFile', 'origin0', videoData.dataList[0])
    ffmpegWriteFileIndexList.push(0)
    await ffmpeg.run('-i', 'origin0')
    console.log(1211212)
  }

  async function doTransCode() {
    let index
    while ((index = tranceCodeQueue.pop()) != undefined) {
      if (!videoData.transCodeSignList[index]) {
        if (
          ffmpegWriteFileIndexList.indexOf(
            Number(videoData.transCodeInfoList[index].sourceIndex)
          ) < 0
        ) {
          const originData = new Uint8Array(
            videoData.dataList[videoData.transCodeInfoList[index].sourceIndex]
          )
          ffmpeg.FS(
            'writeFile',
            'origin' + videoData.transCodeInfoList[index].sourceIndex,
            originData
          )
          ffmpegWriteFileIndexList.push(
            Number(videoData.transCodeInfoList[index].sourceIndex)
          )
        }

        await ffmpeg.run(
          '-i',
          'origin' + videoData.transCodeInfoList[index].sourceIndex,
          '-ss',
          videoData.transCodeInfoList[index].rangeTimeString.start,
          '-to',
          videoData.transCodeInfoList[index].rangeTimeString.end,
          '-preset',
          'ultrafast', // ultrafast superfast veryfast faster
          'result' + index + '.mp4'
        )
        videoData.transCodeSignList[index] = true
        self.postMessage({
          messageType: 'urlBlobData',
          data: {
            urlBlobData: new Blob(
              [ffmpeg.FS('readFile', 'result' + index + '.mp4').buffer],
              {
                type: 'video/mp4',
              }
            ),
            urlIndex: index,
          },
        })

        if (index === 0) {
          self.postMessage({
            messageType: 'canPlay',
            data: {},
          })
        }
      }
    }
    setTimeout(async () => {
      await doTransCode()
    }, 1000)
  }

  self.onmessage = async (event: any) => {
    const messageData = event.data
    const message = JSON.parse(messageData)
    if (message.messageType) {
      if (message.messageType === 'input') {
        videoData.totalBytes = message.data.totalBytes
        for (const item of message.data.dataList) {
          console.log(item)
          videoData.dataList.push(new Uint8Array(item))
        }
        videoData.rangeLoadInfoList = message.data.rangeLoadInfoList
        await transcode()
        setTimeout(async () => {
          await doTransCode()
        }, 1000)
      }

      if (message.messageType === 'pushQueue') {
        for (const item of message.data.pushQueue) {
          tranceCodeQueue.push(item)
        }
      }
    }
  }
}
workerFunction()
