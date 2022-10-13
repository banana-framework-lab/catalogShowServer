package controller

import (
	"fmt"
	"github.com/banana-framework-lab/catalogShowServer/logic"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type ListController struct{}

func (f ListController) RouterList() []param.Router {
	return []param.Router{
		param.NewRouter("/list/getListByName", f.getListByName),
		param.NewRouter("/list/getListByType", f.getListByType),
	}
}

func (ListController) getListByName(req param.Request) param.Response {
	type Aa struct {
		b string
	}
	return param.Response{
		Code:    param.SUCCESS,
		Message: "成功获取",
		Data:    []string{},
	}

}

func (ListController) getListByType(req param.Request) param.Response {
	type ReqData struct {
		Type string `json:"type"`
		Page uint8  `json:"page"`
		Rows uint32 `json:"rows"`
	}
	var data = ReqData{
		Page: 1,
		Rows: 5,
	}
	err := req.PostData(&data)
	if err != nil {
		return param.Response{
			Message: err.Error(),
		}
	}
	fmt.Printf("%+v", data)
	if err == nil {
		var l = logic.ListLogic{}
		var list = l.GetListByType(data.Type, data.Page, data.Rows)
		return param.Response{
			Code:    0,
			Message: data.Type + "成功获取",
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
