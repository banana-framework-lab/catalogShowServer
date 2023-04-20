const wf = async () => {
  const Ffmpeg = await import('@ffmpeg/ffmpeg')
  let ffmpeg, corePath, workerPath, wasmPath
  let videoDataList = []
  let transCodeSrcList
  let transCodeInfoList
  let tranceCodeQueue

  function initFFMGEP() {
    ffmpeg = Ffmpeg.createFFmpeg({
      log: true,
      mainName: 'main',
      corePath,
      workerPath,
      wasmPath,
    })
  }

  async function doTransCode() {
    let index = tranceCodeQueue.pop()
    if (index != undefined) {
      if (!transCodeSrcList[index]) {
        await ffmpeg.load()
        const originData = videoDataList[transCodeInfoList[index].sourceIndex]
        ffmpeg.FS(
          'writeFile',
          'origin' + transCodeInfoList[index].sourceIndex,
          originData
        )
        await ffmpeg.run(
          '-i',
          'origin' + transCodeInfoList[index].sourceIndex,
          '-ss',
          transCodeInfoList[index].rangeTimeString.start,
          '-to',
          transCodeInfoList[index].rangeTimeString.end,
          '-preset',
          'ultrafast', // ultrafast superfast veryfast faster
          'result' + index + '.mp4'
        )
        const resultUrl = URL.createObjectURL(
          new Blob([ffmpeg.FS('readFile', 'result' + index + '.mp4').buffer], {
            type: 'video/mp4',
          })
        )
        ffmpeg.FS('unlink', 'origin' + transCodeInfoList[index].sourceIndex)
        ffmpeg.FS('unlink', 'result' + index + '.mp4')
        ffmpeg.exit()
        self.postMessage(
          JSON.stringify({
            messageType: 'trans_result',
            data: {
              index: index,
              resultUrl: resultUrl,
            },
          })
        )
      }
    }
    setTimeout(async () => {
      await doTransCode()
    }, 500)
  }

  self.onmessage = async (event) => {
    if (typeof event.data == 'string') {
      const res = JSON.parse(event.data)
      if (res.messageType === 'init') {
        corePath = res.data.corePath
        workerPath = res.data.workerPath
        wasmPath = res.data.wasmPath
        transCodeSrcList = res.data.transCodeSrcList
        transCodeInfoList = res.data.transCodeInfoList
        tranceCodeQueue = res.data.tranceCodeQueue
        initFFMGEP()
      } else if (res.messageType === 'start_trans') {
        doTransCode()
      } else if (res.messageType === 'push_trans_code_queue') {
        tranceCodeQueue.push(res.data.index)
      }
    } else if (event.data instanceof Uint8Array) {
      if (ffmpeg && videoDataList.length <= 0) {
        videoDataList[0] = event.data
      }
    }
  }
}
wf()
