package controller

import (
	"github.com/banana-framework-lab/catalogShowServer/body"
	"github.com/banana-framework-lab/catalogShowServer/common"
	"github.com/banana-framework-lab/catalogShowServer/logic"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type NeighborController struct{}

func (n NeighborController) RouterList() []*param.Router {
	return []*param.Router{
		param.NewRouter("/neighbor/checkPassword", n.checkPassword),
		param.NewRouter("/neighbor/getListByCondition", n.getListByCondition),
		param.NewRouter("/neighbor/getFiletypeOption", n.getFiletypeOption),
		param.NewRouter("/neighbor/getCatalogOption", n.getCatalogOption),
	}
}

func (NeighborController) checkPassword(req param.Request) param.Response {
	var data = struct {
		Password string `schema:"password"`
		Ip       string `schema:"ip"`
		Port     string `schema:"port"`
	}{
		Password: "",
		Ip:       "",
		Port:     "",
	}
	err := req.GET(&data)

	if err == nil {
		var n = logic.NeighborLogic{}

		var result = n.CheckPassword(data.Ip, data.Port, data.Password)

		if result {
			return param.Response{
				Code:    param.RequestSuccess,
				Message: "校验成功",
				Data:    struct{}{},
			}
		} else {
			return param.Response{
				Code:    param.RequestFail,
				Message: "校验失败",
				Data:    struct{}{},
			}
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "校验失败" + err.Error(),
			Data:    struct{}{},
		}
	}
}

func (NeighborController) getFiletypeOption(req param.Request) param.Response {
	var data = struct {
		Password string `schema:"password"`
		Ip       string `schema:"ip"`
		Port     string `schema:"port"`
	}{
		Password: "",
		Ip:       "",
		Port:     "",
	}
	err := req.GET(&data)

	if err == nil {
		var n = logic.NeighborLogic{}
		var result = n.GetFiletypeOption(data.Ip, data.Port, data.Password)
		if result != "" {
			var responseData param.Response

			_ = common.DecodeJson([]byte(result), &responseData)

			return responseData
		} else {
			return param.Response{
				Code:    param.RequestFail,
				Message: "失败获取",
				Data: struct {
					Options body.FileTypeOptionList `json:"options"`
				}{Options: []body.FileTypeOption{}},
			}
		}
	} else {
		return param.Response{
			Code:    param.RequestFail,
			Message: "失败获取" + err.Error(),
			Data: struct {
				Options body.FileTypeOptionList `json:"options"`
			}{Options: []body.FileTypeOption{}},
		}
	}

}

func (NeighborController) getCatalogOption(req param.Request) param.Response {
	var data = struct {
		Password string `schema:"password"`
		Ip       string `schema:"ip"`
		Port     string `schema:"port"`
	}{
		Password: "",
		Ip:       "",
		Port:     "",
	}
	err := req.GET(&data)
	if err == nil {

		var n = logic.NeighborLogic{}
		var result = n.GetCatalogOption(data.Ip, data.Port, data.Password)
		if result != "" {
			var responseData param.Response

			_ = common.DecodeJson([]byte(result), &responseData)

			return responseData
		} else {
			return param.Response{
				Code:    param.RequestSuccess,
				Message: "成功获取",
				Data: struct {
					Options body.CatalogOptionList `json:"options"`
				}{Options: []body.CatalogOption{}},
			}
		}
	} else {
		return param.Response{
			Code:    param.RequestSuccess,
			Message: "成功获取",
			Data: struct {
				Options body.CatalogOptionList `json:"options"`
			}{Options: []body.CatalogOption{}},
		}
	}
}

func (NeighborController) getListByCondition(req param.Request) param.Response {

	var data = struct {
		Password string `schema:"password"`
		Ip       string `schema:"ip"`
		Port     string `schema:"port"`
		Name     string `schema:"name"`
		FileType string `schema:"file_type"`
		Catalog  string `schema:"catalog"`
		Page     int    `schema:"page"`
		Rows     int    `schema:"rows"`
	}{
		Password: "",
		Ip:       "",
		Port:     "",
		Name:     "",
		FileType: "",
		Catalog:  "",
		Page:     param.DefaultPage,
		Rows:     param.DefaultRows,
	}
	err := req.GET(&data)
	if err == nil {

		var n = logic.NeighborLogic{}
		var result = n.GetListByCondition(
			data.Ip,
			data.Port,
			data.Password,
			data.Name,
			data.FileType,
			data.Catalog,
			data.Page,
			data.Rows,
		)
		if result != "" {
			var responseData param.Response

			_ = common.DecodeJson([]byte(result), &responseData)

			return responseData
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
