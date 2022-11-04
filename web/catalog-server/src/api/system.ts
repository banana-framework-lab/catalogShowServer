import { Request } from './request'

export class ReloadFile extends Request {
  public url = '/system/reloadFile'
  public setParam(param: this['param']) {
    this.param = param
    return this
  }
}

export class EditBroadcastStatus extends Request {
  public url = '/system/editBroadcastStatus'
  public declare param: {
    status: boolean
  }
  public setParam(param: this['param']) {
    this.param = param
    return this
  }
}

export interface NeighborInfo {
  // [key: string]: any
  index: number
  name: string
  file_type: string
  catalog: string
  open_width: string
  url: string
  absolute_src: string
}
export class GetNeighborList extends Request {
  public url = '/system/getNeighborList'
  public declare datagram: {
    list: NeighborInfo[]
    total: number
  }
  public setParam(param: this['param']) {
    this.param = param
    return this
  }
}
