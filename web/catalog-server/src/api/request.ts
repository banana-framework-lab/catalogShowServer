import axios, {
  AxiosResponse,
  Method,
  AxiosRequestConfig,
  AxiosError,
} from 'axios'
import { deletToken } from '@/util/token'

import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000000000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (!res) {
      window['$message'].error('empty')
      deletToken()
      router.push('/login')
      return
    }
    if (Number(res.code) !== 0) {
      window['$message'].error(res.message)
      if (Number(res.code) === 3) {
        deletToken()
        router.push('/login')
      } else {
        return Promise.reject(response)
      }
    } else {
      return res
    }
  },
  (error: AxiosError) => {
    console.log('err' + error)
    window['$message'].error(error.message)
    return Promise.reject(error)
  }
)

export interface HttpResponse<T> {
  code: number
  message: string
  data: T
}

export abstract class Request {
  abstract url: string
  abstract setParam(params: this['requestParam']): this
  public method: Method = 'GET'
  public requestParam: Record<string, unknown> = {}
  public responseParam!: any
  public protocolDomain = ''

  public setProtocolDomain(protocolDomain: string) {
    this.protocolDomain = protocolDomain
    return this
  }
  public request(): Promise<HttpResponse<this['responseParam']>> {
    const config: AxiosRequestConfig = {
      url: this.protocolDomain + this.url,
      method: this.method,
    }
    if (this.method.toLowerCase() === 'get') {
      config.params = { ...this.requestParam }
    } else {
      config.data = { ...this.requestParam }
    }
    return service.request(config)
  }
}
