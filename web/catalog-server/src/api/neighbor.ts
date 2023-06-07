import { Request } from './request'

export class checkPassword extends Request {
  public url = '/neighbor/checkPassword'
  public declare requestParam: {
    ip: string
    port: string
    password: string
  }
  public setParam(param: this['requestParam']) {
    this.requestParam = param
    return this
  }
}

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
export class GetNeighborListByCondition extends Request {
  public url = '/neighbor/getListByCondition'
  public declare requestParam: {
    ip: string
    port: string
    password: string
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

export interface FileTypeOption {
  label: string
  value: string
  children: FileTypeOption[]
}
export class GetNeighborFiletypeOption extends Request {
  public url = '/neighbor/getFiletypeOption'
  public declare responseParam: {
    options: FileTypeOption[]
  }
  public setParam(param: this['requestParam']) {
    this.requestParam = param
    return this
  }
}

export interface CatalogOption {
  label: string
  value: string
  children: CatalogOption[]
}

export class GetNeighborCatalogOption extends Request {
  public url = '/neighbor/getCatalogOption'
  public declare responseParam: {
    options: CatalogOption[]
  }
  public setParam(param: this['requestParam']) {
    this.requestParam = param
    return this
  }
}
