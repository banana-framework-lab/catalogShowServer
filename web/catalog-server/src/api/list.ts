import { Request } from './request'

export interface FileInfo {
  // [key: string]: any
  index: number
  name: string
  file_type: string
  catalog: string
  open_width: string
  url: string
  absolute_src: string
}
export class GetListByCondition extends Request {
  public url = '/list/getListByCondition'
  public declare requestParam: {
    name?: string
    file_type?: string
    catalog?: string
    page?: number
    rows?: number
  }
  public declare responseParam: {
    list: FileInfo[]
    total: number
  }
  public setParam(param: this['requestParam']) {
    this.requestParam = param
    return this
  }
}
