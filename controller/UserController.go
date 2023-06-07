package controller

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/logic"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type UserController struct{}

func (u UserController) RouterList() []*param.Router {
	return []*param.Router{
		param.NewRouter("/user/login", u.login).SetCommonMiddlewareStatus(param.MiddlewareTypeBefore, false),
		param.NewRouter("/visit/user/checkPassword", u.login).SetCommonMiddlewareStatus(param.MiddlewareTypeBefore, false),
	}
}

func (UserController) login(req param.Request) param.Response {
	var data = struct {
		Password string
	}{
		Password: "",
	}
	err := req.DATA(&data)

	fmt.Printf("%+v", data)

	if err == nil {
		var l = logic.UserLogic{}
		var result, md5 = l.Login(data.Password)
		if result {
			return param.Response{
				Code:    param.RequestSuccess,
				Message: "成功",
				Data: struct {
					Token string `json:"token"`
				}{Token: md5},
			}
		} else {
			return param.Response{
				Code:    param.RequestFail,
				Message: "失败：账号密码(" + data.Password + ")错误",
				Data:    struct{}{},
			}
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "失败" + err.Error(),
			Data:    struct{}{},
		}
	}
}
