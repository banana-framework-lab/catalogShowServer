import { Request } from './request'

export class ReloadFile extends Request {
  public url = '/system/reloadFile'
  public setParam(param: this['requestParam']) {
    this.requestParam = param
    return this
  }
}

export class EditShowStatus extends Request {
  public url = '/system/editShowStatus'
  readonly method = 'POST'
  public declare requestParam: {
    status: boolean
  }
  public setParam(param: this['requestParam']) {
    this.requestParam = param
    return this
  }
}

export interface NeighborInfo {
  ip: string
  url: string
  port: string
}
export class GetNeighborList extends Request {
  public url = '/system/getNeighborList'
  public declare responseParam: {
    list: NeighborInfo[]
    total: number
    broadcast_status: boolean
  }
  public setParam(param: this['requestParam']) {
    this.requestParam = param
    return this
  }
}
