package controller

import (
	"github.com/banana-framework-lab/catalogShowServer/body"
	"github.com/banana-framework-lab/catalogShowServer/logic"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type ListController struct{}

func (f ListController) RouterList() []param.Router {
	return []param.Router{
		param.NewRouter("/list/getListByName", f.getListByName),
		param.NewRouter("/list/getListByType", f.getListByType),
		param.NewRouter("/list/getListByCatalog", f.getListByCatalog),
		param.NewRouter("/list/getFiletypeOption", f.getFiletypeOption),
		param.NewRouter("/list/getCatalogOption", f.getCatalogOption),
	}
}

func (ListController) getFiletypeOption(req param.Request) param.Response {
	var l = logic.ListLogic{}
	var options = l.GetFiletypeOption()
	return param.Response{
		Code:    param.RequestSuccess,
		Message: "成功获取",
		Data: struct {
			Options body.FileTypeOptionList `json:"options"`
		}{Options: options},
	}
}

func (ListController) getCatalogOption(req param.Request) param.Response {
	var l = logic.ListLogic{}
	var options = l.GetCatalogOption()
	return param.Response{
		Code:    param.RequestSuccess,
		Message: "成功获取",
		Data: struct {
			Options body.CatalogOptionList `json:"options"`
		}{Options: options},
	}
}

func (ListController) getListByName(req param.Request) param.Response {
	type ReqData struct {
		Name string `json:"name"`
		Page uint8  `json:"page"`
		Rows uint32 `json:"rows"`
	}
	var data = ReqData{
		Name: "",
		Page: param.DefaultPage,
		Rows: param.DefaultRows,
	}
	err := req.GET(&data)
	if err == nil {
		var l = logic.ListLogic{}
		var list = l.GetListByName(data.Name, data.Page, data.Rows)
		return param.Response{
			Code:    param.RequestSuccess,
			Message: "成功获取",
			Data: struct {
				List []param.FileInfo `json:"list"`
			}{List: list},
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "失败获取" + err.Error(),
			Data: struct {
				List []param.FileInfo `json:"list"`
			}{List: []param.FileInfo{}},
		}
	}
}

func (ListController) getListByType(req param.Request) param.Response {
	type ReqData struct {
		Type string `json:"type"`
		Page uint8  `json:"page"`
		Rows uint32 `json:"rows"`
	}
	var data = ReqData{
		Page: param.DefaultPage,
		Rows: param.DefaultRows,
	}
	err := req.POST(&data)
	if err == nil {
		var l = logic.ListLogic{}
		var list = l.GetListByType(data.Type, data.Page, data.Rows)
		return param.Response{
			Code:    param.RequestSuccess,
			Message: data.Type + "成功获取",
			Data: struct {
				List []param.FileInfo `json:"list"`
			}{List: list},
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "失败获取" + err.Error(),
			Data: struct {
				List []param.FileInfo `json:"list"`
			}{List: []param.FileInfo{}},
		}
	}
}
func (ListController) getListByCatalog(req param.Request) param.Response {
	type ReqData struct {
		Catalog string `json:"catalog"`
		Page    uint8  `json:"page"`
		Rows    uint32 `json:"rows"`
	}
	var data = ReqData{
		Page: param.DefaultPage,
		Rows: param.DefaultRows,
	}
	err := req.POST(&data)
	if err == nil {
		var l = logic.ListLogic{}
		var list = l.GetListByCatalog(data.Catalog, data.Page, data.Rows)
		return param.Response{
			Code:    param.RequestSuccess,
			Message: data.Catalog + "成功获取",
			Data: struct {
				List []param.FileInfo `json:"list"`
			}{List: list},
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "失败获取" + err.Error(),
			Data: struct {
				List []param.FileInfo `json:"list"`
			}{List: []param.FileInfo{}},
		}
	}
}
