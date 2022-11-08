import Cookies from 'js-cookie'

const key = 'catalogShowServerToken'
export function isLogin(): string {
  return String(Cookies.get(key) || '[]')
}

export function setToken(status: string): void {
  Cookies.set(key, status)
}

export function deletToken(): void {
  Cookies.remove(key)
}
