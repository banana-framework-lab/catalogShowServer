package controller

import (
	"github.com/banana-framework-lab/catalogShowServer/body"
	"github.com/banana-framework-lab/catalogShowServer/logic"
	"github.com/banana-framework-lab/catalogShowServer/middleware"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type ListController struct{}

func (f ListController) RouterList() []*param.Router {
	return append([]*param.Router{
		param.NewRouter("/list/getListByCondition", f.getListByCondition),
		param.NewRouter("/list/getFiletypeOption", f.getFiletypeOption),
		param.NewRouter("/list/getCatalogOption", f.getCatalogOption),
	}, f.visitRouterList()...)
}

func (f ListController) visitRouterList() []*param.Router {
	list := []*param.Router{
		param.NewRouter("/visit/list/getListByCondition", f.getListByCondition),
		param.NewRouter("/visit/list/getFiletypeOption", f.getFiletypeOption),
		param.NewRouter("/visit/list/getCatalogOption", f.getCatalogOption),
	}
	for _, router := range list {
		router.SetCommonMiddlewareStatus(param.MiddlewareTypeBefore, false).SetBeforeMiddleware(middleware.VisitMiddleware{}.CheckShowStatus)
	}
	return list
}

func (ListController) getFiletypeOption(_ param.Request) param.Response {
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

func (ListController) getCatalogOption(_ param.Request) param.Response {
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

func (ListController) getListByCondition(req param.Request) param.Response {
	var data = struct {
		Name     string `schema:"name"`
		FileType string `schema:"file_type"`
		Catalog  string `schema:"catalog"`
		Page     int    `schema:"page"`
		Rows     int    `schema:"rows"`
	}{
		Name:     "",
		FileType: "",
		Catalog:  "",
		Page:     param.DefaultPage,
		Rows:     param.DefaultRows,
	}
	err := req.GET(&data)

	if err == nil {
		var l = logic.ListLogic{}
		var list, total = l.GetListByCondition(data.Name, data.FileType, data.Catalog, data.Page, data.Rows)
		return param.Response{
			Code:    param.RequestSuccess,
			Message: "成功获取",
			Data: struct {
				List  []param.FileInfo `json:"list"`
				Total int              `json:"total"`
			}{List: list, Total: total},
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "失败获取" + err.Error(),
			Data: struct {
				List  []param.FileInfo `json:"list"`
				Total int              `json:"total"`
			}{List: []param.FileInfo{}, Total: 0},
		}
	}
}
