package controller

import (
	"github.com/banana-framework-lab/catalogShowServer/logic"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type UserController struct{}

func (u UserController) RouterList() []*param.Router {
	return []*param.Router{
		param.NewRouter("/user/login", u.login).SetCommonMiddlewareStatus(param.MiddlewareTypeBefore, true),
	}
}

func (UserController) login(req param.Request) param.Response {
	var data = struct {
		User     string `json:"user"`
		Password string `json:"password"`
	}{
		User:     "",
		Password: "",
	}
	err := req.POST(&data)

	if err == nil {
		var l = logic.UserLogic{}
		var result, md5 = l.Login(data.User, data.Password)
		if result {
			return param.Response{
				Code:    param.RequestSuccess,
				Message: "登陆成功",
				Data: struct {
					Token string `json:"token"`
				}{Token: md5},
			}
		} else {
			return param.Response{
				Code:    param.RequestFail,
				Message: "登陆失败：账号密码错误",
				Data:    struct{}{},
			}
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "登陆失败" + err.Error(),
			Data:    struct{}{},
		}
	}
}
