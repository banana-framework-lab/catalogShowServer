function sleep(wait = 5000) {
  const now = new Date().getTime()
  // eslint-disable-next-line no-empty
  while (new Date().getTime() - now < wait * 1000) {}
  setTimeout(() => {
    sleep(5)
  }, 1)
}
self.onmessage = async (event: any) => {
  if (typeof event.data == 'string') {
    const data = JSON.parse(event.data)
    console.log(data.data)
  }
}
