package controller

import (
	"github.com/banana-framework-lab/catalogShowServer/logic"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type SystemController struct{}

func (s SystemController) RouterList() []param.Router {
	return []param.Router{
		param.NewRouter("/system/reloadFile", s.reloadFile),
	}
}

func (SystemController) reloadFile(_ param.Request) param.Response {
	var l = logic.SystemLogic{}
	var result = l.ReloadFile()
	if result {
		return param.Response{
			Code:    param.RequestSuccess,
			Message: "成功重载",
			Data:    struct{}{},
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "失败重载",
			Data:    struct{}{},
		}
	}
}
