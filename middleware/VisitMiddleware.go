package middleware

import (
	"github.com/banana-framework-lab/catalogShowServer/library"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"net/http"
)

type VisitMiddleware struct{}

func (VisitMiddleware) CheckShowStatus(_ param.Request) *param.AppError {
	if !library.GetContainer().GetUdp().ShowStatus {
		return param.NewAppError(param.RequestFail, "", http.StatusNotFound)
	}
	return nil
}
