import { Request } from './request'

export class Login extends Request {
  public url = '/user/login'
  readonly method = 'POST'
  public declare requestParam: {
    user: string
    password: string
  }
  public declare responseParam: {
    token: string
  }
  public setParam(param: this['requestParam']) {
    this.requestParam = param
    return this
  }
}
