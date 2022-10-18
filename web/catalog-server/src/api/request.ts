import axios, {
  AxiosResponse,
  Method,
  AxiosRequestConfig,
  AxiosError,
} from 'axios'
import { useMessage } from 'naive-ui'

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
    if (res.code !== 0) {
      useMessage().error(res.message)
      return Promise.reject(response)
    } else {
      return res
    }
  },
  (error: AxiosError) => {
    console.log('err' + error)
    useMessage().error(error.message)
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
  abstract setParam(params: this['param']): this
  public method: Method = 'GET'
  public param: Record<string, unknown> = {}
  public datagram!: any

  public request(): Promise<HttpResponse<this['datagram']>> {
    const config: AxiosRequestConfig = {
      url: this.url,
      method: this.method,
    }
    if (this.method.toLowerCase() === 'get') {
      config.params = { ...this.param }
    } else {
      config.data = { ...this.param }
    }
    return service.request(config)
  }
}
