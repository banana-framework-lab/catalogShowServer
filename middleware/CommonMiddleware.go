package middleware

import (
	"github.com/banana-framework-lab/catalogShowServer/library"
	"github.com/banana-framework-lab/catalogShowServer/param"
)

type CommonMiddleWare struct{}

func (CommonMiddleWare) CheckToken(req param.Request) *param.AppError {
	cookie, noCookieErr := req.GetReqBody().Cookie("catalogShowServerToken")
	if noCookieErr != nil {
		return param.NewAppError(param.RequestNoLogin, "找不到token！")
	}

	if library.GetContainer().GetUser().IsExit(cookie.Value) {
		return nil
	}
	return param.NewAppError(param.RequestNoLogin, "找不到token")
}
