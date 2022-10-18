import { c } from 'naive-ui'
import { Request } from './request'

export interface FileTypeOption {
  label: string
  value: string
  children: FileTypeOption[]
}
export class GetFiletypeOption extends Request {
  public url = '/list/getFiletypeOption'
  public declare datagram: {
    options: FileTypeOption[]
  }
  public setParam(param: this['param']) {
    this.param = param
    return this
  }
}

export interface CatalogOption {
  label: string
  value: string
  children: CatalogOption[]
}

export class GetCatalogOption extends Request {
  public url = '/list/getCatalogOption'
  public declare datagram: {
    options: CatalogOption[]
  }
  public setParam(param: this['param']) {
    this.param = param
    return this
  }
}
