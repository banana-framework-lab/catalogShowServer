import { Request } from './request'

export class ReloadFile extends Request {
  public url = '/system/reloadFile'
  public setParam(param: this['param']) {
    this.param = param
    return this
  }
}
