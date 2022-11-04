package controller

import (
	"github.com/banana-framework-lab/catalogShowServer/library"
	"github.com/banana-framework-lab/catalogShowServer/logic"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"net/url"
)

type SystemController struct{}

func (s SystemController) RouterList() []param.Router {
	return []param.Router{
		param.NewRouter("/system/reloadFile", s.reloadFile),
		param.NewRouter("/system/editBroadcastStatus", s.editBroadcastStatus),
		param.NewRouter("/system/getNeighborList", s.getNeighborList),
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

func (SystemController) editBroadcastStatus(req param.Request) param.Response {
	var data = struct {
		Status bool `json:"status"`
	}{
		Status: false,
	}
	err := req.POST(&data)

	if err == nil {
		var l = logic.SystemLogic{}
		l.EditBroadcastStatus(data.Status)
		return param.Response{
			Code:    param.RequestSuccess,
			Message: "成功更新",
			Data:    struct{}{},
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "失败更新" + err.Error(),
			Data:    struct{}{},
		}
	}
}

func (SystemController) getNeighborList(req param.Request) param.Response {
	urlData, err := url.Parse(req.GetReqBody().Referer())
	if err != nil {
		return param.Response{
			Code:    param.RequestFail,
			Message: "失败获取" + err.Error(),
			Data:    struct{}{},
		}
	}
	req.GetReqBody().Referer()
	var l = logic.SystemLogic{}
	var list, total = l.GetNeighborList(urlData.Hostname())
	return param.Response{
		Code:    param.RequestSuccess,
		Message: "成功获取",
		Data: struct {
			List  []library.Neighbor `json:"list"`
			Total int                `json:"total"`
		}{List: list, Total: total},
	}
}
