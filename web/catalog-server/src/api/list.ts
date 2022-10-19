import { Method } from 'axios'
import { Request } from './request'

export interface FileInfo {
  [key: string]: any
  name: string
  src: string
  file_type: string
}
export class GetListByName extends Request {
  public url = '/list/getListByName'
  public declare param: {
    name?: string
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
export class GetListByCatalog extends Request {
  public url = '/list/getListByCatalog'
  readonly method = 'POST'
  public declare param: {
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
export class GetListByType extends Request {
  public url = '/list/getListByType'
  readonly method = 'POST'
  public declare param: {
    type?: string
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
