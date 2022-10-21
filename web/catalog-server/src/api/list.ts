import { Request } from './request'

export interface FileInfo {
  [key: string]: any
  name: string
  src: string
  url: string
  file_type: string
}
export class GetListByCondition extends Request {
  public url = '/list/getListByCondition'
  public declare param: {
    name?: string
    file_type?: string
    catalog?: string
    page?: number
    rows?: number
  }
  public declare datagram: {
    list: FileInfo[]
    total: number
  }
  public setParam(param: this['param']) {
    this.param = param
    return this
  }
}
