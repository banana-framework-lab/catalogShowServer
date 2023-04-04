export function timeToSec(time: string): number {
  0
  const hour = time.split(':')[0]
  const min = time.split(':')[1]
  const sec = time.split(':')[2]

  return Number(Number(hour) * 3600) + Number(Number(min) * 60) + parseInt(sec)
}

export function secToTime(s: number) {
  let t = ''
  if (s > -1) {
    const hour = Math.floor(s / 3600)
    const min = Math.floor(s / 60) % 60
    const sec = s % 60
    if (hour < 10) {
      t = '0' + hour + ':'
    } else {
      t = hour + ':'
    }

    if (min < 10) {
      t += '0'
    }
    t += min + ':'
    if (sec < 10) {
      t += '0'
    }
    t += sec.toFixed(0)
  }
  return t
}
