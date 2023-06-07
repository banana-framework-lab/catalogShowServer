package middleware

import (
	"github.com/banana-framework-lab/catalogShowServer/common"
	"github.com/banana-framework-lab/catalogShowServer/library"
	"github.com/banana-framework-lab/catalogShowServer/param"
	"net/http"
	"os"
	"path/filepath"
)

type VisitMiddleware struct{}

func (VisitMiddleware) CheckShowStatus(req param.Request) *param.AppError {
	if !library.GetContainer().GetUdp().ShowStatus {
		return param.NewAppError(param.RequestFail, "", http.StatusNotFound)
	} else {
		var data = struct {
			Password string `schema:"password"`
		}{
			Password: "",
		}
		err := req.GET(&data)

		if err == nil {
			loginConfig, err := os.ReadFile(filepath.Join(library.GetRootSrc(), "/build/login.json"))
			if err != nil {
				return param.NewAppError(param.RequestFail, "", http.StatusNotFound)
			}

			var userData struct {
				Password string `json:"password"`
			}
			dataErr := common.DecodeJson(loginConfig, &userData)
			if dataErr != nil {
				return param.NewAppError(param.RequestFail, "", http.StatusNotFound)
			}

			if data.Password == userData.Password {
				return nil
			} else {
				return param.NewAppError(param.RequestFail, "", http.StatusNotFound)
			}
		} else {
			return param.NewAppError(param.RequestFail, "", http.StatusNotFound)
		}
	}

}
