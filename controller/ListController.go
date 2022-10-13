package controller

import (
	"github.com/banana-framework-lab/catalogShowServer/library"
	"github.com/banana-framework-lab/catalogShowServer/logic"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"io"
	"net/http"
)

type ListController struct{}

func (f ListController) RouterList() []param.Router {
	return []param.Router{
		param.NewRouter("/list/getListByName", f.getListByName),
		param.NewRouter("/list/getListByType", f.getListByType),
	}
}

func (ListController) getListByName(req *http.Request) param.Response {
	type ReqData struct {
		Name string `json:"name"`
	}
	var reqData ReqData
	data, _ := io.ReadAll(req.Body)
	if err := library.DecodeJson(data, &reqData); err != nil {
		return param.Response{
			Code:    1,
			Message: "成功获取",
			Data:    []string{},
		}

	} else {
		return param.Response{
			Code:    0,
			Message: "失败获取",
			Data:    []string{},
		}
	}
}

func (ListController) getListByType(req *http.Request) param.Response {
	type ReqData struct {
		Type string `json:"type"`
	}
	var reqData ReqData
	data, _ := io.ReadAll(req.Body)
	if len(data) <= 2 {
		data = []byte("{}")
	}
	err := library.DecodeJson(data, &reqData)
	//.jpg
	if err == nil {
		if reqData.Type == "" {
			reqData.Type = ".mp4"
		}
		var l = logic.ListLogic{}
		var list = l.GetListByType(reqData.Type)
		return param.Response{
			Code:    0,
			Message: "成功获取",
			Data:    list,
		}
	} else {
		return param.Response{
			Code:    0,
			Message: "失败获取" + err.Error(),
			Data:    []string{},
		}
	}
}
